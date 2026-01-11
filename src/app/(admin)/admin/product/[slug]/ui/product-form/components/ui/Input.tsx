import React from 'react';
import { useTheme } from 'next-themes';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ className = '', suffix, prefix, ...props }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative">
      {prefix && (
        <div
          className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          {prefix}
        </div>
      )}
      <input
        className={`block w-full rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm py-2.5 px-3 ${
          suffix ? 'pr-10' : ''
        } ${prefix ? 'pl-9' : ''} ${
          isDark
            ? 'border-gray-600 bg-gray-800 text-gray-100'
            : 'border-slate-300 bg-white text-slate-900'
        } ${className}`}
        {...props}
      />
      {suffix && (
        <div
          className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          {suffix}
        </div>
      )}
    </div>
  );
};
