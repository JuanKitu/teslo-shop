import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';

interface RootDropZoneProps {
  isDragging: boolean;
  isDark: boolean;
  children: React.ReactNode;
}

/**
 * Root drop zone wrapper that enables promoting subcategories to main categories
 * by dropping them in the empty space (padding area)
 */
export const RootDropZone = React.memo<RootDropZoneProps>(({ children, isDragging, isDark }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'root-drop-zone',
  });
  void isDark;
  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'relative transition-all duration-300 rounded-lg p-6 sm:p-12',
        isOver && isDragging
          ? 'bg-blue-100/50 dark:bg-blue-900/40 ring-4 ring-blue-500 ring-inset'
          : isDragging
            ? 'ring-2 ring-dashed ring-gray-300 dark:ring-gray-700 bg-gray-100/50 dark:bg-gray-800/50'
            : ''
      )}
    >
      {children}

      {isOver && isDragging && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-blue-600 shadow-2xl text-white px-8 py-4 rounded-xl font-bold text-xl flex items-center gap-3 animate-bounce">
            <span className="text-3xl">🏠</span>
            <div>Soltar para convertir en Principal</div>
          </div>
        </div>
      )}
    </div>
  );
});

RootDropZone.displayName = 'RootDropZone';
