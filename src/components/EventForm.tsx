
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Event, EventFormData, RecurrencePattern } from '@/types/calendar';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  initialData?: Event | null;
  selectedDate?: Date | null;
}

const EVENT_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6B7280', // Gray
];

const CATEGORIES = [
  'Work',
  'Personal',
  'Meeting',
  'Appointment',
  'Event',
  'Reminder',
  'Other',
];

export const EventForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  selectedDate,
}: EventFormProps) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(),
    color: EVENT_COLORS[0],
    category: 'General',
    isRecurring: false,
  });

  const [recurrence, setRecurrence] = useState<RecurrencePattern>({
    type: 'daily',
    interval: 1,
    daysOfWeek: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        startTime: initialData.startTime,
        endTime: initialData.endTime,
        color: initialData.color,
        category: initialData.category || 'General',
        isRecurring: initialData.isRecurring,
      });
      if (initialData.recurrence) {
        setRecurrence(initialData.recurrence);
      }
    } else if (selectedDate) {
      const startTime = new Date(selectedDate);
      startTime.setHours(9, 0, 0, 0);
      const endTime = new Date(selectedDate);
      endTime.setHours(10, 0, 0, 0);
      
      setFormData(prev => ({
        ...prev,
        startTime,
        endTime,
      }));
    }
  }, [initialData, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: EventFormData = {
      ...formData,
      recurrence: formData.isRecurring ? recurrence : undefined,
    };
    
    onSubmit(submitData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      startTime: new Date(),
      endTime: new Date(),
      color: EVENT_COLORS[0],
      category: 'General',
      isRecurring: false,
    });
    setRecurrence({
      type: 'daily',
      interval: 1,
      daysOfWeek: [],
    });
  };

  const formatDateTimeForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDateTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const newDate = new Date(value);
    setFormData(prev => ({
      ...prev,
      [field]: newDate,
    }));
  };

  const handleRecurrenceChange = (field: keyof RecurrencePattern, value: any) => {
    setRecurrence(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDayOfWeekToggle = (day: number) => {
    setRecurrence(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek?.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...(prev.daysOfWeek || []), day],
    }));
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/95 backdrop-blur-md border border-white/20 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {initialData ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 font-medium">
              Event Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter event title"
              required
              className="bg-white/90"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter event description"
              rows={3}
              className="bg-white/90"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-gray-700 font-medium">
                Start Time *
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formatDateTimeForInput(formData.startTime)}
                onChange={(e) => handleDateTimeChange('startTime', e.target.value)}
                required
                className="bg-white/90"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-gray-700 font-medium">
                End Time *
              </Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={formatDateTimeForInput(formData.endTime)}
                onChange={(e) => handleDateTimeChange('endTime', e.target.value)}
                required
                className="bg-white/90"
              />
            </div>
          </div>

          {/* Category and Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-white/90">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Color</Label>
              <div className="flex gap-2 flex-wrap">
                {EVENT_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Recurring Event */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: !!checked }))}
              />
              <Label htmlFor="recurring" className="text-gray-700 font-medium">
                Recurring Event
              </Label>
            </div>

            {formData.isRecurring && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Repeat Type</Label>
                    <Select
                      value={recurrence.type}
                      onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'custom') => 
                        handleRecurrenceChange('type', value)
                      }
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Every</Label>
                    <Input
                      type="number"
                      min="1"
                      value={recurrence.interval}
                      onChange={(e) => handleRecurrenceChange('interval', parseInt(e.target.value))}
                      className="bg-white"
                    />
                  </div>
                </div>

                {recurrence.type === 'weekly' && (
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Days of Week</Label>
                    <div className="flex gap-2">
                      {dayNames.map((day, index) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayOfWeekToggle(index)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                            recurrence.daysOfWeek?.includes(index)
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">End Date (Optional)</Label>
                  <Input
                    type="date"
                    value={recurrence.endDate ? recurrence.endDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => handleRecurrenceChange('endDate', e.target.value ? new Date(e.target.value) : undefined)}
                    className="bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {initialData ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
