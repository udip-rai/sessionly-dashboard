import { FiCheck, FiX, FiAlertCircle } from "react-icons/fi";
import {
  ProfileCompletionStatus,
  getFieldDisplayName,
  getProfileCompletionMessage,
} from "../../utils/profileCompletion";

interface ProfileCompletionIndicatorProps {
  status: ProfileCompletionStatus;
  className?: string;
}

export function ProfileCompletionIndicator({
  status,
  className = "",
}: ProfileCompletionIndicatorProps) {
  const {
    isComplete,
    completionPercentage,
    criticalMissing,
    optionalMissing,
    completedFields,
  } = status;

  const getStatusColor = () => {
    if (isComplete) return "text-green-600";
    if (criticalMissing.length > 0) return "text-red-600";
    return "text-amber-600";
  };

  const getStatusIcon = () => {
    if (isComplete) return <FiCheck className="h-5 w-5 text-green-600" />;
    if (criticalMissing.length > 0)
      return <FiX className="h-5 w-5 text-red-600" />;
    return <FiAlertCircle className="h-5 w-5 text-amber-600" />;
  };

  const getProgressBarColor = () => {
    if (isComplete) return "bg-green-500";
    if (criticalMissing.length > 0) return "bg-red-500";
    return "bg-amber-500";
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <h3 className={`font-medium ${getStatusColor()}`}>
            Profile Completion
          </h3>
        </div>
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {completionPercentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor()}`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Status Message */}
      <p className="text-sm text-gray-600 mb-3">
        {getProfileCompletionMessage(status)}
      </p>

      {/* Missing Fields */}
      {(criticalMissing.length > 0 || optionalMissing.length > 0) && (
        <div className="space-y-2">
          {criticalMissing.length > 0 && (
            <div>
              <p className="text-xs font-medium text-red-600 mb-1">Required:</p>
              <div className="flex flex-wrap gap-1">
                {criticalMissing.map((field) => (
                  <span
                    key={field}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-xs rounded-md"
                  >
                    <FiX className="h-3 w-3" />
                    {getFieldDisplayName(field)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {optionalMissing.length > 0 && (
            <div>
              <p className="text-xs font-medium text-amber-600 mb-1">
                Optional:
              </p>
              <div className="flex flex-wrap gap-1">
                {optionalMissing.map((field) => (
                  <span
                    key={field}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-md"
                  >
                    <FiAlertCircle className="h-3 w-3" />
                    {getFieldDisplayName(field)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completed Fields */}
      {completedFields.length > 0 && isComplete && (
        <div>
          <p className="text-xs font-medium text-green-600 mb-1">Completed:</p>
          <div className="flex flex-wrap gap-1">
            {completedFields.map((field) => (
              <span
                key={field}
                className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md"
              >
                <FiCheck className="h-3 w-3" />
                {getFieldDisplayName(field)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileCompletionIndicator;
