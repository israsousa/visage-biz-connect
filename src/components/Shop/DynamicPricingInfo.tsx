
import React from 'react';

const DynamicPricingInfo = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
      <h3 className="text-lg font-semibold mb-2">Dynamic Pricing</h3>
      <p className="text-blue-100 mb-4">Automatically adjust prices based on demand, time, and client preferences</p>
      <button className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors">
        Configure Pricing
      </button>
    </div>
  );
};

export default DynamicPricingInfo;
