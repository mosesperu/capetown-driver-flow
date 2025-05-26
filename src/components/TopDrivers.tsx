import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import { Star } from 'lucide-react';

interface Driver {
  name: string;
  image: string;
  rating: number;
  trips: number;
  description: string;
}

const drivers: Driver[] = [
  { 
    name: 'Tinashe Mugabe', 
    image: '/tinashe-mugabe.jpg',
    rating: 4.9, 
    trips: 7180,
    description: "Tinashe is known for her friendly attitude and extensive knowledge of the city's quickest routes."
  },
  { 
    name: 'Johan van der Merwe',
    image: '/johan-van-der-merwe.jpg',
    rating: 4.9, 
    trips: 14321,
    description: 'Johan is a seasoned driver with a reputation for safety and excellent customer care.'
  },
  { 
    name: 'Likho Makonza', 
    image: '/likho-makonza.jpg',
    rating: 4.8, 
    trips: 11956,
    description: 'Likho provides a consistently smooth and comfortable ride, praised for his professionalism.'
  },
];

const TopDrivers: React.FC = () => {
  const handleAffiliateClick = () => {
    window.open("https://indriver.onelink.me/X6vF/1hk3t9ct", "_blank");
  };

  return (
    <section id="top-drivers" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center mb-12">
        <RevealOnScroll>
          <span className="bg-indrive-light text-indrive-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-2">
            Some of Our Top Drivers
          </span>
          <h2 className="section-title text-gray-800">Some of Our Top Drivers</h2>
          <p className="section-subtitle max-w-2xl mx-auto text-gray-600">
            Meet some of our highly-rated professional drivers who make your journey safe and comfortable.
          </p>
        </RevealOnScroll>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {drivers.map((driver, index) => (
            <RevealOnScroll key={driver.name} delay={index * 100}>
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col items-center animate-float">
                <img
                  src={driver.image}
                  alt={driver.name}
                  className="w-32 h-32 rounded-full border-4 border-indrive-primary object-cover mb-4"
                />
                <h3 className="font-bold text-lg text-gray-800">{driver.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Star size={16} className="text-yellow-400" />
                  <span className="font-medium">{driver.rating.toFixed(1)}</span>
                  <span className="text-gray-500">· {driver.trips} trips</span>
                </div>
                <p className="text-gray-600 text-center mt-4 h-20">
                  {driver.description}
                </p>
                <button 
                  onClick={handleAffiliateClick}
                  className="btn-primary mt-6"
                >
                  Join Our Team
                </button>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDrivers; 