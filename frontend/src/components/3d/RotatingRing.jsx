import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Ring } from '@react-three/drei';

const RotatingRing = ({ position = [0, 0, 0], radius = 1.2, color = '#00d4ff' }) => {
  const ringRef = useRef();

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.getElapsedTime() * 0.5;
      ringRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.5;
    }
  });

  return (
    <group ref={ringRef} position={position}>
      <Ring args={[radius, radius + 0.08, 64]} rotation-x={Math.PI / 2}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </Ring>
      <Ring args={[radius + 0.3, radius + 0.38, 64]} rotation-x={Math.PI / 2 + 0.5}>
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.3} />
      </Ring>
    </group>
  );
};

export default RotatingRing;