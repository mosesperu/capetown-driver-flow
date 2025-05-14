
import React from 'react';
import QRCodeDisplay from './QRCodeDisplay';
import AssistanceTopics from './AssistanceTopics';

interface HelpCenterProps {
  affiliateLink: string;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ affiliateLink }) => {
  return (
    <section id="help" className="py-20 bg-white">
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
          <p className="text-xl text-gray-600 mb-4">
            Don't see your issue listed? Our support team is online 24/7.
          </p>
          <button className="btn-primary inline-flex items-center gap-2">
            Start Chat Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HelpCenter;
