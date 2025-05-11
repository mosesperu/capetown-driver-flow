
import React from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className,
}) => {
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-xl hover:border-indrive-primary/20",
      className
    )}>
      <div className="bg-indrive-light p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 text-indrive-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
