
import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Plus } from 'lucide-react';

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const appointments = [
    {
      id: 1,
      clientName: 'Emma Johnson',
      service: 'Hair Cut & Color',
      time: '09:00',
      duration: '90 min',
      phone: '+1 (555) 123-4567',
      status: 'confirmed'
    },
    {
      id: 2,
      clientName: 'Sarah Wilson',
      service: 'Facial Treatment',
      time: '11:00',
      duration: '60 min',
      phone: '+1 (555) 987-6543',
      status: 'pending'
    },
    {
      id: 3,
      clientName: 'Maria Garcia',
      service: 'Manicure & Pedicure',
      time: '14:30',
      duration: '45 min',
      phone: '+1 (555) 456-7890',
      status: 'confirmed'
    },
    {
      id: 4,
      clientName: 'Lisa Brown',
      service: 'Eyebrow Microblading',
      time: '16:00',
      duration: '120 min',
      phone: '+1 (555) 321-0987',
      status: 'confirmed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="text-purple-100">Manage your daily schedule</p>
          </div>
          <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Date Selector */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-transparent text-white placeholder-purple-200 border border-white/20 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-600">{appointments.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {appointments.filter(apt => apt.status === 'confirmed').length}
              </p>
              <p className="text-sm text-gray-600">Confirmed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {appointments.filter(apt => apt.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{appointment.clientName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <p className="text-purple-600 font-medium mb-1">{appointment.service}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{appointment.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{appointment.phone}</span>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
                    Contact
                  </button>
                  <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors">
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Integration Info */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">WhatsApp Booking</h3>
          <p className="text-green-100 mb-4">Automated appointment booking via WhatsApp chatbot</p>
          <button className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors">
            Configure Chatbot
          </button>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
