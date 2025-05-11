
import React from 'react';
import { Car, Check, MapPin, Star } from 'lucide-react';

const DriverAppPreview: React.FC = () => {
  return (
    <div className="w-[300px] h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 relative mx-auto">
      {/* App header */}
      <div className="bg-indrive-primary px-4 py-5 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">inDrive Driver</h3>
            <p className="text-xs">Cape Town</p>
          </div>
          <div>
            <span className="text-xs bg-white/20 py-1 px-2 rounded-full">Online</span>
          </div>
        </div>
      </div>
      
      {/* Ride request */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold text-gray-800">New ride request</h4>
          <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full font-medium">R85.00</span>
        </div>
        
        <div className="flex gap-3 mb-3">
          <div className="text-indrive-primary">
            <MapPin size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500">PICKUP</p>
            <p className="text-sm font-medium">Waterfront, Cape Town</p>
          </div>
        </div>
        
        <div className="flex gap-3 mb-4">
          <div className="text-red-500">
            <MapPin size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500">DROPOFF</p>
            <p className="text-sm font-medium">Century City, Cape Town</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Star size={14} />
            <span>4.93</span>
          </div>
          <div>15.7 km</div>
          <div>~ 22 min</div>
        </div>
        
        <div className="flex gap-2">
          <button className="flex-1 bg-indrive-primary text-white py-2 rounded-lg text-sm font-medium">
            Accept R85
          </button>
          <button className="flex-1 border border-indrive-primary text-indrive-primary py-2 rounded-lg text-sm font-medium">
            Offer price
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="p-4">
        <h4 className="font-medium text-gray-700 mb-2">Today's overview</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Earnings</p>
            <p className="text-lg font-bold text-gray-800">R 450.00</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Rides</p>
            <p className="text-lg font-bold text-gray-800">7</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Hours active</p>
            <p className="text-lg font-bold text-gray-800">5.5</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Rating</p>
            <div className="flex items-center gap-1">
              <Star size={16} fill="currentColor" className="text-yellow-400" />
              <p className="text-lg font-bold text-gray-800">4.91</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom navigation */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
        <div className="grid grid-cols-3 py-4">
          <div className="flex flex-col items-center justify-center">
            <Car size={20} className="text-indrive-primary" />
            <p className="text-xs mt-1 text-indrive-primary font-medium">Rides</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Star size={20} className="text-gray-400" />
            <p className="text-xs mt-1 text-gray-400">Ratings</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Check size={20} className="text-gray-400" />
            <p className="text-xs mt-1 text-gray-400">History</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverAppPreview;
