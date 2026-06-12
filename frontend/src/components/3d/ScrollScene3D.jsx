import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text3D, Sparkles, Trail } from '@react-three/drei';
import * as THREE from 'three';

// Main Scene with Scroll Tracking
const ScrollScene = () => {
  const [scrollY, setScrollY] = useState(0);
  const groupRef = useRef();
  const cubeRef = useRef();
  const sphereRef = useRef();
  const torusRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotate based on scroll
      groupRef.current.rotation.y = scrollY * 0.005;
      groupRef.current.rotation.x = scrollY * 0.002;
    }

    if (cubeRef.current) {
      // Pulse effect based on scroll
      const scale = 1 + Math.sin(scrollY * 0.01) * 0.1;
      cubeRef.current.scale.setScalar(scale);
    }

    if (sphereRef.current) {
      // Float up and down
      sphereRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
    }

    if (torusRef.current) {
      // Rotate torus
      torusRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      torusRef.current.rotation.z = scrollY * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Rotating Cube Ring */}
      <group position={[0, 0, -5]}>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
              ref={i === 0 ? cubeRef : null}
            >
              <boxGeometry args={[0.4, 0.4, 0.4]} />
              <meshStandardMaterial
                color={new THREE.Color().setHSL(0.55 + i * 0.05, 1, 0.5)}
                emissive={new THREE.Color().setHSL(0.55 + i * 0.05, 1, 0.2)}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          );
        })}
      </group>

      {/* Central Glowing Sphere */}
      <mesh ref={sphereRef} position={[0, 0, -3]}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Floating Torus Knot */}
      <mesh ref={torusRef} position={[2, 1, -4]}>
        <torusKnotGeometry args={[0.6, 0.15, 128, 16, 3, 4]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#7c3aed"
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Second Torus */}
      <mesh position={[-2, -1, -4]}>
        <torusGeometry args={[0.7, 0.08, 64, 128]} />
        <meshStandardMaterial
          color="#ff6b6b"
          emissive="#ff6b6b"
          emissiveIntensity={0.3}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
};

// Floating Particles that react to scroll
const ScrollParticles = () => {
  const [scrollY, setScrollY] = useState(0);
  const pointsRef = useRef();

  const particlesCount = 1500;
  const positions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 20;
    }
    return positions;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = scrollY * 0.003;
      pointsRef.current.rotation.x = scrollY * 0.001;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={particlesCount} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#00d4ff"
        size={0.05}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Scroll Progress Bar 3D
const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const meshRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.x = progress / 100;
    }
  });

  return (
    <mesh position={[0, -4.5, 0]} ref={meshRef}>
      <boxGeometry args={[8, 0.1, 0.1]} />
      <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} />
    </mesh>
  );
};

// Main Component
const ScrollScene3D = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      zIndex: 0,
      pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#7c3aed" />
        <pointLight position={[0, 5, 5]} intensity={0.4} color="#00d4ff" />

        <ScrollParticles />
        <ScrollScene />
        <ScrollProgressBar />

        <Environment preset="night" background={false} />
        <Sparkles count={100} scale={20} size={0.5} speed={0.5} />
      </Canvas>
    </div>
  );
};

export default ScrollScene3D;