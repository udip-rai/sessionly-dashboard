import React from "react";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { ExpertData } from "./_types";

interface InlineEditFieldProps {
  field: keyof ExpertData;
  value: string;
  placeholder: string;
  type?: string;
  icon?: React.ComponentType<any>;
  required?: boolean;
  multiline?: boolean;
  editingField: string | null;
  setEditingField: React.Dispatch<React.SetStateAction<string | null>>;
  onUpdate: (field: keyof ExpertData, value: string) => void;
  onCancel: (field: keyof ExpertData) => void;
}

export const InlineEditField: React.FC<InlineEditFieldProps> = ({
  field,
  value,
  placeholder,
  type = "text",
  icon: Icon,
  required = false,
  multiline = false,
  editingField,
  setEditingField,
  onUpdate,
  onCancel,
}) => {
  const isEditing = editingField === field;

  const handleFieldEdit = () => {
    setEditingField(field);
  };

  const handleFieldSave = () => {
    setEditingField(null);
  };

  const handleFieldCancel = () => {
    onCancel(field);
    setEditingField(null);
  };

  return (
    <div className="group">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {Icon && <Icon className="inline mr-2" />}
        {placeholder} {required && <span className="text-red-500">*</span>}
      </label>
      {isEditing ? (
        <div className="flex items-center space-x-2">
          {multiline ? (
            <textarea
              value={value}
              onChange={(e) => onUpdate(field, e.target.value)}
              rows={4}
              maxLength={500}
              className="flex-1 px-3 py-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder={placeholder}
              autoFocus
            />
          ) : (
            <input
              type={type}
              value={value}
              onChange={(e) => onUpdate(field, e.target.value)}
              className="flex-1 px-3 py-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={placeholder}
              autoFocus
            />
          )}
          <button
            onClick={handleFieldSave}
            className="p-2 text-green-600 hover:bg-green-50 rounded-md"
          >
            <FiCheck className="w-4 h-4" />
          </button>
          <button
            onClick={handleFieldCancel}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleFieldEdit}
          className="group cursor-pointer p-3 border border-transparent rounded-md hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 relative"
        >
          <p
            className={`${value ? "text-gray-900" : "text-gray-400"} ${
              multiline ? "whitespace-pre-wrap" : ""
            }`}
          >
            {value || `Click to add ${placeholder.toLowerCase()}`}
          </p>
          <FiEdit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 absolute top-3 right-3 transition-opacity" />
        </div>
      )}
      {multiline && value && (
        <p className="text-xs text-gray-500 mt-1">
          {value.length}/500 characters
        </p>
      )}
    </div>
  );
};
