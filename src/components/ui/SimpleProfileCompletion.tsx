import { useEffect, useState } from "react";
import { ProfileCompletionStatus } from "../../utils/profileCompletion";

interface SimpleProfileCompletionProps {
  status: ProfileCompletionStatus;
}

export function SimpleProfileCompletion({
  status,
}: SimpleProfileCompletionProps) {
  const { completionPercentage, isComplete } = status;
  const [animated, setAnimated] = useState(false);
  const [showValue, setShowValue] = useState(0);

  useEffect(() => {
    // Animate the percentage counter
    let start = 0;
    const end = completionPercentage;
    const duration = 1000; // 1 second animation
    const startTime = performance.now();

    const animateValue = (timestamp: number) => {
      const runTime = timestamp - startTime;
      const progress = Math.min(runTime / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);

      setShowValue(currentValue);

      if (runTime < duration) {
        requestAnimationFrame(animateValue);
      } else {
        setShowValue(end);
        setAnimated(true);
      }
    };

    requestAnimationFrame(animateValue);
  }, [completionPercentage]);

  return (
    <div className="flex flex-col items-center sm:items-end w-52 select-none">
      <div className="flex items-baseline mb-1">
        <span
          className="text-3xl font-semibold text-blue-600 transition-all duration-300"
          style={{
            textShadow: isComplete ? "0 0 10px rgba(34, 197, 94, 0.3)" : "none",
          }}
        >
          {showValue}%
        </span>
        {isComplete && <span className="ml-2 text-lg animate-bounce">🎉</span>}
      </div>
      <p className="text-sm text-gray-600 mb-2 font-medium">
        {isComplete ? "Your profile is complete!" : "Profile completion"}
      </p>

      {/* Modern interactive slider with glowing effect */}
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner relative">
        {/* Track */}
        <div
          className={`h-full relative transition-all duration-1000 ease-out rounded-full ${
            isComplete
              ? "bg-gradient-to-r from-green-400 to-green-500"
              : "bg-gradient-to-r from-blue-500 to-indigo-600"
          }`}
          style={{
            width: `${animated ? completionPercentage : 0}%`,
            boxShadow: isComplete
              ? "0 0 10px rgba(34, 197, 94, 0.5)"
              : "0 0 8px rgba(37, 99, 235, 0.4)",
          }}
        >
          {/* Animated glow effect */}
          <div className="absolute top-0 right-0 h-full w-5 bg-white/30 blur-sm animate-pulse"></div>
        </div>

        {/* Thumb */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-md border-2 border-white transition-all duration-1000 ${
            isComplete ? "bg-green-500" : "bg-blue-600"
          }`}
          style={{
            left: `calc(${animated ? completionPercentage : 0}% - 10px)`,
            transform: "translateY(-50%)",
            boxShadow: isComplete
              ? "0 0 10px rgba(34, 197, 94, 0.7)"
              : "0 0 8px rgba(37, 99, 235, 0.5)",
          }}
        />
      </div>
    </div>
  );
}

export default SimpleProfileCompletion;
