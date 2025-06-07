
import React from 'react';
import { Calendar, Users, ShoppingBag, TrendingUp, Clock, Star } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import AnalyticsChart from '../components/Dashboard/AnalyticsChart';

const Dashboard = () => {
  const weeklyData = [
    { name: 'Mon', appointments: 12, sales: 450 },
    { name: 'Tue', appointments: 15, sales: 680 },
    { name: 'Wed', appointments: 8, sales: 320 },
    { name: 'Thu', appointments: 18, sales: 820 },
    { name: 'Fri', appointments: 22, sales: 1100 },
    { name: 'Sat', appointments: 25, sales: 1350 },
    { name: 'Sun', appointments: 10, sales: 400 },
  ];

  const hourlyData = [
    { name: '9AM', bookings: 3 },
    { name: '10AM', bookings: 5 },
    { name: '11AM', bookings: 8 },
    { name: '12PM', bookings: 12 },
    { name: '1PM', bookings: 15 },
    { name: '2PM', bookings: 18 },
    { name: '3PM', bookings: 14 },
    { name: '4PM', bookings: 10 },
    { name: '5PM', bookings: 7 },
    { name: '6PM', bookings: 4 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Sarah!</h1>
            <p className="text-purple-100">Here's your business overview</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100">Today's Revenue</p>
              <p className="text-3xl font-bold">$1,245</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-100">Appointments</p>
              <p className="text-2xl font-bold">18</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            title="Active Clients"
            value="156"
            icon={Users}
            change="+12% this month"
            changeType="positive"
            gradient="from-blue-500 to-cyan-500"
          />
          <StatsCard
            title="This Week"
            value="89"
            icon={Calendar}
            change="Appointments"
            changeType="neutral"
            gradient="from-green-500 to-emerald-500"
          />
          <StatsCard
            title="Product Sales"
            value="$3,420"
            icon={ShoppingBag}
            change="+8% vs last week"
            changeType="positive"
            gradient="from-orange-500 to-red-500"
          />
          <StatsCard
            title="Avg. Service Time"
            value="45min"
            icon={Clock}
            change="Optimized"
            changeType="positive"
            gradient="from-purple-500 to-pink-500"
          />
        </div>

        {/* Analytics Charts */}
        <div className="space-y-6">
          <AnalyticsChart
            data={weeklyData}
            type="bar"
            title="Weekly Appointments"
            dataKey="appointments"
            color="#8B5CF6"
          />
          
          <AnalyticsChart
            data={weeklyData}
            type="line"
            title="Weekly Sales ($)"
            dataKey="sales"
            color="#EC4899"
          />
          
          <AnalyticsChart
            data={hourlyData}
            type="bar"
            title="Peak Hours Analysis"
            dataKey="bookings"
            color="#06B6D4"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200">
              <Calendar className="w-5 h-5 mr-2" />
              New Appointment
            </button>
            <button className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
