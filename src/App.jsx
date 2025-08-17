import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {
  // Tasks setup
  const [tasks, setTasks] = useState([
    // { id: 1, text: "Go to the gym", completed: false }
  ]);
  // const [newTask, setNewTask] = useState(['']);

  // Load from localStorage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // Save to localStorage when tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Adding tasks
  const addTask = (text) => {
    setTasks([...tasks, { id: Date.now(), text, completed: false }]);
  };

  addTask();

  // Deleting tasks
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  deleteTask();

  // Toggling tasks
  const toggleTask = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  toggleTask();

  // Editing tasks
  const editTask = (id, newText) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  editTask();
}

export default App
