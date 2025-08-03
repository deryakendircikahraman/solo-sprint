import React, { useState } from 'react';
import { Task } from '../types';

interface TaskChecklistProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskSelect?: (task: Task) => void;
  selectedTaskId?: string;
  isLoading: boolean;
}

export default function TaskChecklist({ tasks, onTaskToggle, onTaskUpdate, onTaskSelect, selectedTaskId, isLoading }: TaskChecklistProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [newResource, setNewResource] = useState('');

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  const addResource = (taskId: string) => {
    if (newResource.trim()) {
      const task = tasks.find(t => t.id === taskId);
      const currentResources = task?.resources || [];
      onTaskUpdate(taskId, { resources: [...currentResources, newResource.trim()] });
      setNewResource('');
    }
  };

  const removeResource = (taskId: string, resourceIndex: number) => {
    const task = tasks.find(t => t.id === taskId);
    const currentResources = task?.resources || [];
    const updatedResources = currentResources.filter((_, index) => index !== resourceIndex);
    onTaskUpdate(taskId, { resources: updatedResources });
  };

  const handleTaskClick = (task: Task) => {
    if (onTaskSelect) {
      onTaskSelect(task);
    }
  };

  if (isLoading) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold text-calm-900 mb-4">Tasks</h2>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-calm-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-calm-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-calm-900">Tasks</h2>
        <span className="text-sm text-calm-600">
          {completedCount} of {totalCount} completed
        </span>
      </div>
      
      {tasks.length === 0 ? (
        <p className="text-calm-600 text-center py-4">No tasks yet. Set a goal to get started!</p>
      ) : (
        <div className="space-y-3">
          {onTaskSelect && (
            <p className="text-sm text-calm-600 mb-3">
              💡 Click on a task to find AI-powered resources for it
            </p>
          )}
          
          {tasks.map(task => (
            <div
              key={task.id}
              className={`border border-calm-200 rounded-lg hover:bg-calm-50 transition-colors ${
                selectedTaskId === task.id ? 'ring-2 ring-primary bg-primary-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3 p-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onTaskToggle(task.id)}
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-calm-300 rounded"
                />
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm ${
                        task.completed
                          ? 'line-through text-calm-500'
                          : 'text-calm-900'
                      }`}
                    >
                      {task.title}
                    </span>
                    {onTaskSelect && (
                      <span className="text-xs text-calm-500">
                        {selectedTaskId === task.id ? '✅ Selected' : '👆 Click to select'}
                      </span>
                    )}
                  </div>
                  
                  {task.resources && task.resources.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {task.resources.map((resource, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-xs text-calm-500">🔗</span>
                          <a 
                            href={resource} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline truncate"
                          >
                            {resource}
                          </a>
                          <button
                            onClick={() => removeResource(task.id, index)}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                  className="text-calm-500 hover:text-calm-700 text-sm"
                >
                  {expandedTask === task.id ? '−' : '+'}
                </button>
              </div>
              
              {expandedTask === task.id && (
                <div className="px-3 pb-3 border-t border-calm-100">
                  <div className="flex space-x-2 mt-3">
                    <input
                      type="url"
                      value={newResource}
                      onChange={(e) => setNewResource(e.target.value)}
                      placeholder="https://example.com"
                      className="flex-1 text-xs p-2 border border-calm-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      onClick={() => addResource(task.id)}
                      disabled={!newResource.trim()}
                      className="text-xs bg-primary text-white px-3 py-2 rounded hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 