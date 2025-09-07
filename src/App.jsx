import { useState, useEffect } from 'react'
import useLocalStorage from './hooks/useLocalStorage';
import ErrorBoundary from './components/ErrorBoundary';
import TaskItem from './components/TaskItem';
// import TaskList from './components/taskList';
import AddTaskForm from './components/AddTaskForm';
import CircularProgress from './components/CircularProgress';
// import ProgressControls from './components/ProgressControls';
import './App.css'

function App() {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [overallProgress, setOverallProgress] = useState(0);

  // Calculate overall progress
  useEffect(() => {
    if (tasks.length === 0) {
      setOverallProgress(0);
      return;
    }

    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = (completedTasks / tasks.length) * 100;
    setOverallProgress(progress);
  }, [tasks]);

  const addTask = (newTask) => {
    const taskWithDefaults = { 
      ...newTask, 
      id: Date.now(), 
      completed: false,
      dailyProgress: {
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false
      },
      createdAt: newTask.createdAt || new Date().toISOString()
    };

    setTasks(prev => [...prev, taskWithDefaults]);
  };

  const toggleComplete = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // const updateDailyProgress = (taskId, day, completed) => {
  //   setTasks(prev => prev.map(task => 
  //     task.id === taskId 
  //       ? { 
  //           ...task, 
  //           dailyProgress: { 
  //             ...task.dailyProgress, 
  //             [day]: completed 
  //           } 
  //         }
  //       : task
  //   ));
  // };

  return (
    <ErrorBoundary>
      <div className="app-container">
        <header className="app-header">
          <h1>Weekly Task Progress</h1>
          <div className="overall-progress">
            <CircularProgress 
              percentage={overallProgress} 
              size={120}
              strokeWidth={12}
              label="Overall Completion"
            />
          </div>
        </header>

        <main className="app-main">
          <AddTaskForm onAddTask={addTask} />
          
          <div className="tasks-container">
            {tasks.length === 0 ? (
              <p className="no-tasks">No tasks yet. Add your first task!</p>
            ) : (
              tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleComplete}
                  onDelete={deleteTask}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;

// function App() {
//   const [tasks, setTasks] = useLocalStorage('tasks', []);
//   const [editingTask, setEditingTask] = useState(null);
//   // Create task, modifying the new task object:
//   const addTask = (taskText) => {
//     const newTask = {
//       id: Date.now(),
//       text: taskText,
//       progress: {
//         completed: 0, // Days completed
//         total: 7, // Total days goal
//         lastUpdated: null // Last completion date
//       }
//     }
//     setTasks([...tasks, newTask]);
//   };

//   // Updating progress
//   const updateProgress = (taskId, completed) => {
//     setTasks(tasks.map(task =>
//       task.id === taskId ? {
//         ...task,
//         progress: {
//           ...task.progress,
//           completed: Math.min(task.progress.total, completed),
//           lastUpdated: new Date().toISOString()
//         }
//       } : task
//     ));
//   };

//   const deleteTask = (id) => {
//     setTasks(tasks.filter(task => task.id !== id));
//   }

//   const toggleComplete = (id) => {
//     setTasks(tasks.map(task =>
//       task.id === id ? { ...task, completed: !task.completed } : task
//     ));
//   };

//   const updateTask = (updatedTask) => {
//     setTasks(tasks.map(task =>
//       task.id === updatedTask.id ? updatedTask : task
//     ));
//     setEditingTask(null);
//   };

  

//   return (
//     <div className="min-h-screen bg-gray-100 py-8">
//       <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Daily Tasks & Habits</h1>
//         <p>Welcome!!</p>

//         <AddTaskForm
//           addTask={addTask}
//           editingTask={editingTask}
//           updateTask={updateTask}
//         />
//         <TaskList
//           tasks={tasks}
//           deleteTask={deleteTask}
//           toggleComplete={toggleComplete}
//           setEditingTask={setEditingTask}
//           updateProgress={updateProgress}
//         />
//         <ErrorBoundary>
//           <div className="app">
//             <h1>Daily Tracker</h1>
//             <CircularProgress />
//             <ProgressControls />
//           </div>
//         </ErrorBoundary>
//       </div>
//     </div>
//   );
// }

// export default App;