'use client';

import React, { useRef } from 'react';
import { Bold, Italic, Underline, List, Link as LinkIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

interface RichTextEditorProps {
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const execCmd = (command: string) => {
    document.execCommand(command, false);
    if (editorRef.current) editorRef.current.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange({ target: { name: 'description', value: editorRef.current.innerHTML } });
    }
  };

  return (
    <div
      className={`w-full rounded-lg border overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all ${
        isDark
          ? 'border-gray-600 bg-gray-800 focus-within:border-indigo-500'
          : 'border-slate-300 bg-white focus-within:border-indigo-500'
      }`}
    >
      {/* Toolbar */}
      <div
        className={`flex items-center gap-1 p-2 border-b ${
          isDark
            ? 'border-gray-700 bg-gray-700 text-gray-400'
            : 'border-slate-200 bg-slate-50 text-slate-600'
        }`}
      >
        <button
          type="button"
          onClick={() => execCmd('bold')}
          className={`p-1.5 rounded transition-colors ${
            isDark ? 'hover:bg-gray-600' : 'hover:bg-slate-200'
          }`}
          title="Negrita"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCmd('italic')}
          className={`p-1.5 rounded transition-colors ${
            isDark ? 'hover:bg-gray-600' : 'hover:bg-slate-200'
          }`}
          title="Cursiva"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCmd('underline')}
          className={`p-1.5 rounded transition-colors ${
            isDark ? 'hover:bg-gray-600' : 'hover:bg-slate-200'
          }`}
          title="Subrayado"
        >
          <Underline size={16} />
        </button>
        <div className={`w-px h-4 mx-1 ${isDark ? 'bg-gray-600' : 'bg-slate-300'}`}></div>
        <button
          type="button"
          onClick={() => execCmd('insertUnorderedList')}
          className={`p-1.5 rounded transition-colors ${
            isDark ? 'hover:bg-gray-600' : 'hover:bg-slate-200'
          }`}
          title="Lista con viñetas"
        >
          <List size={16} />
        </button>
        <div className={`w-px h-4 mx-1 ${isDark ? 'bg-gray-600' : 'bg-slate-300'}`}></div>
        <button
          type="button"
          className={`p-1.5 rounded transition-colors cursor-not-allowed ${
            isDark ? 'text-gray-600' : 'text-slate-400'
          }`}
          title="Enlace (Demo)"
        >
          <LinkIcon size={16} />
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        className={`p-4 min-h-[150px] text-sm focus:outline-none prose prose-sm max-w-none ${
          isDark ? 'text-gray-100 prose-invert' : 'text-slate-700'
        }`}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        style={{ whiteSpace: 'pre-wrap' }}
      />
    </div>
  );
};
