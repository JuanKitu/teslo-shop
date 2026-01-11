import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  action?: React.ReactNode;
  className?: string;
  isDark?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, title, action, className = '', isDark }) => (
  <div
    className={`rounded-xl border ${
      isDark ? 'bg-gray-800 border-gray-700 shadow-lg' : 'bg-white border-slate-200 shadow-md'
    } ${className}`}
  >
    {title && (
      <div
        className={`px-4 sm:px-6 py-4 border-b flex flex-wrap gap-2 justify-between items-center rounded-t-xl relative z-20 ${
          isDark ? 'border-gray-700 bg-gray-800/50' : 'border-slate-200 bg-slate-50/50'
        }`}
      >
        <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-slate-900'}`}>
          {title}
        </h3>
        {action && <div className="ml-auto">{action}</div>}
      </div>
    )}
    <div className="p-4 sm:p-6 relative z-10">{children}</div>
  </div>
);
