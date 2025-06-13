import toast from "react-hot-toast";

const baseToastOptions = {
  style: {
    borderRadius: "14px",
    padding: "16px 20px",
    boxShadow:
      "0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 6px 12px -6px rgba(0, 0, 0, 0.08)",
    fontSize: "0.875rem",
    fontWeight: 500,
    maxWidth: "400px",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    animation: "toast-slide-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
    zIndex: 9999999,
  },
  duration: 4000,
  position: "top-right",
  className:
    "transform transition-all duration-300 hover:scale-105 hover:shadow-xl",
  onClick: () => toast.dismiss(),
};

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      ...baseToastOptions,
      duration: 3000,
      position: "top-right",
      className: "!bg-white !text-green-600",
    });
  },

  error: (message: string) => {
    toast.error(message, {
      ...baseToastOptions,
      duration: 4000,
      position: "top-right",
      className: "!bg-white !text-red-600",
    });
  },

  warning: (message: string) => {
    toast(message, {
      ...baseToastOptions,
      duration: 3000,
      position: "top-right",
      icon: "⚠️",
      className: "!bg-white !text-yellow-600",
    });
  },

  info: (message: string) => {
    toast(message, {
      ...baseToastOptions,
      duration: 3000,
      position: "top-right",
      icon: "ℹ️",
      className: "!bg-white !text-navy",
    });
  },
};

// Helper function specifically for JWT expiration handling
export const handleJwtExpiration = (error: any) => {
  const isAuthError = error?.response?.status === 401;
  const isJwtExpired =
    error?.response?.data?.error === "jwt expired" ||
    error?.response?.data?.message === "Unauthorized User" ||
    error?.response?.data?.message?.includes("expired");

  if (isAuthError && isJwtExpired) {
    showToast.warning("Your session has expired. Redirecting to login...");
    return true;
  } else if (isAuthError) {
    showToast.error("Authentication failed. Please log in again.");
    return true;
  }

  return false;
};
