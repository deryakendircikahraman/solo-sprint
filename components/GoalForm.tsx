import React, { useState } from 'react';

interface GoalFormProps {
  onSubmit: (goal: string) => void;
  isLoading: boolean;
}

export default function GoalForm({ onSubmit, isLoading }: GoalFormProps) {
  const [goal, setGoal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim()) {
      onSubmit(goal.trim());
      setGoal('');
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-calm-900 mb-4">
        Set Your Focus Goal
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-calm-700 mb-2">
            What do you want to focus on today?
          </label>
          <textarea
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Complete the project proposal, Learn React hooks, Write blog post..."
            className="input-field"
            rows={3}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={!goal.trim() || isLoading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Breaking down goal...' : 'Break Down Goal'}
        </button>
      </form>
    </div>
  );
} 