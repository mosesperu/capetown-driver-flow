
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface QRCodeDisplayProps {
  url: string;
  title?: string;
  description?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ 
  url, 
  title = "Scan to register as a driver", 
  description = "Scan this QR code to start your inDrive registration process" 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
      
      <div className="max-w-[250px] mx-auto">
        <AspectRatio ratio={1 / 1} className="bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`}
            alt="inDrive Registration QR Code"
            className="w-full h-full object-cover"
          />
        </AspectRatio>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">Powered by inDrive</p>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
