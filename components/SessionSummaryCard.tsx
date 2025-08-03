import React from 'react';
import { FocusSession } from '../types';

interface SessionSummaryCardProps {
  session: FocusSession;
}

export default function SessionSummaryCard({ session }: SessionSummaryCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getEmotionalStateColor = (state: string) => {
    switch (state) {
      case 'focused':
        return 'text-green-600 bg-green-100';
      case 'productive':
        return 'text-blue-600 bg-blue-100';
      case 'distracted':
        return 'text-yellow-600 bg-yellow-100';
      case 'frustrated':
        return 'text-red-600 bg-red-100';
      case 'tired':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-calm-900 mb-4">Session Summary</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-calm-600">Duration</p>
          <p className="text-lg font-semibold text-calm-900">
            {session.duration ? formatDuration(session.duration) : 'In progress...'}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-calm-600">Focus Level</p>
          <p className="text-lg font-semibold text-calm-900">
            {session.focusPercentage}%
          </p>
        </div>
        
        <div>
          <p className="text-sm text-calm-600">Distraction Level</p>
          <p className="text-lg font-semibold text-calm-900">
            {session.distractionPercentage}%
          </p>
        </div>
        
        <div>
          <p className="text-sm text-calm-600">Tab Switches</p>
          <p className="text-lg font-semibold text-calm-900">
            {session.tabSwitches}
          </p>
        </div>
      </div>
      
      <div>
        <p className="text-sm text-calm-600 mb-2">Emotional State</p>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getEmotionalStateColor(session.emotionalState)}`}>
          {session.emotionalState.charAt(0).toUpperCase() + session.emotionalState.slice(1)}
        </span>
      </div>
    </div>
  );
} 