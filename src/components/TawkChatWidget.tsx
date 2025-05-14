
import React, { useEffect } from 'react';

interface TawkChatWidgetProps {
  tawkId?: string;
}

const TawkChatWidget: React.FC<TawkChatWidgetProps> = ({ 
  tawkId = '65d48fc98d44780077524c3c' // Replace with your actual tawk.to ID
}) => {
  useEffect(() => {
    // Load the Tawk.to script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${tawkId}/default`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    document.body.appendChild(script);
    
    // Clean up function to remove script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, [tawkId]);

  return null; // This component doesn't render anything visible
};

export default TawkChatWidget;
