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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-gradient-to-r from-purple-300 to-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-gradient-to-r from-yellow-300 to-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-blue-300 to-green-600 rounded-full mi-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-2 tracking-tight">
                Daily Tracker
              </h1>
              <p className="text-lg text-gray-600 mb-8 font-medium">
                Track your daily progress and build lasting habits!
              </p>

              {/* Main Progress Circle */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-lg opacity-25 animate-pulse"></div>
                  <div className="relative bg-white rounded-full p-6 shadow-2xl border border-gray-100">
                    <CircularProgress
                      completed={Math.round(overallProgress)}
                      total={100}
                      size={120}
                      strokeWidth={10}
                      className="drop-shadow-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200/50 inline-block">
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round(overallProgress)}%
                </p>
                <p className="text-gray-600 font-medium">
                  of tasks completed today.
                </p>
              </div>
            </div>
          </header>

          <main className="max-w-4xl mx-auto space-y-8">
            {/* Edit Form */}
            {editingTask ? (
              <div className="bg-white/80 backdrop-blur-sm rounde-2xl shadow-xl border border-indigo-200/50 p-8 animate-in slide-in-from-top duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Edit Task</h2>
                    <p className="text-gray-600">"{editingTask.text}"</p>
                  </div>
                </div>
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
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Add New Task</h2>
                      <p className="text-gray-600">What would you like to accomplish today?</p>
                    </div>
                  </div>
                  <AddTaskForm onAddTask={addTask} />
                </div>
            )};

            {/* Task Statistics */}
            {tasks.length > 0 && (
              <div className="bg-white/80.backdrop-blur-sm.rounded-2xl.shadow-xl.border.border-gray-200/50.p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Task Overview</h2>
                    <p className="text-gray-600">Your progress on sight</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-indigo-600 font-medium text-sm uppercase tracking-wide">Total Tasks</p>
                        <p className="text-3xl font-bold text-indigo-900">{tasks.length}</p>
                      </div>
                      <div className="bg-indigo-200 p-3 rounded-full">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                    <div className="flex flex-items-center justify-between">
                      <div>
                        <p className="text-green-600 font-medium text-sm uppercase tracking-wide">Completed Today</p>
                        <p className="text-3xl font-bold text-green-900">
                          {tasks.filter(task =>
                            task?.completions?.includes(getTodayDateString())
                          ).length}
                        </p>
                      </div>
                      <div className="bg-green-200 p-3 rounded-full">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-600 font-medium text-sm uppercase tracking-wide">Pending</p>
                        <p className="text-3xl font-bold text-yellow-900">
                          {tasks.filter(task =>
                            !task?.completions?.includes(getTodayDateString())
                          ).length}
                        </p>
                      </div>
                      <div className="bg-yellow-200 p-3 rounded-full">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Task List */}
            {tasks.length > 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
                    <p className="text-gray-600">Manage your daily activities</p>
                  </div>
                </div>
                <TaskList
                  tasks={tasks}
                  onToggleComplete={toggleComplete}
                  onDelete={deleteTask}
                  onEdit={editTask}
                />
              </div>
            ) : (
                <div className="text-center py-16">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-12">
                  <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-600 mb-3">
                      Ready to get started?
                    </h3>
                    <p className="text-gray-500 text-lg max-w-md mx-auto">
                      Add your first task above to begin tracking your daily progress!
                    </p>
                </div>
              </div>
            )}
          </main>
        </div>
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
