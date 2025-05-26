
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event } from '@/types/calendar';
import { CalendarDay } from './CalendarDay';

interface CalendarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  events: Event[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
  onEventDrop: (eventId: string, newDate: Date) => void;
}

export const Calendar = ({
  currentDate,
  onDateChange,
  events,
  onDayClick,
  onEventClick,
  onEventDrop,
}: CalendarProps) => {
  const today = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();

  const daysInMonth = lastDayOfMonth.getDate();
  const daysFromPrevMonth = firstDayOfWeek;
  const totalCells = Math.ceil((daysInMonth + daysFromPrevMonth) / 7) * 7;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateChange(newDate);
  };

  const getDateForCell = (cellIndex: number): Date => {
    const dayNumber = cellIndex - daysFromPrevMonth + 1;
    if (cellIndex < daysFromPrevMonth) {
      // Previous month
      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
      return new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonth.getDate() - (daysFromPrevMonth - cellIndex - 1));
    } else if (dayNumber > daysInMonth) {
      // Next month
      return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, dayNumber - daysInMonth);
    } else {
      // Current month
      return new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
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

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('prev')}
          className="text-white hover:bg-white/10 p-2 rounded-xl"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Button>
        
        <h2 className="text-2xl font-bold text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('next')}
          className="text-white hover:bg-white/10 p-2 rounded-xl"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </Button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-3 text-center text-sm font-semibold text-blue-200">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 bg-white/5 rounded-2xl p-2">
        {Array.from({ length: totalCells }, (_, index) => {
          const date = getDateForCell(index);
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = 
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate();
          const dayEvents = getEventsForDate(date);

          return (
            <CalendarDay
              key={index}
              date={date}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
              events={dayEvents}
              onClick={() => onDayClick(date)}
              onEventClick={onEventClick}
              onEventDrop={onEventDrop}
            />
          );
        })}
      </div>
    </div>
  );
};
