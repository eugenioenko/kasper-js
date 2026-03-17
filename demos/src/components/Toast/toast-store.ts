import { signal } from 'kasper-js';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export const toasts = signal<Toast[]>([]);

let _id = 0;

export function addToast(message: string, type: ToastType = 'info', duration = 4000): void {
  const id = ++_id;
  toasts.value = [...toasts.value, { id, message, type }];
  setTimeout(() => removeToast(id), duration);
}

export function removeToast(id: number): void {
  toasts.value = toasts.value.filter(t => t.id !== id);
}
