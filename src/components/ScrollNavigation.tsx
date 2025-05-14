
import React, { useState, useEffect } from "react";
import { Car, ChartBar, HelpCircle, Workflow, MessageSquare, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const ScrollNavigation = () => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      if (scrollPosition > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Get all sections
      const sections = document.querySelectorAll("section[id]");
      
      // Find the current active section
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop - 100;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute("id") || "";
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };
  
  const navItems = [
    { id: "hero", icon: Car, label: "Home" },
    { id: "benefits", icon: ChartBar, label: "Benefits" },
    { id: "process", icon: Workflow, label: "Process" },
    { id: "commission", icon: DollarSign, label: "Earnings" },
    { id: "help", icon: HelpCircle, label: "Help" },
    { id: "join", icon: MessageSquare, label: "Join" },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-bold text-2xl transition-colors duration-300",
            isScrolled ? "text-indrive-primary" : "text-indrive-primary"
          )}>
            in<span className="text-indrive-primary">Drive</span>
          </span>
          {isScrolled && <span className="text-gray-600 text-sm hidden md:inline-block">Cape Town</span>}
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors relative",
                activeSection === item.id 
                  ? "text-indrive-primary" 
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
              {activeSection === item.id && (
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-indrive-primary rounded-full" />
              )}
            </button>
          ))}
        </nav>
        
        {isMobile && (
          <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-between px-2 py-3 z-50">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center flex-1",
                  activeSection === item.id 
                    ? "text-indrive-primary" 
                    : "text-gray-600"
                )}
              >
                <item.icon size={20} />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default ScrollNavigation;
