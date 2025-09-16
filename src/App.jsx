import { useState, useEffect, useCallback } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import ErrorBoundary from "./components/ErrorBoundary";
import TaskList from './components/taskList';
import AddTaskForm from "./components/AddTaskForm";
import CircularProgress from "./components/CircularProgress";
import { getTodayDateString } from "./utils/dateUtils";
import './App.css';

function App() {
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [overallProgress, setOverallProgress] = useState(0);
  const [editingTask, setEditingTask] = useState(null);

  // Initialize app
  useEffect(() => {
    try {
      const lastVisit = localStorage.getItem("lastVisit");
      const today = getTodayDateString();

      if (lastVisit !== today) {
        localStorage.setItem("lastVisit", today);
      }
      
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Error during app initialization:', error);
    }
  }, []);

  // Calculate overall progress
  useEffect(() => {
    try {
      if (!tasks || tasks.length === 0) {
        setOverallProgress(0);
        return;
      }

      const today = getTodayDateString();
      const completedToday = tasks.filter(
        (task) => {
          return task?.completions && 
                 Array.isArray(task.completions) && 
                 task.completions.includes(today);
        }
      ).length;

      console.log('Completed today:', completedToday, 'Total tasks:', tasks.length);

      const progress = tasks.length > 0 ? (completedToday / tasks.length) * 100 : 0;
      setOverallProgress(progress);
    } catch (error) {
      console.error('Error calculating progress:', error);
      setOverallProgress(0);
    }
  }, [tasks]);

  // Define all functions using useCallback to prevent re-creation
  const addTask = useCallback((taskData) => {
    try {
      console.log('addTask called with:', taskData);
      
      if (!taskData || !taskData.text?.trim()) {
        console.warn('Invalid task data provided to addTask');
        return;
      }

      const newTask = {
        id: Date.now() + Math.random(),
        text: taskData.text.trim(),
        description: taskData.description?.trim() || '',
        completions: [],
        streak: 0,
        lastCompleted: null,
        createdAt: new Date().toISOString(),
      };

      setTasks((prev) => {
        const updated = [...prev, newTask];
        console.log('Tasks updated after add:', updated.length);
        return updated;
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }, [setTasks]);

  const editTask = useCallback((task) => {
    try {
      console.log('editTask called with:', task);
      
      if (!task || !task.id) {
        console.error('Invalid task provided to editTask:', task);
        return;
      }

      setEditingTask(task);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  }, []);

  const updateTask = useCallback((taskId, updatedData) => {
    try {
      console.log('updateTask called with:', { taskId, updatedData });
      
      if (!taskId || !updatedData) {
        console.error('Invalid parameters for updateTask:', { taskId, updatedData });
        return;
      }

      setTasks((prevTasks) => {
        const updated = prevTasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              text: updatedData.text?.trim() || task.text,
              description: updatedData.description?.trim() || task.description || '',
              updatedAt: new Date().toISOString(),
            };
          }
          return task;
        });
        console.log('Tasks updated after edit:', updated.length);
        return updated;
      });

      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }, [setTasks]);

  const cancelEdit = useCallback(() => {
    try {
      console.log('cancelEdit called');
      setEditingTask(null);
    } catch (error) {
      console.error('Error canceling edit:', error);
    }
  }, []);

  const toggleComplete = useCallback((taskId) => {
    try {
      console.log('toggleComplete called with taskId:', taskId);
      
      if (!taskId) {
        console.error('No taskId provided to toggleComplete');
        return;
      }

      setTasks((prevTasks) => {
        const updated = prevTasks.map((task) => {
          if (task.id === taskId) {
            const today = getTodayDateString();
            const completions = task.completions || [];
            const alreadyCompletedToday = completions.includes(today);

            console.log('Toggling task:', {
              taskId,
              alreadyCompletedToday,
              currentCompletions: completions
            });

            let newCompletions;
            let newStreak;

            if (alreadyCompletedToday) {
              newCompletions = completions.filter((date) => date !== today);
              newStreak = Math.max(0, (task.streak || 0) - 1);
            } else {
              newCompletions = [...completions, today];
              newStreak = (task.streak || 0) + 1;
            }

            const updatedTask = {
              ...task,
              completions: newCompletions,
              streak: newStreak,
              lastCompleted: alreadyCompletedToday ? null : new Date().toISOString(),
              completed: !alreadyCompletedToday,
            };

            console.log('Task after toggle:', updatedTask);
            return updatedTask;
          }
          return task;
        });
        
        console.log('All tasks after toggle:', updated.length);
        return updated;
      });
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  }, [setTasks]);

  const deleteTask = useCallback((taskId) => {
    try {
      console.log('deleteTask called with taskId:', taskId);
      
      if (!taskId) {
        console.error('No taskId provided to deleteTask');
        return;
      }

      const confirmed = window.confirm('Are you sure you want to delete this task?');
      if (confirmed) {
        setTasks((prev) => {
          const updated = prev.filter((task) => task.id !== taskId);
          console.log('Tasks after delete:', updated.length);
          return updated;
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, [setTasks]);

  // Handle edit form submission
  const handleEditSubmit = useCallback((updatedData) => {
    if (editingTask) {
      updateTask(editingTask.id, updatedData);
    }
  }, [editingTask, updateTask]);

  // Debug logging
  console.log('App render - Function types:', {
    addTask: typeof addTask,
    editTask: typeof editTask,
    updateTask: typeof updateTask,
    toggleComplete: typeof toggleComplete,
    deleteTask: typeof deleteTask
  });

  return (
    <ErrorBoundary>
      <div className="app-container py-8 min-h-screen bg-gray-50">
        <header className="app-header text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Daily Task Tracker
          </h1>
          <div className="overall-progress flex flex-col items-center justify-center">
            <CircularProgress
              completed={Math.round(overallProgress)}
              total={100}
              size={100}
              strokeWidth={8}
            />
            <p className="text-gray-600 mt-3 text-lg font-medium">
              {Math.round(overallProgress)}% of tasks completed today
            </p>
          </div>
        </header>

        <main className="app-main max-w-4xl mx-auto px-4">
          {/* Edit Form */}
          {editingTask ? (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h2 className="text-lg font-semibold text-blue-800 mb-3">
                Edit Task: {editingTask.text}
              </h2>
              <AddTaskForm
                onAddTask={handleEditSubmit}
                onCancel={cancelEdit}
                initialData={{
                  text: editingTask.text,
                  description: editingTask.description || '',
                }}
                isEditing={true}
              />
            </div>
          ) : (
            <div className="mb-6">
              <AddTaskForm onAddTask={addTask} />
            </div>
          )}

          {/* Task Statistics */}
          {tasks.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Task Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Tasks:</span> {tasks.length}
                </div>
                <div>
                  <span className="font-medium">Completed Today:</span>{' '}
                  {tasks.filter(task => 
                    task?.completions?.includes(getTodayDateString())
                  ).length}
                </div>
                <div>
                  <span className="font-medium">Pending:</span>{' '}
                  {tasks.filter(task => 
                    !task?.completions?.includes(getTodayDateString())
                  ).length}
                </div>
              </div>
            </div>
          )}

          {/* Task List */}
          {tasks.length > 0 ? (
            <TaskList
              tasks={tasks}
              onToggleComplete={toggleComplete}
              onDelete={deleteTask}
              onEdit={editTask}
            />
          ) : (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-sm border p-8">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No tasks yet
                </h3>
                <p className="text-gray-500">
                  Add your first task above to get started with tracking your daily progress!
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;

// setTasks((prev) => [...prev, newTask]);
  // const toggleComplete = (taskId) => {
  //   setTasks(
  //     tasks.map((task) => {
  //       if (task.id === taskId) {
  //         const today = getTodayDateString();
  //         const alreadyCompletedToday =
  //           task.completions && task.completions.includes(today);

  //         let newCompletions;
  //         let newStreak;

  //         if (alreadyCompletedToday) {
  //           // Remove today's completion
  //           newCompletions = task.completions.filter((date) => date !== today);
  //           newStreak = Math.max(0, task.streak - 1);
  //         } else {
  //           // Add today's completion
  //           newCompletions = [...(task.completions || []), today];
  //           newStreak = (task.streak || 0) + 1;
  //         }

  //         return {
  //           ...task,
  //           completions: newCompletions,
  //           streak: newStreak,
  //           lastCompleted: alreadyCompletedToday
  //             ? null
  //             : new Date().toISOString(), // Fixed: added parentheses
  //           completed: !alreadyCompletedToday,
  //         };
  //       }
  //       return task;
  //     })
  //   );
  // }; // Fixed: Removed extra closing brace and semicolon

  // const deleteTask = (taskId) => {
  //   setTasks((prev) => prev.filter((task) => task.id !== taskId));
  // };






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
