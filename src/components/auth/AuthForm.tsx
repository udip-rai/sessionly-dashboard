import {
  HTMLAttributes,
  InputHTMLAttributes,
  ButtonHTMLAttributes,
  LabelHTMLAttributes,
} from "react";
import { twMerge } from "tailwind-merge";

interface AuthFormProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const FormContainer = ({
  children,
  className,
  ...props
}: AuthFormProps) => (
  <div
    className={twMerge("w-full max-w-sm mx-auto space-y-6", className)}
    {...props}
  >
    {children}
  </div>
);

export const FormInput = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={twMerge(
      "block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm text-sm",
      "placeholder-gray-400 bg-white/50 backdrop-blur-sm",
      "focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy",
      "transition duration-200 ease-in-out",
      "hover:border-gray-300",
      className,
    )}
    {...props}
  />
);

export const FormLabel = ({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className={twMerge(
      "block text-sm font-medium text-gray-700 mb-1",
      className,
    )}
    {...props}
  />
);

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

export const FormButton = ({
  className,
  isLoading,
  loadingText,
  children,
  disabled,
  ...props
}: FormButtonProps) => (
  <button
    className={twMerge(
      "w-full flex justify-center items-center px-4 py-3",
      "border border-gray-200 rounded-xl shadow-sm",
      "text-sm font-medium text-white",
      "bg-navy hover:bg-navy/90",
      "transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      className,
    )}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading ? (
      <>
        <svg
          className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {loadingText || "Loading..."}
      </>
    ) : (
      children
    )}
  </button>
);

export const FormError = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={twMerge(
      "p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100",
      "animate-fadeIn",
      className,
    )}
    {...props}
  />
);

export const FormDivider = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge("relative my-6", className)} {...props}>
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-gray-200"></div>
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="px-4 bg-white text-gray-500">
        or continue with email
      </span>
    </div>
  </div>
);

export const FormSection = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge("space-y-1.5 mb-6", className)} {...props} />
);
