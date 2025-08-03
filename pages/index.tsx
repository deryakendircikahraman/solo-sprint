import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import GoalForm from '../components/GoalForm';
import TaskChecklist from '../components/TaskChecklist';
import SessionSummaryCard from '../components/SessionSummaryCard';
import FocusChart from '../components/FocusChart';
import AutoResourceFinder from '../components/AutoResourceFinder';
import { Goal, Task, FocusSession, AutoResource } from '../types';

export default function Home() {
  const router = useRouter();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleGoalSubmit = async (goalText: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gpt-breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goalText }),
      });

      if (!response.ok) throw new Error('Failed to break down goal');

      const { tasks: taskTitles } = await response.json();
      
      const newGoal: Goal = {
        id: `goal-${Date.now()}`,
        title: goalText,
        tasks: [],
        createdAt: new Date(),
      };
      
      const newTasks: Task[] = taskTitles.map((title: string, index: number) => ({
        id: `task-${Date.now()}-${index}`,
        title,
        completed: false,
        createdAt: new Date(),
        goalId: newGoal.id,
        resources: [],
      }));

      const updatedGoal = { ...newGoal, tasks: newTasks };
      
      setGoal(updatedGoal);
      setTasks(newTasks);
      
      localStorage.setItem('currentGoal', JSON.stringify(updatedGoal));
      localStorage.setItem('currentTasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error('Error breaking down goal:', error);
      alert('Failed to break down goal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskToggle = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    );
    
    setTasks(updatedTasks);
    localStorage.setItem('currentTasks', JSON.stringify(updatedTasks));
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, ...updates }
        : task
    );
    
    setTasks(updatedTasks);
    localStorage.setItem('currentTasks', JSON.stringify(updatedTasks));
  };

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(selectedTask?.id === task.id ? null : task);
  };

  const handleResourcesFound = (resources: AutoResource[]) => {
    if (selectedTask) {
      const resourceUrls = resources.map(r => r.url);
      const currentResources = selectedTask.resources || [];
      const updatedResources = Array.from(new Set([...currentResources, ...resourceUrls]));
      
      handleTaskUpdate(selectedTask.id, { 
        resources: updatedResources,
        autoDiscovered: true 
      });
    }
  };

  const startFocusSession = () => {
    if (!goal) return;

    const session: FocusSession = {
      id: `session-${Date.now()}`,
      goalId: goal.id,
      startTime: new Date(),
      focusPercentage: 0,
      distractionPercentage: 0,
      tabSwitches: 0,
      emotionalState: 'focused',
    };

    setCurrentSession(session);
    setIsSessionActive(true);
    
    const interval = setInterval(() => {
      setCurrentSession(prev => {
        if (!prev) return prev;
        
        const duration = Math.floor((Date.now() - prev.startTime.getTime()) / 60000);
        const focusPercentage = Math.min(85 + Math.random() * 15, 100);
        const distractionPercentage = 100 - focusPercentage;
        const tabSwitches = Math.floor(duration / 5) + Math.floor(Math.random() * 3);
        
        return {
          ...prev,
          duration,
          focusPercentage: Math.round(focusPercentage),
          distractionPercentage: Math.round(distractionPercentage),
          tabSwitches,
          emotionalState: focusPercentage > 80 ? 'focused' : 
                         focusPercentage > 60 ? 'productive' : 
                         focusPercentage > 40 ? 'distracted' : 'frustrated'
        };
      });
    }, 10000);

    (window as any).focusInterval = interval;
  };

  const endFocusSession = () => {
    setIsSessionActive(false);
    if ((window as any).focusInterval) {
      clearInterval((window as any).focusInterval);
    }
    
    setTimeout(() => {
      router.push('/summary');
    }, 2000);
  };

  const resetData = () => {
    setGoal(null);
    setTasks([]);
    setCurrentSession(null);
    setIsSessionActive(false);
    setSelectedTask(null);
    localStorage.clear();
  };

  useEffect(() => {
    const savedGoal = localStorage.getItem('currentGoal');
    const savedTasks = localStorage.getItem('currentTasks');
    
    if (savedGoal && savedTasks) {
      setGoal(JSON.parse(savedGoal));
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  return (
    <>
      <Head>
        <title>SoloSprint - Focus & Reflect</title>
        <meta name="description" content="Set goals, track focus, and reflect on your productivity" />
      </Head>

      <div className="min-h-screen bg-calm-50">
        <header className="bg-white shadow-sm border-b border-calm-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-calm-900">
                🧠 SoloSprint
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-calm-600">
                  🤖 AI + Browser Automation
                </span>
                <button
                  onClick={resetData}
                  className="text-calm-600 hover:text-calm-900"
                  title="Clear all data and start fresh"
                >
                  🔄 Reset
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-calm-900 mb-2">
              Focus Dashboard
            </h2>
            <p className="text-calm-600">
              Set your focus goal, track your progress, and let AI help you find resources
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {!goal ? (
                <GoalForm onSubmit={handleGoalSubmit} isLoading={isLoading} />
              ) : (
                <>
                  <div className="card">
                    <h2 className="text-xl font-semibold text-calm-900 mb-2">
                      Today's Goal
                    </h2>
                    <p className="text-calm-700">{goal.title}</p>
                  </div>

                  <TaskChecklist 
                    tasks={tasks} 
                    onTaskToggle={handleTaskToggle}
                    onTaskUpdate={handleTaskUpdate}
                    onTaskSelect={handleTaskSelect}
                    selectedTaskId={selectedTask?.id}
                    isLoading={isLoading}
                  />
                  
                  {selectedTask && (
                    <AutoResourceFinder
                      taskTitle={selectedTask.title}
                      goal={goal.title}
                      onResourcesFound={handleResourcesFound}
                    />
                  )}
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={startFocusSession}
                      disabled={isSessionActive}
                      className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSessionActive ? 'Session Active...' : 'Start Focus Session'}
                    </button>
                    
                    {isSessionActive && (
                      <button
                        onClick={endFocusSession}
                        className="btn-secondary"
                      >
                        End Session
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="space-y-6">
              {currentSession && (
                <>
                  <SessionSummaryCard session={currentSession} />
                  <FocusChart 
                    focusPercentage={currentSession.focusPercentage}
                    distractionPercentage={currentSession.distractionPercentage}
                    type="doughnut"
                  />
                </>
              )}
              
              {!currentSession && goal && (
                <div className="card text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-lg font-semibold text-calm-900 mb-2">
                    Ready to Focus?
                  </h3>
                  <p className="text-calm-600">
                    Start your focus session to begin tracking your productivity
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 