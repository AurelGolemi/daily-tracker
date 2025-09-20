import React, { useState } from "react";
import CircularProgress from "./CircularProgress";
import ProgressControls from "./ProgressControls";
import { isToday, getTodayDateString } from "../utils/dateUtils";

export default function TaskItem({
  task,
  onDelete,
  onToggleComplete,
  onEdit,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task?.text || '');
  const [editDescription, setEditDescription] = useState(task?.description || '');

  // Add safety checks for all props
  if (!task) {
    console.warn('TaskItem: No task prop provided');
    return <div className="text-red-500 p-4">Invalid task data</div>;
  }

  const taskText = task?.text || 'Unnamed Task';
  const taskCompletions = task?.completions || [];
  const taskStreak = task?.streak || 0;

  const today = getTodayDateString();
  const completions = task.completions || [];
  const completedToday = completions.some((completionDate) =>
    isToday(completionDate)
  );

  // Calculate progress for circular bar (7-day week)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weeklyCompletions = taskCompletions.filter((completionDate) => {
    try {
      const date = new Date(completionDate);
      return date >= oneWeekAgo && !isNaN(date.getTime());
    } catch (error) {
      console.warn('Invalid date in completions:', completionDate);
      return false;
    }
  });

  const weeklyProgress = {
    completed: weeklyCompletions.length,
    total: 7
  };

  // Handle starting edit mode
  const handleStartEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setEditTitle(task.text);
    setEditDescription(task.description || '');
  };

  // Handle saving edits
  const handleSaveEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!editTitle.trim()) {
      alert('Task title cannot be empty');
      return;
    }

    // Call the onEdit function with updated data
    if (typeof onEdit === 'function') {
      // Create updated task object
      const updatedTask = {
        ...task,
        text: editTitle.trim(),
        description: editDescription.trim()
      };
      
      onEdit(updatedTask);
      setIsEditing(false);
    }
  };

  // Handle canceling edit
  const handleCancelEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
    setEditTitle(task.text);
    setEditDescription(task.description || '');
  };

  // Handle key presses during editing
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit(e);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit(e);
    }
  };

  // Safe delete handler
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (typeof onDelete === 'function') {
      const confirmed = window.confirm('Are you sure you want to delete this task?');
      if (confirmed) {
        onDelete(task.id);
      }
    }
  };

  // Safe toggle handler
  const handleToggleComplete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (typeof onToggleComplete === 'function') {
      onToggleComplete(task.id);
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-all duration-300 text-gray-900 ${
        isEditing ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      } ${
        completedToday ? 'bg-green-50 border-green-200' : ''
      }`}
      style={{
        background: isEditing 
          ? 'rgba(59, 130, 246, 0.3)' 
          : completedToday 
            ? 'rgba(34, 197, 94, 0.05)' 
            : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        border: isEditing 
          ? '2px solid #3b82f6' 
          : completedToday 
            ? '1px solid #22c55e' 
            : '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}
    >
      {/* Edit Mode Indicator */}
      {isEditing && (
        <div style={{
          background: '#3b82f6',
          color: '#111',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600',
          marginBottom: '12px',
          display: 'inline-block'
        }}>
          Editing Mode - Press Enter to save, Esc to cancel
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={completedToday}
            onChange={handleToggleComplete}
            className="h-5 w-5 text-blue-500 rounded focus:ring-blue-400 cursor-pointer"
            disabled={isEditing}
          />

          {/* Circular Progress */}
          <CircularProgress
            completed={weeklyProgress.completed}
            total={weeklyProgress.total}
            size={50}
            strokeWidth={4}
          />

          {/* Task Info */}
          <div className="flex-1 min-w-0">
            {/* Task Title - Editable */}
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full text-lg font-medium border-2 border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                style={{
                  background: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}
                autoFocus
                placeholder="Enter task title..."
              />
            ) : (
              <span 
                className={`text-gray-800 font-medium cursor-pointer hover:text-blue-600 ${
                  completedToday ? 'line-through text-gray-400' : ''
                }`}
                onClick={handleStartEdit}
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  display: 'block',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!completedToday) {
                    e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                }}
              >
                {taskText}
              </span>
            )}

            {/* Task Description - Editable */}
            {isEditing ? (
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full text-sm text-gray-600 mt-2 border-2 border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                style={{
                  background: 'white',
                  minHeight: '60px',
                  resize: 'vertical'
                }}
                placeholder="Enter task description (optional)..."
              />
            ) : (
              task?.description && (
                <p 
                  className="text-sm text-gray-600 mt-1 cursor-pointer hover:text-blue-600"
                  onClick={handleStartEdit}
                  style={{
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                >
                  {task.description}
                </p>
              )
            )}

            {/* Progress Stats */}
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Today:</span>
                {completedToday ? ' ✔ Completed' : ' ⏳ Pending'}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Streak:</span> {taskStreak} days
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">This week:</span> {weeklyProgress.completed}/7 days
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 ml-4">
          {isEditing ? (
            // Edit Mode Buttons
            <div className="flex space-x-2">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                style={{
                  background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                  boxShadow: '0 4px 12px rgba(107, 114, 128, 0.4)',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            // Normal Mode Buttons
            <>
              <button
                onClick={handleStartEdit}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                style={{
                  background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                  padding: '12px 16px',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                style={{
                  background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
                  padding: '12px 16px',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progress Controls */}
      {task && !isEditing && (
        <div className="mt-3 pt-3 border-t">
          <ProgressControls
            task={task}
            onToggleComplete={onToggleComplete}
          />
        </div>
      )}
    </div>
  );
}

// const TaskItem = ({ task, deleteTask, toggleComplete, onToggleComplete, onDelete, setEditingTask }) => {
//   if (!task) return null;

//   // Calculate completion percentage for subtasks if they exist
//   const calculateCompletion = () => {
//     if (task.subtasks && task.subtasks.length > 0) {
//       const completed = task.subtasks.filter(st => st.completed).length;
//       return (completed / task.subtasks.length) * 100;
//     }
//     return task.completed ? 100 : 0;
//   };

//   const completionPercentage = calculateCompletion();

//   return (
//     <div className={`task-item ${task.completed ? 'completed' : ''}`}>
//       <div className="task-header">
//         <h3 className="task-title">{task.title}</h3>
//         {onDelete && (
//           <button
//             onClick={() => onDelete(task.id)}
//             className="delete-btn"
//             aria-label="Delete task"
//           >
//             Delete
//           </button>
//         )}
//       </div>

//       {task.description && (
//         <p className="task-description">{task.description}</p>
//       )}

//       <div className="task-progress-section">
//         <div className="progress-visual">
//           <CircularProgress
//             percentage={completionPercentage}
//             size={60}
//             strokeWidth={6}
//             showPercentage={false}
//           />
//         </div>

//         <div className="progress-controls-wrapper">
//           <ProgressControls
//             task={task}
//             onToggleComplete={onToggleComplete}
//           />
//         </div>
//       </div>

//       {/* Weekly progress bars for each day */}
//       {task.dailyProgress && (
//         <div className="weekly-progress-bars">
//           <h4>Daily Progress:</h4>
//           <div className="days-grid">
//             {Object.entries(task.dailyProgress).map(([day, completed]) => (
//               <div key={day} className="day-progress">
//                 <span className="day-label">{day.slice(0, 3)}</span>
//                 <div className="day-progress-bar">
//                   <div
//                     className="day-progress-fill"
//                     style={{
//                       height: completed ? '100%' : '0%',
//                       backgroundColor: completed ? '#4caf50' : '#ddd'
//                     }}
//                   >
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TaskItem;

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
