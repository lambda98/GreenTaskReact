import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { Plus, ListTodo } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { Login } from './components/Login';
import { TodoItem } from './components/TodoItem';
import { Button } from './components/Button';
import { ThemeToggle } from './components/ThemeToggle';
import { Todo } from './types';
import { STORAGE_KEY_TODOS, STORAGE_KEY_THEME, SESSION_KEY_AUTH } from './constants';

const App: React.FC = () => {
  // --- State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Sensors for DnD ---
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevent accidental drags when clicking
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --- Effects ---

  // Load initial state
  useEffect(() => {
    // Auth Check
    const authSession = sessionStorage.getItem(SESSION_KEY_AUTH);
    if (authSession === 'true') setIsAuthenticated(true);

    // Load Todos
    const savedTodos = localStorage.getItem(STORAGE_KEY_TODOS);
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {
        console.error("Failed to parse todos", e);
      }
    }

    // Load Theme
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    setIsLoaded(true);
  }, []);

  // Persist Todos
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  // Persist Theme
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_THEME, darkMode ? 'dark' : 'light');
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode, isLoaded]);

  // --- Handlers ---

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem(SESSION_KEY_AUTH, 'true');
  };

  const handleAddTodo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!newTaskTitle.trim()) return;

    const newTodo: Todo = {
      id: uuidv4(),
      title: newTaskTitle.trim(),
      completed: false,
      dueDate: newTaskDate || undefined
    };

    setTodos(prev => [newTodo, ...prev]);
    setNewTaskTitle('');
    setNewTaskDate('');
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const handleUpdateTodo = (id: string, title: string, date?: string) => {
    setTodos(prev => prev.map(t => 
      t.id === id ? { ...t, title, dueDate: date } : t
    ));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // --- Render ---

  if (!isLoaded) return null; // Or a spinner

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-600 rounded-xl shadow-lg shadow-green-600/20">
              <ListTodo className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">GreenTasker</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Stay organized, stay productive.</p>
            </div>
          </div>
          <ThemeToggle isDark={darkMode} toggle={() => setDarkMode(!darkMode)} />
        </header>

        {/* Input Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 p-6 mb-8 animate-fade-in">
          <form onSubmit={handleAddTodo} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="sr-only" htmlFor="taskTitle">Task Title</label>
                <input
                  id="taskTitle"
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                />
              </div>
              <div className="sm:w-48">
                <label className="sr-only" htmlFor="taskDate">Due Date</label>
                <input
                  id="taskDate"
                  type="datetime-local"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={!newTaskTitle.trim()}>
                <Plus size={20} />
                Add Task
              </Button>
            </div>
          </form>
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={todos.map(t => t.id)} 
              strategy={verticalListSortingStrategy}
            >
              {todos.length === 0 ? (
                <div className="text-center py-12 bg-white/50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400">No tasks yet. Add one above!</p>
                </div>
              ) : (
                todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    onUpdate={handleUpdateTodo}
                  />
                ))
              )}
            </SortableContext>
          </DndContext>
        </div>
        
        <div className="mt-8 text-center text-sm text-slate-400 dark:text-slate-600">
          {todos.filter(t => t.completed).length}/{todos.length} tasks completed
        </div>
      </div>
    </div>
  );
};

export default App;