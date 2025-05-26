import { useState, useEffect } from 'react';
import { Event, EventFormData, RecurrencePattern } from '@/types/calendar';

const STORAGE_KEY = 'calendar-events';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const savedEvents = localStorage.getItem(STORAGE_KEY);
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        startTime: new Date(event.startTime),
        endTime: new Date(event.endTime),
        recurrence: event.recurrence ? {
          ...event.recurrence,
          endDate: event.recurrence.endDate ? new Date(event.recurrence.endDate) : undefined
        } : undefined
      }));
      setEvents(parsedEvents);
    }
  }, []);

  const saveEvents = (newEvents: Event[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
    setEvents(newEvents);
  };

  const parseCustomPattern = (pattern: string): { type: 'daily' | 'weekly' | 'monthly'; interval: number } | null => {
    if (!pattern) return null;
    
    const normalizedPattern = pattern.toLowerCase().trim();
    
    // Parse patterns like "every 2 weeks", "every 3 days", "every 6 months"
    const weeklyMatch = normalizedPattern.match(/every\s+(\d+)\s+weeks?/);
    if (weeklyMatch) {
      return { type: 'weekly', interval: parseInt(weeklyMatch[1]) };
    }
    
    const dailyMatch = normalizedPattern.match(/every\s+(\d+)\s+days?/);
    if (dailyMatch) {
      return { type: 'daily', interval: parseInt(dailyMatch[1]) };
    }
    
    const monthlyMatch = normalizedPattern.match(/every\s+(\d+)\s+months?/);
    if (monthlyMatch) {
      return { type: 'monthly', interval: parseInt(monthlyMatch[1]) };
    }
    
    // Default fallback
    return null;
  };

  const generateRecurringEvents = (baseEvent: Event): Event[] => {
    if (!baseEvent.isRecurring || !baseEvent.recurrence) {
      return [baseEvent];
    }

    const recurringEvents: Event[] = [baseEvent];
    let { type, interval, daysOfWeek, endDate, customPattern } = baseEvent.recurrence;
    
    // Handle custom patterns
    if (type === 'custom' && customPattern) {
      const parsedPattern = parseCustomPattern(customPattern);
      if (parsedPattern) {
        type = parsedPattern.type;
        interval = parsedPattern.interval;
      } else {
        // If pattern can't be parsed, treat as daily with interval 1
        type = 'daily';
        interval = 1;
      }
    }
    
    const maxDate = endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
    
    let currentDate = new Date(baseEvent.startTime);
    let instanceCount = 0;
    const maxInstances = 100; // Prevent infinite loops

    while (currentDate <= maxDate && instanceCount < maxInstances) {
      let nextDate: Date;

      switch (type) {
        case 'daily':
          nextDate = new Date(currentDate);
          nextDate.setDate(nextDate.getDate() + interval);
          break;
        case 'weekly':
          if (daysOfWeek && daysOfWeek.length > 0) {
            nextDate = getNextWeeklyOccurrence(currentDate, daysOfWeek, interval);
          } else {
            nextDate = new Date(currentDate);
            nextDate.setDate(nextDate.getDate() + (7 * interval));
          }
          break;
        case 'monthly':
          nextDate = new Date(currentDate);
          nextDate.setMonth(nextDate.getMonth() + interval);
          break;
        default:
          nextDate = new Date(currentDate);
          nextDate.setDate(nextDate.getDate() + interval);
      }

      if (nextDate <= maxDate) {
        const duration = baseEvent.endTime.getTime() - baseEvent.startTime.getTime();
        const recurringEvent: Event = {
          ...baseEvent,
          id: `${baseEvent.id}-${nextDate.getTime()}`,
          startTime: new Date(nextDate),
          endTime: new Date(nextDate.getTime() + duration),
          parentEventId: baseEvent.id,
        };
        recurringEvents.push(recurringEvent);
      }

      currentDate = nextDate;
      instanceCount++;
    }

    return recurringEvents;
  };

  const getNextWeeklyOccurrence = (currentDate: Date, daysOfWeek: number[], interval: number): Date => {
    const currentDay = currentDate.getDay();
    const sortedDays = [...daysOfWeek].sort((a, b) => a - b);
    
    // Find next day in the same week
    const nextDayInWeek = sortedDays.find(day => day > currentDay);
    
    if (nextDayInWeek !== undefined) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + (nextDayInWeek - currentDay));
      return nextDate;
    } else {
      // Move to next week's first day
      const daysUntilNextWeek = 7 - currentDay + sortedDays[0] + (7 * (interval - 1));
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + daysUntilNextWeek);
      return nextDate;
    }
  };

  const addEvent = (eventData: EventFormData) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      ...eventData,
    };

    let eventsToAdd: Event[] = [];
    if (newEvent.isRecurring) {
      eventsToAdd = generateRecurringEvents(newEvent);
    } else {
      eventsToAdd = [newEvent];
    }

    const updatedEvents = [...events, ...eventsToAdd];
    saveEvents(updatedEvents);
  };

  const updateEvent = (eventId: string, eventData: Partial<EventFormData>) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        return { ...event, ...eventData };
      }
      return event;
    });
    saveEvents(updatedEvents);
  };

  const deleteEvent = (eventId: string) => {
    const eventToDelete = events.find(e => e.id === eventId);
    
    if (eventToDelete?.parentEventId) {
      // Delete only this recurring instance
      const updatedEvents = events.filter(event => event.id !== eventId);
      saveEvents(updatedEvents);
    } else if (eventToDelete?.isRecurring) {
      // Delete all recurring instances
      const updatedEvents = events.filter(event => 
        event.id !== eventId && event.parentEventId !== eventId
      );
      saveEvents(updatedEvents);
    } else {
      // Delete single event
      const updatedEvents = events.filter(event => event.id !== eventId);
      saveEvents(updatedEvents);
    }
  };

  const getEventsForDate = (date: Date): Event[] => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  };

  const checkEventConflict = (newEvent: Event): Event[] => {
    return events.filter(existingEvent => {
      if (existingEvent.id === newEvent.id) return false;
      
      const existingStart = existingEvent.startTime.getTime();
      const existingEnd = existingEvent.endTime.getTime();
      const newStart = newEvent.startTime.getTime();
      const newEnd = newEvent.endTime.getTime();
      
      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    checkEventConflict,
  };
};
