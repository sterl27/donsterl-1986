'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeWorld from '../components/ThreeWorld';

interface Car {
  id: number;
  name: string;
  model: string;
  level: number;
}

interface ArtPiece {
  id: number;
  name: string;
  influence: number;
}

export default function DonsterlGame() {
  const [cash, setCash] = useState(12450000);
  const [time, setTime] = useState('11:11 AM');
  const [wantedLevel, setWantedLevel] = useState(2);
  const [view, setView] = useState<'dashboard' | 'world'>('dashboard');
  const [notifications, setNotifications] = useState<string[]>([]);

  const [fleet, setFleet] = useState<Car[]>([
    { id: 1, name: "Rolls-Royce", model: "Phantom", level: 4 },
    { id: 2, name: "Bugatti", model: "Chiron", level: 3 },
    { id: 3, name: "Aston Martin", model: "DBS", level: 2 },
    { id: 4, name: "Ferrari", model: "Testarossa", level: 5 },
  ]);

  const [artGallery, setArtGallery] = useState<ArtPiece[]>([
    { id: 1, name: "The Meeting", influence: 78 },
    { id: 2, name: "Portrait of a Lady", influence: 64 },
  ]);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => {
      const [h, m] = time.split(':');
      let hour = parseInt(h);
      let min = parseInt(m);
      min += 1;
      if (min >= 60) { min = 0; hour = (hour + 1) % 12 || 12; }
      setTime(`${hour}:${min.toString().padStart(2, '0')} ${time.includes('AM') ? 'AM' : 'PM'}`);
    }, 8000);
    return () => clearInterval(interval);
  }, [time]);

  const addNotification = (msg: string) => {
    setNotifications(prev => [...prev, msg]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 2400);
  };

  const upgradeCar = (id: number) => {
    setFleet(fleet.map(car => {
      if (car.id === id && car.level < 5) {
        const newLevel = car.level + 1;
        setCash(c => c - 185000);
        addNotification(`+1 ${car.name} Level`);
        return { ...car, level: newLevel };
      }
      return car;
    }));
  };

  const expandInfluence = () => {
    setArtGallery(artGallery.map(a => {
      const newInf = Math.min(100, a.influence + 11);
      return { ...a, influence: newInf };
    }));
    setCash(c => c - 420000);
    addNotification("Influence Increased");
  };

  const hostGala = () => {
    setWantedLevel(Math.max(0, wantedLevel - 1));
    setCash(c => c + 920000);
    addNotification("Gala Successful - Heat Reduced");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0c14] text-white font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(#1a1f2e_0.8px,transparent_1px)] bg-[length:5px_5px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-black/95" />

      {/* Notifications */}
      <div className="fixed top-6 right-6 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -25, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-[#ff2d55] text-black px-6 py-2.5 text-sm font-bold tracking-[2px] rounded-xl shadow-2xl"
            >
              {msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="relative z-10 p-5 max-w-[1540px] mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-[#ff2d55] text-[48px] leading-none font-black tracking-[-5px]">MODEL CITIZEN</div>
            <div className="text-[10px] tracking-[5px] text-[#ff2d55]/50 -mt-1">VICE CITY • 1986</div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setView('dashboard')} 
              className={`px-9 py-3 text-sm font-semibold tracking-[1.5px] transition-all duration-200 ${view === 'dashboard' 
                ? 'bg-[#ff2d55] text-black shadow-xl' 
                : 'border border-white/20 hover:bg-white/5'}`}
            >
              MANAGEMENT
            </button>
            <button 
              onClick={() => setView('world')} 
              className={`px-9 py-3 text-sm font-semibold tracking-[1.5px] transition-all duration-200 ${view === 'world' 
                ? 'bg-[#ff2d55] text-black shadow-xl' 
                : 'border border-white/20 hover:bg-white/5'}`}
            >
              3D WORLD
            </button>
          </div>

          <div className="text-right">
            <motion.div 
              key={cash}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-3xl font-mono text-[#ff2d55] tracking-wider"
            >
              ${cash.toLocaleString()}
            </motion.div>
            <div className="text-[10px] text-[#555] -mt-1 tracking-[2px]">CASH ON HAND</div>
          </div>
        </div>

        {view === 'dashboard' ? (
          <div className="grid grid-cols-12 gap-5">
            {/* Character Card */}
            <motion.div 
              whileHover={{ scale: 1.005 }}
              className="col-span-12 md:col-span-3 bg-[#11151f] border border-[#ff2d55]/30 rounded-3xl p-8 transition-all"
            >
              <div className="uppercase text-xs tracking-[4px] text-[#ff2d55]">GOLDCREST SOCIETY FIXER</div>
              <div className="text-[42px] font-bold tracking-[-2px] leading-[42px] mt-4">VICTORIA<br />‘VIX’ LANG</div>
              <div className="text-[#777] mt-3 text-sm">Society Lawyer &amp; Political Fixer</div>

              <div className="mt-10 grid grid-cols-2 gap-3">
                <button className="bg-[#ff2d55] py-4 text-sm font-bold text-black tracking-[1px] active:scale-[0.985] transition">RECRUIT</button>
                <button className="border border-white/20 py-4 text-sm tracking-[1px] active:scale-[0.985] transition">DISMISS</button>
              </div>
            </motion.div>

            {/* Objective */}
            <div className="col-span-12 md:col-span-6 bg-[#11151f] border border-[#ff2d55]/30 rounded-3xl p-8 flex flex-col justify-center">
              <div className="text-xs tracking-[4px] text-[#ff2d55]">CURRENT OBJECTIVE</div>
              <div className="text-3xl font-bold tracking-[-1px] mt-2">HOST THE CHARITY AUCTION</div>
              <div className="text-[#666] mt-1">Goldcrest Hills Estate • {time}</div>
            </div>

            {/* HUD */}
            <div className="col-span-12 md:col-span-3 bg-[#11151f] border border-[#ff2d55]/30 rounded-3xl p-8">
              <div className="flex justify-between text-xs tracking-[2px]">
                <div>WANTED LEVEL</div>
                <div className="text-[#ff2d55] tracking-widest">{'★'.repeat(wantedLevel)}{'☆'.repeat(5-wantedLevel)}</div>
              </div>
              <div className="mt-8 text-xs text-[#666] tracking-[1px]">TIME: {time}</div>
              <div className="text-xs text-[#666] tracking-[1px]">AMMO: 17/120</div>
            </div>

            {/* Luxury Fleet */}
            <div className="col-span-12 md:col-span-7 bg-[#11151f] border border-[#ff2d55]/30 rounded-3xl p-8">
              <div className="text-[#ff2d55] text-sm tracking-[3px] mb-6">LUXURY FLEET</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {fleet.map(car => (
                  <motion.div 
                    key={car.id} 
                    whileHover={{ scale: 1.015 }}
                    className="bg-[#0a0c14] rounded-2xl p-5 border border-white/10"
                  >
                    <div className="font-semibold text-xl tracking-tight">{car.name}</div>
                    <div className="text-xs text-[#555] mt-0.5">{car.model}</div>
                    <div className="text-yellow-400 text-sm mt-4 tracking-[3px]">{'★'.repeat(car.level)}{'☆'.repeat(5-car.level)}</div>
                    <button 
                      onClick={() => upgradeCar(car.id)}
                      disabled={car.level >= 5}
                      className="mt-6 w-full bg-[#ff2d55] py-3 text-xs font-bold text-black tracking-[1.5px] disabled:opacity-40 active:scale-[0.985] transition"
                    >
                      {car.level >= 5 ? "MAX LEVEL" : "UPGRADE"}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Art Gallery */}
            <div className="col-span-12 md:col-span-5 bg-[#11151f] border border-[#ff2d55]/30 rounded-3xl p-8">
              <div className="text-[#ff2d55] text-sm tracking-[3px] mb-6">ART GALLERY VENTURES</div>
              {artGallery.map((art, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between text-xs tracking-[1px] mb-2">
                    <div>{art.name}</div>
                    <div className="text-[#ff2d55]">{art.influence}</div>
                  </div>
                  <div className="h-2 bg-[#0a0c14] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-2 bg-[#ff2d55] rounded-full" 
                      animate={{ width: `${art.influence}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}

              <div className="flex gap-4 mt-8">
                <button onClick={expandInfluence} className="flex-1 bg-[#ff2d55] py-4 text-sm font-bold text-black tracking-[1px] active:scale-[0.985]">EXPAND INFLUENCE</button>
                <button onClick={hostGala} className="flex-1 border border-white/20 py-4 text-sm tracking-[1px] active:scale-[0.985]">HOST GALA</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-screen overflow-hidden bg-black">
            {/* GTA-style HUD Overlay */}
            <div className="absolute inset-0 z-50 pointer-events-none">
              {/* Top Bar */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent px-8 py-4 flex items-center justify-between text-white">
                <div>
                  <div className="text-[#ff2d55] text-3xl font-black tracking-[-2px]">MODEL CITIZEN</div>
                  <div className="text-xs tracking-[3px] text-white/50 -mt-1">VICE CITY • 1986</div>
                </div>

                <div className="text-right">
                  <div className="text-4xl font-mono text-[#ff2d55] tracking-wider">${cash.toLocaleString()}</div>
                  <div className="text-xs tracking-[2px] text-white/60">{time} • GOLD CREST</div>
                </div>
              </div>

              {/* Wanted Level - Big GTA Style */}
              <div className="absolute top-20 right-8 z-50">
                <div className="text-xs tracking-[4px] text-white/60 mb-1 text-right">WANTED</div>
                <div className="flex gap-1 justify-end">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 flex items-center justify-center text-2xl transition-all ${i < wantedLevel ? 'text-[#ff2d55] scale-110' : 'text-white/20'}`}
                    >
                      ★
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom HUD */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent px-8 py-6">
                <div className="flex justify-between items-end">
                  {/* Health / Armor */}
                  <div className="flex gap-8">
                    <div>
                      <div className="text-xs tracking-[3px] text-white/60 mb-1">HEALTH</div>
                      <div className="w-48 h-3 bg-[#111] rounded-full overflow-hidden border border-white/20">
                        <div className="h-full w-[78%] bg-[#ff2d55] transition-all" />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs tracking-[3px] text-white/60 mb-1">ARMOR</div>
                      <div className="w-48 h-3 bg-[#111] rounded-full overflow-hidden border border-white/20">
                        <div className="h-full w-[45%] bg-[#4ade80] transition-all" />
                      </div>
                    </div>
                  </div>

                  {/* Weapon + Ammo */}
                  <div className="text-right">
                    <div className="text-xs tracking-[3px] text-white/60">PISTOL • 17 / 120</div>
                    <div className="text-2xl font-bold tracking-widest text-white">9MM</div>
                  </div>

                  {/* Objective reminder */}
                  <div className="text-right max-w-[280px]">
                    <div className="text-xs tracking-[3px] text-[#ff2d55]">OBJECTIVE</div>
                    <div className="text-sm text-white/90">Host the Charity Auction</div>
                  </div>
                </div>
              </div>

              {/* Minimap / Radar (simple version) */}
              <div className="absolute bottom-24 left-8 w-36 h-36 rounded-full border-2 border-white/30 bg-black/60 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#ff2d55_0.8px,transparent_1px)] bg-[length:6px_6px] opacity-40" />
                <div className="absolute top-1/2 left-1/2 w-2 h-2 -mt-1 -ml-1 bg-[#ff2d55] rounded-full" />
                {/* Fake blips */}
                <div className="absolute top-[35%] left-[60%] w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                <div className="absolute top-[68%] left-[25%] w-1.5 h-1.5 bg-[#4ade80] rounded-full" />
              </div>
            </div>

            {/* The actual 3D world */}
            <ThreeWorld />
          </div>
        )}
      </div>
    </div>
  );
}
