import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '../types';
import { Trash2, Edit2, GripVertical, Check, X, Calendar } from 'lucide-react';
import { Button } from './Button';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newTitle: string, newDate?: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDate, setEditDate] = useState(todo.dueDate || '');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.3 : 1,
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, editTitle, editDate);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDate(todo.dueDate || '');
    setIsEditing(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
  };

  if (isEditing) {
    return (
      <div 
        ref={setNodeRef} 
        style={style}
        className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-2 border-green-500 animate-fade-in mb-3"
      >
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Task title..."
            autoFocus
          />
          <div className="flex gap-2">
            <input
              type="datetime-local"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="p-2 border border-slate-300 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex-1"></div>
            <Button variant="secondary" onClick={handleCancel} size="sm">
              <X size={16} />
            </Button>
            <Button variant="primary" onClick={handleSave} size="sm">
              <Check size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-200 mb-3 ${todo.completed ? 'opacity-75' : ''}`}
    >
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-green-600 dark:hover:text-green-400"
      >
        <GripVertical size={20} />
      </div>

      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
          todo.completed 
            ? 'bg-green-500 border-green-500 text-white' 
            : 'border-slate-300 dark:border-slate-500 hover:border-green-500'
        }`}
      >
        {todo.completed && <Check size={14} strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col cursor-pointer" onClick={() => onToggle(todo.id)}>
        <span className={`font-medium truncate transition-all ${
          todo.completed 
            ? 'text-slate-400 line-through' 
            : 'text-slate-800 dark:text-slate-100'
        }`}>
          {todo.title}
        </span>
        {todo.dueDate && (
          <span className={`text-xs flex items-center gap-1 mt-0.5 ${
            todo.completed ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
          }`}>
            <Calendar size={10} />
            {formatDate(todo.dueDate)}
          </span>
        )}
      </div>

      {/* Actions (Visible on Hover/Focus) */}
      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
        <button 
          onClick={() => setIsEditing(true)}
          className="p-2 text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          aria-label="Edit task"
        >
          <Edit2 size={18} />
        </button>
        <button 
          onClick={() => onDelete(todo.id)}
          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          aria-label="Delete task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};