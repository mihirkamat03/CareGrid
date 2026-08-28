import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import './Hero3D.css';

const DNAHelix = () => {
  const meshRef = useRef();
  
  const geometry = useMemo(() => new THREE.SphereGeometry(0.1, 14, 14), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ 
    transparent: true,
    opacity: 0.75,
    emissiveIntensity: 0.6,
    roughness: 0.1,
    metalness: 0.9
  }), []);

  const numPairs = 45;
  const numSpheres = numPairs * 2;
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(numSpheres * 3);
    const col = new Float32Array(numSpheres * 3);
    
    const color1 = new THREE.Color('#38bdf8'); // Electric Sky
    const color2 = new THREE.Color('#10b981'); // Emerald
    
    let index = 0;
    const height = 18;
    const radius = 1.8;
    
    for (let i = 0; i < numPairs; i++) {
      const t = (i / numPairs) * Math.PI * 4;
      const y = (i / numPairs) * height - height / 2;
      
      // Strand 1
      pos[index * 3] = Math.cos(t) * radius;
      pos[index * 3 + 1] = y;
      pos[index * 3 + 2] = Math.sin(t) * radius;
      col[index * 3] = color1.r;
      col[index * 3 + 1] = color1.g;
      col[index * 3 + 2] = color1.b;
      index++;
      
      // Strand 2
      pos[index * 3] = Math.cos(t + Math.PI) * radius;
      pos[index * 3 + 1] = y;
      pos[index * 3 + 2] = Math.sin(t + Math.PI) * radius;
      col[index * 3] = color2.r;
      col[index * 3 + 1] = color2.g;
      col[index * 3 + 2] = color2.b;
      index++;
    }
    
    return [pos, col];
  }, [numPairs, numSpheres]);

  useEffect(() => {
    if (meshRef.current) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < numSpheres; i++) {
        dummy.position.set(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        );
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        meshRef.current.setColorAt(i, new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]));
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [positions, colors, numSpheres]);

  useFrame((state) => {
    if (meshRef.current) {
      const scrollY = window.scrollY || 0;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15 + scrollY * 0.0015;
      meshRef.current.position.y = -scrollY * 0.003;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <instancedMesh ref={meshRef} args={[geometry, material, numSpheres]} position={[3.5, 0, -2]} />
    </Float>
  );
};

const MedicalCrosses = () => {
  const groupRef = useRef();
  
  const crosses = useMemo(() => {
    const items = [];
    for (let i = 0; i < 12; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 12
        ],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ],
        scale: 0.15 + Math.random() * 0.25,
        speed: 0.2 + Math.random() * 0.4
      });
    }
    return items;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const scrollY = window.scrollY || 0;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08 + scrollY * 0.001;
      groupRef.current.position.y = -scrollY * 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {crosses.map((cross, i) => (
        <Float key={i} speed={cross.speed} rotationIntensity={0.8} floatIntensity={0.8}>
          <group position={cross.position} rotation={cross.rotation} scale={cross.scale}>
            <mesh>
              <boxGeometry args={[1, 0.28, 0.08]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.4} transparent opacity={0.45} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.28, 1, 0.08]} />
              <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.4} transparent opacity={0.45} />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  );
};

const AmbientDust = ({ count }) => {
  const meshRef = useRef();
  
  const geometry = useMemo(() => new THREE.SphereGeometry(0.02, 6, 6), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ 
    color: '#ffffff',
    transparent: true,
    opacity: 0.25
  }), []);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useEffect(() => {
    if (meshRef.current) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < count; i++) {
        dummy.position.set(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        );
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [positions, count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.05;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} />
  );
};

class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn("Hero3D Canvas WebGL fallback:", error);
  }
  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export default function Hero3D() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="hero-3d-container">
      <CanvasErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 9], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ pointerEvents: 'none' }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[8, 8, 8]} intensity={1.2} color="#38bdf8" />
          <pointLight position={[-8, -8, -8]} intensity={1} color="#10b981" />
          
          <DNAHelix />
          <MedicalCrosses />
          <AmbientDust count={isMobile ? 120 : 300} />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
