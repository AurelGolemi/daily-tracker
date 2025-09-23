import { useState, useEffect, useCallback } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import ErrorBoundary from "./components/ErrorBoundary";
import TaskList from './components/TaskList';
import AddTaskForm from "./components/AddTaskForm";
import CircularProgress from "./components/CircularProgress";
import { getTodayDateString } from "./utils/dateUtils";
import "./App.css";

function App() {
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);

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

  // Calculate both daily and weekly progress
  useEffect(() => {
    try {
      if (!tasks || tasks.length === 0) {
        setDailyProgress(0);
        setWeeklyProgress(0);
        return;
      }

      const today = getTodayDateString();
      
      // Calculate daily progress
      const completedToday = tasks.filter(
        (task) => {
          return task?.completions && 
                 Array.isArray(task.completions) && 
                 task.completions.includes(today);
        }
      ).length;

      const dailyPercent = tasks.length > 0 ? (completedToday / tasks.length) * 100 : 0;
      setDailyProgress(dailyPercent);

      // Calculate weekly progress (last 7 days)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      let totalWeeklyTaskInstances = 0;
      let completedWeeklyTaskInstances = 0;

      // For each task, check how many times it should have been completed this week
      tasks.forEach(task => {
        const completions = task.completions || [];
        
        // Count how many days this week the task could have been completed (7 days)
        totalWeeklyTaskInstances += 7;
        
        // Count how many times it was actually completed in the last 7 days
        const weeklyCompletions = completions.filter(completionDate => {
          try {
            const date = new Date(completionDate);
            return date >= oneWeekAgo && date <= new Date();
          } catch (error) {
            return false;
          }
        });
        
        completedWeeklyTaskInstances += weeklyCompletions.length;
      });

      const weeklyPercent = totalWeeklyTaskInstances > 0 
        ? (completedWeeklyTaskInstances / totalWeeklyTaskInstances) * 100 
        : 0;
      
      setWeeklyProgress(weeklyPercent);

      console.log('Progress calculated:', {
        daily: `${completedToday}/${tasks.length} (${Math.round(dailyPercent)}%)`,
        weekly: `${completedWeeklyTaskInstances}/${totalWeeklyTaskInstances} (${Math.round(weeklyPercent)}%)`
      });

    } catch (error) {
      console.error('Error calculating progress:', error);
      setDailyProgress(0);
      setWeeklyProgress(0);
    }
  }, [tasks]);

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

  const editTask = useCallback((updatedTask) => {
    try {
      console.log('editTask called with updated task:', updatedTask);
      
      if (!updatedTask || !updatedTask.id) {
        console.error('Invalid task provided to editTask:', updatedTask);
        return;
      }

      setTasks((prevTasks) => {
        const updated = prevTasks.map((task) => {
          if (task.id === updatedTask.id) {
            return {
              ...task,
              text: updatedTask.text?.trim() || task.text,
              description: updatedTask.description?.trim() || task.description || '',
              updatedAt: new Date().toISOString(),
            };
          }
          return task;
        });
        console.log('Tasks updated after inline edit:', updated.length);
        return updated;
      });
    } catch (error) {
      console.error('Error editing task:', error);
    }
  }, [setTasks]);

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

      setTasks((prev) => {
        const updated = prev.filter((task) => task.id !== taskId);
        console.log('Tasks after delete:', updated.length);
        return updated;
      });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }, [setTasks]);

  return (
    <ErrorBoundary>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '20px'
      }}>
        
        <div style={{
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          
          {/* Header with Dual Progress Display */}
          <header style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Daily Tracker
            </h1>
            
            <p style={{
              fontSize: '1.2rem',
              color: '#4b5563',
              marginBottom: '32px',
              fontWeight: '500'
            }}>
              Track your daily progress and build lasting habits
            </p>
            
            {/* Dual Progress Display */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '40px',
              marginBottom: '32px',
              flexWrap: 'wrap'
            }}>
              
              {/* Main Weekly Progress Circle */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '50%',
                  padding: '32px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: '-10px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '50%',
                    opacity: '0.2',
                    filter: 'blur(15px)',
                    animation: 'pulse 3s ease-in-out infinite'
                  }}></div>
                  <div style={{ position: 'relative' }}>
                    <CircularProgress
                      completed={Math.round(weeklyProgress)}
                      total={100}
                      size={100}
                      strokeWidth={8}
                    />
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '16px 24px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  marginTop: '16px',
                  display: 'inline-block'
                }}>
                  <p style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>
                    {Math.round(weeklyProgress)}%
                  </p>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}>
                    Weekly Progress
                  </p>
                </div>
              </div>

              {/* Secondary Daily Progress Circle */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '50%',
                  padding: '20px',
                  boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <CircularProgress
                    completed={Math.round(dailyProgress)}
                    total={100}
                    size={80}
                    strokeWidth={6}
                  />
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                  marginTop: '12px',
                  display: 'inline-block'
                }}>
                  <p style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '2px'
                  }}>
                    {Math.round(dailyProgress)}%
                  </p>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    Today's Progress
                  </p>
                </div>
              </div>
            </div>
            
            {/* Progress Explanation */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              maxWidth: '600px',
              margin: '0 auto',
              fontSize: '14px',
              color: '#e5e7eb',
              lineHeight: '1.5'
            }}>
              <strong style={{ color: 'white' }}>Weekly Progress:</strong> Shows your consistency over the last 7 days across all tasks
              <br />
              <strong style={{ color: 'white' }}>Daily Progress:</strong> Shows today's completion rate for immediate motivation
            </div>
          </header>

          {/* Add Task Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              Add New Task
            </h2>
            <p style={{
              color: '#6b7280',
              marginBottom: '24px',
              fontSize: '1.1rem'
            }}>
              What would you like to accomplish this week?
            </p>
            
            <AddTaskForm onAddTask={addTask} />
          </div>

          {/* Task Statistics */}
          {tasks.length > 0 && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              marginBottom: '32px',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '24px'
              }}>
                Task Overview
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #ddd6fe, #c7d2fe)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#5b21b6', fontWeight: '600', fontSize: '0.9rem', marginBottom: '8px' }}>
                    TOTAL TASKS
                  </p>
                  <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4c1d95' }}>
                    {tasks.length}
                  </p>
                </div>
                
                <div style={{
                  background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#166534', fontWeight: '600', fontSize: '0.9rem', marginBottom: '8px' }}>
                    COMPLETED TODAY
                  </p>
                  <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#15803d' }}>
                    {tasks.filter(task => 
                      task?.completions?.includes(getTodayDateString())
                    ).length}
                  </p>
                </div>
                
                <div style={{
                  background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#92400e', fontWeight: '600', fontSize: '0.9rem', marginBottom: '8px' }}>
                    PENDING TODAY
                  </p>
                  <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#d97706' }}>
                    {tasks.filter(task => 
                      !task?.completions?.includes(getTodayDateString())
                    ).length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Task List */}
          {tasks.length > 0 ? (
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              marginBottom: '32px',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '24px'
              }}>
                Your Tasks
              </h2>
              
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid #93c5fd',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '20px',
                fontSize: '14px',
                color: '#1e40af'
              }}>
                <strong>Tip:</strong> Click on any task title or description to edit it directly. Weekly progress builds consistency over time!
              </div>
              
              <TaskList
                tasks={tasks}
                onToggleComplete={toggleComplete}
                onDelete={deleteTask}
                onEdit={editTask}
              />
            </div>
          ) : (
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '48px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '24px'
              }}>📝</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#6b7280',
                marginBottom: '12px'
              }}>
                Ready to get started?
              </h3>
              <p style={{
                color: '#9ca3af',
                fontSize: '1.1rem'
              }}>
                Add your first task above to begin tracking your weekly progress!
              </p>
            </div>
          )}
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
