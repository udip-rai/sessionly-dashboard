import React from "react";
import { FiLoader } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white" | "gray" | "purple" | "blue" | "red" | "green";
  className?: string;
}

const sizeClasses = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const colorClasses = {
  primary: "text-navy",
  white: "text-white",
  gray: "text-gray-500",
  purple: "text-purple-600",
  blue: "text-blue-600",
  red: "text-red-600",
  green: "text-green-600",
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "primary",
  className = "",
}) => {
  return (
    <FiLoader
      className={twMerge(
        "animate-spin",
        sizeClasses[size],
        colorClasses[color],
        className,
      )}
    />
  );
};

// Spinner with centered fullscreen overlay
export const FullPageSpinner: React.FC<SpinnerProps & { message?: string }> = ({
  size = "xl",
  color = "primary",
  message,
  className = "",
}) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <Spinner size={size} color={color} className={className} />
      {message && (
        <p className="mt-4 text-gray-600 font-medium text-center">{message}</p>
      )}
    </div>
  );
};

// Button with spinner
interface ButtonWithSpinnerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  spinnerSize?: SpinnerProps["size"];
  spinnerColor?: SpinnerProps["color"];
  variant?: "primary" | "secondary" | "outline" | "danger" | "success";
}

export const ButtonWithSpinner: React.FC<ButtonWithSpinnerProps> = ({
  children,
  isLoading = false,
  loadingText,
  icon,
  spinnerSize = "sm",
  spinnerColor = "white",
  variant = "primary",
  className = "",
  disabled,
  ...props
}) => {
  const variantClasses = {
    primary: "bg-navy text-white hover:bg-navy/90",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
  };

  return (
    <button
      className={twMerge(
        "flex items-center justify-center px-4 py-2 rounded-lg",
        "font-medium transition-colors duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size={spinnerSize} color={spinnerColor} className="mr-2" />
          {loadingText || children}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Spinner;
