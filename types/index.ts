export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  goalId: string;
  resources?: string[];
  autoDiscovered?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  tasks: Task[];
  createdAt: Date;
  completedAt?: Date;
}

export interface FocusSession {
  id: string;
  goalId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  focusPercentage: number;
  distractionPercentage: number;
  tabSwitches: number;
  emotionalState: 'focused' | 'distracted' | 'frustrated' | 'productive' | 'tired';
}

export interface DailyReflection {
  id: string;
  date: Date;
  focusSessions: FocusSession[];
  overallFocusPercentage: number;
  emotionalInsights: string;
  recommendations: string[];
  mood: 'positive' | 'neutral' | 'negative';
}

export interface BrowserActivity {
  url: string;
  title: string;
  timestamp: Date;
  duration: number;
  category: 'productive' | 'distracting' | 'neutral';
}

export interface BrowserAction {
  action: 'navigate' | 'click' | 'type' | 'extract' | 'wait' | 'open-resource';
  selector?: string;
  text?: string;
  url?: string;
  waitTime?: number;
  taskId?: string;
}

export interface AutoResource {
  url: string;
  title: string;
  relevance: number;
  source: 'ai-search' | 'auto-discovery';
} 