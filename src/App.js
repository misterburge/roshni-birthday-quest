import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Shield, Trophy, Key, Heart, Star, Flame, Lock, Unlock, 
  Volume2, VolumeX, RefreshCw, Wand2, Play, Award, Gem, Cat, Zap, ChevronRight, Gift, Video, Skull, Ghost, Compass, ArrowUp, ArrowDown, ArrowLeft, ArrowRight
} from 'lucide-react';

// Synthesizer for rich audio effects without external assets
class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }
  playTone(freq, type, duration, vol = 0.1) {
    if (this.muted) return;
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio fallback
    }
  }
  click() { this.playTone(600, 'sine', 0.08, 0.1); }
  orb() { 
    this.playTone(523, 'triangle', 0.1, 0.15);
    setTimeout(() => this.playTone(659, 'triangle', 0.1, 0.15), 80);
    setTimeout(() => this.playTone(783, 'triangle', 0.2, 0.2), 160);
  }
  win() {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.3, 0.2), idx * 120);
    });
  }
  hit() { this.playTone(150, 'sawtooth', 0.15, 0.2); }
  blow() { this.playTone(200, 'sine', 0.5, 0.3); }
}

const audio = new SoundFX();

const StoneBrickPattern = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="brick-pattern" width="80" height="40" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="78" height="18" fill="#2d221c" rx="1" stroke="#120c0a" strokeWidth="2" />
        <rect x="0" y="20" width="38" height="18" fill="#261d18" rx="1" stroke="#120c0a" strokeWidth="2" />
        <rect x="40" y="20" width="38" height="18" fill="#31251e" rx="1" stroke="#120c0a" strokeWidth="2" />
        <circle cx="15" cy="8" r="1" fill="#4a3b32" opacity="0.5" />
        <circle cx="55" cy="12" r="1.5" fill="#120c0a" opacity="0.6" />
        <circle cx="20" cy="28" r="1" fill="#4a3b32" opacity="0.4" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#brick-pattern)" />
  </svg>
);

const ChibiRoshni = ({ className = "" }) => (
  <div className={`relative inline-block overflow-hidden rounded-2xl border-2 border-amber-500/60 shadow-[0_0_20px_rgba(234,179,8,0.4)] ${className}`}>
    <img 
      src="image_af98fe.jpg" 
      alt="Roshni Chibi Avatar" 
      className="w-full h-full object-cover"
    />
  </div>
);

const MrBurgeNPC = ({ text }) => (
  <div className="flex items-end gap-3 z-20">
    <div className="relative animate-bounce">
      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-900 to-indigo-600 border-2 border-yellow-400 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.6)]">
        <span className="text-3xl">🧙‍♂</span>
      </div>
      <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded border border-black">
        NPC
      </div>
    </div>
    <div className="relative max-w-xs bg-slate-900/90 border-2 border-yellow-500/80 p-3 rounded-xl shadow-2xl backdrop-blur text-yellow-100 text-xs sm:text-sm font-serif">
      <div className="font-bold text-yellow-400 text-xs mb-1 flex items-center justify-between">
        <span>Supreme Mr. Burge</span>
        <span className="text-[10px] text-purple-300 font-sans">Guide</span>
      </div>
      <p className="leading-snug">"{text}"</p>
      <div className="absolute left-[-8px] bottom-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-yellow-500 border-b-8 border-b-transparent"></div>
    </div>
  </div>
);

export default function App() {
  const [gameState, setGameState] = useState('AVATAR_SELECT'); 
  const [activeDoor, setActiveDoor] = useState(null);
  const [collectedOrbs, setCollectedOrbs] = useState(new Array(9).fill(false));
  const [devMode, setDevMode] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [guideDialog, setGuideDialog] = useState("Greetings Alien Roshni! Conquer all 9 trials across 958 km to unlock Door 10!");

  const toggleDevMode = () => {
    audio.click();
    if (!devMode) {
      setDevMode(true);
      setCollectedOrbs(new Array(9).fill(true));
      setGuideDialog("⚡ Dev Mode Activated! All 9 magical orbs acquired. Door 10 is unlocked!");
    } else {
      setDevMode(false);
      setCollectedOrbs(new Array(9).fill(false));
      setGuideDialog("Dev Mode OFF. Prove your worth in the stone chambers, Alien!");
    }
  };

  const orbCount = collectedOrbs.filter(Boolean).length;

  const markDoorCompleted = (doorIndex) => {
    audio.orb();
    setCollectedOrbs(prev => {
      const next = [...prev];
      next[doorIndex] = true;
      return next;
    });
    setGameState('LOBBY');
    setActiveDoor(null);
    setGuideDialog(`Splendid work Alien! You secured Orb #${doorIndex + 1}! Only ${9 - (orbCount + 1)} more needed!`);
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-black font-sans text-white select-none relative">
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-amber-900/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-amber-950/60 border border-amber-600/50 px-3 py-1 rounded-full">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-serif text-amber-200 tracking-wider font-bold">ROSHNI'S 16TH QUEST</span>
          </div>
          <div className="flex items-center gap-1.5 bg-purple-950/60 border border-purple-500/40 px-3 py-1 rounded-full text-xs">
            <Gem className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-purple-200 font-mono font-bold">{orbCount} / 9 Orbs</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleDevMode}
            className={`text-xs px-3 py-1 rounded-full font-bold transition flex items-center gap-1 border ${
              devMode 
                ? 'bg-amber-500 text-black border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                : 'bg-slate-800 text-slate-300 border-slate-600 hover:border-amber-500'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {devMode ? 'Dev Mode ON' : '⚡ Dev: Unlock All'}
          </button>

          <button 
            onClick={() => { audio.muted = !soundMuted; setSoundMuted(!soundMuted); }}
            className="p-1.5 bg-slate-800/80 rounded-full border border-slate-700 text-slate-300 hover:text-white"
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {gameState === 'AVATAR_SELECT' && (
        <div className="w-full h-full relative flex items-center justify-center pt-12 overflow-hidden bg-[#120d0a]">
          <StoneBrickPattern />
          <div className="absolute top-1/4 left-1/6 w-80 h-80 rounded-full bg-amber-600/25 blur-[100px] animate-pulse pointer-events-none" />
          <div className="absolute top-1/4 right-1/6 w-80 h-80 rounded-full bg-orange-600/25 blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

          <div className="relative z-10 max-w-md w-full mx-4 bg-slate-900/95 border-4 border-amber-600/70 rounded-2xl p-6 shadow-[0_0_60px_rgba(0,0,0,0.95)] backdrop-blur-md text-center">
            <div className="relative mb-4">
              <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 border-2 border-amber-400 py-2 px-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-serif font-black tracking-widest text-amber-100 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  CHOOSE YOUR HERO
                </h1>
              </div>
            </div>

            <div className="relative w-40 h-48 mx-auto mb-4 bg-slate-950 rounded-xl border-2 border-amber-500/50 p-2 flex items-center justify-center overflow-hidden shadow-inner group">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-purple-500/10" />
              <ChibiRoshni className="w-36 h-44 transition-transform group-hover:scale-105 duration-300" />
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 mb-5 text-left font-serif">
              <div className="text-lg font-bold text-amber-400 flex justify-between items-center border-b border-slate-800 pb-1 mb-2">
                <span>Roshni</span>
                <span className="text-xs text-purple-400 font-sans border border-purple-500/40 px-2 py-0.5 rounded">LVL 16</span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <p><span className="text-slate-500">Class:</span> Alien / Dungeon Explorer</p>
                <p><span className="text-slate-500">Special Ability:</span> Unlimited KitKat Boost</p>
                <p><span className="text-slate-500">Mission:</span> Collect 9 Orbs across 958 km</p>
              </div>
            </div>

            <button
              onClick={() => { audio.click(); setGameState('LOBBY'); }}
              className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-serif font-black text-xl rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.5)] transform hover:-translate-y-0.5 transition active:translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 fill-slate-950" />
              BEGIN QUEST
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {gameState === 'LOBBY' && (
        <div className="w-full h-full relative flex flex-col justify-between pt-14 pb-4 px-4 bg-[#0a0706] overflow-hidden">
          <StoneBrickPattern />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-transparent to-stone-950/80 pointer-events-none" />

          <div className="relative z-10 max-w-4xl w-full mx-auto h-full flex flex-col justify-between py-2">
            
            <div className="flex flex-col items-center justify-center relative my-2">
              <div className="text-center mb-1">
                <span className="text-[10px] font-serif uppercase tracking-widest text-amber-400/80 bg-slate-900/90 px-3 py-0.5 rounded-full border border-amber-500/40 shadow-md">
                  TOP PEAK TIER
                </span>
              </div>
              
              <button
                onClick={() => {
                  if (orbCount >= 9) {
                    audio.win();
                    setGameState('FINAL_ROOM');
                  } else {
                    audio.hit();
                    setGuideDialog("Door 10 is sealed by ancient magic! Collect all 9 Orbs first, Alien!");
                  }
                }}
                className={`relative group w-32 h-36 rounded-t-full border-4 transition-all duration-300 flex flex-col items-center justify-center p-2 shadow-2xl ${
                  orbCount >= 9
                    ? 'bg-gradient-to-t from-amber-900 via-amber-600 to-yellow-400 border-yellow-300 shadow-[0_0_35px_rgba(234,179,8,0.8)] animate-pulse cursor-pointer'
                    : 'bg-stone-900/95 border-amber-900/60 opacity-90'
                }`}
              >
                <div className="absolute top-2 text-xs font-bold font-serif text-amber-200">DOOR 10</div>
                {orbCount >= 9 ? (
                  <div className="text-center">
                    <Unlock className="w-10 h-10 text-yellow-200 mx-auto animate-bounce mb-1" />
                    <span className="text-[10px] font-black text-slate-950 bg-yellow-300 px-2 py-0.5 rounded uppercase">ENTER CHAMBER</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-amber-700 mx-auto mb-1" />
                    <span className="text-[10px] text-amber-500 font-mono">{orbCount}/9 ORBS</span>
                  </div>
                )}
              </button>
            </div>

            <div className="relative my-2 bg-stone-900/90 border-2 border-amber-800/60 py-3 px-4 rounded-xl backdrop-blur shadow-2xl">
              <div className="absolute -top-3 left-4 text-[10px] font-serif tracking-widest text-amber-300 bg-slate-950 px-2 border border-amber-800 rounded">
                MIDDLE BALCONY TIER
              </div>
              <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto">
                {[5, 6, 7, 8].map((index) => {
                  const doorNum = index + 1;
                  const isDone = collectedOrbs[index];
                  const labels = ["Iruma Quiz", "KitKat Smile", "AoT Exam", "Cozy Break"];
                  return (
                    <button
                      key={doorNum}
                      onClick={() => {
                        audio.click();
                        setActiveDoor(doorNum);
                        setGameState('GAME');
                      }}
                      className={`relative h-28 rounded-t-2xl border-2 flex flex-col items-center justify-between p-2 transition transform hover:-translate-y-1 shadow-lg ${
                        isDone
                          ? 'bg-gradient-to-b from-purple-900/90 to-slate-950 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                          : 'bg-stone-900 border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      <span className="text-xs font-bold font-serif text-amber-400">DOOR {doorNum}</span>
                      <div className="my-auto text-center">
                        {isDone ? (
                          <Gem className="w-6 h-6 text-purple-300 mx-auto animate-pulse" />
                        ) : (
                          <Flame className="w-5 h-5 text-amber-600 mx-auto opacity-60" />
                        )}
                        <span className="text-[10px] text-slate-300 block mt-1 leading-none">{labels[index - 5]}</span>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${isDone ? 'bg-purple-950 text-purple-300 border border-purple-500' : 'bg-slate-950 text-slate-400'}`}>
                        {isDone ? 'CLEARED' : 'UNCLEAR'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative my-2 bg-stone-950/95 border-2 border-stone-800 py-3 px-3 rounded-xl shadow-2xl">
              <div className="absolute -top-3 left-4 text-[10px] font-serif tracking-widest text-amber-300 bg-slate-950 px-2 border border-amber-800 rounded">
                LOWER GROUND TIER
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[0, 1, 2, 3, 4].map((index) => {
                  const doorNum = index + 1;
                  const isDone = collectedOrbs[index];
                  const labels = ["Air Hockey", "Roblox Trap", "Mysore Palace", "Pirate Ship", "Ender Dragon"];
                  return (
                    <button
                      key={doorNum}
                      onClick={() => {
                        audio.click();
                        setActiveDoor(doorNum);
                        setGameState('GAME');
                      }}
                      className={`relative h-26 rounded-t-xl border-2 flex flex-col items-center justify-between p-1.5 transition transform hover:-translate-y-1 shadow-md ${
                        isDone
                          ? 'bg-gradient-to-b from-purple-900/90 to-slate-950 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                          : 'bg-stone-900 border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      <span className="text-[11px] font-bold font-serif text-amber-400">DOOR {doorNum}</span>
                      <div className="my-auto text-center">
                        {isDone ? (
                          <Gem className="w-5 h-5 text-purple-300 mx-auto animate-pulse" />
                        ) : (
                          <Key className="w-4 h-4 text-amber-600 mx-auto opacity-60" />
                        )}
                        <span className="text-[9px] text-slate-300 block mt-0.5 leading-none">{labels[index]}</span>
                      </div>
                      <span className={`text-[8px] px-1 py-0.5 rounded font-mono ${isDone ? 'bg-purple-950 text-purple-300' : 'bg-slate-950 text-slate-500'}`}>
                        {isDone ? 'CLEARED' : 'PENDING'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between mt-1">
              <MrBurgeNPC text={guideDialog} />
              <div className="hidden sm:block w-16 h-20 overflow-hidden rounded-xl border border-amber-500/50 shadow-md">
                <ChibiRoshni className="w-full h-full" />
              </div>
            </div>

          </div>
        </div>
      )}

      {gameState === 'GAME' && (
        <div className="w-full h-full relative pt-14 pb-4 px-4 bg-stone-950 flex flex-col items-center justify-center">
          <StoneBrickPattern />
          <button 
            onClick={() => setGameState('LOBBY')}
            className="absolute top-16 left-4 z-30 px-3 py-1.5 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-1 shadow-md"
          >
            ← Back to Lobby
          </button>

          <div className="max-w-xl w-full bg-slate-900/95 border-2 border-amber-600/70 rounded-2xl p-4 shadow-2xl relative overflow-hidden flex flex-col items-center backdrop-blur-md">
            {activeDoor === 1 && <MiniGame1AirHockey onWin={() => setGameState('DOOR1_PHOTO')} />}
            {activeDoor === 2 && <MiniGame2RobloxRatTrap onWin={() => setGameState('DOOR2_CUTSCENE')} />}
            {activeDoor === 3 && <MiniGame3MysorePalaceMaze onWin={() => setGameState('DOOR3_CUTSCENE')} />}
            {activeDoor === 4 && <MiniGame4CarnivalPirateShip onWin={() => setGameState('DOOR4_PHOTOS')} />}
            {activeDoor === 5 && <MiniGame5MinecraftDragon onWin={() => markDoorCompleted(4)} />}
            {activeDoor === 6 && <MiniGame6IrumaQuiz onWin={() => markDoorCompleted(5)} />}
            {activeDoor === 7 && <MiniGame7KitKatSmile onWin={() => markDoorCompleted(6)} />}
            {activeDoor === 8 && <MiniGame8AoTExam onWin={() => markDoorCompleted(7)} />}
            {activeDoor === 9 && <MiniGame9CozyBreak onWin={() => markDoorCompleted(8)} />}
          </div>
        </div>
      )}

      {/* DOOR 1 AIR HOCKEY PHOTO REEL */}
      {gameState === 'DOOR1_PHOTO' && (
        <div className="w-full h-full relative pt-14 pb-4 px-4 bg-black flex flex-col items-center justify-center z-40">
          <div className="max-w-lg w-full bg-slate-900/95 border-2 border-amber-500 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <h2 className="text-xl font-serif font-bold text-amber-300">VICTORY MEMORY REEL!</h2>
            <p className="text-xs text-slate-300">Incredible air hockey showdown action[cite: 6]!</p>
            
            <div className="w-full bg-black rounded-xl overflow-hidden border-2 border-amber-600 relative aspect-video flex items-center justify-center shadow-2xl">
              <img 
                src="image_c612e0.jpg" 
                alt="Air Hockey Memory" 
                className="w-full h-full object-cover"
              />
            </div>

            <button
              onClick={() => setGameState('DOOR1_REWARD')}
              className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-bold font-serif rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              Claim Your Orb! ➔
            </button>
          </div>
        </div>
      )}

      {/* DOOR 1 ORB REWARD SCREEN */}
      {gameState === 'DOOR1_REWARD' && (
        <div className="w-full h-full relative pt-14 pb-4 px-4 bg-purple-950/90 flex flex-col items-center justify-center z-40">
          <StoneBrickPattern />
          <div className="max-w-md w-full bg-slate-900/95 border-4 border-purple-500 rounded-2xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.8)] text-center space-y-4 relative z-10 animate-bounce">
            <div className="w-20 h-20 bg-purple-900 border-2 border-purple-300 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <Gem className="w-10 h-10 text-purple-200" />
            </div>

            <div>
              <span className="text-xs font-serif uppercase tracking-widest text-purple-300 bg-purple-950 px-3 py-1 rounded-full border border-purple-500">
                TRIAL 1 COMPLETE
              </span>
              <h2 className="text-2xl font-serif font-black text-amber-300 mt-2">
                YOU HAVE OBTAINED THE ORB OF ARCADE FURY!
              </h2>
            </div>

            <p className="text-xs text-slate-300">
              The energy of the air hockey arena flows into your magical inventory. 8 more orbs await your conquest!
            </p>

            <button
              onClick={() => markDoorCompleted(0)}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-serif font-bold text-base rounded-xl shadow-lg transition"
            >
              Claim Orb & Return to Lobby ➔
            </button>
          </div>
        </div>
      )}

      {/* DOOR 2 GHOST & ROBLOX PHOTO CUTSCENE */}
      {gameState === 'DOOR2_CUTSCENE' && (
        <Door2GhostCutscene onFinish={() => setGameState('DOOR2_REWARD')} />
      )}

      {/* DOOR 2 ORB REWARD SCREEN */}
      {gameState === 'DOOR2_REWARD' && (
        <div className="w-full h-full relative pt-14 pb-4 px-4 bg-purple-950/90 flex flex-col items-center justify-center z-40">
          <StoneBrickPattern />
          <div className="max-w-md w-full bg-slate-900/95 border-4 border-purple-500 rounded-2xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.8)] text-center space-y-4 relative z-10 animate-bounce">
            <div className="w-20 h-20 bg-purple-900 border-2 border-purple-300 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <Gem className="w-10 h-10 text-purple-200" />
            </div>

            <div>
              <span className="text-xs font-serif uppercase tracking-widest text-purple-300 bg-purple-950 px-3 py-1 rounded-full border border-purple-500">
                TRIAL 2 COMPLETE
              </span>
              <h2 className="text-2xl font-serif font-black text-amber-300 mt-2">
                YOU HAVE OBTAINED THE ORB OF SPOOKY RAT POISON!
              </h2>
            </div>

            <p className="text-xs text-slate-300">
              The ghost has vanished into thin air after snacking on your poisoned rat. Orb #2 is yours!
            </p>

            <button
              onClick={() => markDoorCompleted(1)}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-serif font-bold text-base rounded-xl shadow-lg transition"
            >
              Claim Orb & Return to Lobby ➔
            </button>
          </div>
        </div>
      )}

      {/* DOOR 3 FRIENDS CUTSCENE & GROUP PHOTO */}
      {gameState === 'DOOR3_CUTSCENE' && (
        <Door3FriendsCutscene onFinish={() => setGameState('DOOR3_REWARD')} />
      )}

      {/* DOOR 3 ORB REWARD SCREEN */}
      {gameState === 'DOOR3_REWARD' && (
        <div className="w-full h-full relative pt-14 pb-4 px-4 bg-purple-950/90 flex flex-col items-center justify-center z-40">
          <StoneBrickPattern />
          <div className="max-w-md w-full bg-slate-900/95 border-4 border-purple-500 rounded-2xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.8)] text-center space-y-4 relative z-10 animate-bounce">
            <div className="w-20 h-20 bg-purple-900 border-2 border-purple-300 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <Gem className="w-10 h-10 text-purple-200" />
            </div>

            <div>
              <span className="text-xs font-serif uppercase tracking-widest text-purple-300 bg-purple-950 px-3 py-1 rounded-full border border-purple-500">
                TRIAL 3 COMPLETE
              </span>
              <h2 className="text-2xl font-serif font-black text-amber-300 mt-2">
                YOU HAVE OBTAINED THE ORB OF MYSORE PALACE ROYALTY!
              </h2>
            </div>

            <p className="text-xs text-slate-300">
              You successfully navigated the royal palace maze, found the exit, and reunited with your amazing friends!
            </p>

            <button
              onClick={() => markDoorCompleted(2)}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-serif font-bold text-base rounded-xl shadow-lg transition"
            >
              Claim Orb & Return to Lobby ➔
            </button>
          </div>
        </div>
      )}

      {/* DOOR 4 PHOTOS CUTSCENE SEQUENCE */}
      {gameState === 'DOOR4_PHOTOS' && (
        <Door4PhotosSequence onFinish={() => setGameState('DOOR4_REWARD')} />
      )}

      {/* DOOR 4 ORB REWARD SCREEN */}
      {gameState === 'DOOR4_REWARD' && (
        <div className="w-full h-full relative pt-14 pb-4 px-4 bg-purple-950/90 flex flex-col items-center justify-center z-40">
          <StoneBrickPattern />
          <div className="max-w-md w-full bg-slate-900/95 border-4 border-purple-500 rounded-2xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.8)] text-center space-y-4 relative z-10 animate-bounce">
            <div className="w-20 h-20 bg-purple-900 border-2 border-purple-300 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <Gem className="w-10 h-10 text-purple-200" />
            </div>

            <div>
              <span className="text-xs font-serif uppercase tracking-widest text-purple-300 bg-purple-950 px-3 py-1 rounded-full border border-purple-500">
                TRIAL 4 COMPLETE
              </span>
              <h2 className="text-2xl font-serif font-black text-amber-300 mt-2">
                YOU HAVE OBTAINED THE ORB OF CARNIVAL PIRATE THRILLS!
              </h2>
            </div>

            <p className="text-xs text-slate-300">
              The swinging pirate ship ride and night sky fireworks light up your magical inventory. Orb #4 is yours!
            </p>

            <button
              onClick={() => markDoorCompleted(3)}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-serif font-bold text-base rounded-xl shadow-lg transition"
            >
              Claim Orb & Return to Lobby ➔
            </button>
          </div>
        </div>
      )}

      {gameState === 'FINAL_ROOM' && (
        <GrandBirthdayChamber onBack={() => setGameState('LOBBY')} />
      )}
    </div>
  );
}

// DOOR 1: WHITE AIR HOCKEY TABLE
function MiniGame1AirHockey({ onWin }) {
  const [score, setScore] = useState(0);
  const [paddleX, setPaddleX] = useState(150);
  const [paddleY, setPaddleY] = useState(230);
  const [ball, setBall] = useState({ x: 150, y: 150, vx: 3, vy: 3 });
  const [aiX, setAiX] = useState(150);
  const [aiTargetX, setAiTargetX] = useState(150);

  useEffect(() => {
    const aiTimer = setInterval(() => {
      setAiTargetX(Math.random() * 200 + 50);
    }, 600);
    return () => clearInterval(aiTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setAiX(prev => {
        const diff = aiTargetX - prev;
        return prev + diff * 0.1;
      });

      setBall(b => {
        let nx = b.x + b.vx;
        let ny = b.y + b.vy;
        let nvx = b.vx;
        let nvy = b.vy;

        if (nx <= 15 || nx >= 285) nvx = -nvx;

        if (ny <= 35 && Math.abs(nx - aiX) < 30) {
          nvy = Math.abs(nvy) * 1.05;
          audio.click();
        }

        const distToPaddle = Math.hypot(nx - paddleX, ny - paddleY);
        if (distToPaddle < 25 && nvy > 0) {
          const hitAngle = (nx - paddleX) / 20;
          nvx = hitAngle * 4;
          nvy = -Math.abs(nvy) * 1.05;
          audio.click();
        }

        if (ny <= 10) {
          audio.orb();
          setScore(s => {
            const ns = s + 1;
            if (ns >= 3) onWin();
            return ns;
          });
          return { x: 150, y: 150, vx: (Math.random() - 0.5) * 4, vy: 3 };
        }

        if (ny >= 290) {
          audio.hit();
          return { x: 150, y: 150, vx: (Math.random() - 0.5) * 4, vy: -3 };
        }

        return { x: nx, y: ny, vx: nvx, vy: nvy };
      });
    }, 20);

    return () => clearInterval(timer);
  }, [paddleX, paddleY, aiX, aiTargetX, onWin]);

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const relX = clientX - rect.left;
    const relY = clientY - rect.top;

    setPaddleX(Math.max(25, Math.min(275, relX)));
    setPaddleY(Math.max(160, Math.min(270, relY)));
  };

  return (
    <div className="w-full text-center">
      <h2 className="text-lg font-bold text-amber-400 font-serif mb-1">DOOR 1: Air Hockey Showdown</h2>
      <p className="text-xs text-slate-300 mb-3">Score 3 goals! Move your round mallet anywhere on your side of the white table.</p>
      <div className="text-sm font-bold text-yellow-300 mb-2 font-mono">Score: {score} / 3</div>

      <div 
        className="w-[300px] h-[300px] bg-white border-4 border-slate-400 rounded-xl relative mx-auto overflow-hidden cursor-crosshair shadow-[0_0_20px_rgba(255,255,255,0.4)]"
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
      >
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-red-500/80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-red-500/50 rounded-full" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-8 border-b-2 border-x-2 border-red-500 rounded-b-xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-8 border-t-2 border-x-2 border-red-500 rounded-t-xl" />

        <div 
          className="absolute w-12 h-6 bg-red-600 border border-red-300 rounded-full shadow-md -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${aiX}px`, top: `20px` }}
        />

        <div 
          className="absolute w-10 h-10 bg-cyan-500 border-2 border-cyan-200 rounded-full shadow-[0_0_10px_cyan] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          style={{ left: `${paddleX}px`, top: `${paddleY}px` }}
        >
          <div className="w-4 h-4 bg-cyan-300 rounded-full" />
        </div>

        <div 
          className="absolute w-6 h-6 bg-slate-900 border-2 border-slate-600 rounded-full shadow-md -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${ball.x}px`, top: `${ball.y}px` }}
        />
      </div>
    </div>
  );
}

// DOOR 2: ROBLOX RAT POISON
function MiniGame2RobloxRatTrap({ onWin }) {
  const [stage, setStage] = useState('INSTRUCTIONS');
  const [ratPos, setRatPos] = useState({ x: 120, y: 120 });
  const [hasRat, setHasRat] = useState(false);
  const [isPoisoned, setIsPoisoned] = useState(false);

  useEffect(() => {
    if (stage !== 'HUNT') return;
    const interval = setInterval(() => {
      setRatPos({
        x: Math.floor(Math.random() * 220 + 30),
        y: Math.floor(Math.random() * 160 + 50)
      });
    }, 700);
    return () => clearInterval(interval);
  }, [stage]);

  const catchRat = () => {
    audio.click();
    setHasRat(true);
    setStage('CAULDRON');
  };

  const dipInCauldron = () => {
    audio.orb();
    setIsPoisoned(true);
    setStage('TABLE');
  };

  const placeOnTable = () => {
    audio.win();
    onWin();
  };

  return (
    <div className="w-full text-center">
      <h2 className="text-lg font-bold text-amber-400 font-serif mb-1">DOOR 2: Roblox Spooky Rat Trap</h2>

      {stage === 'INSTRUCTIONS' && (
        <div className="py-4 space-y-3">
          <div className="bg-slate-950 p-4 rounded-xl border border-amber-600/50 text-xs text-amber-100 font-serif leading-relaxed text-left">
            <p className="font-bold text-amber-400 mb-1">📜 Stage Instructions:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Catch the running rat in the dark chamber.</li>
              <li>Dip the rat into the Poison Cauldron.</li>
              <li>Place the poisoned rat on the table to lure the ghost!</li>
            </ul>
          </div>
          <button
            onClick={() => { audio.click(); setStage('HUNT'); }}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 font-bold font-serif text-slate-950 rounded-xl shadow-lg transition"
          >
            Start Mission ➔
          </button>
        </div>
      )}

      {(stage === 'HUNT' || stage === 'CAULDRON' || stage === 'TABLE') && (
        <div>
          <p className="text-xs text-slate-300 mb-2">
            {stage === 'HUNT' && "Click the running rat to catch it!"}
            {stage === 'CAULDRON' && "Rat caught! Now click the Green Poison Cauldron to dip it."}
            {stage === 'TABLE' && "Rat is poisoned! Click the Wooden Table to place it."}
          </p>

          <div className="w-[300px] h-[220px] bg-slate-950 border-2 border-stone-700 rounded-xl relative mx-auto overflow-hidden shadow-2xl flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/40 via-transparent to-stone-900/60 pointer-events-none" />

            <button
              disabled={stage !== 'TABLE'}
              onClick={placeOnTable}
              className={`absolute bottom-3 right-6 w-20 h-12 bg-amber-900 border-2 border-amber-600 rounded-lg flex items-center justify-center text-xs font-bold font-serif shadow-lg transition ${stage === 'TABLE' ? 'animate-bounce border-yellow-400 bg-amber-700 cursor-pointer' : 'opacity-80'}`}
            >
              {isPoisoned && hasRat ? '🐀 (Poison)' : 'Table'}
            </button>

            <button
              disabled={stage !== 'CAULDRON'}
              onClick={dipInCauldron}
              className={`absolute bottom-3 left-6 w-14 h-14 bg-emerald-950 border-2 border-emerald-500 rounded-full flex flex-col items-center justify-center shadow-lg transition ${stage === 'CAULDRON' ? 'animate-pulse border-emerald-300 bg-emerald-900 cursor-pointer' : 'opacity-80'}`}
            >
              <span className="text-xl">🫕</span>
              <span className="text-[8px] text-emerald-300 font-mono">Cauldron</span>
            </button>

            {stage === 'HUNT' && (
              <button
                onClick={catchRat}
                className="absolute text-2xl animate-spin hover:scale-125 transition cursor-pointer"
                style={{ left: ratPos.x, top: ratPos.y }}
              >
                🐀
              </button>
            )}

            {hasRat && stage !== 'HUNT' && (
              <div className="absolute top-3 right-3 bg-purple-900/90 border border-purple-400 px-2 py-1 rounded text-[10px] text-purple-200">
                Holding Rat {isPoisoned ? '🟢 (Poisoned)' : '🔴'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// DOOR 2 GHOST CUTSCENE & PHOTO
function Door2GhostCutscene({ onFinish }) {
  const [phase, setPhase] = useState('EATING');

  useEffect(() => {
    const t1 = setTimeout(() => {
      audio.hit();
      setPhase('DEAD');
    }, 3000);

    const t2 = setTimeout(() => {
      setPhase('PHOTO');
    }, 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="w-full h-full relative pt-14 pb-4 px-4 bg-black flex flex-col items-center justify-center z-40">
      <div className="max-w-lg w-full bg-slate-900/95 border-2 border-purple-500 rounded-2xl p-6 shadow-2xl text-center space-y-4">
        
        {phase === 'EATING' && (
          <div className="space-y-4 py-6 animate-pulse">
            <Ghost className="w-20 h-20 text-purple-400 mx-auto animate-bounce" />
            <h2 className="text-xl font-serif font-bold text-amber-300">A WILD GHOST APPEARS!</h2>
            <p className="text-xs text-slate-300">The hungry ghost spots the poisoned rat on the table and gobbles it right up...</p>
          </div>
        )}

        {phase === 'DEAD' && (
          <div className="space-y-4 py-6 animate-fade-in">
            <Skull className="w-20 h-20 text-red-500 mx-auto animate-spin" />
            <h2 className="text-xl font-serif font-bold text-red-400">BLECH! TOO TOXIC!</h2>
            <p className="text-xs text-slate-300">The poison takes effect instantly! The ghost collapses and vanishes!</p>
          </div>
        )}

        {phase === 'PHOTO' && (
          <div className="space-y-3 animate-fade-in">
            <h2 className="text-lg font-serif font-bold text-amber-300">DUNGEON MEMORY SNAPSHOT</h2>
            <div className="w-full bg-black rounded-xl overflow-hidden border-2 border-amber-500 relative aspect-video flex items-center justify-center shadow-2xl">
              <img 
                src="image_0c065d.png" 
                alt="Roblox Dungeon Snapshot"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-slate-400 italic">"Victory in the dark Roblox realm!"</p>

            <button
              onClick={onFinish}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold font-serif rounded-xl shadow-lg transition"
            >
              Continue to Orb Claim ➔
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// DOOR 3: MYSORE PALACE MAZE
function MiniGame3MysorePalaceMaze({ onWin }) {
  const [stage, setStage] = useState('INSTRUCTIONS');
  const [pos, setPos] = useState({ x: 20, y: 20 });

  const move = (dx, dy) => {
    audio.click();
    setPos(prev => {
      const nx = Math.max(10, Math.min(240, prev.x + dx * 15));
      const ny = Math.max(10, Math.min(180, prev.y + dy * 15));
      
      if (nx >= 220 && ny >= 160) {
        audio.win();
        onWin();
      }
      return { x: nx, y: ny };
    });
  };

  return (
    <div className="w-full text-center">
      <h2 className="text-lg font-bold text-amber-400 font-serif mb-1">DOOR 3: Mysore Palace Maze</h2>

      {stage === 'INSTRUCTIONS' && (
        <div className="py-4 space-y-3">
          <div className="bg-slate-950 p-4 rounded-xl border border-amber-600/50 text-xs text-amber-100 font-serif leading-relaxed text-left">
            <p className="font-bold text-amber-400 mb-1">🏰 Situation Briefing:</p>
            <p className="text-slate-300 mb-2">
              You are completely lost in the grand, winding corridors of the Mysore Palace! Use the on-screen joystick to navigate through the royal halls, avoid the ancient pillars, and find the exit where your friends are waiting for you!
            </p>
          </div>
          <button
            onClick={() => { audio.click(); setStage('MAZE'); }}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 font-bold font-serif text-slate-950 rounded-xl shadow-lg transition"
          >
            Enter Palace Maze ➔
          </button>
        </div>
      )}

      {stage === 'MAZE' && (
        <div>
          <p className="text-xs text-slate-300 mb-2">Use the joystick below to guide Roshni to the EXIT door!</p>

          <div className="w-[280px] h-[200px] bg-amber-950/40 border-2 border-amber-600 rounded-xl relative mx-auto overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-950/60 via-stone-900/90 to-amber-950/80" />

            <div className="absolute top-10 left-16 w-8 h-24 bg-amber-800/80 border border-amber-500 rounded" />
            <div className="absolute top-8 left-44 w-8 h-20 bg-amber-800/80 border border-amber-500 rounded" />

            <div className="absolute bottom-2 right-2 px-2 py-1 bg-yellow-500 text-slate-950 font-bold text-[10px] rounded border border-yellow-300 animate-pulse">
              🚪 EXIT (Friends Here!)
            </div>

            <div 
              className="absolute w-7 h-7 bg-cyan-400 border-2 border-white rounded-full shadow-[0_0_10px_cyan] flex items-center justify-center font-bold text-[10px] text-slate-950 transition-all duration-100 overflow-hidden"
              style={{ left: pos.x, top: pos.y }}
            >
              <img src="image_af98fe.jpg" alt="Roshni" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="mt-3 flex flex-col items-center">
            <button 
              onClick={() => move(0, -1)}
              className="w-12 h-10 bg-amber-700 hover:bg-amber-600 border border-amber-400 rounded-t-lg text-amber-100 font-bold shadow flex items-center justify-center"
            >
              ▲
            </button>
            <div className="flex gap-4">
              <button 
                onClick={() => move(-1, 0)}
                className="w-12 h-10 bg-amber-700 hover:bg-amber-600 border border-amber-400 rounded-l-lg text-amber-100 font-bold shadow flex items-center justify-center"
              >
                ◀
              </button>
              <div className="w-12 h-10 bg-slate-900 border border-slate-700 rounded flex items-center justify-center text-[10px] text-amber-300 font-mono">
                MOVE
              </div>
              <button 
                onClick={() => move(1, 0)}
                className="w-12 h-10 bg-amber-700 hover:bg-amber-600 border border-amber-400 rounded-r-lg text-amber-100 font-bold shadow flex items-center justify-center"
              >
                ▶
              </button>
            </div>
            <button 
              onClick={() => move(0, 1)}
              className="w-12 h-10 bg-amber-700 hover:bg-amber-600 border border-amber-400 rounded-b-lg text-amber-100 font-bold shadow flex items-center justify-center"
            >
              ▼
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// DOOR 3 FRIEND REUNION & GROUP PHOTO CUTSCENE
function Door3FriendsCutscene({ onFinish }) {
  const [showPhoto, setShowPhoto] = useState(false);

  return (
    <div className="w-full h-full relative pt-14 pb-4 px-4 bg-black flex flex-col items-center justify-center z-40">
      <div className="max-w-lg w-full bg-slate-900/95 border-2 border-amber-500 rounded-2xl p-6 shadow-2xl text-center space-y-4 animate-fade-in">
        
        {!showPhoto ? (
          <div className="space-y-4 py-8">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto animate-bounce" />
            <h2 className="text-2xl font-serif font-bold text-amber-300">CONGRATS! YOU FOUND YOUR FRIENDS!</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              After navigating the winding halls of the majestic Mysore Palace, you successfully reached the exit and reunited with your wonderful school friends!
            </p>
            <button
              onClick={() => { audio.click(); setShowPhoto(true); }}
              className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 text-slate-950 font-bold font-serif rounded-xl shadow-lg transition"
            >
              View Reunion Snapshot ➔
            </button>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <h2 className="text-lg font-serif font-bold text-amber-300">MYSORE PALACE REUNION SNAPSHOT</h2>
            <div className="w-full bg-black rounded-xl overflow-hidden border-2 border-amber-500 relative aspect-video flex items-center justify-center shadow-2xl">
              <img 
                src="image_0b8de4.jpg" 
                alt="Roshni and Friends Reunion"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-slate-400 italic">"Unforgettable memories with amazing friends!"[cite: 1]</p>

            <button
              onClick={onFinish}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold font-serif rounded-xl shadow-lg transition"
            >
              Continue to Orb Claim ➔
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// DOOR 4: CARNIVAL PIRATE SHIP SWING & 2 PHOTOS SEQUENCE
function MiniGame4CarnivalPirateShip({ onWin }) {
  const [stage, setStage] = useState('INSTRUCTIONS');
  const [pullCount, setPullCount] = useState(0);
  const [swinging, setSwinging] = useState(false);
  const [swingPhase, setSwingPhase] = useState(0);

  const pullRope = () => {
    audio.click();
    const next = pullCount + 1;
    setPullCount(next);
    if (next >= 10) {
      setStage('READY');
    }
  };

  const leaveRide = () => {
    audio.win();
    setSwinging(true);
    setSwingPhase(1);
    
    setTimeout(() => setSwingPhase(2), 1200);
    setTimeout(() => setSwingPhase(3), 2400);
    setTimeout(() => {
      onWin();
    }, 3600);
  };

  return (
    <div className="w-full text-center">
      <h2 className="text-lg font-bold text-amber-400 font-serif mb-1">DOOR 4: Carnival Pirate Ship Swing</h2>

      {stage === 'INSTRUCTIONS' && (
        <div className="py-4 space-y-3">
          <div className="bg-slate-950 p-4 rounded-xl border border-amber-600/50 text-xs text-amber-100 font-serif leading-relaxed text-left">
            <p className="font-bold text-amber-400 mb-1">🎡 Carnival Instructions:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Step into the night carnival surrounded by glowing trees and bushes!</li>
              <li>Tap the **"Pull"** button 10 times to ready the swinging pirate ship.</li>
              <li>Press **"Leave"** to watch the ship swing on its own while fireworks burst in the night sky!</li>
            </ul>
          </div>
          <button
            onClick={() => { audio.click(); setStage('PULL'); }}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 font-bold font-serif text-slate-950 rounded-xl shadow-lg transition"
          >
            Start Carnival Ride ➔
          </button>
        </div>
      )}

      {stage !== 'INSTRUCTIONS' && (
        <div>
          <p className="text-xs text-slate-300 mb-2">
            {!swinging ? (pullCount < 10 ? `Pull the rope! Taps: ${pullCount} / 10` : "Ready to launch!") : "Enjoy the night ride and fireworks!"}
          </p>

          <div className="w-[300px] h-[220px] bg-slate-950 border-2 border-indigo-900 rounded-xl relative mx-auto overflow-hidden shadow-2xl flex flex-col justify-end">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 pointer-events-none" />

            {swinging && (
              <div className="absolute inset-0 flex items-center justify-center text-3xl animate-ping pointer-events-none">
                🎆 ✨ 🎇
              </div>
            )}

            <div className="absolute bottom-0 left-0 text-3xl">🌲</div>
            <div className="absolute bottom-0 left-6 text-2xl">🌿</div>
            <div className="absolute bottom-0 right-0 text-3xl">🌲</div>
            <div className="absolute bottom-0 right-6 text-2xl">🌿</div>

            <div className={`relative mx-auto mb-6 text-4xl transition-transform duration-700 ${swinging ? (swingPhase % 2 === 1 ? '-rotate-12 translate-y-2' : 'rotate-12 translate-y-2') : 'rotate-0'}`}>
              🚢
            </div>

            <div className="relative z-10 pb-3 flex justify-center gap-2">
              {!swinging ? (
                pullCount < 10 ? (
                  <button
                    onClick={pullRope}
                    className="px-6 py-2 bg-amber-600 hover:bg-amber-500 font-bold font-serif text-slate-950 rounded-lg shadow transition active:scale-95 text-xs"
                  >
                    PULL ({10 - pullCount} left)
                  </button>
                ) : (
                  <button
                    onClick={leaveRide}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 font-bold font-serif text-white rounded-lg shadow transition active:scale-95 text-xs animate-bounce"
                  >
                    🚀 LEAVE & RIDE!
                  </button>
                )
              ) : (
                <div className="text-xs text-amber-300 font-mono animate-pulse">Swinging through the night...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// DOOR 4 PHOTOS SEQUENCE (2 PHOTOS)
function Door4PhotosSequence({ onFinish }) {
  const [photoStep, setPhotoStep] = useState(1);

  return (
    <div className="w-full h-full relative pt-14 pb-4 px-4 bg-black flex flex-col items-center justify-center z-40">
      <div className="max-w-lg w-full bg-slate-900/95 border-2 border-amber-500 rounded-2xl p-6 shadow-2xl text-center space-y-4 animate-fade-in">
        
        {photoStep === 1 && (
          <div className="space-y-3 animate-fade-in">
            <h2 className="text-lg font-serif font-bold text-amber-300">CARNIVAL MEMORY SNAPSHOT #1</h2>
            <div className="w-full bg-black rounded-xl overflow-hidden border-2 border-amber-500 relative aspect-video flex items-center justify-center shadow-2xl">
              <img 
                src="image_0b8de4.jpg" 
                alt="Carnival Memory 1"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-slate-400 italic">"High in the night sky under the festival lights!"[cite: 1]</p>

            <button
              onClick={() => { audio.click(); setPhotoStep(2); }}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 text-slate-950 font-bold font-serif rounded-xl shadow-lg transition"
            >
              Next Photo ➔
            </button>
          </div>
        )}

        {photoStep === 2 && (
          <div className="space-y-3 animate-fade-in">
            <h2 className="text-lg font-serif font-bold text-amber-300">CARNIVAL MEMORY SNAPSHOT #2</h2>
            <div className="w-full bg-black rounded-xl overflow-hidden border-2 border-amber-500 relative aspect-video flex items-center justify-center shadow-2xl">
              <img 
                src="image_0c065d.png" 
                alt="Carnival Memory 2"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-slate-400 italic">"The magic of celebration and friendship!"</p>

            <button
              onClick={onFinish}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold font-serif rounded-xl shadow-lg transition"
            >
              Continue to Orb Claim ➔
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// DOOR 5: MINECRAFT BOW SHOOTING DRAGON & KITKAT EGG HATCH
function MiniGame5MinecraftDragon({ onWin }) {
  const [stage, setStage] = useState('INSTRUCTIONS');
  const [dragonHp, setDragonHp] = useState(3);
  const [dragonX, setDragonX] = useState(100);
  const [dragonDir, setDragonDir] = useState(1);
  const [eggTaps, setEggTaps] = useState(0);
  const [hatched, setHatched] = useState(false);

  useEffect(() => {
    if (stage !== 'FIGHT') return;
    const timer = setInterval(() => {
      setDragonX(prev => {
        if (prev >= 200) setDragonDir(-1);
        if (prev <= 20) setDragonDir(1);
        return prev + dragonDir * 4;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [stage, dragonDir]);

  const shootArrow = () => {
    audio.hit();
    const nextHp = dragonHp - 1;
    setDragonHp(nextHp);
    if (nextHp <= 0) {
      audio.win();
      setStage('EGG');
    }
  };

  const tapEgg = () => {
    audio.click();
    const nextTaps = eggTaps + 1;
    setEggTaps(nextTaps);
    if (nextTaps >= 3) {
      audio.orb();
      setHatched(true);
      setTimeout(() => {
        onWin();
      }, 2500);
    }
  };

  return (
    <div className="w-full text-center">
      <h2 className="text-lg font-bold text-amber-400 font-serif mb-1">DOOR 5: Ender Dragon & Mystery Egg</h2>

      {stage === 'INSTRUCTIONS' && (
        <div className="py-4 space-y-3">
          <div className="bg-slate-950 p-4 rounded-xl border border-amber-600/50 text-xs text-amber-100 font-serif leading-relaxed text-left">
            <p className="font-bold text-amber-400 mb-1">🏹 Mission Briefing:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Equip your bow and shoot the Ender Dragon as it glides back and forth!</li>
              <li>Once defeated, a mysterious dragon egg will appear.</li>
              <li>Tap the egg 3 times to break it and see what hatches!</li>
            </ul>
          </div>
          <button
            onClick={() => { audio.click(); setStage('FIGHT'); }}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 font-bold font-serif text-slate-950 rounded-xl shadow-lg transition"
          >
            Enter Dragon Arena ➔
          </button>
        </div>
      )}

      {stage === 'FIGHT' && (
        <div>
          <p className="text-xs text-slate-300 mb-2">Shoot the Ender Dragon! HP: {dragonHp} / 3</p>

          <div className="w-[300px] h-[220px] bg-purple-950/60 border-2 border-purple-500 rounded-xl relative mx-auto overflow-hidden shadow-2xl flex flex-col justify-between p-4">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-950 to-black pointer-events-none" />

            <div 
              className="absolute top-12 text-5xl transition-all duration-75 cursor-pointer"
              style={{ left: `${dragonX}px` }}
              onClick={shootArrow}
            >
              🐉
            </div>

            <div className="relative z-10 mt-auto">
              <button
                onClick={shootArrow}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 text-white font-bold font-serif rounded-xl shadow-lg active:scale-95 transition text-xs flex items-center justify-center gap-2"
              >
                🏹 SHOOT BOW! (Tap Dragon or Here)
              </button>
            </div>
          </div>
        </div>
      )}

      {stage === 'EGG' && (
        <div className="py-2 space-y-3 animate-fade-in">
          <p className="text-xs text-slate-300">
            {!hatched ? `Dragon defeated! Tap the egg to hatch it (${3 - eggTaps} taps left):` : "SURPRISE! It hatched into a KitKat chocolate!"}
          </p>

          <div className="w-[300px] h-[200px] bg-slate-950 border-2 border-amber-500 rounded-xl relative mx-auto overflow-hidden shadow-2xl flex items-center justify-center">
            {!hatched ? (
              <button
                onClick={tapEgg}
                className="text-6xl animate-bounce hover:scale-110 transition cursor-pointer"
              >
                🥚
              </button>
            ) : (
              <div className="text-center space-y-2 animate-bounce">
                <span className="text-6xl">🍫</span>
                <div className="text-xs font-serif font-bold text-red-400">KITKAT CHOCOLATE HATCHED!</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// DOOR 6: IRUMA-KUN QUIZ
function MiniGame6IrumaQuiz({ onWin }) {
  const [qStep, setQStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  const handleQ1 = (answer) => {
    audio.click();
    if (answer === 'Welcome to my demon school') {
      setErrorMsg('');
      setQStep(2);
    } else {
      audio.hit();
      setErrorMsg('Incorrect! Try again.');
    }
  };

  const handleQ2 = (answer) => {
    audio.click();
    if (answer === 'yes') {
      audio.win();
      setQStep(3);
    }
  };

  return (
    <div className="w-full text-center">
      <h2 className="text-lg font-bold text-amber-400 font-serif mb-1">DOOR 6: Iruma-kun Babyls Enrollment</h2>

      {qStep === 1 && (
        <div className="py-3 space-y-3">
          <p className="text-xs text-amber-200 font-serif">Question 1: What was your first anime?</p>
          {errorMsg && <p className="text-[10px] text-red-400 font-bold">{errorMsg}</p>}
          <div className="grid grid-cols-1 gap-2 max-w-xs mx-auto">
            <button onClick={() => handleQ1('Welcome to my demon school')} className="p-2 bg-purple-950 border border-purple-500 rounded-lg text-xs hover:bg-purple-900 transition">
              Welcome to my demon school
            </button>
            <button onClick={() => handleQ1('Attack on Titan')} className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs hover:bg-slate-700 transition">
              Attack on Titan
            </button>
            <button onClick={() => handleQ1('Demon Slayer')} className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs hover:bg-slate-700 transition">
              Demon Slayer
            </button>
            <button onClick={() => handleQ1('One Punch Man')} className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs hover:bg-slate-700 transition">
              One Punch Man
            </button>
          </div>
        </div>
      )}

      {qStep === 2 && (
        <div className="py-3 space-y-3 animate-fade-in">
          <p className="text-xs text-amber-200 font-serif">Question 2: Are you ready to dive into the school "Babyls"?</p>
          <div className="max-w-xs mx-auto">
            <button onClick={() => handleQ2('yes')} className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold font-serif rounded-lg shadow-lg transition">
              Yes
            </button>
          </div>
        </div>
      )}

      {qStep === 3 && (
        <div className="py-2 space-y-3 animate-fade-in">
          <h3 className="text-sm font-serif font-bold text-amber-300">YOU ARE ENROLLED IN BABYLS, CONGRATS!</h3>
          <div className="w-[280px] h-[160px] bg-black rounded-xl overflow-hidden border-2 border-amber-500 relative mx-auto shadow-2xl flex items-center justify-center">
            <img 
              src="image_b00239.jpg" 
              alt="Babyls Demon School Enrollment"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xs text-slate-300 italic">"Welcome to the magical halls of Babyls!"[cite: 3]</p>

          <button
            onClick={onWin}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold font-serif rounded-xl shadow-lg transition"
          >
            Claim Your Orb! ➔
          </button>
        </div>
      )}
    </div>
  );
}

// DOOR 7: KITKAT SMILE BREAK
function MiniGame7KitKatSmile({ onWin }) {
  const [opened, setOpened] = useState(false);

  const openKitKat = () => {
    audio.orb();
    setOpened(true);
  };

  return (
    <div className="w-full text-center">
      <h2 className="text-lg font-bold text-amber-400 font-serif mb-1">DOOR 7: KitKat Smile Break</h2>

      {!opened ? (
        <div className="py-4 space-y-3">
          <p className="text-xs text-slate-300">A delicious KitKat awaits! Tap on it to unwrap and open:</p>
          <div className="w-[260px] h-[160px] bg-red-950 border-2 border-red-600 rounded-xl mx-auto flex flex-col items-center justify-center shadow-xl cursor-pointer group" onClick={openKitKat}>
            <span className="text-5xl group-hover:scale-110 transition duration-300 mb-2">🍫</span>
            <span className="text-xs font-serif font-bold text-red-200 bg-red-900 px-3 py-1 rounded border border-red-500 animate-pulse">
              Tap to Unwrap KitKat!
            </span>
          </div>
        </div>
      ) : (
        <div className="py-2 space-y-3 animate-fade-in">
          <h3 className="text-sm font-serif font-bold text-amber-300">CONGRATS, YOU MADE ROSHNI SMILE!</h3>
          <div className="w-[220px] h-[220px] bg-black rounded-2xl overflow-hidden border-2 border-amber-500 relative mx-auto shadow-2xl flex items-center justify-center">
            <img 
              src="image_af951d.png" 
              alt="Roshni Beaming Smile Chibi"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xs text-slate-300 italic">"That radiant smile brings pure joy!"[cite: 2]</p>

          <button
            onClick={onWin}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold font-serif rounded-xl shadow-lg transition"
          >
            Claim Your Orb! ➔
          </button>
        </div>
      )}
    </div>
  );
}

// DOOR 8: ATTACK ON TITAN CORPS ENROLLMENT EXAM
function MiniGame8AoTExam({ onWin }) {
  const [examStep, setExamStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  const handleQ1 = (answer) => {
    audio.click();
    if (answer === 'Attack on Titan') {
      setErrorMsg('');
      setExamStep(2);
    } else {
      audio.hit();
      setErrorMsg('Incorrect! That is not the correct answer.');
    }
  };

  const handleQ2 = (answer) => {
    audio.click();
    if (answer === 'the nape') {
      audio.win();
      setExamStep(3);
    } else {
      audio.hit();
      setErrorMsg('Incorrect! Titans cannot be defeated that way.');
    }
  };

  return (
    <div className="w-full text-center">
      <h2 className="text-lg font-bold text-amber-400 font-serif mb-1">DOOR 8: Attack on Titan Corps Exam</h2>

      {examStep === 1 && (
        <div className="py-3 space-y-3 bg-[#f4ecd8] border-2 border-amber-700/80 rounded-xl p-4 text-slate-900 shadow-inner">
          <div className="text-[10px] uppercase font-mono tracking-widest text-amber-900 font-bold border-b border-amber-800/40 pb-1 mb-2">
            OFFICIAL MILITARY ENROLLMENT TEST PAPER
          </div>
          <p className="text-xs font-serif font-bold text-slate-900">Question 1: What is your favourite anime?</p>
          {errorMsg && <p className="text-[10px] text-red-600 font-bold">{errorMsg}</p>}
          <div className="grid grid-cols-1 gap-2 max-w-xs mx-auto">
            <button onClick={() => handleQ1('Attack on Titan')} className="p-2 bg-amber-900 text-amber-100 border border-amber-950 rounded-lg text-xs hover:bg-amber-800 transition font-serif font-bold shadow">
              1. Attack on Titan
            </button>
            <button onClick={() => handleQ1('One Punch Man')} className="p-2 bg-amber-100 text-slate-900 border border-amber-300 rounded-lg text-xs hover:bg-amber-200 transition font-serif">
              2. One Punch Man
            </button>
          </div>
        </div>
      )}

      {examStep === 2 && (
        <div className="py-3 space-y-3 bg-[#f4ecd8] border-2 border-amber-700/80 rounded-xl p-4 text-slate-950 shadow-inner animate-fade-in">
          <div className="text-[10px] uppercase font-mono tracking-widest text-amber-900 font-bold border-b border-amber-800/40 pb-1 mb-2">
            OFFICIAL MILITARY ENROLLMENT TEST PAPER
          </div>
          <p className="text-xs font-serif font-bold text-slate-950">Question 2: Which part must we attack to kill the titan?</p>
          {errorMsg && <p className="text-[10px] text-red-600 font-bold">{errorMsg}</p>}
          <div className="grid grid-cols-1 gap-2 max-w-xs mx-auto">
            <button onClick={() => handleQ2('eyes')} className="p-2 bg-amber-100 text-slate-900 border border-amber-300 rounded-lg text-xs hover:bg-amber-200 transition font-serif">
              1. Eyes
            </button>
            <button onClick={() => handleQ2('heart')} className="p-2 bg-amber-100 text-slate-900 border border-amber-300 rounded-lg text-xs hover:bg-amber-200 transition font-serif">
              2. Heart
            </button>
            <button onClick={() => handleQ2('the nape')} className="p-2 bg-amber-900 text-amber-100 border border-amber-950 rounded-lg text-xs hover:bg-amber-800 transition font-serif font-bold shadow">
              3. The Nape
            </button>
          </div>
        </div>
      )}

      {examStep === 3 && (
        <div className="py-2 space-y-3 animate-fade-in">
          <h3 className="text-sm font-serif font-bold text-amber-300">CONGRATS U HAVE BEEN ENROLLED IN THE CORP</h3>
          <div className="w-[280px] h-[160px] bg-black rounded-xl overflow-hidden border-2 border-amber-500 relative mx-auto shadow-2xl flex items-center justify-center">
            <img 
              src="image_b3afbd.jpg" 
              alt="Attack on Titan Corps Enrollment"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xs text-slate-300 italic">"Dedicate your heart to the Corps!"[cite: 4]</p>

          <button
            onClick={onWin}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold font-serif rounded-xl shadow-lg transition"
          >
            Claim Your Orb! ➔
          </button>
        </div>
      )}
    </div>
  );
}

// DOOR 9: COZY BREAK
function MiniGame9CozyBreak({ onWin }) {
  return (
    <div className="w-full text-center space-y-3">
      <h2 className="text-lg font-bold text-amber-400 font-serif">DOOR 9: Cozy Relaxation Break</h2>
      <p className="text-xs text-slate-300">Just enjoy some time for urself, and then move on to collect the final orb!</p>
      
      <div className="w-[280px] h-[180px] bg-black rounded-xl overflow-hidden border-2 border-amber-500 relative mx-auto shadow-2xl flex items-center justify-center">
        <img 
          src="image_581877.jpg" 
          alt="Roshni Cozy Cat Break"
          className="w-full h-full object-cover"
        />
      </div>

      <button
        onClick={() => { audio.orb(); onWin(); }}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold font-serif rounded-xl shadow-lg transition"
      >
        Collect Final Orb ➔
      </button>
    </div>
  );
}

// DOOR 10: GRAND BIRTHDAY CHAMBER
function GrandBirthdayChamber({ onBack }) {
  const [candlesBlown, setCandlesBlown] = useState(false);

  const extinguishCandles = () => {
    if (!candlesBlown) {
      audio.blow();
      audio.win();
      setCandlesBlown(true);
    }
  };

  return (
    <div className="w-full h-full relative pt-14 pb-6 px-4 bg-gradient-to-b from-purple-950 via-slate-950 to-black overflow-y-auto">
      <StoneBrickPattern />

      <button 
        onClick={onBack}
        className="fixed top-16 left-4 z-30 px-3 py-1.5 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-slate-200 backdrop-blur shadow-lg"
      >
        ← Return to Lobby
      </button>

      <div className="max-w-2xl mx-auto text-center space-y-6 pt-2 relative z-10">
        <div>
          <span className="text-xs font-serif uppercase tracking-widest text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full bg-amber-950/60">
            GRAND CHAMBER UNLOCKED
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-amber-300 mt-2 tracking-wide drop-shadow-[0_2px_10px_rgba(234,179,8,0.5)]">
            HAPPY 16TH BIRTHDAY ROSHNI!
          </h1>
        </div>

        <div className="bg-slate-900/95 border-2 border-amber-500/60 rounded-2xl p-6 shadow-2xl backdrop-blur relative overflow-hidden">
          <h3 className="text-sm font-serif text-amber-200 mb-2">16TH BIRTHDAY CELEBRATION CAKE</h3>
          <p className="text-xs text-slate-400 mb-4">Make a wish, then tap the candles to blow them out!</p>

          <div 
            onClick={extinguishCandles}
            className="w-52 h-44 mx-auto relative cursor-pointer group flex flex-col items-center justify-end pb-2"
          >
            <div className="flex justify-center gap-4 mb-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col items-center">
                  {!candlesBlown ? (
                    <div className="w-3 h-5 bg-amber-400 rounded-full blur-[2px] animate-ping" />
                  ) : (
                    <div className="text-xs text-slate-500 font-mono">💨</div>
                  )}
                  <div className="w-2 h-8 bg-gradient-to-b from-pink-300 to-pink-500 rounded-t" />
                </div>
              ))}
            </div>

            <div className="w-48 h-14 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 rounded-t-xl border-t-4 border-pink-300 shadow-md flex items-center justify-center">
              <span className="text-xl">🎂</span>
            </div>
            <div className="w-56 h-14 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 rounded-b-xl border-t-2 border-amber-400 flex items-center justify-center">
              <span className="text-xs font-serif font-bold text-amber-200">16 YEARS OF AWESOMENESS</span>
            </div>
          </div>

          {candlesBlown && (
            <div className="mt-6 space-y-4 animate-fade-in">
              <div className="w-full bg-black rounded-xl overflow-hidden border-2 border-amber-500 relative aspect-video flex items-center justify-center shadow-2xl">
                <img 
                  src="image_c68b81.jpg" 
                  alt="Grand 16th Birthday Celebration"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 bg-slate-950/90 border-2 border-amber-600/70 rounded-xl text-amber-100 font-serif text-left space-y-3 leading-relaxed text-sm shadow-xl">
                <p className="font-bold text-amber-300 text-base">
                  HAPPY BIRTHDAY yo 😊!
                </p>
                <p>
                  I hope your day goes beautifully, and so does the rest of your sweet 16.
                </p>
                <p>
                  I know life is tough right now and is busy as well, but don't forget to take care of your health and also give time to yourself.
                </p>
                <p className="text-amber-300 font-medium pt-1">
                  Anyway, keep smiling!
                </p>
                <div className="text-right pt-3 font-sans text-xs text-amber-400 font-bold">
                  — Bhargav
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}