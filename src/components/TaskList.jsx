import React from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onDelete, onToggleComplete, onEdit }) {

  // Debug logging to verify functions are received
  console.log('TaskList received props:', {
    tasksCount: tasks?.length || 0,
    onToggleCompleteType: typeof onToggleComplete,
    onDeleteType: typeof onDelete,
    onEditType: typeof onEdit
  });

  if (!Array.isArray(tasks)) {
    console.warn('TaskList: tasks is not an array:', tasks);
    return <div className="text-red-500">Invalid tasks data</div>
  }

  if (typeof onToggleComplete !== 'function') {
    console.error('TaskList: onToggleComplete is not a function');
  }

  if (typeof onDelete !== 'function') {
    console.error('TaskList: onDelete is not a function');
  }

  if (typeof onEdit !== 'function') {
    console.error('TaskList: onEdit is not a function');
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No tasks yet!</p>
        <p className="text-gray-400 text-sm">Add your first task above to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Your Tasks</h2>
      <ul className="divide-y divide-gray-200">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
          />
        ))}
      </ul>
    </div>
  );
}