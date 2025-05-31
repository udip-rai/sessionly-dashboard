import { FiX } from "react-icons/fi";

interface AnimatedCloseButtonProps {
  onClick: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "danger" | "subtle";
}

export function AnimatedCloseButton({
  onClick,
  className = "",
  size = "md",
  variant = "default",
}: AnimatedCloseButtonProps) {
  const sizeClasses = {
    sm: "w-6 h-6 p-1",
    md: "w-8 h-8 p-1.5",
    lg: "w-10 h-10 p-2",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const variantClasses = {
    default:
      "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 border-gray-200",
    danger:
      "bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 border-red-200",
    subtle:
      "bg-transparent hover:bg-gray-100 text-gray-400 hover:text-gray-600 border-transparent",
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[size]} ${variantClasses[variant]}
        relative overflow-hidden rounded-full border
        transition-all duration-300 ease-out
        hover:scale-110 hover:shadow-lg hover:rotate-90
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy/50
        group active:scale-95
        ${className}
      `}
    >
      {/* Ripple effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out"></div>

      {/* Icon with rotation animation */}
      <FiX
        className={`
        ${iconSizes[size]}
        relative z-10 transition-all duration-300 ease-out
        group-hover:rotate-90 group-active:scale-75
      `}
      />

      {/* Pulse ring on hover */}
      <div className="absolute inset-0 rounded-full border-2 border-current opacity-0 group-hover:opacity-30 group-hover:scale-150 transition-all duration-300 ease-out"></div>
    </button>
  );
}
