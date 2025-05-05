import React, { useState } from 'react';

const ReminderForm = ({ onAddReminder }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '') return;
    onAddReminder({ id: Date.now(), text });
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your reminder..."
        className="w-full p-4 border-2 border-yellow-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />
      <button
        type="submit"
        className="mt-3 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
      >
        Add Reminder
      </button>
    </form>
  );
};

export default ReminderForm;
