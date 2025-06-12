import { showToast } from "../utils/toast";

// Simple toast utility for admin components
export interface ToastInterface {
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

export const toast: ToastInterface = {
  success: (title, message) =>
    showToast.success(message ? `${title}: ${message}` : title),
  error: (title, message) =>
    showToast.error(message ? `${title}: ${message}` : title),
  warning: (title, message) =>
    showToast.warning(message ? `${title}: ${message}` : title),
  info: (title, message) =>
    showToast.info(message ? `${title}: ${message}` : title),
};

export function useSimpleToast(): ToastInterface {
  return toast;
}
