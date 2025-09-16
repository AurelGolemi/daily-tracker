import React from "react";
import CircularProgress from "./CircularProgress";
import ProgressControls from "./ProgressControls";
import { isToday, getTodayDateString } from "../utils/dateUtils";

export default function TaskItem({
  task,
  onDelete,
  onToggleComplete,
  onEdit,
}) {

  // Debug logging to verify functions are received
  console.log('TaskItem received props:', {
    taskId: task?.id,
    onToggleCompleteType: typeof onToggleComplete,
    onDeleteType: typeof onDelete,
    onEditType: typeof onEdit
  });

  // Safety checks for every prop
  if (!task) {
    console.warn('TaskItem: No task prop provided');
    return <div className="text-red-500 p-4">Invalid task data</div>;
  }

  // Verify functions
  const functionsValid = {
    onToggleComplete: typeof onToggleComplete === 'function',
    onDelete: typeof onDelete === 'function',
    onEdit: typeof onEdit === 'function'
  };

  console.log('TaskItem function validation:', functionsValid);

  const taskText = task?.text || 'Unnamed Task';
  const taskCompletions = task?.completions || [];
  const taskStreak = task?.streak || 0;

  const today = getTodayDateString();

  // Check if task is completed today
  const completions = task.completions || [];
  const completedToday = completions.some((completionDate) => isToday(completionDate)
  );

  // Calculate progress for circular bar (7-day week)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weeklyCompletions = taskCompletions.filter((completionDate) => {
    try {
      const date = new Date(completionDate);
      return date >= oneWeekAgo;
      // const completionDate = new Date(date);
      // const weekAgo = new Date();
      // weekAgo.setDate(weekAgo.getDate() - 7);
    } catch (error) {
      console.warn('Invalid date in completions:', completionDate, error);
      return false;
    }
    
  });

  const weeklyProgress = {
    completed: weeklyCompletions.length,
    total: 7
  };

  // Safe edit handler
  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('TaskItem: Edit button clicked for task:', task.id);

    if (functionsValid.onEdit) {
      try {
        onEdit(task);
        console.log('TaskItem: onEdit called succesfully');
      } catch (error) {
        console.error('TaskItem: Error calling onEdit', error);
      }
    } else {
      console.error('TaskItem: onEdit is not a function:', typeof onEdit);
      alert('Edit functionality is not available. Please check the console for errors!');
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('TaskItem: Delete button clicked for task:', task.id);

    if (functionsValid.onDelete) {
      const confirmed = window.confirm('Are you sure you want to delete the task?');
      if (confirmed) {
        try {
          onDelete(task.id);
          console.log('TaskItem: onDelete called successfully');
        } catch (error) {
          console.error('TaskItem: Error calling onDelete', error);
        }
      }
    } else {
      console.error('TaskItem: onDelete is not a function:', typeof onDelete);
      alert('Delete functionality is not available. Please check the console for errors!');
    }
  }

  // Safe toggle handler
  const handleToggleComplete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('TaskItem: Toggle complete clicked for task:', task.id);

    if (functionsValid.onToggleComplete) {
      try {
        onToggleComplete(task.id);
        console.log('TaskItem: onToggleComplete called successfully');
      } catch (error) {
        console.error('TaskItem: Error calling onToggleComplete:', error);
      }
    } else {
      console.error('TaskItem: onToggleComplete is not a function:', typeof onToggleComplete);
      alert('Toggle complete functionality is not available. Please check the console for errors!');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={completedToday}
            onChange={handleToggleComplete}
            className="h-5 w-5 text-blue-500 rounded focus:ring-blue-400 cursor-pointer"
          />

          {/*Circular Progress*/}
          <CircularProgress
            completed={weeklyProgress.completed}
            total={weeklyProgress.total}
            size={50}
            strokeWidth={4}
          />

          {/*Task Info*/}
          <div className="flex-1 min-w-0">
            <span className={`text-gray-800 font-medium ${completedToday ? 'line-through text-gray-400' : ''}`}>
              {taskText}
            </span>

            {/* Show Description */}
            {task?.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}

            {/*Progress Stats */}
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Today:</span>
                {completedToday ? '✔ Completed' : '⏳ Pending'}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Streak:</span> {taskStreak} days.
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">This week:</span> {weeklyProgress.completed}/7 days
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 ml-4">
          <button
            onClick={handleEdit}
            disabled={!functionsValid.onEdit}
            className={`px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors ${functionsValid.onEdit ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            type="button"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={!functionsValid.onDelete}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              functionsValid.onDelete
                ? 'bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Progress Controls */}
      {task && functionsValid.onToggleComplete && (
        <div className="mt-3 pt-3 border-t">
          <ProgressControls
            task={task}
            onToggleComplete={onToggleComplete}
          />
        </div>
      )};

      {/* Show error message if functions are missing */}
      {(!functionsValid.onToggleComplete || !functionsValid.onEdit || !functionsValid.onDelete) && (
        <div className="mt-3 pt-3 border-t bg-red-50 p-2 rounded">
          <p className="text-red-600 text-sm font-medium">
            ⚠ Some functionality is unavailable. Check console for details!
          </p>
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
