// Simple toast utility for admin components
export interface ToastInterface {
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

class SimpleToast implements ToastInterface {
  private formatMessage(title: string, message?: string): string {
    return message ? `${title}: ${message}` : title;
  }

  success(title: string, message?: string): void {
    const msg = this.formatMessage(title, message);

    // Try to use a more sophisticated toast if available
    if (typeof window !== "undefined" && (window as any).showToast) {
      (window as any).showToast(msg, "success");
      return;
    }

    // Fallback to alert with success emoji
    alert(`✅ ${msg}`);
  }

  error(title: string, message?: string): void {
    const msg = this.formatMessage(title, message);

    // Try to use a more sophisticated toast if available
    if (typeof window !== "undefined" && (window as any).showToast) {
      (window as any).showToast(msg, "error");
      return;
    }

    // Fallback to alert with error emoji
    alert(`❌ ${msg}`);
  }

  warning(title: string, message?: string): void {
    const msg = this.formatMessage(title, message);

    // Try to use a more sophisticated toast if available
    if (typeof window !== "undefined" && (window as any).showToast) {
      (window as any).showToast(msg, "warning");
      return;
    }

    // Fallback to alert with warning emoji
    alert(`⚠️ ${msg}`);
  }

  info(title: string, message?: string): void {
    const msg = this.formatMessage(title, message);

    // Try to use a more sophisticated toast if available
    if (typeof window !== "undefined" && (window as any).showToast) {
      (window as any).showToast(msg, "info");
      return;
    }

    // Fallback to alert with info emoji
    alert(`ℹ️ ${msg}`);
  }
}

// Create a singleton instance
export const toast = new SimpleToast();

// Hook-like function that can be used as a drop-in replacement
export function useSimpleToast(): ToastInterface {
  return toast;
}
