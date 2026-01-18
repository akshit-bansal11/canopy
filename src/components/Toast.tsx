"use client";

import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] px-4 py-3 rounded-md shadow-lg flex items-center gap-3">
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default Toast;
