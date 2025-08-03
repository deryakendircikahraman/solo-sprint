import React, { useState } from 'react';
import { AutoResource } from '../types';
import toast from 'react-hot-toast';

interface AutoResourceFinderProps {
  taskTitle: string;
  goal: string;
  onResourcesFound: (resources: AutoResource[]) => void;
}

export default function AutoResourceFinder({ taskTitle, goal, onResourcesFound }: AutoResourceFinderProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [resources, setResources] = useState<AutoResource[]>([]);

  const findResources = async () => {
    setIsSearching(true);
    
    try {
      const response = await fetch('/api/auto-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle, goal })
      });
      
      const data = await response.json();
      
      if (data.resources) {
        setResources(data.resources);
        onResourcesFound(data.resources);
        toast.success(`Found ${data.resources.length} relevant resources!`);
      } else {
        toast.error('Failed to find resources');
      }
    } catch (error) {
      console.error('Error finding resources:', error);
      toast.error('Error finding resources');
    } finally {
      setIsSearching(false);
    }
  };

  const openResource = async (resource: AutoResource) => {
    try {
      const response = await fetch('/api/browser-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'open-resource', 
          url: resource.url,
          taskId: 'current-task'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success(`Opening ${data.result.title || resource.title}`);
        window.open(resource.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening resource:', error);
      window.open(resource.url, '_blank');
    }
  };

  return (
    <div className="card border-2 border-primary-200 bg-primary-50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-calm-900">
            🤖 AI Resource Finder
          </h3>
          <p className="text-sm text-calm-600">
            Selected task: <strong>{taskTitle}</strong>
          </p>
        </div>
        <button
          onClick={findResources}
          disabled={isSearching}
          className="btn-primary text-sm disabled:opacity-50"
        >
          {isSearching ? '🔍 Searching...' : '🔍 Find Resources'}
        </button>
      </div>
      
      {resources.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-calm-600">
            AI-discovered resources for: <strong>{taskTitle}</strong>
          </p>
          
          {resources.map((resource, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-calm-200"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-calm-500">
                    {resource.source === 'ai-search' ? '🤖' : '🔍'}
                  </span>
                  <span className="text-sm font-medium text-calm-900">
                    {resource.title}
                  </span>
                  <span className="text-xs text-calm-500">
                    (Relevance: {resource.relevance}/10)
                  </span>
                </div>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline block mt-1"
                >
                  {resource.url}
                </a>
              </div>
              
              <button
                onClick={() => openResource(resource)}
                className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark"
              >
                Open
              </button>
            </div>
          ))}
        </div>
      )}
      
      {resources.length === 0 && !isSearching && (
        <div className="text-center py-6">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm text-calm-600 mb-3">
            Click "Find Resources" to let AI discover relevant resources for this task
          </p>
          <p className="text-xs text-calm-500">
            AI will search for high-quality educational resources related to: <strong>{taskTitle}</strong>
          </p>
        </div>
      )}
    </div>
  );
} 