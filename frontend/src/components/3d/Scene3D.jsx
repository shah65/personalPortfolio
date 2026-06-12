import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import ParticleField from './ParticleField';
import FloatingCube from './FloatingCube';
import GlowingSphere from './GlowingSphere';
import StarsBackground from './StarsBackground';
import RotatingRing from './RotatingRing';

const Scene3D = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none',
    }}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={75} />

        {/* Ambient Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#00d4ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#7c3aed" />

        {/* 3D Objects */}
        <StarsBackground />
        <ParticleField />
        <FloatingCube position={[-3, 1, -2]} color="#00d4ff" />
        <FloatingCube position={[3, -1, -3]} color="#7c3aed" />
        <GlowingSphere position={[0, 2, -5]} size={0.7} />
        <RotatingRing position={[2, 2, -4]} radius={1} color="#00d4ff" />
        <RotatingRing position={[-2, -1, -6]} radius={0.8} color="#7c3aed" />

        {/* Environment */}
        <Environment preset="night" background={false} />

        {/* Subtle camera movement */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate={true}
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
};

export default Scene3D;