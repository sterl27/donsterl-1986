'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    }, 2200);
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/95" />

      {/* Floating Notifications */}
      <div className="fixed top-6 right-6 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#ff2d55] text-black px-5 py-2 text-sm font-bold tracking-widest rounded"
            >
              {msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="relative z-10 p-4 max-w-[1520px] mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-[#ff2d55] text-[42px] leading-none font-black tracking-[-4px]">MODEL CITIZEN</div>
            <div className="text-[10px] tracking-[4px] text-[#ff2d55]/70 -mt-1">VICE CITY • 1986</div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setView('dashboard')} className={`px-7 py-2 text-sm font-medium transition-all ${view === 'dashboard' ? 'bg-[#ff2d55] text-black' : 'border border-white/30'}`}>
              MANAGEMENT
            </button>
            <button onClick={() => setView('world')} className={`px-7 py-2 text-sm font-medium transition-all ${view === 'world' ? 'bg-[#ff2d55] text-black' : 'border border-white/30'}`}>
              3D WORLD
            </button>
          </div>

          <div className="text-right font-mono">
            <div className="text-2xl text-[#ff2d55]">${cash.toLocaleString()}</div>
            <div className="text-[10px] text-[#666] -mt-1">CASH</div>
          </div>
        </div>

        {view === 'dashboard' ? (
          <div className="grid grid-cols-12 gap-4">
            {/* Character Card */}
            <div className="col-span-12 md:col-span-3 bg-[#11151f] border border-[#ff2d55]/40 rounded-2xl p-6">
              <div className="uppercase text-xs tracking-[3px] text-[#ff2d55]">GOLDCREST SOCIETY FIXER</div>
              <div className="text-4xl font-bold tracking-[-1.5px] mt-3 leading-none">VICTORIA<br />‘VIX’ LANG</div>
              <div className="text-sm text-[#777] mt-4">Society Lawyer &amp; Political Fixer</div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <button className="bg-[#ff2d55] py-3 text-sm font-bold text-black active:scale-[0.985]">RECRUIT</button>
                <button className="border border-white/30 py-3 text-sm active:scale-[0.985]">DISMISS</button>
              </div>
            </div>

            {/* Objective */}
            <div className="col-span-12 md:col-span-6 bg-[#11151f] border border-[#ff2d55]/40 rounded-2xl p-5 flex flex-col justify-center">
              <div className="text-xs tracking-[3px] text-[#ff2d55]">CURRENT OBJECTIVE</div>
              <div className="text-2xl font-bold tracking-tight mt-1">HOST THE CHARITY AUCTION</div>
              <div className="text-[#888] text-sm mt-1">Goldcrest Hills Estate • 11:11 AM</div>
            </div>

            {/* Right HUD */}
            <div className="col-span-12 md:col-span-3 bg-[#11151f] border border-[#ff2d55]/40 rounded-2xl p-5">
              <div className="flex justify-between text-xs">
                <div>WANTED</div>
                <div className="text-[#ff2d55] tracking-widest">{'★'.repeat(wantedLevel)}{'☆'.repeat(5-wantedLevel)}</div>
              </div>
              <div className="mt-4 text-xs text-[#888]">TIME: {time}</div>
              <div className="text-xs text-[#888]">AMMO: 17/120</div>
            </div>

            {/* Luxury Fleet */}
            <div className="col-span-12 md:col-span-7 bg-[#11151f] border border-[#ff2d55]/40 rounded-2xl p-6">
              <div className="text-[#ff2d55] text-sm tracking-[2px] mb-4">LUXURY FLEET</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {fleet.map(car => (
                  <div key={car.id} className="bg-[#0a0c14] rounded-xl p-4 border border-white/10">
                    <div className="font-semibold text-lg">{car.name}</div>
                    <div className="text-xs text-[#666]">{car.model}</div>
                    <div className="text-yellow-400 text-sm mt-3 tracking-widest">{'★'.repeat(car.level)}{'☆'.repeat(5-car.level)}</div>
                    <button 
                      onClick={() => upgradeCar(car.id)}
                      disabled={car.level >= 5}
                      className="mt-4 w-full bg-[#ff2d55] py-2 text-xs font-bold text-black disabled:opacity-40 active:scale-[0.985]"
                    >
                      {car.level >= 5 ? "MAX LEVEL" : "UPGRADE"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Art Gallery */}
            <div className="col-span-12 md:col-span-5 bg-[#11151f] border border-[#ff2d55]/40 rounded-2xl p-6">
              <div className="text-[#ff2d55] text-sm tracking-[2px] mb-4">ART GALLERY VENTURES</div>
              {artGallery.map((art, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <div>{art.name}</div>
                    <div className="text-[#ff2d55]">{art.influence}</div>
                  </div>
                  <div className="h-2 bg-[#0a0c14] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-2 bg-[#ff2d55] rounded-full" 
                      animate={{ width: `${art.influence}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              ))}

              <div className="flex gap-3 mt-6">
                <button onClick={expandInfluence} className="flex-1 bg-[#ff2d55] py-3 text-sm font-bold text-black active:scale-[0.985]">
                  EXPAND INFLUENCE
                </button>
                <button onClick={hostGala} className="flex-1 border border-white/30 py-3 text-sm active:scale-[0.985]">
                  HOST GALA
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-[#555]">
            3D World view (switch back to Management)
          </div>
        )}
      </div>
    </div>
  );
}
