import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Flame, Calendar, MessageCircleHeart } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { format } from 'date-fns';
import { appreciationsDB, scheduledMomentsDB } from './lib/db';
import { AppreciationCard } from './components/AppreciationCard';
import { ScheduleMoment } from './components/ScheduleMoment';

function App() {
  const [isHotMode, setIsHotMode] = useState(false);
  const [newAppreciation, setNewAppreciation] = useState('');
  const queryClient = useQueryClient();

  const { data: appreciations = [] } = useQuery({
    queryKey: ['appreciations'],
    queryFn: () => appreciationsDB.getAll(),
  });

  const { data: scheduledMoments = [] } = useQuery({
    queryKey: ['scheduled-moments'],
    queryFn: () => scheduledMomentsDB.getAll(),
  });

  const addAppreciation = useMutation({
    mutationFn: (text: string) =>
      appreciationsDB.add({
        text,
        date: new Date(),
        isHot: isHotMode,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appreciations'] });
      toast.success('Appreciation added!');
      setNewAppreciation('');
    },
  });

  const deleteAppreciation = useMutation({
    mutationFn: (id: number) => appreciationsDB.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appreciations'] });
      toast.success('Appreciation deleted');
    },
  });

  const addScheduledMoment = useMutation({
    mutationFn: scheduledMomentsDB.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-moments'] });
      toast.success('Moment scheduled!');
    },
  });

  const deleteScheduledMoment = useMutation({
    mutationFn: (id: number) => scheduledMomentsDB.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-moments'] });
      toast.success('Scheduled moment deleted');
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Toaster position="top-center" />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            {isHotMode ? (
              <>
                <Flame className="w-8 h-8 text-red-500" />
                HOT Mode
              </>
            ) : (
              <>
                <Heart className="w-8 h-8 text-pink-500" />
                Appreciated Moments
              </>
            )}
          </h1>
          
          <button
            onClick={() => setIsHotMode(!isHotMode)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              isHotMode
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
            }`}
          >
            {isHotMode ? 'Switch to Regular' : 'Switch to HOT'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageCircleHeart className="w-5 h-5 text-pink-500" />
                Share an Appreciation
              </h2>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newAppreciation.trim()) {
                    addAppreciation.mutate(newAppreciation);
                  }
                }}
                className="space-y-4"
              >
                <textarea
                  value={newAppreciation}
                  onChange={(e) => setNewAppreciation(e.target.value)}
                  placeholder="I appreciated when you..."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  rows={3}
                />
                <button
                  type="submit"
                  className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                    isHotMode
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                      : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                  } transition-colors`}
                >
                  Share Appreciation
                </button>
              </form>
            </div>

            <div className="space-y-4">
              {appreciations.map((appreciation) => (
                <AppreciationCard
                  key={appreciation.id}
                  appreciation={appreciation}
                  onDelete={deleteAppreciation.mutate}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pink-500" />
                Schedule a Moment
              </h2>
              
              <ScheduleMoment
                isHotMode={isHotMode}
                onSchedule={addScheduledMoment.mutate}
              />
            </div>

            <div className="space-y-4">
              {scheduledMoments.map((moment) => (
                <div
                  key={moment.id}
                  className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {moment.type.charAt(0).toUpperCase() + moment.type.slice(1)} Moment
                      </h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(moment.date), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <button
                      onClick={() => moment.id && deleteScheduledMoment.mutate(moment.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Flame className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="mt-2 text-gray-700">{moment.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;