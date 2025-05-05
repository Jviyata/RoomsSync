import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, MapPin, AlertCircle } from 'lucide-react';

const EventForm = ({
  event = null,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    attendees: [],
    color: '#7A8450', // olive
    isAllDay: false,
    reminder: '15',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        date: event.date ? formatDateForInput(new Date(event.date)) : '',
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        attendees: event.attendees || [],
        color: event.color || '#7A8450',
        isAllDay: event.isAllDay || false,
        reminder: event.reminder || '15',
      });
    }
  }, [event]);

  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let validationErrors = {};
    if (!formData.title.trim()) validationErrors.title = 'Title is required.';
    if (!formData.date) validationErrors.date = 'Date is required.';

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#FAF8F1] p-6 rounded-2xl shadow-md text-[#1A1A1A] space-y-4 max-w-xl mx-auto"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Event Details</h2>
        <button type="button" onClick={onCancel} className="text-[#1A1A1A] hover:text-red-600">
          <X />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 rounded-md border border-[#7A8450] bg-white focus:outline-none focus:ring-2 focus:ring-[#7A8450]"
        />
        {errors.title && (
          <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
            <AlertCircle size={14} /> {errors.title}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium flex items-center gap-1">
            <Calendar size={16} /> Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-[#7A8450] bg-white focus:outline-none focus:ring-2 focus:ring-[#7A8450]"
          />
          {errors.date && (
            <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
              <AlertCircle size={14} /> {errors.date}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 mt-6">
          <label className="text-sm flex gap-1">
            <input
              type="checkbox"
              name="isAllDay"
              checked={formData.isAllDay}
              onChange={handleChange}
              className="accent-[#7A8450]"
            />
            All Day
          </label>
        </div>
      </div>

      {!formData.isAllDay && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium flex items-center gap-1">
              <Clock size={16} /> Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-[#7A8450] bg-white focus:outline-none focus:ring-2 focus:ring-[#7A8450]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-[#7A8450] bg-white focus:outline-none focus:ring-2 focus:ring-[#7A8450]"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium flex items-center gap-1">
          <MapPin size={16} /> Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 rounded-md border border-[#7A8450] bg-white focus:outline-none focus:ring-2 focus:ring-[#7A8450]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium flex items-center gap-1">
          <Users size={16} /> Attendees (comma-separated)
        </label>
        <input
          type="text"
          name="attendees"
          value={formData.attendees.join(', ')}
          onChange={(e) =>
            setFormData({ ...formData, attendees: e.target.value.split(',').map(a => a.trim()) })
          }
          className="w-full p-2 rounded-md border border-[#7A8450] bg-white focus:outline-none focus:ring-2 focus:ring-[#7A8450]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 rounded-md border border-[#7A8450] bg-white focus:outline-none focus:ring-2 focus:ring-[#7A8450]"
        ></textarea>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white border border-black text-black rounded-md hover:bg-[#eee]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#1A1A1A] text-[#FAF8F1] rounded-md hover:bg-[#343434]"
        >
          Save Event
        </button>
      </div>
    </form>
  );
};

export default EventForm;
