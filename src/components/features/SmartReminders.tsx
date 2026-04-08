import React, { useState } from 'react';
import { Bell, Clock, Calendar, CheckCircle2, ChevronRight, AlertCircle, Plus } from 'lucide-react';

const mockReminders = [
  { id: 1, title: 'Take Metformin (500mg)', time: '08:00 AM', type: 'medicine', status: 'pending', frequency: 'Daily after breakfast' },
  { id: 2, title: 'Check Blood Sugar', time: '02:00 PM', type: 'measurement', status: 'pending', frequency: 'Daily before lunch' },
  { id: 3, title: 'Cardiologist Follow-up', time: 'Tomorrow, 10:30 AM', type: 'appointment', status: 'upcoming', frequency: 'One-time' },
  { id: 4, title: 'Take Vitamin D3', time: '09:00 AM', type: 'medicine', status: 'completed', frequency: 'Weekly on Sundays' },
];

const SmartReminders: React.FC = () => {
  const [reminders, setReminders] = useState(mockReminders);

  const toggleStatus = (id: number) => {
    setReminders(reminders.map(rem => 
      rem.id === id && rem.status === 'pending' 
        ? { ...rem, status: 'completed' } 
        : rem
    ));
  };

  const pendingCount = reminders.filter(r => r.status === 'pending').length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Reminders</h1>
          <p className="text-gray-600">Never miss a dose or an appointment. We've got your schedule handled.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus className="h-5 w-5 mr-1.5" />
          Add Reminder
        </button>
      </div>

      {pendingCount > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-sm">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-yellow-500 mr-3" />
            <div>
              <h3 className="text-yellow-800 font-medium">You have {pendingCount} pending task(s) today.</h3>
              <p className="text-sm text-yellow-700 mt-0.5">Please update your status once you complete them.</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-indigo-600" />
            Upcoming Schedule
          </h2>
          <span className="text-sm font-medium text-gray-500">Today</span>
        </div>
        
        <div className="divide-y divide-gray-100">
          {reminders.map((reminder) => (
            <div key={reminder.id} className={`p-5 flex items-center justify-between transition-colors ${reminder.status === 'completed' ? 'bg-gray-50 opacity-75' : 'hover:bg-gray-50'}`}>
              <div className="flex items-center">
                <button 
                  onClick={() => toggleStatus(reminder.id)}
                  className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${
                    reminder.status === 'completed' 
                      ? 'border-green-500 bg-green-500 text-white' 
                      : 'border-gray-300 hover:border-indigo-500'
                  }`}
                  disabled={reminder.status === 'completed' || reminder.status === 'upcoming'}
                >
                  {reminder.status === 'completed' && <CheckCircle2 className="h-4 w-4" />}
                </button>
                
                <div>
                  <h3 className={`font-semibold ${reminder.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {reminder.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {reminder.time}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {reminder.frequency}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="pl-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  reminder.type === 'medicine' ? 'bg-blue-100 text-blue-800' :
                  reminder.type === 'appointment' ? 'bg-purple-100 text-purple-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {reminder.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartReminders;
