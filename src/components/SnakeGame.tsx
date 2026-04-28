import { useEffect, useRef, useState, useCallback } from 'react';

const GRID_SIZE = 20;
const SPEED = 120; // ms per tick

type Point = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const dRef = useRef(direction);

  const spawnFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    dRef.current = { x: 1, y: 0 };
    setFood(spawnFood([{ x: 10, y: 10 }]));
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && !isGameOver) {
        setIsPaused(p => !p);
        return;
      }

      const { x, y } = dRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y === 0) { setDirection({ x: 0, y: -1 }); dRef.current = { x: 0, y: -1 }; }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y === 0) { setDirection({ x: 0, y: 1 }); dRef.current = { x: 0, y: 1 }; }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x === 0) { setDirection({ x: -1, y: 0 }); dRef.current = { x: -1, y: 0 }; }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x === 0) { setDirection({ x: 1, y: 0 }); dRef.current = { x: 1, y: 0 }; }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prev => {
        const head = prev[0];
        const newHead = { x: head.x + dRef.current.x, y: head.y + dRef.current.y };

        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prev;
        }

        if (prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          setIsGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, SPEED);
    return () => clearInterval(intervalId);
  }, [food, isGameOver, isPaused, spawnFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cellW = w / GRID_SIZE;
    const cellH = h / GRID_SIZE;

    ctx.clearRect(0, 0, w, h);

    // Grid backdrop
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellW, 0);
      ctx.lineTo(i * cellW, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellH);
      ctx.lineTo(w, i * cellH);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((seg, index) => {
      ctx.fillStyle = index === 0 ? '#fff' : '#00ffff';
      ctx.shadowBlur = index === 0 ? 15 : 10;
      ctx.shadowColor = '#00ffff';
      ctx.fillRect(seg.x * cellW + 1, seg.y * cellH + 1, cellW - 2, cellH - 2);
    });

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(food.x * cellW + cellW/2, food.y * cellH + cellH/2, cellW/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="flex-grow relative glass rounded-3xl border-neon game-grid overflow-hidden flex items-center justify-center w-full h-full flex-col">
      <div className="absolute top-4 left-6 flex gap-4 z-10">
        <div className='px-3 py-1 rounded bg-black/50 border border-cyan-500/30 text-[10px] uppercase font-bold text-cyan-400 tracking-widest'>
          Score: <span className="neon-cyan">{score.toString().padStart(6, '0')}</span>
        </div>
        {isPaused && !isGameOver && (
          <div className='px-3 py-1 rounded bg-black/50 border border-magenta-500/30 text-[10px] uppercase font-bold neon-magenta tracking-widest'>
            PAUSED
          </div>
        )}
      </div>
      
      <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center pt-8">
        <canvas 
          ref={canvasRef}
          width={400}
          height={400}
          className="block rounded-sm w-[90%] h-auto aspect-square z-10"
        />
        
        {isGameOver && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md rounded-2xl mx-4 my-8">
            <h2 className="text-4xl font-bold neon-magenta mb-2 tracking-widest uppercase">SYS_FAIL</h2>
            <p className="neon-cyan mb-8 font-mono text-lg">FINAL SCORE [{score}]</p>
            <button 
              onClick={resetGame}
              className="px-8 py-3 border border-cyan-500 neon-cyan hover:bg-cyan-500 hover:text-black transition-all font-mono font-bold tracking-widest shadow-[0_0_15px_rgba(0,243,255,0.5)] hover:shadow-[0_0_25px_rgba(0,243,255,1)] uppercase bg-cyan-500/10"
            >
              Restart
            </button>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-6 text-center w-full px-12">
        <p className='text-[11px] opacity-30 uppercase tracking-[0.4em]'>[ W A S D ] Navigate • [ SPACE ] PAUSE</p>
      </div>
    </div>
  );
}
