import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Stage, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AbstractModel = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  useGSAP(() => {
    if (!meshRef.current) return;
    gsap.to(meshRef.current.rotation, {
      y: Math.PI * 4,
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });
  }, []);
  return (
    <Float speed={2}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <MeshDistortMaterial color="#aa3bff" speed={3} distort={0.4} />
      </mesh>
    </Float>
  );
};

export const FashionScene = () => {
  return (
    <div className="canvas-container">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <Stage environment="city">
          <AbstractModel />
        </Stage>
      </Canvas>
    </div>
  );
};
