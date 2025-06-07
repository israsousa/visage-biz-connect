
import React, { useState } from 'react';
import { Calendar, Clock, User, MessageCircle, CheckCircle } from 'lucide-react';

const BookAppointment = () => {
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientInfo, setClientInfo] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  const services = [
    { id: 'haircut', name: 'Hair Cut & Style', duration: '60 min', price: 65 },
    { id: 'color', name: 'Hair Color', duration: '120 min', price: 120 },
    { id: 'facial', name: 'Facial Treatment', duration: '75 min', price: 85 },
    { id: 'manicure', name: 'Manicure', duration: '30 min', price: 35 },
    { id: 'pedicure', name: 'Pedicure', duration: '45 min', price: 45 },
    { id: 'both', name: 'Mani + Pedi', duration: '75 min', price: 75 }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle appointment booking logic here
    console.log('Booking appointment:', {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      client: clientInfo
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Book Appointment</h1>
          <p className="text-purple-100">Schedule your next beauty session</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Service Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            Select Service
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {services.map((service) => (
              <label key={service.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="service"
                  value={service.id}
                  checked={selectedService === service.id}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="sr-only"
                />
                <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedService === service.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-600">{service.duration}</p>
                    </div>
                    <p className="text-lg font-bold text-purple-600">${service.price}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Select Date
          </h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* Time Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Select Time
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  selectedTime === time
                    ? 'border-purple-500 bg-purple-50 text-purple-600'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Client Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            Client Information
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={clientInfo.name}
              onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={clientInfo.phone}
              onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={clientInfo.email}
              onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <textarea
              placeholder="Special requests or notes..."
              value={clientInfo.notes}
              onChange={(e) => setClientInfo({...clientInfo, notes: e.target.value})}
              rows={3}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* WhatsApp Integration */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <MessageCircle className="w-6 h-6" />
            <h3 className="text-lg font-semibold">WhatsApp Confirmation</h3>
          </div>
          <p className="text-green-100 text-sm">
            Appointment confirmations and reminders will be sent via WhatsApp
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedService || !selectedDate || !selectedTime || !clientInfo.name || !clientInfo.phone}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
