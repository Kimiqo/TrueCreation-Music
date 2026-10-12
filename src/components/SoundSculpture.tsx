import { Component, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Sculpture() {
  const ref = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const points: number[] = [];
    const colors: number[] = [];
    const color = new THREE.Color();
    for (let i = 0; i < 210; i++) {
      const u = i / 210 * Math.PI * 2;
      for (let j = 0; j < 62; j++) {
        const v = j / 62 * Math.PI * 2;
        const radius = 2.05 + .27 * Math.sin(u * 3);
        const tube = .55 + .13 * Math.sin(u * 5);
        points.push((radius + tube * Math.cos(v)) * Math.cos(u), (radius + tube * Math.cos(v)) * Math.sin(u), tube * Math.sin(v) + .38 * Math.sin(u * 2));
        color.setHSL(.045 + .055 * (Math.sin(u + v) + 1) / 2, .92, .42 + .25 * (Math.cos(v) + 1) / 2);
        colors.push(color.r, color.g, color.b);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, []);
  useFrame((state) => {
    if (!ref.current) return;
    const progress = Math.min(window.scrollY / window.innerHeight, 1.5);
    ref.current.rotation.set(.48 + progress * .3 + state.pointer.y * .08, -.3 + state.clock.elapsedTime * .07 + progress * .55, -.38 + state.pointer.x * .09);
    ref.current.scale.setScalar(1 + progress * .22);
  });
  return <group ref={ref}><points geometry={geometry}><pointsMaterial size={.022} vertexColors transparent opacity={.9} blending={THREE.AdditiveBlending} depthWrite={false} /></points><mesh rotation={[0, 0, .1]}><torusGeometry args={[2.08, .005, 8, 200]} /><meshBasicMaterial color="#edb065" transparent opacity={.4} /></mesh></group>;
}
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}
export default function SoundSculpture() {
  return <SceneBoundary><Canvas camera={{ position: [0, 0, 7.4], fov: 45 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: false }} aria-hidden="true"><Sculpture /></Canvas></SceneBoundary>;
}
