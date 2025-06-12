import React, { useState } from "react";
import { Dialog, ConfirmDialog, useToast } from "../ui";

export function ToastTestComponent() {
  const toast = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Toast & Modal Test Component</h2>

      <div className="space-x-2">
        <button
          onClick={() => toast.success("Success!", "This is a success message")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Test Success Toast
        </button>

        <button
          onClick={() => toast.error("Error!", "This is an error message")}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Test Error Toast
        </button>

        <button
          onClick={() => toast.warning("Warning!", "This is a warning message")}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
        >
          Test Warning Toast
        </button>

        <button
          onClick={() => toast.info("Info!", "This is an info message")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Test Info Toast
        </button>
      </div>

      <div className="space-x-2">
        <button
          onClick={() => setShowDialog(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Test Dialog
        </button>

        <button
          onClick={() => setShowConfirmDialog(true)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Test Confirm Dialog
        </button>
      </div>

      <Dialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        title="Test Dialog"
        size="md"
      >
        <div className="space-y-4">
          <p>
            This is a test dialog to verify the modal functionality is working
            correctly.
          </p>
          <div className="flex justify-end">
            <button
              onClick={() => setShowDialog(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => {
          toast.success("Confirmed!", "You clicked the confirm button");
          setShowConfirmDialog(false);
        }}
        title="Test Confirmation"
        message="Are you sure you want to test this confirmation dialog?"
        confirmText="Yes, Test It"
        cancelText="Cancel"
        variant="info"
      />
    </div>
  );
}
