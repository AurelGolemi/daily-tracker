// ProgressControls.jsx

import React from 'react';

const ProgressControls = ({ task, onToggleComplete }) => {
  // Add null/undefined checking
  if (!task) {
    return (
      <div className="progress-controls loading">
        <div className="skeleton-checkbox"></div>
        <div className="skeleton-text"></div>
      </div>
    )
  }

  return (
    <div className="progress-controls">
      <label className="checkbox-container">
        <input
          type="checkbox"
          checked={task.completed || false} // Safe access with fallback
          onChange={() => onToggleComplete(task.id)}
          className="progress-checkbox"
        />
        Mark as completed
      </label>
      <span className={`status ${task.completed ? 'completed' : 'pending'}`}>
        Status: {task.completed ? 'Completed' : 'Pending'}
      </span>
    </div>
  );
};

// Add default props for safety
ProgressControls.defaultProps = {
  task: null,
  onToggleComplete: () => {}
};

export default ProgressControls;


// export default function ProgressControls({ progress, onUpdate, taskId }) {
//   const handleIncrement = () => {
//     onUpdate(taskId, progress.completed + 1);
//   };

//   const handleDecrement = () => {
//     onUpdate(taskId, Math.max(0, progress.completed - 1));
//   };
  
//   return (
//     <div className="flex items-center space-x-2 mt-2">
//       <span className="text-xs text-gray-600">Progress:</span>
//       <div className="flex items-center space-x-1">
//         <button
//           onClick={handleDecrement}
//           disabled={progress.completed <= 0}
//           className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//         >
//           -
//         </button>
//         <span className="text-xs font-medium">
//           {progress.completed}/{progress.total}
//         </span>
//         <button
//           onClick={handleIncrement}
//           disabled={progress.completed >= progress.total}
//           className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//         >
//           +
//         </button>
//       </div>
//     </div>
//   );
// }