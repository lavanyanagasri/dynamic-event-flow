
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/Calendar';
import { EventModal } from '@/components/EventModal';
import { EventForm } from '@/components/EventForm';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { CalendarIcon, PlusIcon } from 'lucide-react';
import { Event, EventFormData } from '@/types/calendar';
import { useEvents } from '@/hooks/useEvents';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { events, addEvent, updateEvent, deleteEvent, getEventsForDate } = useEvents();
  const { toast } = useToast();

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsFormModalOpen(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleEventSubmit = (formData: EventFormData) => {
    try {
      if (selectedEvent) {
        updateEvent(selectedEvent.id, formData);
        toast({
          title: "Event Updated",
          description: "Your event has been successfully updated.",
        });
      } else {
        addEvent(formData);
        toast({
          title: "Event Created",
          description: "Your event has been successfully created.",
        });
      }
      setIsFormModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your event.",
        variant: "destructive",
      });
    }
  };

  const handleEventDelete = (eventId: string) => {
    try {
      deleteEvent(eventId);
      toast({
        title: "Event Deleted",
        description: "Your event has been successfully deleted.",
      });
      setIsEventModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting your event.",
        variant: "destructive",
      });
    }
  };

  const handleEventEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(false);
    setIsFormModalOpen(true);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Event Calendar
            </h1>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Manage your schedule with our beautiful, interactive calendar. Add events, set reminders, and stay organized.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search events..."
          />
          <Button
            onClick={() => {
              setSelectedDate(new Date());
              setSelectedEvent(null);
              setIsFormModalOpen(true);
            }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Event
          </Button>
        </div>

        {/* Calendar */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20">
          <Calendar
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            events={filteredEvents}
            onDayClick={handleDayClick}
            onEventClick={handleEventClick}
            onEventDrop={(eventId, newDate) => {
              const event = events.find(e => e.id === eventId);
              if (event) {
                const updatedEvent = {
                  ...event,
                  startTime: new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), event.startTime.getHours(), event.startTime.getMinutes()),
                  endTime: new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), event.endTime.getHours(), event.endTime.getMinutes())
                };
                updateEvent(eventId, updatedEvent);
                toast({
                  title: "Event Moved",
                  description: "Your event has been rescheduled.",
                });
              }
            }}
          />
        </div>

        {/* Event Modal */}
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          event={selectedEvent}
          onEdit={handleEventEdit}
          onDelete={handleEventDelete}
        />

        {/* Event Form Modal */}
        <EventForm
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleEventSubmit}
          initialData={selectedEvent}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
};

export default Index;
