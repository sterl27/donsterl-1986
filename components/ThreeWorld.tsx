'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Collectible {
  id: number;
  position: [number, number, number];
  collected: boolean;
}

interface Mission {
  id: number;
  title: string;
  completed: boolean;
  reward: number;
}

function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const footstepOscRef = useRef<OscillatorNode | null>(null);
  const engineOscRef = useRef<OscillatorNode | null>(null);
  const engineGainRef = useRef<GainNode | null>(null);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playFootstep = () => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'square';
    osc.frequency.value = 80;
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    gain.gain.value = 0.08;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.stop(ctx.currentTime + 0.2);
  };

  const startEngine = (speed: number = 1) => {
    const ctx = getAudioContext();
    if (engineOscRef.current) {
      // Update pitch based on speed
      engineOscRef.current.frequency.value = 38 + (speed * 18);
      if (engineGainRef.current) {
        engineGainRef.current.gain.value = 0.1 + (speed * 0.08);
      }
      return;
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.value = 38 + (speed * 18);
    filter.type = 'lowpass';
    filter.frequency.value = 280;
    gain.gain.value = 0.1 + (speed * 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    engineOscRef.current = osc;
    engineGainRef.current = gain;
  };

  const stopEngine = () => {
    if (engineOscRef.current) {
      engineOscRef.current.stop();
      engineOscRef.current = null;
      engineGainRef.current = null;
    }
  };

  return { playFootstep, startEngine, stopEngine };
}

function ImprovedAvatar({ position, rotation, isMoving }: { 
  position: [number, number, number]; 
  rotation: number;
  isMoving: boolean;
}) {
  const group = useRef<THREE.Group>(null!);
  const leftLegRef = useRef<THREE.Group>(null!);
  const rightLegRef = useRef<THREE.Group>(null!);
  const bobRef = useRef(0);
  const walkRef = useRef(0);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.position.set(...position);
      group.current.rotation.y = rotation;

      if (isMoving) {
        bobRef.current += delta * 14;
        group.current.position.y = Math.sin(bobRef.current) * 0.08;

        walkRef.current += delta * 11;
        const legSwing = Math.sin(walkRef.current) * 0.75;

        if (leftLegRef.current) leftLegRef.current.rotation.x = legSwing;
        if (rightLegRef.current) rightLegRef.current.rotation.x = -legSwing;
      } else {
        bobRef.current = 0;
        group.current.position.y = 0;
        if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
        if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      }
    }
  });

  return (
    <group ref={group}>
      {/* Body */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <capsuleGeometry args={[0.42, 1.1, 4, 8]} />
        <meshStandardMaterial color="#ff2d55" metalness={0.2} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 2.65, 0]} castShadow>
        <sphereGeometry args={[0.38]} />
        <meshStandardMaterial color="#f4d3b3" />
      </mesh>
      <mesh position={[0, 3.05, 0]} castShadow>
        <sphereGeometry args={[0.4]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.22, 0.85, 0]}>
        <mesh position={[0, -0.6, 0]} castShadow>
          <capsuleGeometry args={[0.13, 0.9, 4, 6]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.22, 0.85, 0]}>
        <mesh position={[0, -0.6, 0]} castShadow>
          <capsuleGeometry args={[0.13, 0.9, 4, 6]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
    </group>
  );
}

function CarModel({ position, rotation, isPlayerCar }: { 
  position: [number, number, number]; 
  rotation: number;
  isPlayerCar?: boolean;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[3.2, 1.4, 5.5]} />
        <meshStandardMaterial color={isPlayerCar ? "#ff2d55" : "#1f2535"} />
      </mesh>
      <mesh position={[0, 2.1, 0]} castShadow>
        <boxGeometry args={[2.4, 1.1, 3]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </group>
  );
}

function StreetLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 8, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 16, 6]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0, 16, 0]} castShadow>
        <sphereGeometry args={[0.8]} />
        <meshStandardMaterial color="#fffbeb" emissive="#fffbeb" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[0, 16, 0]} color="#fffbeb" intensity={1.2} distance={35} />
    </group>
  );
}

function City({ collectibles }: { collectibles: Collectible[] }) {
  return (
    <group>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[240, 240]} />
        <meshStandardMaterial color="#0c0f18" />
      </mesh>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[20, 240]} />
        <meshStandardMaterial color="#151a26" />
      </mesh>

      {[-65, 65].map((x, i) => (
        <mesh key={i} position={[x, 28, -55]} castShadow receiveShadow>
          <boxGeometry args={[30, 56, 30]} />
          <meshStandardMaterial color="#1c2438" />
        </mesh>
      ))}
      {[-65, 65].map((x, i) => (
        <mesh key={i} position={[x, 24, 60]} castShadow receiveShadow>
          <boxGeometry args={[30, 48, 30]} />
          <meshStandardMaterial color="#1c2438" />
        </mesh>
      ))}

      <mesh position={[-64, 42, -54]} castShadow>
        <planeGeometry args={[18, 8]} />
        <meshStandardMaterial color="#ff2d55" emissive="#ff2d55" emissiveIntensity={2.8} />
      </mesh>

      <StreetLight position={[-35, 0, -35]} />
      <StreetLight position={[35, 0, -35]} />
      <StreetLight position={[-35, 0, 40]} />
      <StreetLight position={[35, 0, 40]} />
      <StreetLight position={[-70, 0, 0]} />
      <StreetLight position={[70, 0, 0]} />
    </group>
  );
}

function PlayerController({ 
  onUpdate, 
  collectibles, 
  setCollectibles,
  isInCar,
  setIsInCar,
  carPos,
  setCarPos,
  wantedLevel,
  setWantedLevel,
  missions,
  setMissions,
  playFootstep,
  startEngine,
  stopEngine
}: { 
  onUpdate: (pos: [number, number, number], rot: number, moving: boolean) => void;
  collectibles: Collectible[];
  setCollectibles: React.Dispatch<React.SetStateAction<Collectible[]>>;
  isInCar: boolean;
  setIsInCar: React.Dispatch<React.SetStateAction<boolean>>;
  carPos: [number, number, number];
  setCarPos: React.Dispatch<React.SetStateAction<[number, number, number]>>;
  wantedLevel: number;
  setWantedLevel: React.Dispatch<React.SetStateAction<number>>;
  missions: Mission[];
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>;
  playFootstep: () => void;
  startEngine: () => void;
  stopEngine: () => void;
}) {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const pos = useRef<[number, number, number]>([0, 0, 0]);
  const rot = useRef(0);
  const yaw = useRef(0);
  const isMovingRef = useRef(false);
  const lastFootstep = useRef(0);
  const lastCollectTime = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === 'e') {
        const distToCar = Math.sqrt(
          Math.pow(pos.current[0] - carPos[0], 2) + 
          Math.pow(pos.current[2] - carPos[2], 2)
        );
        if (distToCar < 8) {
          setIsInCar(!isInCar);
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        yaw.current -= e.movementX * 0.0022;
      }
    };

    const handleClick = () => {
      const canvas = document.querySelector('canvas');
      if (canvas) canvas.requestPointerLock();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [isInCar, carPos]);

  useFrame((state, delta) => {
    const speed = isInCar ? 52 * delta : 28 * delta;
    let [x, y, z] = isInCar ? carPos : pos.current;
    let newRot = rot.current;
    let moving = false;

    const forward = keys.current['w'] || keys.current['arrowup'];
    const backward = keys.current['s'] || keys.current['arrowdown'];
    const left = keys.current['a'] || keys.current['arrowleft'];
    const right = keys.current['d'] || keys.current['arrowright'];

    let moveX = 0;
    let moveZ = 0;

    if (forward) moveZ -= 1;
    if (backward) moveZ += 1;
    if (left) moveX -= 1;
    if (right) moveX += 1;

    const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (len > 0) {
      moveX /= len;
      moveZ /= len;
      moving = true;
    }

    const moveAngle = yaw.current;
    const worldMoveX = moveX * Math.cos(moveAngle) - moveZ * Math.sin(moveAngle);
    const worldMoveZ = moveX * Math.sin(moveAngle) + moveZ * Math.cos(moveAngle);

    x += worldMoveX * speed;
    z += worldMoveZ * speed;

    if (moving) {
      newRot = yaw.current + Math.atan2(moveX, moveZ);
    }

    // Footstep sounds
    if (moving && !isInCar) {
      const now = Date.now();
      if (now - lastFootstep.current > 280) {
        lastFootstep.current = now;
        playFootstep();
      }
    }

    // Engine sound with speed variation
    if (isInCar) {
      const currentSpeed = moving ? 1 : 0.3;
      startEngine(currentSpeed);
    } else {
      stopEngine();
    }

    // Collectibles + Wanted + Missions
    const now = Date.now();
    const newCollectibles = collectibles.map(item => {
      if (!item.collected) {
        const dx = x - item.position[0];
        const dz = z - item.position[2];
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 4.5) {
          if (now - lastCollectTime.current > 400) {
            lastCollectTime.current = now;
            if (isInCar) {
              setWantedLevel(Math.min(5, wantedLevel + 1));
            }
          }
          return { ...item, collected: true };
        }
      }
      return item;
    });

    const collectedCount = newCollectibles.filter(c => c.collected).length;
    const newMissions = missions.map(m => {
      if (!m.completed && collectedCount >= 3 && m.id === 1) {
        return { ...m, completed: true };
      }
      return m;
    });

    if (JSON.stringify(newMissions) !== JSON.stringify(missions)) {
      setMissions(newMissions);
    }

    if (JSON.stringify(newCollectibles) !== JSON.stringify(collectibles)) {
      setCollectibles(newCollectibles);
    }

    x = Math.max(-95, Math.min(95, x));
    z = Math.max(-95, Math.min(95, z));

    if (isInCar) {
      setCarPos([x, y, z]);
    } else {
      pos.current = [x, y, z];
    }
    rot.current = newRot;
    isMovingRef.current = moving;

    onUpdate(isInCar ? carPos : pos.current, newRot, moving);

    const camX = x - Math.sin(yaw.current) * (isInCar ? 22 : 16);
    const camZ = z - Math.cos(yaw.current) * (isInCar ? 22 : 16);

    camera.position.x = camX;
    camera.position.y = isInCar ? 19 : 16;
    camera.position.z = camZ;
    camera.lookAt(x, isInCar ? 3 : 4.2, z);
  });

  return null;
}

export default function ThreeWorld() {
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 0, 0]);
  const [playerRot, setPlayerRot] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isInCar, setIsInCar] = useState(false);
  const [carPos, setCarPos] = useState<[number, number, number]>([18, 0, -22]);
  const [wantedLevel, setWantedLevel] = useState(1);

  const [collectibles, setCollectibles] = useState<Collectible[]>([
    { id: 1, position: [-42, 2, -28], collected: false },
    { id: 2, position: [35, 2, -15], collected: false },
    { id: 3, position: [-18, 2, 38], collected: false },
    { id: 4, position: [48, 2, 42], collected: false },
    { id: 5, position: [-55, 2, 18], collected: false },
  ]);

  const [missions, setMissions] = useState<Mission[]>([
    { id: 1, title: "Collect 3 items", completed: false, reward: 150000 },
    { id: 2, title: "Drive the car", completed: false, reward: 80000 },
  ]);

  const collectedCount = collectibles.filter(c => c.collected).length;
  const [cash, setCash] = useState(12450000);

  const { playFootstep, startEngine, stopEngine } = useSound();

  const handleUpdate = (pos: [number, number, number], rot: number, moving: boolean) => {
    setPlayerPos(pos);
    setPlayerRot(rot);
    setIsMoving(moving);
  };

  useEffect(() => {
    const collected = collectibles.filter(c => c.collected).length;
    setCash(12450000 + collected * 28000);
  }, [collectibles]);

  return (
    <div className="relative w-full h-[700px] rounded-2xl overflow-hidden border border-[#ff2d55]/30 bg-black cursor-pointer">
      <Canvas camera={{ position: [0, 16, 16], fov: 62 }} style={{ background: '#0a0c14' }} shadows>
        <ambientLight intensity={0.45} />
        <directionalLight position={[65, 90, 60]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />

        <fog attach="fog" args={['#0a0c14', 45, 140]} />

        <City collectibles={collectibles} />
        {!isInCar && <ImprovedAvatar position={playerPos} rotation={playerRot} isMoving={isMoving} />}
        <CarModel position={carPos} rotation={playerRot} isPlayerCar={isInCar} />
        
        <PlayerController 
          onUpdate={handleUpdate} 
          collectibles={collectibles} 
          setCollectibles={setCollectibles}
          isInCar={isInCar}
          setIsInCar={setIsInCar}
          carPos={carPos}
          setCarPos={setCarPos}
          wantedLevel={wantedLevel}
          setWantedLevel={setWantedLevel}
          missions={missions}
          setMissions={setMissions}
          playFootstep={playFootstep}
          startEngine={startEngine}
          stopEngine={stopEngine}
        />
      </Canvas>

      {/* Minimap */}
      <div className="absolute top-4 right-4 w-40 h-40 bg-black/70 border border-[#ff2d55]/40 rounded-full overflow-hidden">
        <div className="relative w-full h-full">
          <div className="absolute w-2.5 h-2.5 bg-[#ff2d55] rounded-full z-10" 
               style={{ left: `${((playerPos[0] + 95) / 190) * 100}%`, top: `${((playerPos[2] + 95) / 190) * 100}%`, transform: 'translate(-50%, -50%)' }} />
          {collectibles.map((c, i) => !c.collected && (
            <div key={i} className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full" 
                 style={{ left: `${((c.position[0] + 95) / 190) * 100}%`, top: `${((c.position[2] + 95) / 190) * 100}%`, transform: 'translate(-50%, -50%)' }} />
          ))}
        </div>
      </div>

      {/* Wanted Level */}
      <div className="absolute top-4 left-4 bg-black/70 px-4 py-1 text-xs tracking-widest border border-[#ff2d55]/40">
        WANTED: <span className="text-[#ff2d55]">{'★'.repeat(wantedLevel)}{'☆'.repeat(5 - wantedLevel)}</span>
      </div>

      {/* Missions */}
      <div className="absolute bottom-20 left-4 bg-black/70 p-3 text-xs w-64 border border-[#ff2d55]/40">
        <div className="text-[#ff2d55] mb-1 tracking-widest">MISSIONS</div>
        {missions.map(m => (
          <div key={m.id} className={m.completed ? "line-through text-[#555]" : ""}>
            {m.title} {m.completed ? "✓" : ""}
          </div>
        ))}
      </div>

      <div className="absolute bottom-5 left-5 text-xs tracking-[3px] text-[#444]">
        WASD = MOVE • E = ENTER/EXIT CAR • MOUSE = LOOK
      </div>
      <div className="absolute top-5 left-5 bg-black/60 px-4 py-1 text-xs tracking-widest">
        CASH: <span className="text-[#ff2d55]">${cash.toLocaleString()}</span> • {collectedCount}/5
      </div>
    </div>
  );
}
