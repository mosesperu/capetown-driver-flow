import React, { useState, useEffect, useRef, useCallback } from 'react';

interface GameState {
  score: number;
  passengers: number;
  isGameOver: boolean;
  playerPosition: number;
  gameSpeed: number;
}

interface GameObject {
  element: HTMLDivElement;
  x: number;
  y: number;
  id: number;
}

interface InDriveGameProps {
  onGameEndReport: (name: string, score: number) => void;
}

// Path relative to the 'public' folder
const PLAYER_CAR_IMAGE_PATH = '/assets/images/player_car.png';
const PLAYER_CAR_WIDTH = 50; // Example width, adjust to your image
const PLAYER_CAR_HEIGHT = 70; // Example height, adjust to your image

// Paths relative to the 'public' folder
const enemyTypes = [
  { src: '/assets/images/police_car.png', width: 50, height: 70 },
  { src: '/assets/images/taxi.png', width: 50, height: 70 },
  { src: '/assets/images/truck.png', width: 60, height: 90 },
  { src: '/assets/images/bus.png', width: 65, height: 100 },
  { src: '/assets/images/ambulance.png', width: 55, height: 75 },
  { src: '/assets/images/regular_car_1.png', width: 50, height: 70 },
  { src: '/assets/images/regular_car_2.png', width: 50, height: 70 },
  { src: '/assets/images/motorcycle.png', width: 40, height: 60 }, // If you have one
];

const InDriveGame: React.FC<InDriveGameProps> = (props) => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    passengers: 0,
    isGameOver: false,
    playerPosition: 50,
    gameSpeed: 1
  });

  const [statusMessage, setStatusMessage] = useState('Pick up passengers! Avoid traffic!');
  const [statusColor, setStatusColor] = useState('rgba(0,0,0,0.7)');
  const [showGameOver, setShowGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');

  const roadRef = useRef<HTMLDivElement>(null);
  const playerCarRef = useRef<HTMLDivElement>(null);
  const enemiesRef = useRef<GameObject[]>([]);
  const passengersRef = useRef<GameObject[]>([]);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const spawnTimersRef = useRef<NodeJS.Timeout[]>([]);
  const nextIdRef = useRef(0);

  const lanes = [20, 50, 80];

  const movePlayer = useCallback((direction: number) => {
    if (gameState.isGameOver) return;

    setGameState(prev => {
      let currentLaneIndex = lanes.findIndex(lane => Math.abs(lane - prev.playerPosition) < 10);
      
      if (currentLaneIndex === -1) {
        currentLaneIndex = lanes.reduce((closest, lane, index) => {
          return Math.abs(lane - prev.playerPosition) < Math.abs(lanes[closest] - prev.playerPosition) ? index : closest;
        }, 0);
      }
      
      if (direction === -1 && currentLaneIndex > 0) {
        currentLaneIndex--;
      } else if (direction === 1 && currentLaneIndex < lanes.length - 1) {
        currentLaneIndex++;
      }
      
      return { ...prev, playerPosition: lanes[currentLaneIndex] };
    });
  }, [gameState.isGameOver]);

  const createRoadLine = useCallback(() => {
    if (!roadRef.current || gameState.isGameOver) return;

    const line = document.createElement('div');
    line.className = 'road-lines';
    line.style.cssText = `
      position: absolute;
      width: 4px;
      height: 40px;
      background: #f1c40f;
      left: 50%;
      transform: translateX(-50%);
      animation: moveDown ${2 / gameState.gameSpeed}s linear infinite;
    `;
    roadRef.current.appendChild(line);

    setTimeout(() => {
      if (line.parentNode) line.remove();
    }, 2000 / gameState.gameSpeed);
  }, [gameState.isGameOver, gameState.gameSpeed]);

  const createEnemy = useCallback(() => {
    if (!roadRef.current || gameState.isGameOver) return;

    const selectedType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    
    const enemyWrapper = document.createElement('div');
    const lanePosition = lanes[Math.floor(Math.random() * lanes.length)];
    enemyWrapper.className = 'enemy-car'; // Used for animation in <style jsx>
    
    enemyWrapper.style.cssText = `
      width: ${selectedType.width}px;
      height: ${selectedType.height}px;
      position: absolute;
      left: ${lanePosition}%;
      transform: translateX(-50%);
      animation: enemyMove ${2.5 / gameState.gameSpeed}s linear infinite;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const enemyImg = document.createElement('img');
    enemyImg.src = selectedType.src;
    enemyImg.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain; /* or 'cover', depending on your images */
    `;
    enemyWrapper.appendChild(enemyImg);

    roadRef.current.appendChild(enemyWrapper);

    const enemyData: GameObject = {
      element: enemyWrapper,
      x: lanePosition,
      y: -selectedType.height, // Start off-screen based on its height
      id: nextIdRef.current++
    };
    enemiesRef.current.push(enemyData);

    setTimeout(() => {
      if (enemyWrapper.parentNode) enemyWrapper.remove();
      enemiesRef.current = enemiesRef.current.filter(e => e.element !== enemyWrapper);
    }, 2500 / gameState.gameSpeed);
  }, [gameState.isGameOver, gameState.gameSpeed]);

  const createPassenger = useCallback(() => {
    if (!roadRef.current || gameState.isGameOver) return;

    const passenger = document.createElement('div');
    const passengerLanes = [25, 50, 75];
    const lanePosition = passengerLanes[Math.floor(Math.random() * passengerLanes.length)];
    passenger.className = 'passenger';
    passenger.style.cssText = `
      width: 30px;
      height: 30px;
      background: #2ecc71;
      position: absolute;
      border-radius: 50%;
      left: ${lanePosition}%;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      animation: passengerMove ${3 / gameState.gameSpeed}s linear infinite;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    `;
    passenger.textContent = '👤';

    roadRef.current.appendChild(passenger);

    const passengerData: GameObject = {
      element: passenger,
      x: lanePosition,
      y: -30,
      id: nextIdRef.current++
    };
    passengersRef.current.push(passengerData);

    setTimeout(() => {
      if (passenger.parentNode) passenger.remove();
      passengersRef.current = passengersRef.current.filter(p => p.element !== passenger);
    }, 3000 / gameState.gameSpeed);
  }, [gameState.isGameOver, gameState.gameSpeed]);

  const collectPassenger = useCallback((passenger: GameObject, index: number) => {
    if (passenger.element.parentNode) {
      passenger.element.remove();
    }
    passengersRef.current.splice(index, 1);
    
    setGameState(prev => ({
      ...prev,
      passengers: prev.passengers + 1,
      score: prev.score + 100,
      gameSpeed: prev.gameSpeed + 0.05
    }));

    setStatusMessage(`Passenger picked up! Total: ${gameState.passengers + 1}`);
    setStatusColor('rgba(46, 204, 113, 0.8)');

    setTimeout(() => {
      if (!gameState.isGameOver) {
        setStatusMessage('Pick up passengers! Avoid traffic!');
        setStatusColor('rgba(0,0,0,0.7)');
      }
    }, 1500);
  }, [gameState.passengers, gameState.isGameOver]);

  const gameOver = useCallback(() => {
    setGameState(prev => ({ ...prev, isGameOver: true }));
    setShowGameOver(true);
    setStatusMessage('Game Over!');
  }, []);

  const checkCollisions = useCallback(() => {
    if (!playerCarRef.current) return;

    const playerRect = playerCarRef.current.getBoundingClientRect();

    // Check enemy collisions
    enemiesRef.current.forEach((enemy, index) => {
      if (!enemy.element.parentNode) {
        enemiesRef.current.splice(index, 1);
        return;
      }
      
      const enemyRect = enemy.element.getBoundingClientRect();
      
      if (playerRect.left < enemyRect.right &&
          playerRect.right > enemyRect.left &&
          playerRect.top < enemyRect.bottom &&
          playerRect.bottom > enemyRect.top) {
        gameOver();
      }
    });

    // Check passenger pickups
    passengersRef.current.forEach((passenger, index) => {
      if (!passenger.element.parentNode) {
        passengersRef.current.splice(index, 1);
        return;
      }
      
      const passengerRect = passenger.element.getBoundingClientRect();
      
      if (playerRect.left < passengerRect.right &&
          playerRect.right > passengerRect.left &&
          playerRect.top < passengerRect.bottom &&
          playerRect.bottom > passengerRect.top) {
        collectPassenger(passenger, index);
      }
    });
  }, [gameOver, collectPassenger]);

  const restartGame = useCallback(() => {
    // Clear all timers
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    spawnTimersRef.current.forEach(timer => clearInterval(timer));
    spawnTimersRef.current = [];

    // Clear game objects
    enemiesRef.current = [];
    passengersRef.current = [];

    // Clear DOM elements
    if (roadRef.current) {
      const elements = roadRef.current.querySelectorAll('.enemy-car, .passenger, .road-lines');
      elements.forEach(el => el.remove());
    }

    // Reset game state
    setGameState({
      score: 0,
      passengers: 0,
      isGameOver: false,
      playerPosition: 50,
      gameSpeed: 1
    });

    setShowGameOver(false);
    setPlayerName(''); // Reset player name
    setStatusMessage('Pick up passengers! Avoid traffic!');
    setStatusColor('rgba(0,0,0,0.7)');
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameState.isGameOver) {
      gameLoopRef.current = setInterval(() => {
        checkCollisions();
        setGameState(prev => ({ ...prev, score: prev.score + 1 }));
      }, 100);
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState.isGameOver, checkCollisions]);

  // Spawn timers
  useEffect(() => {
    if (!gameState.isGameOver) {
      const roadLineTimer = setInterval(createRoadLine, 500);
      const enemyTimer = setInterval(() => {
        if (Math.random() < 0.4) createEnemy();
      }, 1800);
      const passengerTimer = setInterval(() => {
        if (Math.random() < 0.6) createPassenger();
      }, 2500);

      spawnTimersRef.current = [roadLineTimer, enemyTimer, passengerTimer];
    }

    return () => {
      spawnTimersRef.current.forEach(timer => clearInterval(timer));
      spawnTimersRef.current = [];
    };
  }, [gameState.isGameOver, createRoadLine, createEnemy, createPassenger]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') movePlayer(-1);
      if (e.key === 'ArrowRight') movePlayer(1);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  const handleTouchStart = (direction: number) => (e: React.TouchEvent) => {
    e.preventDefault();
    movePlayer(direction);
  };

  return (
    <div className="w-full max-w-md h-screen max-h-[700px] bg-gray-100 rounded-3xl overflow-hidden relative shadow-2xl mx-auto">
      {/* Header */}
      <div className="bg-[#92C83E] p-4 text-white flex justify-between items-center">
        <div className="text-2xl font-bold">inDrive</div>
        <div className="text-lg font-bold">Score: {gameState.score}</div>
      </div>

      {/* Game Area */}
      <div className="w-full h-[calc(100%-140px)] bg-slate-700 relative overflow-hidden">
        <div ref={roadRef} className="w-full h-full bg-slate-600 relative">
          {/* Player Car */}
          <div
            ref={playerCarRef}
            className="absolute bottom-20 transition-all duration-200 ease-out flex items-center justify-center"
            style={{
              left: `${gameState.playerPosition}%`,
              transform: 'translateX(-50%)',
              width: `${PLAYER_CAR_WIDTH}px`,
              height: `${PLAYER_CAR_HEIGHT}px`,
            }}
          >
            <img 
              src={PLAYER_CAR_IMAGE_PATH} 
              alt="Player Car"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>
        </div>

        {/* Status Message */}
        <div
          className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white px-5 py-2 rounded-full text-sm font-medium"
          style={{ backgroundColor: statusColor }}
        >
          {statusMessage}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 w-full h-20 bg-black bg-opacity-80 flex justify-around items-center">
        <button
          className="w-15 h-15 bg-[#92C83E] border-none rounded-full text-white text-2xl font-bold cursor-pointer transition-all duration-200 active:bg-[#7cb32b] active:scale-95"
          onTouchStart={handleTouchStart(-1)}
          onClick={() => movePlayer(-1)}
        >
          ←
        </button>
        <button
          className="w-15 h-15 bg-[#92C83E] border-none rounded-full text-white text-2xl font-bold cursor-pointer transition-all duration-200 active:bg-[#7cb32b] active:scale-95"
          onTouchStart={handleTouchStart(1)}
          onClick={() => movePlayer(1)}
        >
          →
        </button>
      </div>

      {/* Game Over Modal */}
      {showGameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-90 text-white p-6 sm:p-8 rounded-2xl text-center w-11/12 max-w-sm">
          <h2 className="mb-4 text-2xl sm:text-3xl font-bold">Game Over!</h2>
          <p className="mb-1 text-sm sm:text-base">Final Score: {Math.floor(gameState.score)}</p>
          <p className="mb-4 text-sm sm:text-base">Passengers: {gameState.passengers}</p>
          
          <input 
            type="text"
            placeholder="Enter Your Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-3 py-2 mb-3 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm sm:text-base"
          />
          
          <button
            className="w-full bg-green-500 text-white border-none py-2.5 sm:py-3 px-4 rounded-full text-sm sm:text-base font-semibold cursor-pointer transition-colors duration-300 hover:bg-green-600 mb-2"
            onClick={() => {
              if (playerName.trim() !== '') {
                props.onGameEndReport(playerName.trim(), Math.floor(gameState.score));
              }
              // still allow restart even if name is blank, or if they just want to save and restart
              restartGame(); 
            }}
          >
            Save Score & Restart
          </button>
          <button
            className="w-full bg-red-500 text-white border-none py-2.5 sm:py-3 px-4 rounded-full text-sm sm:text-base font-semibold cursor-pointer transition-colors duration-300 hover:bg-red-600"
            onClick={restartGame} // Just restarts without saving
          >
            Restart without Saving
          </button>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes moveDown {
          from { top: -40px; }
          to { top: 100%; }
        }
        
        @keyframes enemyMove {
          from { top: -60px; }
          to { top: 100%; }
        }
        
        @keyframes passengerMove {
          from { top: -30px; }
          to { top: 100%; }
        }
        
        .road-lines {
          animation: moveDown 2s linear infinite;
        }
        
        .enemy-car {
          animation: enemyMove 2.5s linear infinite;
        }
        
        .passenger {
          animation: passengerMove 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default InDriveGame;
