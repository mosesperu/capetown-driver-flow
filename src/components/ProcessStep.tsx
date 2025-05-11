
import React from 'react';
import { cn } from '@/lib/utils';
import RevealOnScroll from './RevealOnScroll';

interface ProcessStepProps {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  isLast?: boolean;
  className?: string;
}

const ProcessStep: React.FC<ProcessStepProps> = ({
  step,
  title,
  description,
  icon,
  isLast = false,
  className,
}) => {
  return (
    <div className={cn("relative", className)}>
      <RevealOnScroll delay={step * 100}>
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="bg-indrive-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg z-10 relative">
              {step}
            </div>
            {!isLast && (
              <div className="absolute top-12 bottom-0 left-1/2 transform -translate-x-1/2 w-1 bg-indrive-light" />
            )}
          </div>
          
          <div className="flex-1 pb-12">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-indrive-primary">
                {icon}
              </span>
              <h3 className="font-bold text-xl">{title}</h3>
            </div>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  );
};

export default ProcessStep;
