
import React from "react";
import { MessageCircle, DollarSign, Smartphone, HelpCircle } from "lucide-react";

const AssistanceTopics: React.FC = () => {
  return (
    <div className="bg-indrive-light rounded-xl p-6 shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">How Can We Help You?</h3>
      <p className="text-gray-600 mb-6">
        Our assistance team is ready to help you with any questions related to:
      </p>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-indrive-primary p-2 rounded-full text-white">
            <DollarSign size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Account Top-up/Replenishment</h4>
            <p className="text-gray-600">Assistance with wallet balance, payments, and commissions</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="bg-indrive-primary p-2 rounded-full text-white">
            <Smartphone size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Phone Compatibility & App Connectivity</h4>
            <p className="text-gray-600">Help with app installation, device compatibility, and connection issues</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="bg-indrive-primary p-2 rounded-full text-white">
            <HelpCircle size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Technical Difficulties</h4>
            <p className="text-gray-600">Support for app errors, login problems, and other technical issues</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="bg-indrive-primary p-2 rounded-full text-white">
            <MessageCircle size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">General Assistance</h4>
            <p className="text-gray-600">Any other questions about using our service or driving with inDrive</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-center font-medium">
          Chat with us directly or contact an agent via WhatsApp for immediate assistance
        </p>
      </div>
    </div>
  );
};

export default AssistanceTopics;
