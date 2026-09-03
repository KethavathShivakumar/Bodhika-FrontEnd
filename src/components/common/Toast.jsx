import React, { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-surface-container-lowest text-on-surface rounded-2xl shadow-float border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isSuccess ? 'bg-secondary-container text-on-secondary-container' :
        isError ? 'bg-error-container text-on-error-container' :
        'bg-surface-container text-primary'
      }`}>
        <span className="material-symbols-outlined text-[18px]">
          {isSuccess ? 'check_circle' : isError ? 'error' : 'info'}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-sm text-on-surface">{toast.title || 'Notification'}</span>
        <span className="text-xs text-on-surface-variant">{toast.message}</span>
      </div>
      <button
        onClick={onClose}
        className="ml-2 p-1 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
}
