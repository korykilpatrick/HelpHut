export type WorkflowStatus = 
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'failed';

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: WorkflowStatus;
  isRequired: boolean;
  completedAt?: Date;
}

export interface Workflow {
  id: string;
  type: 'food_rescue' | 'shift_management' | 'impact_tracking';
  currentStep: number;
  steps: WorkflowStep[];
  startedAt: Date;
  completedAt?: Date;
  metadata: Record<string, unknown>;
} 