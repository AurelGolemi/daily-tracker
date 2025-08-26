import { useState, useEffect } from 'react';

export default function AddTaskForm ({addTask, editingTask, updateTask}) {
  const [taskText, setTaskText] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTaskText(editingTask.text);
    } else {
      setTaskText('');
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskText.trim()) return;

    if (editingTask) {
      updateTask({
        ...editingTask,
        text: taskText
      });
    } else {
      addTask({
        id: Date.now(),
        text: taskText,
        completed: false
      });
    }

    setTaskText('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="What do you need to do today?"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          {editingTask ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
}