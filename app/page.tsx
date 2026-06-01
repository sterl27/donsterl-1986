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
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1a1f2e_0.8px,transparent_1px)] bg-[length:5px_5px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-black/95" />

      {/* Floating Notifications */}
      <div className="fixed top-6 right-6 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#ff2d55] text-black px-6 py-2.5 text-sm font-bold tracking-[2px] rounded-lg shadow-xl"
            >
              {msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="relative z-10 p-5 max-w-[1540px] mx-auto">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-[#ff2d55] text-[46px] leading-none font-black tracking-[-4.5px]">MODEL CITIZEN</div>
            <div className="text-[10px] tracking-[5px] text-[#ff2d55]/60 -mt-1">VICE CITY • 1986</div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setView('dashboard')} 
              className={`px-8 py-2.5 text-sm font-semibold tracking-[1px] transition-all duration-200 ${view === 'dashboard' 
                ? 'bg-[#ff2d55] text-black shadow-lg' 
                : 'border border-white/25 hover:bg-white/5'}`}
            >
              MANAGEMENT
            </button>
            <button 
              onClick={() => setView('world')} 
              className={`px-8 py-2.5 text-sm font-semibold tracking-[1px] transition-all duration-200 ${view === 'world' 
                ? 'bg-[#ff2d55] text-black shadow-lg' 
                : 'border border-white/25 hover:bg-white/5'}`}
            >
              3D WORLD
            </button>
          </div>

          <div className="text-right">
            <div className="text-3xl font-mono text-[#ff2d55] tracking-wider">${cash.toLocaleString()}</div>
            <div className="text-[10px] text-[#555] -mt-1 tracking-[2px]">CASH ON HAND</div>
          </div>
        </div>

        {view === 'dashboard' ? (
          /* PREMIUM MANAGEMENT DASHBOARD */
          <div className="grid grid-cols-12 gap-5">
            {/* Character Card */}
            <div className="col-span-12 md:col-span-3 bg-[#11151f] border border-[#ff2d55]/30 rounded-3xl p-8">
              <div className="uppercase text-xs tracking-[4px] text-[#ff2d55]">GOLDCREST SOCIETY FIXER</div>
              <div className="text-[42px] font-bold tracking-[-2px] leading-[42px] mt-4">VICTORIA<br />‘VIX’ LANG</div>
              <div className="text-[#777] mt-3 text-sm">Society Lawyer &amp; Political Fixer</div>

              <div className="mt-10 grid grid-cols-2 gap-3">
                <button className="bg-[#ff2d55] py-4 text-sm font-bold text-black tracking-[1px] active:scale-[0.985] transition">RECRUIT</button>
                <button className="border border-white/20 py-4 text-sm tracking-[1px] active:scale-[0.985] transition">DISMISS</button>
              </div>
            </div>

            {/* Objective Banner */}
            <div className="col-span-12 md:col-span-6 bg-[#11151f] border border-[#ff2d55]/30 rounded-3xl p-8 flex flex-col justify-center">
              <div className="text-xs tracking-[4px] text-[#ff2d55]">CURRENT OBJECTIVE</div>
              <div className="text-3xl font-bold tracking-[-1px] mt-2">HOST THE CHARITY AUCTION</div>
              <div className="text-[#666] mt-1">Goldcrest Hills Estate • {time}</div>
            </div>

            {/* Right HUD */}
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
                  <div key={car.id} className="bg-[#0a0c14] rounded-2xl p-5 border border-white/10">
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
                  </div>
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
                      transition={{ duration: 0.5 }}
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
          <ThreeWorld />
        )}
      </div>
    </div>
  );
}
