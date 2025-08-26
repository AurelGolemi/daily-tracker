import { useState } from 'react'
import './App.css'
import TaskItem from './components/TaskItem';
import TaskList from './components/taskList';
import AddTaskForm from './components/AddTaskForm';
import useLocalStorage from './hooks/useLocalStorage';



function App() {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [editingTask, setEditingTask] = useState(null);

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  }

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ));
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Daily Tasks & Habits</h1>
        <p>Welcome!!</p>

        <AddTaskForm
          addTask={addTask}
          editingTask={editingTask}
          updateTask={updateTask}
        />
        <TaskList
          tasks={tasks}
          deleteTask={deleteTask}
          toggleComplete={toggleComplete}
          setEditingTask={setEditingTask}
        />
      </div>
    </div>
  );
}

export default App;