import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertGuestSchema } from '@shared/schema';
import { X, Calendar, Clock, User, Tag, Info } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

// Extend the schema with extra validation
const guestFormSchema = insertGuestSchema
  .extend({
    id: z.number().optional(),
    tags: z.union([z.string(), z.array(z.string())]).transform(val => 
      typeof val === 'string' ? val.split(',').map(a => a.trim()).filter(Boolean) : val
    ),
  });

const relationshipOptions = [
  'Friend',
  'Family',
  'Roommate\'s Guest',
  'Classmate',
  'Coworker',
  'Study Group',
  'Other'
];

const GuestForm = ({ guest = null, onSubmit, onCancel }) => {
  const form = useForm({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      userId: 1, // Hardcoded for demo
      name: '',
      relationship: '',
      visitDate: '',
      visitTime: '',
      visitEndTime: '',
      notes: '',
      tags: [],
      isFirstTime: true
    }
  });

  // Update form when guest changes
  useEffect(() => {
    if (guest) {
      form.reset({
        ...guest,
        visitDate: guest.visitDate || '',
        tags: guest.tags || [],
      });
    }
  }, [guest, form]);

  const handleSubmitForm = (data) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="bg-[#FAF8F1] p-6 rounded-2xl shadow-md text-[#1A1A1A] space-y-4 max-w-xl mx-auto"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {guest ? 'Edit Guest' : 'Add New Guest'}
          </h2>
          <button type="button" onClick={onCancel} className="text-[#1A1A1A] hover:text-red-600">
            <X />
          </button>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <User size={16} /> Name
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Guest name" 
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
          name="relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship</FormLabel>
              <FormControl>
                <select 
                  {...field}
                  className="w-full p-2 rounded-md border border-[#7A8450] bg-white focus:outline-none focus:ring-2 focus:ring-[#7A8450]"
                >
                  <option value="" disabled>Select relationship</option>
                  {relationshipOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
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
            name="visitDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Calendar size={16} /> Visit Date
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
            name="isFirstTime"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 mt-10">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="accent-[#7A8450]"
                  />
                </FormControl>
                <FormLabel className="text-sm flex items-center gap-1">
                  <Info size={14} /> First time visitor
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="visitTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Clock size={16} /> Arrival Time
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
            name="visitEndTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Clock size={16} /> Departure Time
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
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <Tag size={16} /> Tags (comma-separated)
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Friend, Study Group, Dinner Guest" 
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Any special information about this guest"
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
            {guest ? 'Update Guest' : 'Save Guest'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GuestForm;
