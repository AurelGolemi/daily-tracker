import TaskItem from './TaskItem';

export default function TaskList({ tasks, deleteTask, toggleComplete, setEditingTask }) {
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
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Your Tasks</h2>
      <ul className="divide-y divide-gray-200">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            toggleComplete={toggleComplete}
            setEditingTask={setEditingTask}
          />
        ))}
      </ul>
    </div>
  );
}