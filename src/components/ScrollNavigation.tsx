
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Home' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'process', label: 'Register' },
  { id: 'commission', label: 'Earnings' },
  { id: 'join', label: 'Join Now' }
];

const ScrollNavigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [scrolled, setScrolled] = useState<boolean>(false);

  // Handle scroll to show/hide nav background
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      
      // Set navbar background when scrolled
      if (position > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Determine active section
      const sections = navItems.map(item => 
        document.getElementById(item.id)
      );
      
      sections.forEach((section) => {
        if (!section) return;
        
        const top = section.offsetTop - 100;
        const height = section.offsetHeight;
        
        if (position >= top && position < top + height) {
          setActiveSection(section.id);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-white shadow-md py-2" : "py-4"
      )}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <a href="#" className="flex items-center gap-2">
            <span className="font-bold text-2xl text-indrive-primary">in<span className="text-indrive-secondary">Drive</span></span>
            <span className="hidden md:inline-block text-gray-500">Cape Town</span>
          </a>

          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  activeSection === item.id 
                    ? "bg-indrive-light text-indrive-primary" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollToSection('join')}
            className="bg-indrive-primary hover:bg-indrive-secondary text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Start Driving
          </button>
        </div>
      </nav>

      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-6 right-6 bg-indrive-primary text-white p-3 rounded-full shadow-lg transition-all z-40",
          scrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <ChevronUp size={20} />
      </button>
    </>
  );
};

export default ScrollNavigation;
