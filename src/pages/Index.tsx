import React, { useEffect, useState, useCallback } from "react";
import { 
  Car, 
  Check, 
  Clock, 
  DollarSign, 
  Gift, 
  MapPin, 
  Phone, 
  Shield, 
  Star, 
  User, 
  Users,
  ChevronDown
} from "lucide-react";
import ScrollNavigation from "@/components/ScrollNavigation";
import RevealOnScroll from "@/components/RevealOnScroll";
import FeatureCard from "@/components/FeatureCard";
import ProcessStep from "@/components/ProcessStep";
import DriverAppPreview from "@/components/DriverAppPreview";
import HelpCenter from "@/components/HelpCenter";
import TawkChatWidget from "@/components/TawkChatWidget";
import TopDrivers from "@/components/TopDrivers";
import InDriveGame from "../InDriveGame";

// Define AppState locally
enum AppState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

declare global {
  interface Window {
    Tawk_API?: any;
  }
}

// New Component: HowToPlayGuide
const HowToPlayGuide: React.FC = () => {
  return (
    <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg h-full">
      <h3 className="text-xl font-bold text-indrive-primary mb-3">How to Play</h3>
      <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
        <li>Use <span className="font-semibold">Arrow Keys</span> on desktop or <span className="font-semibold">Tap Controls</span> on mobile to change lanes.</li>
        <li>Dodge oncoming <span className="font-semibold">vehicles</span>. Collision ends the game!</li>
        <li>Pick up <span className="font-semibold">Passengers</span> (👤) for extra points.</li>
        <li>Your <span className="font-semibold">Score</span> increases the longer you drive and for each passenger collected.</li>
        <li>The <span className="font-semibold">Game Speed</span> increases as your score gets higher. Stay alert!</li>
        <li>Enter your name after a game over to save your score to the <span className="font-semibold">High Scores</span> list.</li>
      </ul>
    </div>
  );
};

// Modified HighScoresTable Component
const HighScoresTable: React.FC<{ scores: { name?: string, score: number, date: string }[] }> = ({ scores }) => {
  return (
    <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg h-full">
      <h3 className="text-xl font-bold text-indrive-primary mb-3">High Scores</h3>
      {scores.length > 0 ? (
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          {scores.map((entry, index) => (
            <li key={index} className="flex justify-between items-center">
              <div>
                <span className="font-semibold">{entry.name || 'Player'}:</span> {entry.score} pts
              </div>
              <span className="text-xs text-gray-500">{entry.date}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-gray-600">No high scores yet. Be the first!</p>
      )}
    </div>
  );
};

const Index = () => {
  const affiliateLink = "https://indriver.onelink.me/X6vF/1hk3t9ct";
  
  const [currentAppState, setCurrentAppState] = useState<AppState>(AppState.START);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [highScores, setHighScores] = useState<{ name?: string, score: number, date: string }[]>([]);
  const [isLoadingScores, setIsLoadingScores] = useState(false);
  const [errorLoadingScores, setErrorLoadingScores] = useState<string | null>(null);

  const fetchHighScores = useCallback(async () => {
    setIsLoadingScores(true);
    setErrorLoadingScores(null);
    try {
      const response = await fetch('/.netlify/functions/get-scores');
      if (!response.ok) {
        throw new Error(`Failed to fetch scores: ${response.statusText}`);
      }
      const scoresData = await response.json();
      // Convert date strings to more readable format if needed, or ensure consistent format
      const formattedScores = scoresData.map((s: any) => ({ 
        ...s, 
        date: new Date(s.date).toLocaleDateString()
      })); 
      setHighScores(formattedScores);
    } catch (e: any) {
      console.error("Failed to load high scores from server", e);
      setErrorLoadingScores(e.message || "Could not load scores.");
      setHighScores([]); // Clear scores on error or set to a default
    }
    setIsLoadingScores(false);
  }, []);

  // Load high scores from server on initial mount
  useEffect(() => {
    fetchHighScores();
  }, [fetchHighScores]);

  const handleGameStartRequested = useCallback(() => {
    setCurrentScore(0);
    setCurrentAppState(AppState.PLAYING);
  }, []);

  const handleGameReallyOver = useCallback((finalScore: number) => {
    const flooredScore = Math.floor(finalScore);
    setCurrentScore(flooredScore);
    // In this setup, InDriveGame handles its own game over modal for name input
    // and then calls handleSaveNamedScore which Index.tsx passes as a prop.
    // So, we don't automatically switch to AppState.GAME_OVER here.
    // The state change might happen after score submission or if user skips.
  }, []);

  const handleSaveNamedScore = useCallback(async (name: string, score: number) => {
    console.log("Attempting to save score:", name, score);
    try {
      const newScoreEntry = { name: name, score: score }; // Date will be added by serverless function
      const response = await fetch('/.netlify/functions/save-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newScoreEntry),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Failed to save score: ${errorData.message || response.statusText}`);
      }
      
      console.log("Score saved, re-fetching high scores...");
      await fetchHighScores(); // Re-fetch scores to update the list
      // setCurrentAppState(AppState.GAME_OVER); // Transition to game over summary view if desired
    } catch (e: any) {
      console.error("Failed to save high score to server", e);
      // Optionally, display an error message to the user
      alert(`Error saving score: ${e.message}`);
    }
  }, [fetchHighScores]);

  // Initialize IntersectionObserver for scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const elements = document.querySelectorAll(".reveal");
    
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleAffiliateClick = () => {
    window.open(affiliateLink, "_blank");
  };

  return (
    <div className="overflow-x-hidden">
      <ScrollNavigation />
      <TawkChatWidget /> {/* Add the Tawk.to chat widget */}
      
      
      {/* Hero Section */}
      <section id="hero" className="min-h-screen relative bg-gradient-to-br from-white to-indrive-light pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <RevealOnScroll direction="left">
              <div className="max-w-lg">
                <span className="bg-indrive-light text-indrive-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                  Now in South Africa
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Drive with <span className="text-indrive-primary">inDrive</span>, <br />
                  <span className="text-indrive-primary">You</span> set the price
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8">
                  Join thousands of drivers earning more with our fair-price
                  ride-hailing app. Lower commission, higher earnings, more control.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleAffiliateClick}
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    <Car size={20} />
                    Start Driving Today
                  </button>
                  <a 
                    href="#benefits" 
                    className="flex items-center justify-center gap-2 py-3 px-6 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Learn More
                    <ChevronDown size={18} />
                  </a>
                </div>
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indrive-primary flex items-center justify-center text-white text-xs">
                      CT
                    </div>
                    <div className="w-8 h-8 rounded-full bg-indrive-secondary flex items-center justify-center text-white text-xs">
                      JB
                    </div>
                    <div className="w-8 h-8 rounded-full bg-indrive-primary flex items-center justify-center text-white text-xs">
                      DB
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Join <span className="font-bold">32,500+</span> drivers in South Africa
                  </p>
                </div>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll direction="right" delay={200}>
              <div className="relative">
                <div className="absolute -right-4 -top-4 w-24 h-24 md:w-32 md:h-32 bg-indrive-primary rounded-full opacity-10"></div>
                <div className="absolute -left-4 -bottom-4 w-32 h-32 md:w-40 md:h-40 bg-indrive-primary rounded-full opacity-10"></div>
                <div className="relative z-10 animate-float">
                  <DriverAppPreview />
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-6">
          <a 
            href="#benefits" 
            className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all animate-bounce"
          >
            <ChevronDown size={24} className="text-indrive-primary" />
          </a>
        </div>
      </section>
      <TopDrivers />
      {/* Key Benefits Section */}
      <section id="benefits" className="relative overflow-hidden py-20 bg-[#FAF7F0]">
        {/* Lime Green Scribble Background Elements (Copied from game section) */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute bg-[#92C83E] opacity-80"
            style={{
              width: '150%',
              height: '100%',
              top: '-20%',
              left: '-50%',
              transform: 'rotate(-25deg)',
              borderRadius: '30% 70% 60% 40% / 40% 30% 70% 60%', 
            }}
          ></div>
          <div
            className="absolute bg-[#92C83E] opacity-60"
            style={{
              width: '120%',
              height: '80%',
              bottom: '-30%',
              right: '-40%',
              transform: 'rotate(15deg)',
              borderRadius: '50% 50% 30% 70% / 60% 40% 60% 40%', 
            }}
          ></div>
        </div>

        {/* Original content of benefits section, wrapped to ensure it's above background */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-12">
            <RevealOnScroll>
              <span className="bg-indrive-light text-indrive-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-2">
                Why Choose inDrive
              </span>
              <h2 className="section-title">
                Benefits That <span className="text-indrive-primary">Put You First</span>
              </h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                We're not just another ride-hailing app. We're changing the game with driver-first features.
              </p>
            </RevealOnScroll>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <RevealOnScroll delay={100}>
              <FeatureCard
                icon={<DollarSign size={24} />}
                title="Lower Commission - Only 9.9%"
                description="Keep more of what you earn with the lowest commission rate in South Africa, compared to 20-25% from other services."
              />
            </RevealOnScroll>
            
            <RevealOnScroll delay={200}>
              <FeatureCard
                icon={<Check size={24} />}
                title="You Choose Your Rides"
                description="Full freedom to accept or decline any ride request. See all ride details upfront before accepting."
              />
            </RevealOnScroll>
            
            <RevealOnScroll delay={300}>
              <FeatureCard
                icon={<DollarSign size={24} />}
                title="Set Your Own Prices"
                description="Negotiate directly with passengers and set fares that work for you. No more fixed pricing that cuts into your earnings."
              />
            </RevealOnScroll>
            
            <RevealOnScroll delay={400}>
              <FeatureCard
                icon={<Clock size={24} />}
                title="Flexible Schedule"
                description="Work whenever suits you best. No minimum hours, no schedules. Be your own boss completely."
              />
            </RevealOnScroll>
            
            <RevealOnScroll delay={500}>
              <FeatureCard
                icon={<MapPin size={24} />}
                title="Full Ride Transparency"
                description="See pickup location, destination, passenger rating and estimated fare before accepting any ride."
              />
            </RevealOnScroll>
            
            <RevealOnScroll delay={600}>
              <FeatureCard
                icon={<Shield size={24} />}
                title="24/7 Support"
                description="Get help whenever you need it with our always-on support team, dedicated to solving your issues quickly."
              />
            </RevealOnScroll>
          </div>
          
          <RevealOnScroll delay={700}>
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-6">
                inDrive operates in <span className="font-bold">46 countries</span> with over <span className="font-bold">240 million</span> app downloads worldwide.
              </p>
              <button 
                onClick={handleAffiliateClick}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Users size={20} />
                Join Our Driver Community
              </button>
            </div>
          </RevealOnScroll>
        </div>
      </section>
      
      {/* Registration Process */}
      <section id="process" className="relative overflow-hidden py-20 bg-gray-50">
        {/* Decorative Tag Background */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
          <img 
            src="/process-tag-background.png"
            alt=""
            className="w-full h-full object-contain opacity-90 rotate-6 max-w-4xl md:max-w-5xl lg:max-w-6xl"
          />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-12">
            <RevealOnScroll>
              <span className="bg-indrive-light text-indrive-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-2">
                Easy to Start
              </span>
              <h2 className="section-title">
                Simple <span className="text-indrive-primary">4-Step</span> Registration
              </h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                Get on the road and start earning in no time with our straightforward registration process.
              </p>
            </RevealOnScroll>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <ProcessStep
              step={1}
              title="Download the inDrive App"
              description="Get the inDrive driver app from Google Play or App Store using our special link to ensure you're properly registered."
              icon={<Phone size={20} />}
            />
            
            <ProcessStep
              step={2}
              title="Submit Required Documents"
              description="Upload your driver's license with PDP, car registration (2011 model or newer), and a profile photo directly in the app."
              icon={<Check size={20} />}
            />
            
            <ProcessStep
              step={3}
              title="Wait for Approval"
              description="Our team will review your documents within 24 hours and notify you once you're approved to start driving."
              icon={<Clock size={20} />}
            />
            
            <ProcessStep
              step={4}
              title="Start Earning"
              description="Once approved, go online and start accepting ride requests. You're now part of the inDrive driver community!"
              icon={<Car size={20} />}
              isLast
            />
          </div>
          
          <RevealOnScroll delay={300}>
            <div className="text-center mt-12">
              <button 
                onClick={handleAffiliateClick}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Car size={20} />
                Begin Registration Now
              </button>
            </div>
          </RevealOnScroll>
        </div>
      </section>
      
      {/* Commission Comparison */}
      <section id="commission" className="relative overflow-hidden py-20 bg-[#FAF7F0]">
        {/* Lime Green Scribble Background Elements (Copied from benefits section) */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute bg-[#92C83E] opacity-80"
            style={{
              width: '150%',
              height: '100%',
              top: '-20%',
              left: '-50%',
              transform: 'rotate(-25deg)',
              borderRadius: '30% 70% 60% 40% / 40% 30% 70% 60%', 
            }}
          ></div>
          <div
            className="absolute bg-[#92C83E] opacity-60"
            style={{
              width: '120%',
              height: '80%',
              bottom: '-30%',
              right: '-40%',
              transform: 'rotate(15deg)',
              borderRadius: '50% 50% 30% 70% / 60% 40% 60% 40%', 
            }}
          ></div>
        </div>

        {/* Original content of commission section, wrapped to ensure it's above background */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-12">
            <RevealOnScroll>
              <span className="bg-indrive-light text-indrive-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-2">
                Compare and Save
              </span>
              <h2 className="section-title">
                Earn <span className="text-indrive-primary">More</span> With inDrive
              </h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                See how much more you can earn with inDrive's lower commission rate compared to other ride-hailing services.
              </p>
            </RevealOnScroll>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <RevealOnScroll direction="left" delay={100}>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="bg-indrive-primary text-white p-4">
                  <h3 className="text-2xl font-bold">Commission Comparison</h3>
                  <p>For a R100 ride fare</p>
                </div>
                
                <div className="p-6">
                  <div className="mb-8">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">inDrive</span>
                      <span className="font-bold text-indrive-primary">9.9%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div className="bg-indrive-primary h-4 rounded-full" style={{ width: '9.9%' }}></div>
                    </div>
                    <div className="text-right mt-1 text-sm text-gray-600">You keep R90.10</div>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Other App A</span>
                      <span className="font-bold text-red-500">20%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div className="bg-red-500 h-4 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    <div className="text-right mt-1 text-sm text-gray-600">You keep R80.00</div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Other App B</span>
                      <span className="font-bold text-red-500">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div className="bg-red-500 h-4 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <div className="text-right mt-1 text-sm text-gray-600">You keep R75.00</div>
                  </div>
                </div>
                
                <div className="bg-indrive-light p-4 border-t border-gray-200">
                  <p className="font-medium">
                    Earn up to <span className="text-indrive-primary font-bold">20% more</span> with inDrive!
                  </p>
                </div>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll direction="right" delay={200}>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Why Our Drivers Earn More</h3>
                
                <div className="flex items-start gap-4">
                  <div className="bg-indrive-light p-2 rounded-full text-indrive-primary">
                    <Check size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Lower Service Fee</h4>
                    <p className="text-gray-600">Our 9.9% commission is less than half of what other services charge, putting more money in your pocket.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-indrive-light p-2 rounded-full text-indrive-primary">
                    <Check size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Set Your Own Prices</h4>
                    <p className="text-gray-600">Negotiate directly with passengers to set fares that work for you, especially during high-demand times.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-indrive-light p-2 rounded-full text-indrive-primary">
                    <Check size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Choose Profitable Rides</h4>
                    <p className="text-gray-600">Skip unprofitable trips and only accept rides that make financial sense for you.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-indrive-light p-2 rounded-full text-indrive-primary">
                    <Check size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">No Hidden Fees</h4>
                    <p className="text-gray-600">What you see is what you get – no surprising deductions or hidden charges.</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button 
                    onClick={handleAffiliateClick}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <DollarSign size={20} />
                    Start Earning More Today
                  </button>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
      
      {/* Topup Section */}
      <section id="topup" className="relative overflow-hidden py-20 bg-gradient-to-br from-white to-indrive-light">
        {/* Decorative background elements */}
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-indrive-primary rounded-full opacity-10"></div>
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indrive-primary rounded-full opacity-5"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <RevealOnScroll>
            <span className="bg-indrive-primary/10 text-indrive-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-2">
              Account Balance
            </span>
            <h2 className="section-title">
              Top Up Your Account & Keep <span className="text-indrive-primary">Driving</span>
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Ensure your inDrive account always has a sufficient balance to cover our low 9.9% service fee on completed rides. Topping up is quick and easy, allowing you to seamlessly continue accepting rides and maximizing your earnings without interruption. Click the button below to learn more and top up your account.
            </p>
            <div className="mt-8">
              <a
                href="https://indrivetopup.my.canva.site/topup"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <DollarSign size={20} />
                Top Up Now
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Help Center Section */}
      <HelpCenter affiliateLink={affiliateLink} />
      
      {/* Call to Action */}
      <section id="join" className="py-20 bg-gradient-to-br from-indrive-primary to-indrive-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3">
              <RevealOnScroll direction="left">
                <span className="bg-white/10 text-white px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                  Join Today
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  Ready to take control of your driving career?
                </h2>
                <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl">
                  Join the thousands of drivers who have switched to inDrive and are enjoying more freedom, higher earnings, and better working conditions.
                </p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Check size={18} />
                    </div>
                    <span>Lower 9.9% commission</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Check size={18} />
                    </div>
                    <span>Set your own prices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Check size={18} />
                    </div>
                    <span>Choose your rides</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Check size={18} />
                    </div>
                    <span>24/7 support</span>
                  </div>
                </div>
                
                <button
                  onClick={handleAffiliateClick}
                  className="bg-white text-indrive-primary hover:bg-gray-100 font-medium py-3 px-8 rounded-full transition-all shadow-md hover:shadow-lg text-lg"
                >
                  Register as a Driver Now
                </button>
              </RevealOnScroll>
            </div>
            
            <div className="lg:col-span-2">
              <RevealOnScroll direction="right" delay={200}>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4">Driver Requirements:</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 p-1.5 rounded-full mt-0.5">
                        <Check size={16} />
                      </div>
                      <div>
                        <p className="font-medium">Vehicle model 2011 or newer</p>
                        <p className="text-white/70 text-sm">Sedan, Hatchback or SUV in good condition</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 p-1.5 rounded-full mt-0.5">
                        <Check size={16} />
                      </div>
                      <div>
                        <p className="font-medium">Valid driver's license with PDP</p>
                        <p className="text-white/70 text-sm">Temporary license accepted with Professional Driving Permit</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 p-1.5 rounded-full mt-0.5">
                        <Check size={16} />
                      </div>
                      <div>
                        <p className="font-medium">Vehicle documentation</p>
                        <p className="text-white/70 text-sm">Current registration and license disk</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 p-1.5 rounded-full mt-0.5">
                        <Check size={16} />
                      </div>
                      <div>
                        <p className="font-medium">Profile photo</p>
                        <p className="text-white/70 text-sm">Clear photo of yourself for your driver profile</p>
                      </div>
                    </li>
                  </ul>
                  
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="mb-4 font-medium">Have questions? Contact us:</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={16} />
                      <span>+27 81 546 8283</span>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* InDrive Game Section */}
      {/*
      <section id="indrive-game" className="relative overflow-hidden py-10 sm:py-16 bg-[#FAF7F0]">
        //Lime Green Scribble Background Elements
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          // These are abstract shapes to mimic the lime green background. Adjust rotation, position, scale, and opacity as needed.
          <div 
            className="absolute bg-[#92C83E] opacity-80"
            style={{
              width: '150%',
              height: '100%',
              top: '-20%',
              left: '-50%',
              transform: 'rotate(-25deg)',
              borderRadius: '30% 70% 60% 40% / 40% 30% 70% 60%', // Creates an irregular blob shape
            }}
          ></div>
          <div
            className="absolute bg-[#92C83E] opacity-60"
            style={{
              width: '120%',
              height: '80%',
              bottom: '-30%',
              right: '-40%',
              transform: 'rotate(15deg)',
              borderRadius: '50% 50% 30% 70% / 60% 40% 60% 40%', // Another irregular blob shape
            }}
          ></div>
        </div>

        //Ensure content is above the background shapes
        <div className="relative z-10 container mx-auto px-4">
          <RevealOnScroll>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-10">
              Take a Break & <span className="text-indrive-primary">Play Our Game!</span>
            </h2>
          </RevealOnScroll>

          //Three-column layout for game, guide, and scores
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            //Column 1: How to Play
            <RevealOnScroll direction="left" className="lg:col-span-1">
              <HowToPlayGuide />
            </RevealOnScroll>

            //Column 2: Phone Mockup (Game) - Centered
            <RevealOnScroll className="lg:col-span-1 flex justify-center">
              <div className="w-[300px] h-[600px] bg-gray-800 rounded-[40px] shadow-2xl overflow-hidden border-[10px] border-gray-800 relative mx-auto flex flex-col box-content">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-5 bg-gray-800 rounded-b-lg z-10"></div>
                <div className="w-full h-full bg-white flex flex-col overflow-hidden">
                  <InDriveGame onGameEndReport={handleSaveNamedScore} />
                </div>
              </div>
            </RevealOnScroll>

            //Column 3: High Scores
            <RevealOnScroll direction="right" className="lg:col-span-1">
              {isLoadingScores && <p>Loading scores...</p>}
              {errorLoadingScores && <p>Error: {errorLoadingScores}</p>}
              {!isLoadingScores && !errorLoadingScores && <HighScoresTable scores={highScores} />}
            </RevealOnScroll>
          </div>
        </div>
      </section>
      */}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <a href="/" className="font-bold text-2xl text-white hover:text-gray-300 transition-colors">
                  in<span className="text-indrive-primary">Drive</span>
                </a>
              </div>
              <p className="mb-4">Join a fair journey with the ride-hailing app that puts drivers first.</p>
              <div className="flex space-x-3">
                <a href="https://www.facebook.com/indrive.southafrica" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/indrive.za/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.045-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://x.com/inDrive" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  <span className="sr-only">X (formerly Twitter)</span>
                  <svg className="h-5 w-5" style={{ transform: 'scale(0.95)', transformOrigin: 'center' }} viewBox="0 0 1200 1227" xmlns="http://www.w3.org/2000/svg">
                    <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Download App</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://indriver.onelink.me/X6vF/1hk3t9ct" target="_blank" rel="noopener noreferrer" className="hover:text-white">Google Play</a>
                </li>
                <li>
                  <a href="https://indriver.onelink.me/X6vF/1hk3t9ct" target="_blank" rel="noopener noreferrer" className="hover:text-white">App Store</a>
                </li>
                <li>
                  <a href="https://indriver.onelink.me/X6vF/1hk3t9ct" target="_blank" rel="noopener noreferrer" className="hover:text-white">AppGallery</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Chat With Us for Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') { window.Tawk_API.maximize(); } else { console.error('Tawk_API not available or maximize function is missing.'); } }} className="hover:text-white">Driver FAQ</a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') { window.Tawk_API.maximize(); } else { console.error('Tawk_API not available or maximize function is missing.'); } }} className="hover:text-white">Help Center</a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') { window.Tawk_API.maximize(); } else { console.error('Tawk_API not available or maximize function is missing.'); } }} className="hover:text-white">Safety Center</a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') { window.Tawk_API.maximize(); } else { console.error('Tawk_API not available or maximize function is missing.'); } }} className="hover:text-white">About inDrive</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Chat With Us for Services</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') { window.Tawk_API.maximize(); } else { console.error('Tawk_API not available or maximize function is missing.'); } }} className="hover:text-white">City Rides</a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') { window.Tawk_API.maximize(); } else { console.error('Tawk_API not available or maximize function is missing.'); } }} className="hover:text-white">City to City</a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') { window.Tawk_API.maximize(); } else { console.error('Tawk_API not available or maximize function is missing.'); } }} className="hover:text-white">Cargo Delivery</a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') { window.Tawk_API.maximize(); } else { console.error('Tawk_API not available or maximize function is missing.'); } }} className="hover:text-white">Courier Services</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © 2025 inDrive. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="https://indriver.com/mobile/page/privacyPolicy/en" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white">Privacy Policy</a>
              <a href="https://indriver.com/mobile/page/offer_RH/ru/bw" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white">Terms of Service</a>
              <a href="https://indriver.com/mobile/page/Cookie_Policy/en" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white">Cookies Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
