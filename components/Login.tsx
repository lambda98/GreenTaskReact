import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { APP_PASSWORD } from '../constants';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === APP_PASSWORD) {
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-green-100 dark:border-slate-700 overflow-hidden animate-fade-in">
        <div className="bg-green-600 p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-green-100">GreenTasker is locked to protect your data.</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Enter Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1 animate-pulse">
                  {error}
                </p>
              )}
            </div>
            
            <Button type="submit" className="w-full py-3 text-lg group">
              Unlock Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
          
          <div className="mt-6 text-center text-xs text-slate-400">
            Hint: Use the default password found in password.md
          </div>
        </div>
      </div>
    </div>
  );
};