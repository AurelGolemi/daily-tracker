// components/CircularProgress.jsx
import React from 'react';

const CircularProgress = ({ 
  percentage = 0, 
  size = 100, 
  strokeWidth = 10,
  label,
  showPercentage = true 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (percent) => {
    if (percent >= 90) return '#4caf50';
    if (percent >= 70) return '#8bc34a';
    if (percent >= 50) return '#ffeb3b';
    if (percent >= 30) return '#ff9800';
    return '#f44336';
  };

  return (
    <div className="circular-progress-container" style={{ width: size, height: size }}>
      <svg className="circular-progress" width={size} height={size}>
        {/* Background circle */}
        <circle
          className="progress-bg"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className="progress-fill"
          stroke={getColor(percentage)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      
      <div className="progress-content">
        {showPercentage && (
          <span className="percentage-text" style={{ fontSize: size * 0.25 }}>
            {Math.round(percentage)}%
          </span>
        )}
        {label && (
          <span className="progress-label" style={{ fontSize: size * 0.1 }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;

// export default function CircularProgress({ completed, total, size = 40, strokeWidth = 4 }) {
//   // Calculate percentage
//   const percentage = total > 0 ? Math.min(100, (completed / total) * 100) : 0;

//   // SVG calculations
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const strokeDashoffset = circumference - (percentage / 100) * circumference;

//   return (
//     <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
//       <svg className="transform -rotate-90" width={size} height={size}>
//         {/* Background circle */}
//         <circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           stroke="#e5e7eb" // gray-200
//           strokeWidth={strokeWidth}
//           fill="none"
//         />
//         {/* Progress circle */}
//         <circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           stroke="#3b82f6"
//           strokeWidth={strokeWidth}
//           fill="none"
//           strokeLinecap="round"
//           strokeDasharray={circumference}
//           strokeDashoffset={strokeDashoffset}
//           className="transition-all duration-300 ease-in-out"
//         />
//       </svg>
      
//       {/* Percentage text */}
//       <span className="absolute text-xs font-medium text-gray-700">
//         {Math.round(percentage)}%
//       </span>
//     </div>
//   );
// }