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
    <section id="help" className="relative overflow-hidden py-20 bg-white">
      {/* Decorative Tag Background */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="/help-tag-background2.png"
          alt=""
          className="w-full h-full object-cover opacity-90"
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 container mx-auto px-4">
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
        
        {/* Technical Help Guide */}
        <div className="mt-16 mb-12 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold text-indrive-primary mb-6 text-center">Quick Guide for Common Concerns</h3>
          
          <div className="space-y-6 text-left">
            <div>
              <h4 className="font-semibold text-lg text-gray-800 mb-2">App & Technical Troubles?</h4>
              <p className="text-gray-600 leading-relaxed">
                If the app isn't working as expected, please capture the issue with screenshots or a screen recording.
                For most technical glitches, submit details through our <a href="https://indrive.com/en-in/contacts/support" target="_blank" rel="noopener noreferrer" className="text-indrive-primary hover:underline font-medium">Online Support Form</a>.
                For more complex problems, you can also email our support team directly at <a href="mailto:support@indrive.com" className="text-indrive-primary hover:underline font-medium">support@indrive.com</a>.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Concerns about Fares or Safety?</h4>
              <p className="text-gray-600 leading-relaxed">
                Your peace of mind is important to us. If you have concerns about fares, safety, or other service aspects, please share your feedback. Our team is here to listen and will do their best to address your concerns based on our policies and your valuable input.
                For persistent issues, the <a href="https://indrive.com/en-in/contacts/support" target="_blank" rel="noopener noreferrer" className="text-indrive-primary hover:underline font-medium">Support Form</a> is also available.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Account Support (Blocking, Profile Edits)?</h4>
              <p className="text-gray-600 leading-relaxed">
                For assistance with account-specific issues like account blocks or necessary profile updates, please use the <a href="https://indrive.com/en-in/contacts/support" target="_blank" rel="noopener noreferrer" className="text-indrive-primary hover:underline font-medium">inDrive Support Form</a>. This helps us track and resolve your query efficiently.
              </p>
            </div>
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
