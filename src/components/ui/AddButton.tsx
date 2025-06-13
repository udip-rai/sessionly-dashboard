import { ReactNode } from "react";
import { FiPlus } from "react-icons/fi";

export interface AddButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export const AddButton = ({
  onClick,
  disabled = false,
  children,
  className = "",
}: AddButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      <FiPlus className="w-4 h-4 mr-2" />
      {children}
    </button>
  );
};
