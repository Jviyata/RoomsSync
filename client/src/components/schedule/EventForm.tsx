import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, MapPin, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertEventSchema } from '@shared/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

// Extend the schema with extra validation
const eventFormSchema = insertEventSchema
  .extend({
    id: z.number().optional(),
    attendees: z.union([z.string(), z.array(z.string())]).transform(val => 
      typeof val === 'string' ? val.split(',').map(a => a.trim()).filter(Boolean) : val
    ),
  })
  .refine(data => !data.isAllDay || (data.isAllDay && !data.startTime && !data.endTime), {
    message: "Start and end times should not be provided for all-day events",
    path: ["isAllDay"],
  })
  .refine(data => data.isAllDay || (!data.isAllDay && data.startTime), {
    message: "Start time is required for non-all-day events",
    path: ["startTime"],
  });

const EventForm = ({ event = null, onSubmit, onCancel }) => {
  const form = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      userId: 1, // Hardcoded for demo
      title: '',
      space: '',
      date: '',
      startTime: '',
      endTime: '',
      description: '',
      isAllDay: false,
      color: '#7A8450',
      attendees: [],
    }
  });

  // Update form when event changes
  useEffect(() => {
    if (event) {
      form.reset({
        ...event,
        date: event.date || '',
        attendees: event.attendees || [],
      });
    }
  }, [event, form]);

  const handleSubmitForm = (data) => {
    onSubmit(data);
  };

  const spaces = [
    'Kitchen',
    'Living Room',
    'Bathroom',
    'Laundry Room',
    'Balcony',
    'Study Room',
    'Other'
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="bg-[#FAF8F1] p-6 rounded-2xl shadow-md text-[#1A1A1A] space-y-4 max-w-xl mx-auto"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button type="button" onClick={onCancel} className="text-[#1A1A1A] hover:text-red-600">
            <X />
          </button>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Event title" 
                  {...field} 
                  className="border-[#7A8450] focus:ring-[#7A8450]" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="space"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Space</FormLabel>
              <FormControl>
                <select 
                  {...field}
                  className="w-full p-2 rounded-md border border-[#7A8450] bg-white focus:outline-none focus:ring-2 focus:ring-[#7A8450]"
                >
                  <option value="" disabled>Select a space</option>
                  {spaces.map(space => (
                    <option key={space} value={space}>{space}</option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Calendar size={16} /> Date
                </FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    className="border-[#7A8450] focus:ring-[#7A8450]" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isAllDay"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 mt-10">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="accent-[#7A8450]"
                  />
                </FormControl>
                <FormLabel className="text-sm">All Day</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!form.watch('isAllDay') && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Clock size={16} /> Start Time
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="time" 
                      {...field} 
                      className="border-[#7A8450] focus:ring-[#7A8450]" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input 
                      type="time" 
                      {...field} 
                      className="border-[#7A8450] focus:ring-[#7A8450]" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="attendees"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <Users size={16} /> Attendees (comma-separated)
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Jamie, Casey, Taylor" 
                  value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="border-[#7A8450] focus:ring-[#7A8450]" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Add additional details about the event"
                  rows={3}
                  className="border-[#7A8450] focus:ring-[#7A8450]" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-black text-black hover:bg-[#eee]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#1A1A1A] text-[#FAF8F1] hover:bg-[#343434]"
          >
            {event ? 'Update Event' : 'Save Event'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
