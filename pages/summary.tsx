import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SessionSummaryCard from '../components/SessionSummaryCard';
import FocusChart from '../components/FocusChart';
import { FocusSession } from '../types';

export default function Summary() {
  const router = useRouter();
  const [reflection, setReflection] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const mockSession: FocusSession = {
    id: 'session-1',
    goalId: 'goal-1',
    startTime: new Date(Date.now() - 45 * 60 * 1000),
    endTime: new Date(),
    duration: 45,
    focusPercentage: 78,
    distractionPercentage: 22,
    tabSwitches: 12,
    emotionalState: 'productive',
  };

  useEffect(() => {
    const generateReflection = async () => {
      try {
        const response = await fetch('/api/gpt-reflection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ focusData: mockSession }),
        });

        if (response.ok) {
          const data = await response.json();
          setReflection(data.reflection);
        }
      } catch (error) {
        console.error('Error generating reflection:', error);
        setReflection('Great work on your focus session! You maintained good concentration and made steady progress.');
      } finally {
        setIsLoading(false);
      }
    };

    generateReflection();
  }, []);

  return (
    <>
      <Head>
        <title>Daily Summary - SoloSprint</title>
        <meta name="description" content="Your daily focus summary and reflection" />
      </Head>

      <div className="min-h-screen bg-calm-50">
        <header className="bg-white shadow-sm border-b border-calm-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-calm-900">
                🧠 SoloSprint
              </h1>
              <button
                onClick={() => router.push('/')}
                className="btn-secondary"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-calm-900 mb-2">
              Daily Summary
            </h2>
            <p className="text-calm-600">
              Review your focus session and get AI-powered insights
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <SessionSummaryCard session={mockSession} />
              
              <div className="card">
                <h3 className="text-xl font-semibold text-calm-900 mb-4">
                  AI Reflection
                </h3>
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-calm-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-calm-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-calm-200 rounded w-5/6"></div>
                  </div>
                ) : (
                  <p className="text-calm-700 leading-relaxed">
                    {reflection}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <FocusChart 
                focusPercentage={mockSession.focusPercentage}
                distractionPercentage={mockSession.distractionPercentage}
                type="bar"
              />
              
              <div className="card">
                <h3 className="text-xl font-semibold text-calm-900 mb-4">
                  Task Completion
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-calm-900">Research project requirements</span>
                    <span className="text-green-600">✓</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-calm-900">Create project outline</span>
                    <span className="text-green-600">✓</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-calm-50 rounded-lg">
                    <span className="text-calm-900">Write first draft</span>
                    <span className="text-calm-400">In progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 