export default function TaskItem({ task, deleteTask, toggleComplete, setEditingTask }) {
  return (
    <li className="py-3 px-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="fle items-center space-x-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleComplete(task.id)}
            className="h-5 w-5 text-blue-500 rounded focus:ring-blue-400 cursor-pointer"
          />
          <span
            className={`text-gray-800 ${task.completed ? 'line-through text-gray-400' : ''}`}
          >
            {task.text}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setEditingTask(task)}
            className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded-text-sm font-medium transition-colors"
            aria-label="Edit task"
          >
            Edit
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="text-red-500 hover:text-red-700 px-2 py-1 rounded text-sm font-medium transition-colors"
            aria-label="Delete task"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  )
}