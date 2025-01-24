import React from 'react';
import { type Workflow } from '../../types';
import { StatusBadge } from '../../../shared/components/status/StatusBadge';

interface FoodRescueWorkflowProps {
  workflow: Workflow;
  onStepComplete: (stepId: string) => void;
}

export function FoodRescueWorkflow({ workflow, onStepComplete }: FoodRescueWorkflowProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Food Rescue Workflow</h2>
      
      <div className="space-y-2">
        {workflow.steps.map((step, index) => (
          <div
            key={step.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <span className="text-lg font-medium">{index + 1}.</span>
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <StatusBadge
                label={step.status}
                variant={step.status === 'completed' ? 'success' : 'default'}
              />
              
              {step.status === 'in_progress' && (
                <button
                  onClick={() => onStepComplete(step.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Complete Step
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 