import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { ScheduledMoment } from '../lib/db';

interface Props {
  onSchedule: (moment: Omit<ScheduledMoment, 'id'>) => void;
  isHotMode: boolean;
}

const MOMENT_TYPES = {
  regular: [
    { value: 'affectionate', label: 'Affectionate Touch' },
    { value: 'emotional', label: 'Emotional Connection' },
    { value: 'sexual', label: 'Sexual Desires' },
    { value: 'adventurous', label: 'Adventurous Fun' },
  ],
  hot: [
    { value: 'spicy', label: 'Spicy Surprise' },
    { value: 'roleplay', label: 'Role Play' },
    { value: 'exploration', label: 'Exploration Zone' },
  ],
};

export function ScheduleMoment({ onSchedule, isHotMode }: Props) {
  const [type, setType] = useState<ScheduledMoment['type']>('affectionate');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !date || !time) return;

    const dateTime = new Date(`${date}T${time}`);
    onSchedule({
      type,
      description,
      date: dateTime,
      isHot: isHotMode,
    });

    setDescription('');
    setDate('');
    setTime('');
  };

  const types = isHotMode ? MOMENT_TYPES.hot : MOMENT_TYPES.regular;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type of Moment
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ScheduledMoment['type'])}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
        >
          {types.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4 inline-block mr-1" />
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Clock className="w-4 h-4 inline-block mr-1" />
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          isHotMode
            ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
            : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
        } transition-colors`}
      >
        Schedule Moment
      </button>
    </form>
  );
}