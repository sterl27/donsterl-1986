'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Collectible {
  id: number;
  position: [number, number, number];
  collected: boolean;
}

function Avatar({ position, rotation, isMoving }: { 
  position: [number, number, number]; 
  rotation: number;
  isMoving: boolean;
}) {
  const group = useRef<THREE.Group>(null!);
  const bobRef = useRef(0);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.position.set(...position);
      group.current.rotation.y = rotation;

      if (isMoving) {
        bobRef.current += delta * 13;
        const bob = Math.sin(bobRef.current) * 0.09;
        group.current.position.y = bob;
      } else {
        bobRef.current = 0;
        group.current.position.y = 0;
      }
    }
  });

  return (
    <group ref={group}>
      <mesh position={[0, 1.4, 0]} castShadow>
        <capsuleGeometry args={[0.4, 1.2, 4, 8]} />
        <meshStandardMaterial color="#ff2d55" metalness={0.2} />
      </mesh>
      <mesh position={[0, 2.6, 0]} castShadow>
        <sphereGeometry args={[0.38]} />
        <meshStandardMaterial color="#f4d3b3" />
      </mesh>
      <mesh position={[0, 3.0, 0]} castShadow>
        <sphereGeometry args={[0.4]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </group>
  );
}

function City({ collectibles }: { collectibles: Collectible[] }) {
  return (
    <group>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[220, 220]} />
        <meshStandardMaterial color="#0c0f18" />
      </mesh>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[18, 220]} />
        <meshStandardMaterial color="#151a26" />
      </mesh>

      {/* Buildings */}
      {[-60, 60].map((x, i) => (
        <mesh key={i} position={[x, 26, -52]} castShadow receiveShadow>
          <boxGeometry args={[28, 52, 28]} />
          <meshStandardMaterial color="#1c2438" />
        </mesh>
      ))}
      {[-60, 60].map((x, i) => (
        <mesh key={i} position={[x, 22, 56]} castShadow receiveShadow>
          <boxGeometry args={[28, 44, 28]} />
          <meshStandardMaterial color="#1c2438" />
        </mesh>
      ))}

      {/* Neon */}
      <mesh position={[-59, 38, -51]} castShadow>
        <planeGeometry args={[16, 7]} />
        <meshStandardMaterial color="#ff2d55" emissive="#ff2d55" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[59, 34, 55]} castShadow>
        <planeGeometry args={[16, 7]} />
        <meshStandardMaterial color="#ff2d55" emissive="#ff2d55" emissiveIntensity={2.5} />
      </mesh>

      {/* Collectibles - glowing orbs */}
      {collectibles.map((item, index) => 
        !item.collected && (
          <mesh key={index} position={item.position} castShadow>
            <sphereGeometry args={[1.2]} />
            <meshStandardMaterial 
              color="#ff2d55" 
              emissive="#ff2d55" 
              emissiveIntensity={3}
            />
          </mesh>
        )
      )}
    </group>
  );
}

function PlayerController({ 
  onUpdate, 
  collectibles, 
  setCollectibles 
}: { 
  onUpdate: (pos: [number, number, number], rot: number, moving: boolean) => void;
  collectibles: Collectible[];
  setCollectibles: React.Dispatch<React.SetStateAction<Collectible[]>>;
}) {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const pos = useRef<[number, number, number]>([0, 0, 0]);
  const rot = useRef(0);
  const yaw = useRef(0);
  const isMovingRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; };
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
  }, []);

  useFrame((state, delta) => {
    const speed = 28 * delta;
    let [x, y, z] = pos.current;
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

    // Collectibles
    const newCollectibles = collectibles.map(item => {
      if (!item.collected) {
        const dx = x - item.position[0];
        const dz = z - item.position[2];
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 4) {
          return { ...item, collected: true };
        }
      }
      return item;
    });

    if (JSON.stringify(newCollectibles) !== JSON.stringify(collectibles)) {
      setCollectibles(newCollectibles);
    }

    x = Math.max(-90, Math.min(90, x));
    z = Math.max(-90, Math.min(90, z));

    pos.current = [x, y, z];
    rot.current = newRot;
    isMovingRef.current = moving;

    onUpdate(pos.current, rot.current, moving);

    const camX = x - Math.sin(yaw.current) * 16;
    const camZ = z - Math.cos(yaw.current) * 16;

    camera.position.x = camX;
    camera.position.y = 16;
    camera.position.z = camZ;
    camera.lookAt(x, 4.2, z);
  });

  return null;
}

export default function ThreeWorld() {
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 0, 0]);
  const [playerRot, setPlayerRot] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [cash, setCash] = useState(12450000);

  const [collectibles, setCollectibles] = useState<Collectible[]>([
    { id: 1, position: [-35, 2, -25], collected: false },
    { id: 2, position: [28, 2, -18], collected: false },
    { id: 3, position: [-12, 2, 32], collected: false },
    { id: 4, position: [42, 2, 38], collected: false },
    { id: 5, position: [-48, 2, 12], collected: false },
  ]);

  const collectedCount = collectibles.filter(c => c.collected).length;

  const handleUpdate = (pos: [number, number, number], rot: number, moving: boolean) => {
    setPlayerPos(pos);
    setPlayerRot(rot);
    setIsMoving(moving);
  };

  // Update cash when collecting
  useEffect(() => {
    const collected = collectibles.filter(c => c.collected).length;
    if (collected > 0) {
      setCash(12450000 + collected * 25000);
    }
  }, [collectibles]);

  return (
    <div className="relative w-full h-[680px] rounded-2xl overflow-hidden border border-[#ff2d55]/30 bg-black cursor-pointer">
      <Canvas camera={{ position: [0, 16, 16], fov: 62 }} style={{ background: '#0a0c14' }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[60, 85, 55]} intensity={1.6} castShadow shadow-mapSize={[2048, 2048]} />

        <City collectibles={collectibles} />
        <Avatar position={playerPos} rotation={playerRot} isMoving={isMoving} />
        <PlayerController 
          onUpdate={handleUpdate} 
          collectibles={collectibles} 
          setCollectibles={setCollectibles} 
        />
      </Canvas>

      {/* Minimap */}
      <div className="absolute top-4 right-4 w-36 h-36 bg-black/70 border border-[#ff2d55]/40 rounded-full overflow-hidden">
        <div className="relative w-full h-full">
          {/* Player dot */}
          <div 
            className="absolute w-2.5 h-2.5 bg-[#ff2d55] rounded-full z-10"
            style={{
              left: `${((playerPos[0] + 90) / 180) * 100}%`,
              top: `${((playerPos[2] + 90) / 180) * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
          {/* Collectibles on minimap */}
          {collectibles.map((c, i) => 
            !c.collected && (
              <div 
                key={i}
                className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full"
                style={{
                  left: `${((c.position[0] + 90) / 180) * 100}%`,
                  top: `${((c.position[2] + 90) / 180) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            )
          )}
        </div>
      </div>

      {/* HUD */}
      <div className="absolute bottom-5 left-5 text-xs tracking-[3px] text-[#444]">
        WASD = MOVE • CLICK + MOUSE = LOOK
      </div>
      <div className="absolute top-5 left-5 bg-black/60 px-4 py-1 text-xs tracking-widest">
        CASH: <span className="text-[#ff2d55]">${cash.toLocaleString()}</span> • COLLECTED: {collectedCount}/5
      </div>
    </div>
  );
}
