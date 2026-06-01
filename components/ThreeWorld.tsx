'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Avatar({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  const group = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (group.current) {
      group.current.position.set(...position);
      group.current.rotation.y = rotation;
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

function City() {
  return (
    <group>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0c0f18" />
      </mesh>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[16, 200]} />
        <meshStandardMaterial color="#151a26" />
      </mesh>

      {[-55, 55].map((x, i) => (
        <mesh key={i} position={[x, 24, -48]} castShadow receiveShadow>
          <boxGeometry args={[26, 48, 26]} />
          <meshStandardMaterial color="#1c2438" />
        </mesh>
      ))}
      {[-55, 55].map((x, i) => (
        <mesh key={i} position={[x, 20, 52]} castShadow receiveShadow>
          <boxGeometry args={[26, 40, 26]} />
          <meshStandardMaterial color="#1c2438" />
        </mesh>
      ))}

      {/* Neon signs */}
      <mesh position={[-54, 34, -47]} castShadow>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial color="#ff2d55" emissive="#ff2d55" emissiveIntensity={2.2} />
      </mesh>
      <mesh position={[54, 30, 51]} castShadow>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial color="#ff2d55" emissive="#ff2d55" emissiveIntensity={2.2} />
      </mesh>
    </group>
  );
}

function PlayerController({ onUpdate }: { onUpdate: (pos: [number, number, number], rot: number) => void }) {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const pos = useRef<[number, number, number]>([0, 0, 0]);
  const rot = useRef(0);
  const yaw = useRef(0); // mouse look

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        yaw.current -= e.movementX * 0.002;
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
    const speed = 26 * delta;
    let [x, y, z] = pos.current;
    let newRot = rot.current;

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
    }

    // Move relative to camera yaw
    const moveAngle = yaw.current;
    const worldMoveX = moveX * Math.cos(moveAngle) - moveZ * Math.sin(moveAngle);
    const worldMoveZ = moveX * Math.sin(moveAngle) + moveZ * Math.cos(moveAngle);

    x += worldMoveX * speed;
    z += worldMoveZ * speed;

    if (moveX !== 0 || moveZ !== 0) {
      newRot = yaw.current + Math.atan2(moveX, moveZ);
    }

    x = Math.max(-85, Math.min(85, x));
    z = Math.max(-85, Math.min(85, z));

    pos.current = [x, y, z];
    rot.current = newRot;

    onUpdate(pos.current, rot.current);

    // Camera
    const camX = x - Math.sin(yaw.current) * 15;
    const camZ = z - Math.cos(yaw.current) * 15;

    camera.position.x = camX;
    camera.position.y = 15.5;
    camera.position.z = camZ;
    camera.lookAt(x, 4, z);
  });

  return null;
}

export default function ThreeWorld() {
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 0, 0]);
  const [playerRot, setPlayerRot] = useState(0);

  const handleUpdate = (pos: [number, number, number], rot: number) => {
    setPlayerPos(pos);
    setPlayerRot(rot);
  };

  return (
    <div className="relative w-full h-[660px] rounded-2xl overflow-hidden border border-[#ff2d55]/30 bg-black cursor-pointer">
      <Canvas camera={{ position: [0, 15, 16], fov: 62 }} style={{ background: '#0a0c14' }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[60, 80, 50]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />

        <City />
        <Avatar position={playerPos} rotation={playerRot} />
        <PlayerController onUpdate={handleUpdate} />
      </Canvas>

      <div className="absolute bottom-5 left-5 text-xs tracking-[3px] text-[#444]">
        WASD = MOVE • CLICK TO LOCK MOUSE • MOUSE = LOOK
      </div>
      <div className="absolute top-5 right-5 bg-black/60 px-4 py-1 text-xs tracking-widest">
        GOLDCREST HILLS • MODEL CITIZEN
      </div>
    </div>
  );
}
