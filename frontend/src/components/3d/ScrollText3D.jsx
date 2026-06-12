import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

const ScrollText3D = () => {
  const [scrollY, setScrollY] = useState(0);
  const textRef = useRef();
  const groupRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame(() => {
    if (textRef.current) {
      // Change color based on scroll
      const hue = (scrollY * 0.002) % 1;
      textRef.current.material.color.setHSL(hue, 1, 0.5);
      textRef.current.material.emissive.setHSL(hue, 1, 0.2);
    }

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(scrollY * 0.005) * 0.2;
    }
  });

  const words = ['CREATIVE', 'INNOVATIVE', 'PASSIONATE', 'DEDICATED'];
  const currentWord = words[Math.floor(scrollY / 300) % words.length];

  return (
    <group ref={groupRef} position={[0, -2, -2]}>
      <Center>
        <Text3D
          ref={textRef}
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.5}
          height={0.1}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.01}
          bevelSegments={5}
        >
          {currentWord}
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </Text3D>
      </Center>
    </group>
  );
};

export default ScrollText3D;