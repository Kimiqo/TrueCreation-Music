import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Object3D, InstancedMesh, Color } from 'three';
import { MeshReflectorMaterial, PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NUM_BARS = 120;
const SPACING = 0.15;
const MAX_WIDTH = NUM_BARS * SPACING;

const GlowingWave = () => {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  const baseColor = new Color('#ff4500');
  const emissiveColor = baseColor.clone().multiplyScalar(4);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < NUM_BARS; i++) {
      const x = (i - NUM_BARS / 2) * SPACING;
      const nx = x / (MAX_WIDTH / 2);
      const envelope = Math.exp(-Math.pow(nx * 2.5, 2));

      const wave1 = Math.sin(nx * 10 + time * 2);
      const wave2 = Math.sin(nx * 25 - time * 3) * 0.5;
      const wave3 = Math.sin(nx * 5 + time * 1.5) * 0.8;
      
      const rawAmplitude = Math.abs(wave1 + wave2 + wave3);
      const height = 0.1 + rawAmplitude * envelope * 4;

      dummy.position.set(x, 0, 0);
      dummy.scale.set(0.04, height, 0.04);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.rotation.y = Math.sin(time * 0.2) * 0.15;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, NUM_BARS]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color="#ff4500"
        emissive={emissiveColor}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </instancedMesh>
  );
};

// Component to handle native WebGL camera zoom via GSAP scroll
const CameraAnimator = () => {
  const { camera } = useThree();

  useEffect(() => {
    // Find the hero section container by its class (we will add 'hero-section' class to it)
    const st = ScrollTrigger.create({
      trigger: '.hero-section',
      start: 'top top',
      end: '+=100%',
      scrub: true,
      onUpdate: (self) => {
        // Animate Z from 12 (far) to 4 (zoomed in)
        camera.position.z = 12 - (8 * self.progress);
        camera.updateProjectionMatrix();
      }
    });

    return () => st.kill();
  }, [camera]);

  return <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />;
};

export const HeroWaveform3D = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    // Delay expensive WebGL mounting by a short tick to allow the HTML Hero to paint instantly
    const timer = setTimeout(() => {
      setShouldMount(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer to throttle frameloop when scrolled out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="hero-wave-blur" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0, animation: 'fadeIn 2s forwards' }}>
      {shouldMount && (
        <Canvas dpr={[1, 2]} frameloop={isVisible ? 'always' : 'never'}>
          <CameraAnimator />
          
          <color attach="background" args={['#0a0a0a']} />
          <ambientLight intensity={0.2} />
          
          <GlowingWave />

          <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
              resolution={256}
              mixStrength={80}
              roughness={0.8}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#0a0a0a"
              metalness={0.8}
              mirror={0.5}
            />
          </mesh>

          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.2} 
              mipmapBlur 
              intensity={1.5} 
              levels={5} 
            />
          </EffectComposer>
        </Canvas>
      )}
    </div>
  );
};
