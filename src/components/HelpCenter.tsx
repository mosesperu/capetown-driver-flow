declare global {
  interface Window {
    Tawk_API?: any; // You can be more specific with the type if you know the Tawk_API structure
  }
}

import React from 'react';
import QRCodeDisplay from './QRCodeDisplay';
import AssistanceTopics from './AssistanceTopics';
import { MessageCircle, Zap } from 'lucide-react'; // Zap for WhatsApp, MessageCircle for chat

interface HelpCenterProps {
  affiliateLink: string;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ affiliateLink }) => {
  const whatsappNumber = "+27815468283";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\+/g, '')}`;

  return (
    <section id="help" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="bg-indrive-light text-indrive-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-2">
            Driver Support
          </span>
          <h2 className="section-title">
            Need <span className="text-indrive-primary">Help?</span> We're Here For You
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Get instant assistance with your inDrive account, app, or any other questions you might have.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <AssistanceTopics />
          </div>
          
          <div className="order-1 md:order-2 flex justify-center">
            <QRCodeDisplay 
              url={affiliateLink}
              title="Scan to register as a driver" 
              description="Scan this QR code to download the app and start your inDrive registration"
            />
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-xl text-gray-600 mb-6">
            Don't see your issue listed? Our support team is online 24/7.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              className="btn-primary inline-flex items-center gap-2"
              onClick={() => {
                if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
                  window.Tawk_API.maximize();
                } else {
                  console.error("Tawk_API not available or maximize function is missing.");
                }
              }}
            >
              <MessageCircle size={20} />
              Start Chat Now
            </button>
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 bg-green-500 hover:bg-green-600"
            >
              <Zap size={20} />
              WhatsApp Our Agents
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpCenter;
