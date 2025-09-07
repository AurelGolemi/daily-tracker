import { useState } from 'react';

const AddTaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    } 

    // Check if onAddTask is actually a function
    if (typeof onAddTask !== 'function') {
      console.error('onAddTask is not a function:', onAddTask);
      alert('Error: Cannot add task. Please refresh the page.');
      return;
    }

    // Call the prop function with the correct name
    try {
      onAddTask({
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: new Date().toISOString()
      });
      // Reset form
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Error adding task. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <div className="form-group">
        <input type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          className="task-input"
          style={{ color: "#111" }}
          required
        />
      </div>

      <div className="form-group">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          className="task-textarea"
          rows="3"
          style={{color: "#111"}}
        />
      </div>

      <button type="submit" className="add-task-btn">
        Add Task
      </button>

      {/* Debug info - remove in production */}
      {import.meta.env && import.meta.env.MODE === 'development' && (
        <div style={{ fontSize: '12px', color: '#666', marginTop: '10px', display: 'none'}}>
          onAddTask type: {typeof onAddTask}
        </div>
      )}
    </form>
  );
};

AddTaskForm.defaultProps = {
  onAddTask: () => console.warn('onAddTask function not provided to AddTaskForm')
};

export default AddTaskForm;

// export default function AddTaskForm ({addTask, editingTask, updateTask}) {
//   const [taskText, setTaskText] = useState('');

//   useEffect(() => {
//     if (editingTask) {
//       setTaskText(editingTask.text);
//     } else {
//       setTaskText('');
//     }
//   }, [editingTask]);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!taskText.trim()) return;

//     if (editingTask) {
//       updateTask({
//         ...editingTask,
//         text: taskText
//       });
//     } else {
//       addTask({
//         id: Date.now(),
//         text: taskText,
//         completed: false
//       });
//     }

//     setTaskText('');
//   };

//   return (
//     <form onSubmit={handleSubmit} className="mb-6">
//       <div className="flex gap-2">
//         <input
//           type="text"
//           value={taskText}
//           onChange={(e) => setTaskText(e.target.value)}
//           placeholder="What do you need to do today?"
//           className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
//         />
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//         >
//           {editingTask ? 'Update' : 'Add'}
//         </button>
//       </div>
//     </form>
//   );
// }