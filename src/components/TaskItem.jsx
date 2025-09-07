import React from 'react';
import CircularProgress from './CircularProgress';
import ProgressControls from './ProgressControls';

const TaskItem = ({ task, onToggleComplete, onDelete }) => {
  if (!task) return null;

  // Calculate completion percentage for subtasks if they exist
  const calculateCompletion = () => {
    if (task.subtasks && task.subtasks.length > 0) {
      const completed = task.subtasks.filter(st => st.completed).length;
      return (completed / task.subtasks.length) * 100;
    }
    return task.completed ? 100 : 0;
  };

  const completionPercentage = calculateCompletion();

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="delete-btn"
            aria-label="Delete task"
          >
            Delete
          </button>
        )}
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-progress-section">
        <div className="progress-visual">
          <CircularProgress
            percentage={completionPercentage}
            size={60}
            strokeWidth={6}
            showPercentage={false}
          />
        </div>

        <div className="progress-controls-wrapper">
          <ProgressControls
            task={task}
            onToggleComplete={onToggleComplete}
          />
        </div>
      </div>

      {/* Weekly progress bars for each day */}
      {task.dailyProgress && (
        <div className="weekly-progress-bars">
          <h4>Daily Progress:</h4>
          <div className="days-grid">
            {Object.entries(task.dailyProgress).map(([day, completed]) => (
              <div key={day} className="day-progress">
                <span className="day-label">{day.slice(0, 3)}</span>
                <div className="day-progress-bar">
                  <div
                    className="day-progress-fill"
                    style={{
                      height: completed ? '100%' : '0%',
                      backgroundColor: completed ? '#4caf50' : '#ddd'
                    }}
                  >
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;

// export default function TaskItem({ task, deleteTask, toggleComplete, setEditingTask, updateProgress }) {
//   // Tracking progress data
//   const progressData = task.progress || { completed: 0, total: 7 };

//   return (
//     <li className="py-3 px-4 hover:bg-gray-50 transition-colors">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <input
//             type="checkbox"
//             checked={task.completed}
//             onChange={() => toggleComplete(task.id)}
//             className="h-5 w-5 text-blue-500 rounded focus:ring-blue-400 cursor-pointer"
//           />
//           {/* Circular Progress */}
//           <CircularProgress
//             completed={progressData.completed}
//             total={progressData.total}
//             size={30}
//             strokeWidth={3}
//           />
//           <div className="flex-1 min-w-0">
//             <span
//               className={`text-gray-800 ${task.completed ? 'line-through text-gray-400' : ''}`}
//             >
//               {task.text}
//             </span>
//               <p className="text-xs text-gray-500 mt-1">{progressData.completed} of {progressData.total} days completed</p>
            
//             <ProgressControls
//               progress={task.progress}
//               onUpdate={updateProgress}
//               taskId={task.id}
//             />
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex space-x-2 ml-4">
//           {/* Edit Task */}
//           <button
//             onClick={() => setEditingTask(task)}
//             className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded-text-sm font-medium transition-colors"
//           // aria-label="Edit task"
//           >
//             Edit
//           </button>
//           {/* Delete Task */}
//           <button
//             onClick={() => deleteTask(task.id)}
//             className="text-red-500 hover:text-red-700 px-2 py-1 rounded text-sm font-medium transition-colors"
//           // aria-label="Delete task"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </li>
//   );
// }