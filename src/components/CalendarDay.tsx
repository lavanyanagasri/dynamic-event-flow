
import { useState } from 'react';
import { Event } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
  onClick: () => void;
  onEventClick: (event: Event) => void;
  onEventDrop: (eventId: string, newDate: Date) => void;
}

export const CalendarDay = ({
  date,
  isCurrentMonth,
  isToday,
  events,
  onClick,
  onEventClick,
  onEventDrop,
}: CalendarDayProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const eventId = e.dataTransfer.getData('text/plain');
    if (eventId) {
      onEventDrop(eventId, date);
    }
  };

  const handleEventDragStart = (e: React.DragEvent, event: Event) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', event.id);
  };

  return (
    <div
      className={cn(
        'min-h-[100px] p-2 border border-white/10 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/5',
        isCurrentMonth ? 'bg-white/5' : 'bg-black/10 opacity-50',
        isToday && 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-purple-400/50',
        isDragOver && 'bg-blue-500/30 border-blue-400'
      )}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={cn(
        'text-sm font-medium mb-1',
        isCurrentMonth ? 'text-white' : 'text-gray-400',
        isToday && 'text-white font-bold'
      )}>
        {date.getDate()}
      </div>
      
      <div className="space-y-1">
        {events.slice(0, 3).map((event) => (
          <div
            key={event.id}
            draggable
            onDragStart={(e) => handleEventDragStart(e, event)}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event);
            }}
            className="px-2 py-1 text-xs rounded-md cursor-move transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: event.color }}
          >
            <div className="text-white font-medium truncate">
              {event.title}
            </div>
            <div className="text-white/80 text-xs">
              {event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {events.length > 3 && (
          <div className="text-xs text-blue-200 font-medium">
            +{events.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};
