import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useTheme } from 'next-themes';

interface LabelProps {
  children: React.ReactNode;
  helpText?: string;
}

export const Label: React.FC<LabelProps> = ({ children, helpText }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <label
      className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}
    >
      {children}
      {helpText && (
        <div className="group relative inline-block ml-1">
          <HelpCircle
            size={14}
            className={`inline cursor-help ${isDark ? 'text-gray-500' : 'text-slate-400'}`}
          />
          <div
            className={`invisible group-hover:visible absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs rounded shadow-lg whitespace-nowrap ${
              isDark ? 'bg-gray-900 text-gray-100' : 'bg-slate-800 text-white'
            }`}
          >
            {helpText}
          </div>
        </div>
      )}
    </label>
  );
};
