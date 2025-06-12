import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { FiX } from "react-icons/fi";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;

      // Focus trap - but don't interfere with input focus
      const focusableElements =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

      let trapFocusHandler: (e: KeyboardEvent) => void;

      // Delay focus trap to avoid interfering with initial focus
      const trapFocusTimeout = setTimeout(() => {
        const modal = document.querySelector('[data-modal="true"]');
        const firstFocusableElement = modal?.querySelectorAll(
          focusableElements,
        )[0] as HTMLElement;
        const focusableContent = modal?.querySelectorAll(focusableElements);
        const lastFocusableElement = focusableContent?.[
          focusableContent.length - 1
        ] as HTMLElement;

        // Only focus if no input is already focused
        if (
          !document.activeElement ||
          !document.activeElement.matches("input, textarea")
        ) {
          firstFocusableElement?.focus();
        }

        trapFocusHandler = (e: KeyboardEvent) => {
          if (e.key === "Tab") {
            // Only trap focus if we're not in an input field that's being edited
            const activeElement = document.activeElement as HTMLElement;
            const isInInputField =
              activeElement &&
              activeElement.matches("input, textarea") &&
              (activeElement as HTMLInputElement | HTMLTextAreaElement)
                .selectionStart !==
                (activeElement as HTMLInputElement | HTMLTextAreaElement)
                  .selectionEnd;

            if (!isInInputField) {
              if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                  lastFocusableElement?.focus();
                  e.preventDefault();
                }
              } else {
                if (document.activeElement === lastFocusableElement) {
                  firstFocusableElement?.focus();
                  e.preventDefault();
                }
              }
            }
          }
        };

        document.addEventListener("keydown", trapFocusHandler);
      }, 100);

      return () => {
        clearTimeout(trapFocusTimeout);
        if (trapFocusHandler) {
          document.removeEventListener("keydown", trapFocusHandler);
        }
      };
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        zIndex: 999999,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      data-modal="true"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
        style={{ zIndex: 999998 }}
      />

      {/* Modal container */}
      <div
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{ zIndex: 999999 }}
      >
        <div
          className={`relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full ${sizeClasses[size]} transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50/50">
            <h3
              id="modal-title"
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close modal"
                type="button"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render at document body level
  return ReactDOM.createPortal(modalContent, document.body);
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmModalProps) {
  const variantClasses = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    info: "bg-blue-600 hover:bg-blue-700",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        {typeof message === "string" ? (
          <p className="text-gray-700">{message}</p>
        ) : (
          <div>{message}</div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${variantClasses[variant]}`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
