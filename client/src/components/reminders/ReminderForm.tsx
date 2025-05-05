import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertReminderSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Extend the schema with any additional validation
const reminderFormSchema = insertReminderSchema.extend({
  id: z.number().optional(),
});

const PredefinedMessages = ({ onSelect }) => {
  const messages = [
    "Please take out the trash today.",
    "Remember to clean the kitchen after cooking.",
    "Utility bills are due this week.",
    "Turn off lights when leaving shared areas.",
    "Please keep noise levels down after 10pm.",
    "It's your turn to clean the bathroom this week."
  ];

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Predefined Messages</h3>
      <div className="grid grid-cols-1 gap-2">
        {messages.map((message, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(message)}
            className="text-left px-3 py-2 bg-[#FAF3E0] hover:bg-[#DCCCA3] text-[#556B2F] rounded-md text-sm transition-colors"
          >
            {message}
          </button>
        ))}
      </div>
    </div>
  );
};

const ReminderForm = ({ onSubmit, onCancel, initialData = null }) => {
  const form = useForm({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: initialData || {
      userId: 1, // Hardcoded for demo
      text: '',
      fromUser: 'Jamie', // Hardcoded for demo
      priority: 'medium',
      completed: false
    },
  });

  const [showPredefined, setShowPredefined] = useState(false);

  const handlePredefinedSelect = (message) => {
    form.setValue('text', message);
    setShowPredefined(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reminder Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your reminder message here..."
                  className="h-24 border-2 border-[#DCCCA3] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7A8450]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="low" className="text-[#DCCCA3]" />
                    </FormControl>
                    <FormLabel className="text-sm">Low</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="medium" className="text-[#7A8450]" />
                    </FormControl>
                    <FormLabel className="text-sm">Medium</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="high" className="text-red-600" />
                    </FormControl>
                    <FormLabel className="text-sm">High</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPredefined(!showPredefined)}
            className="border-[#7A8450] text-[#7A8450] hover:bg-[#FAF3E0]"
          >
            {showPredefined ? 'Hide Templates' : 'Use Template'}
          </Button>
          <Button
            type="submit"
            className="bg-[#7A8450] text-white hover:bg-[#556B2F]"
          >
            {initialData ? 'Update Reminder' : 'Add Reminder'}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-gray-300 text-gray-700"
            >
              Cancel
            </Button>
          )}
        </div>
        
        {showPredefined && <PredefinedMessages onSelect={handlePredefinedSelect} />}
      </form>
    </Form>
  );
};

export default ReminderForm;
