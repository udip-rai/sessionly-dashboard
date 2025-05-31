import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { UserRejectionDialogProps } from "./types";

export const UserRejectionDialog: React.FC<UserRejectionDialogProps> = ({
  isOpen,
  staffName,
  onConfirm,
  onCancel,
}) => {
  const [rejectionReason, setRejectionReason] = useState("");

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm(rejectionReason);
    setRejectionReason("");
  };

  const handleCancel = () => {
    onCancel();
    setRejectionReason("");
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <FiX className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Reject Expert Application
            </h3>
            <p className="text-sm text-gray-600">For {staffName}</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rejection Reason (Optional)
          </label>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Please provide a reason for rejection..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
          >
            Confirm Rejection
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
