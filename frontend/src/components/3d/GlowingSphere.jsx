import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

const GlowingSphere = ({ position = [0, 0, 0], size = 0.5 }) => {
  const sphereRef = useRef();

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.3;
    }
  });

  return (
    <Sphere ref={sphereRef} args={[size, 64, 64]} position={position}>
      <MeshDistortMaterial
        color="#7c3aed"
        emissive="#4c1d95"
        emissiveIntensity={0.5}
        metalness={0.9}
        roughness={0.1}
        distort={0.4}
        speed={2}
      />
    </Sphere>
  );
};

export default GlowingSphere;