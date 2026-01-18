import { useEffect } from 'react';
import type { ToastMessage } from '../../types';

interface ToastProps {
  messages: ToastMessage[];
  onClose: (id: string) => void;
  autoCloseDuration?: number;
}

const typeStyles = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
  warning: 'bg-yellow-500 text-white',
};

const typeIcons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

function ToastItem({
  message,
  onClose,
  autoCloseDuration,
}: {
  message: ToastMessage;
  onClose: () => void;
  autoCloseDuration: number;
}) {
  useEffect(() => {
    if (autoCloseDuration > 0) {
      const timer = setTimeout(onClose, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [onClose, autoCloseDuration]);

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${typeStyles[message.type]} min-w-[280px] max-w-md`}
    >
      <span className="text-lg">{typeIcons[message.type]}</span>
      <span className="flex-1">{message.message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-70 transition-opacity"
        aria-label="关闭"
      >
        ✕
      </button>
    </div>
  );
}

export default function Toast({
  messages,
  onClose,
  autoCloseDuration = 3000,
}: ToastProps) {
  if (messages.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {messages.map((msg) => (
        <ToastItem
          key={msg.id}
          message={msg}
          onClose={() => onClose(msg.id)}
          autoCloseDuration={autoCloseDuration}
        />
      ))}
    </div>
  );
}
