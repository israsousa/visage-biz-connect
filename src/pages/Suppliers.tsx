
import React, { useState } from 'react';
import { Users, Plus, Search, Phone, Mail, MapPin, TrendingUp } from 'lucide-react';

const Suppliers = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const suppliers = [
    {
      id: 1,
      name: 'Beauty Pro Supplies',
      category: 'Hair Care Products',
      contact: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      email: 'contact@beautypro.com',
      location: 'New York, NY',
      rating: 4.8,
      orders: 45,
      lastOrder: '2 days ago',
      products: ['Shampoo', 'Conditioner', 'Hair Masks', 'Styling Products']
    },
    {
      id: 2,
      name: 'SkinCare Distributors',
      category: 'Skincare Products',
      contact: 'Mike Wilson',
      phone: '+1 (555) 987-6543',
      email: 'orders@skincare-dist.com',
      location: 'Los Angeles, CA',
      rating: 4.9,
      orders: 32,
      lastOrder: '1 week ago',
      products: ['Facials', 'Serums', 'Moisturizers', 'Cleansers']
    },
    {
      id: 3,
      name: 'Professional Tools Co.',
      category: 'Equipment & Tools',
      contact: 'Lisa Chen',
      phone: '+1 (555) 456-7890',
      email: 'info@protools.com',
      location: 'Chicago, IL',
      rating: 4.7,
      orders: 18,
      lastOrder: '3 days ago',
      products: ['Hair Dryers', 'Straighteners', 'Scissors', 'Chairs']
    },
    {
      id: 4,
      name: 'Nail Art Supplies',
      category: 'Nail Care',
      contact: 'Emma Davis',
      phone: '+1 (555) 321-0987',
      email: 'sales@nailart.com',
      location: 'Miami, FL',
      rating: 4.6,
      orders: 28,
      lastOrder: '5 days ago',
      products: ['Polish', 'Nail Art', 'Tools', 'UV Lamps']
    }
  ];

  const getRandomColor = (index: number) => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Suppliers</h1>
            <p className="text-purple-100">Manage your supplier relationships</p>
          </div>
          <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-200" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 border border-white/20 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Suppliers</p>
                <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Monthly Orders</p>
                <p className="text-2xl font-bold text-gray-900">123</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Suppliers List */}
        <div className="space-y-4">
          {suppliers.map((supplier, index) => (
            <div key={supplier.id} className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getRandomColor(index)} flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">
                        {supplier.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                      <p className="text-purple-600 font-medium text-sm">{supplier.category}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{supplier.orders}</p>
                  <p className="text-sm text-gray-600">Orders</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{supplier.contact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{supplier.location}</span>
                </div>
              </div>

              {/* Products */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Products:</p>
                <div className="flex flex-wrap gap-2">
                  {supplier.products.map((product, idx) => (
                    <span key={idx} className="bg-purple-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium">
                      {product}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Last order: {supplier.lastOrder}
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors">
                    Contact
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200">
                    New Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Supplier CTA */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white text-center">
          <h3 className="text-lg font-semibold mb-2">Add New Supplier</h3>
          <p className="text-blue-100 mb-4">Expand your network and find better deals</p>
          <button className="bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors">
            Add Supplier
          </button>
        </div>
      </div>
    </div>
  );
};

export default Suppliers;
