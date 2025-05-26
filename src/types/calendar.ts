
export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  color: string;
  category?: string;
  recurrence?: RecurrencePattern;
  isRecurring: boolean;
  parentEventId?: string;
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval: number;
  daysOfWeek?: number[]; // 0-6, Sunday to Saturday
  endDate?: Date;
  customPattern?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  color: string;
  category?: string;
  recurrence?: RecurrencePattern;
  isRecurring: boolean;
}

export interface DraggedEvent {
  id: string;
  originalDate: Date;
}
