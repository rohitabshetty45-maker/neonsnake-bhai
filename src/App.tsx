import { Gamepad2 } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] w-full p-6 gap-6 bg-[#050505] text-[#e0e0e0] font-sans overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-magenta-500/5 rounded-full blur-[120px] pointer-events-none" />

      <aside className="w-full lg:w-72 flex flex-col gap-4 flex-shrink-0 z-10 relative">
        <header className="glass p-5 rounded-2xl border-neon h-fit">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-black tracking-tighter neon-cyan uppercase">
              NEONSNAKE
            </h1>
          </div>
          <p className="text-[10px] uppercase tracking-widest opacity-50 mb-2">
            v1.0.0_BETA • OS_READY
          </p>
        </header>

        {/* Media Control Deck Area */}
        <MusicPlayer />
      </aside>

      <main className="flex-grow flex flex-col gap-4 relative min-w-0 z-10">
        {/* Game Area */}
        <SnakeGame />
      </main>
    </div>
  );
}
