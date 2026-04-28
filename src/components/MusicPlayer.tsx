import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Disc, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    title: 'Neon Drift',
    artist: 'AI Synth (Dummy)',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    title: 'Digital Horizon',
    artist: 'AI Synth (Dummy)',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    title: 'Quantum Resonance',
    artist: 'AI Synth (Dummy)',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Autoplay prevented:', e));
    }
  }, [currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="glass p-5 rounded-2xl border-neon flex-grow flex flex-col justify-between w-full relative">

      <h2 className="neon-cyan font-bold tracking-widest text-sm mb-6 flex items-center gap-2 border-b border-white/10 pb-2 z-10">
        <Activity className="w-4 h-4" />
        SYSTEM_AUDIO
      </h2>

      <div className="z-10 flex flex-col items-center mb-6">
        <motion.div 
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 rounded-full border border-neon flex items-center justify-center mb-4 neon-magenta bg-white/5 relative"
        >
          <div className="absolute inset-0 rounded-full border-t-2 border-magenta-400 rotate-45 opacity-50 blur-[2px]"></div>
          <Disc className="w-12 h-12" />
        </motion.div>

        <div className="text-center w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="min-w-0"
            >
              <h3 className="neon-cyan font-bold truncate text-lg">
                {TRACKS[currentTrack].title}
              </h3>
              <p className="opacity-60 text-xs mt-1 truncate uppercase tracking-widest">
                {TRACKS[currentTrack].artist}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="z-10 w-full mb-6 relative">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden w-full relative">
          <div 
            className="h-full bg-cyan-500 transition-all duration-100 shadow-[0_0_10px_#06b6d4] absolute top-0 left-0"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="z-10 flex items-center justify-center gap-6 mb-4">
        <button onClick={skipBack} className="opacity-50 hover:opacity-100 transition-opacity">
          <SkipBack className="w-6 h-6 fill-current" />
        </button>
        
        <button 
          onClick={togglePlay} 
          className="w-12 h-12 rounded-full border border-cyan-500 flex items-center justify-center hover:bg-cyan-500/20 transition-all neon-cyan bg-cyan-500/10"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
        </button>
        
        <button onClick={skipForward} className="opacity-50 hover:opacity-100 transition-opacity">
          <SkipForward className="w-6 h-6 fill-current" />
        </button>
      </div>

      <div className="z-10 flex items-center gap-3 w-full border-t border-white/10 pt-4 mt-2">
        <Volume2 className="w-4 h-4 opacity-50" />
        <input 
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full accent-cyan-500 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer outline-none"
        />
      </div>

      <audio 
        ref={audioRef} 
        src={TRACKS[currentTrack].url} 
        onEnded={skipForward}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
}
