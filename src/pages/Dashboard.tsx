
import React, { useMemo, useState } from 'react';
import { Calendar, Users, ShoppingBag, TrendingUp, Clock, Star, Euro, Phone, UserCheck, AlertCircle, Award, Activity } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import AnalyticsChart from '../components/Dashboard/AnalyticsChart';
import { useAppointments } from '@/contexts/AppointmentContext';
import { format, startOfWeek, endOfWeek, subDays, addDays, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

const Dashboard = () => {
  const { appointments, getStatistics, services } = useAppointments();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const stats = getStatistics();
  
  // Calculate real analytics from appointment data
  const analytics = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { locale: pt });
    const monthStart = startOfMonth(now);
    
    // Weekly data for the last 7 days
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      const dayAppointments = appointments.filter(apt => {
        const aptDate = parseISO(apt.date);
        return format(aptDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      });
      
      const revenue = dayAppointments.reduce((sum, apt) => sum + apt.service.price, 0);
      const completed = dayAppointments.filter(apt => apt.status === 'completed').length;
      
      return {
        name: format(date, 'EEE', { locale: pt }),
        fullDate: format(date, 'dd/MM'),
        appointments: dayAppointments.length,
        completed,
        revenue,
        pending: dayAppointments.filter(apt => apt.status === 'pending').length,
        confirmed: dayAppointments.filter(apt => apt.status === 'confirmed').length,
      };
    });
    
    // Monthly data for the last 30 days
    const monthlyData = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(now, 29 - i);
      const dayAppointments = appointments.filter(apt => {
        const aptDate = parseISO(apt.date);
        return format(aptDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      });
      
      const revenue = dayAppointments.reduce((sum, apt) => sum + apt.service.price, 0);
      
      return {
        name: format(date, 'dd/MM'),
        appointments: dayAppointments.length,
        revenue,
        completed: dayAppointments.filter(apt => apt.status === 'completed').length,
      };
    });
    
    // Hourly distribution
    const hourlyData = Array.from({ length: 10 }, (_, i) => {
      const hour = 9 + i;
      const hourStr = `${hour.toString().padStart(2, '0')}:00`;
      const count = appointments.filter(apt => apt.time.startsWith(hour.toString().padStart(2, '0'))).length;
      
      return {
        name: hour >= 12 ? `${hour === 12 ? 12 : hour - 12}PM` : `${hour}AM`,
        bookings: count,
        hour,
      };
    });
    
    // Service popularity
    const serviceStats = services.map(service => {
      const serviceAppointments = appointments.filter(apt => apt.serviceId === service.id);
      const revenue = serviceAppointments.reduce((sum, apt) => sum + service.price, 0);
      const completed = serviceAppointments.filter(apt => apt.status === 'completed').length;
      
      return {
        name: service.name,
        appointments: serviceAppointments.length,
        revenue,
        completed,
        duration: service.duration,
        price: service.price,
      };
    }).sort((a, b) => b.appointments - a.appointments);
    
    // Client insights
    const clientInsights = {
      totalClients: new Set(appointments.map(apt => apt.clientInfo.phone)).size,
      returningClients: 0, // Calculate based on multiple appointments from same phone
      averageServiceValue: appointments.length > 0 ? appointments.reduce((sum, apt) => sum + apt.service.price, 0) / appointments.length : 0,
      genderDistribution: appointments.reduce((acc, apt) => {
        if (apt.clientInfo.gender) {
          acc[apt.clientInfo.gender] = (acc[apt.clientInfo.gender] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
    };
    
    // Calculate returning clients
    const phoneCount = appointments.reduce((acc, apt) => {
      acc[apt.clientInfo.phone] = (acc[apt.clientInfo.phone] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    clientInsights.returningClients = Object.values(phoneCount).filter(count => count > 1).length;
    
    // Status distribution for pie chart
    const statusData = [
      { name: 'Confirmados', value: stats.confirmed, color: '#10B981' },
      { name: 'Pendentes', value: stats.pending, color: '#F59E0B' },
      { name: 'Completados', value: stats.completed, color: '#8B5CF6' },
      { name: 'Cancelados', value: stats.cancelled, color: '#EF4444' },
      { name: 'Faltaram', value: stats.noShow, color: '#6B7280' },
    ].filter(item => item.value > 0);
    
    return {
      weeklyData,
      monthlyData,
      hourlyData,
      serviceStats,
      clientInsights,
      statusData,
    };
  }, [appointments, services, stats]);
  
  // Calculate totals for current period
  const currentPeriodData = selectedPeriod === 'week' ? analytics.weeklyData : analytics.monthlyData;
  const totalRevenue = currentPeriodData.reduce((sum, day) => sum + day.revenue, 0);
  const totalAppointments = currentPeriodData.reduce((sum, day) => sum + day.appointments, 0);
  const avgDailyRevenue = totalRevenue / currentPeriodData.length;
  const conversionRate = analytics.clientInsights.totalClients > 0 ? (analytics.clientInsights.returningClients / analytics.clientInsights.totalClients) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard CRM</h1>
            <p className="text-purple-100">Visão geral do seu negócio</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">Receita do Período</p>
                <p className="text-3xl font-bold">€{totalRevenue.toFixed(0)}</p>
              </div>
              <Euro className="w-8 h-8 text-purple-200" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">Agendamentos</p>
                <p className="text-3xl font-bold">{totalAppointments}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>
        
        {/* Period Selector */}
        <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedPeriod === 'week' ? 'bg-white text-purple-600' : 'text-purple-100'
            }`}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedPeriod === 'month' ? 'bg-white text-purple-600' : 'text-purple-100'
            }`}
          >
            Últimos 30 Dias
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <StatsCard
            title="Total Clientes"
            value={analytics.clientInsights.totalClients.toString()}
            icon={Users}
            change={`${analytics.clientInsights.returningClients} recorrentes`}
            changeType="positive"
            gradient="from-blue-500 to-cyan-500"
          />
          <StatsCard
            title="Taxa Conversão"
            value={`${conversionRate.toFixed(1)}%`}
            icon={TrendingUp}
            change="Clientes recorrentes"
            changeType={conversionRate > 20 ? 'positive' : 'neutral'}
            gradient="from-green-500 to-emerald-500"
          />
          <StatsCard
            title="Receita Média"
            value={`€${avgDailyRevenue.toFixed(0)}`}
            icon={Euro}
            change="Por dia"
            changeType="neutral"
            gradient="from-orange-500 to-red-500"
          />
          <StatsCard
            title="Valor Médio"
            value={`€${analytics.clientInsights.averageServiceValue.toFixed(0)}`}
            icon={Award}
            change="Por serviço"
            changeType="positive"
            gradient="from-purple-500 to-pink-500"
          />
        </div>
        
        {/* Status Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status dos Agendamentos</h3>
          <div className="grid grid-cols-5 gap-4">
            {analytics.statusData.map((status) => (
              <div key={status.name} className="text-center">
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: status.color }}
                >
                  {status.value}
                </div>
                <p className="text-xs text-gray-600">{status.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsChart
              data={currentPeriodData}
              type="bar"
              title={`Agendamentos - ${selectedPeriod === 'week' ? 'Esta Semana' : 'Últimos 30 Dias'}`}
              dataKey="appointments"
              color="#8B5CF6"
            />
          </div>
          
          <AnalyticsChart
            data={currentPeriodData}
            type="line"
            title={`Receita (€) - ${selectedPeriod === 'week' ? 'Esta Semana' : 'Últimos 30 Dias'}`}
            dataKey="revenue"
            color="#EC4899"
          />
          
          <AnalyticsChart
            data={analytics.hourlyData}
            type="bar"
            title="Análise de Horários de Pico"
            dataKey="bookings"
            color="#06B6D4"
          />
        </div>
        
        {/* Secondary Analytics */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Service Performance */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance dos Serviços</h3>
            <div className="space-y-3">
              {analytics.serviceStats.slice(0, 5).map((service, index) => (
                <div key={service.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-600' : 'bg-purple-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.appointments} agendamentos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">€{service.revenue}</p>
                    <p className="text-sm text-gray-500">{service.completed} completados</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Client Demographics */}
          {Object.keys(analytics.clientInsights.genderDistribution).length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Demografia dos Clientes</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(analytics.clientInsights.genderDistribution).map(([gender, count]) => (
                  <div key={gender} className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <div className="text-2xl mb-2">
                      {gender === 'Homem' ? '👨' : gender === 'Mulher' ? '👩' : '🤝'}
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{count}</p>
                    <p className="text-sm text-gray-600">{gender}</p>
                    <p className="text-xs text-gray-500">
                      {((count / Object.values(analytics.clientInsights.genderDistribution).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => window.location.href = '/book'}
              className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Novo Agendamento
            </button>
            <button 
              onClick={() => window.location.href = '/appointments'}
              className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Users className="w-5 h-5 mr-2" />
              Ver Agendamentos
            </button>
          </div>
          
          {/* Manager Actions */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-600 mb-3">Configurações (Manager)</h4>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => window.location.href = '/custom-fields'}
                className="flex items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Activity className="w-4 h-4 mr-2" />
                Campos
              </button>
              <button 
                onClick={() => window.location.href = '/services'}
                className="flex items-center justify-center p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Award className="w-4 h-4 mr-2" />
                Serviços
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
