
import { Event } from '@/types/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EditIcon, TrashIcon, ClockIcon, CalendarIcon } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

export const EventModal = ({
  isOpen,
  onClose,
  event,
  onEdit,
  onDelete,
}: EventModalProps) => {
  if (!event) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/95 backdrop-blur-md border border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {event.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Event Color Indicator */}
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: event.color }}
            />
            <span className="text-sm text-gray-600 font-medium">
              {event.category || 'General'}
            </span>
          </div>

          {/* Date and Time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-700">
              <CalendarIcon className="w-4 h-4" />
              <span className="font-medium">{formatDate(event.startTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <ClockIcon className="w-4 h-4" />
              <span>
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </span>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-800 mb-1">Description</h4>
              <p className="text-gray-600 text-sm">{event.description}</p>
            </div>
          )}

          {/* Recurrence Info */}
          {event.isRecurring && event.recurrence && (
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-medium text-blue-800 mb-1">Recurring Event</h4>
              <p className="text-blue-600 text-sm capitalize">
                Repeats {event.recurrence.type}
                {event.recurrence.interval > 1 && ` every ${event.recurrence.interval}`}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => onEdit(event)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <EditIcon className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={() => onDelete(event.id)}
              variant="destructive"
              className="flex-1"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
