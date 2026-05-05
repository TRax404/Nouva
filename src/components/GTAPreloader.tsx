import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, MeshReflectorMaterial, PerspectiveCamera, Float } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import * as THREE from 'three'

const LoaderScene = () => {
  const particlesRef = useRef<THREE.Points>(null)
  const gradientRef = useRef<THREE.Mesh>(null)
  const { mouse } = useThree()

  const particles = useMemo(() => {
    const count = 1200
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2
    }

    return positions
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Smooth camera parallax
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouse.x * 0.5, 0.05)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouse.y * 0.3, 0.05)
    state.camera.lookAt(0, 0, 0)

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.02
      particlesRef.current.rotation.z = time * 0.01
      
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + positions[i]) * 0.002
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (gradientRef.current) {
      gradientRef.current.rotation.z = Math.sin(time * 0.2) * 0.1
      gradientRef.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.05)
    }
  })

  return (
    <>
      <color attach="background" args={['#030205']} />
      <ambientLight intensity={0.2} />
      <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={20} color="#ff3e9d" />
      <pointLight position={[-3, 2, 3]} color="#c73cff" intensity={15} distance={10} />
      <pointLight position={[3, -1, 2]} color="#ff9a3d" intensity={10} distance={8} />

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={gradientRef} position={[0, 0, -4]} scale={[10, 5, 1]}>
          <planeGeometry args={[1, 1, 32, 32]} />
          <meshBasicMaterial color="#1a0a1f" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
        </mesh>
      </Float>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.015} 
          color="#fff1fb" 
          transparent 
          opacity={0.4} 
          sizeAttenuation 
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={30}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.5}
          mirror={0.5}
        />
      </mesh>

      <Environment preset="night" />
    </>
  )
}

export const GTAPreloader = ({ onComplete }: { onComplete: () => void }) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const traRef = useRef<HTMLSpanElement>(null)
  const xRef = useRef<SVGSVGElement>(null)
  const streakOneRef = useRef<HTMLSpanElement>(null)
  const streakTwoRef = useRef<HTMLSpanElement>(null)
  const reflectionRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      onComplete: () => {
        gsap.to(rootRef.current, {
          opacity: 0,
          duration: 1.2,
          ease: 'power4.inOut',
          onComplete: onComplete
        })
      },
    })

    // Initial State
    gsap.set([streakOneRef.current, streakTwoRef.current], { scaleX: 0, opacity: 0 })
    gsap.set(xRef.current, { scale: 0.02, opacity: 0, rotate: -15 })
    gsap.set(traRef.current, { y: 40, opacity: 0, filter: 'blur(20px)' })

    tl.to(containerRef.current, { opacity: 1, duration: 1 })
      .to(logoRef.current, { opacity: 1, duration: 0.1 }, 0.2)
      
      // 1. Reveal TRa with elegant blur transition
      .to(traRef.current, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 2,
        ease: 'power4.out'
      }, 0.3)

      // 2. Reveal X with cinematic scale and rotation
      .to(xRef.current, {
        scale: 0.085,
        opacity: 1,
        rotate: 0,
        duration: 2.5,
        ease: 'expo.out'
      }, 0.5)

      // 3. Streaks animation
      .to([streakOneRef.current, streakTwoRef.current], {
        scaleX: 1,
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power3.inOut'
      }, 1)
      .to([streakOneRef.current, streakTwoRef.current], {
        xPercent: 150,
        opacity: 0,
        duration: 2,
        ease: 'power2.in'
      }, 2)

      // 4. Reflection and subtle floating
      .to(reflectionRef.current, {
        opacity: 0.3,
        scaleY: 1,
        filter: 'blur(4px)',
        duration: 1.5
      }, 1.2)
      
      // 5. Grand expansion for exit
      .to(logoRef.current, {
        scale: 1.1,
        duration: 4,
        ease: 'sine.inOut'
      }, 0.5)
      
      .to(xRef.current, {
        scale: 1.2,
        opacity: 0,
        duration: 1.5,
        ease: 'expo.in'
      }, "-=1.2")
      .to(traRef.current, {
        scale: 0.8,
        opacity: 0,
        y: -20,
        filter: 'blur(10px)',
        duration: 1.2,
        ease: 'power3.in'
      }, "-=1.4")

  }, { scope: rootRef, dependencies: [onComplete] })

  return (
    <div ref={rootRef} className="fixed inset-0 z-[200] overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Canvas dpr={[1, 2]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={35} />
          <Suspense fallback={null}>
            <LoaderScene />
          </Suspense>
          <EffectComposer multisampling={4}>
            <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.4} />
            <ChromaticAberration offset={new THREE.Vector2(0.0015, 0.0015)} />
            <Noise opacity={0.04} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Atmospheric Overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,62,157,0.12),transparent_40%),radial-gradient(circle_at_30%_50%,rgba(199,60,255,0.1),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      <div ref={containerRef} className="absolute inset-0 flex items-center justify-center opacity-0">
        <div ref={logoRef} className="relative w-full max-w-4xl px-4 flex items-center justify-center opacity-0 will-change-transform">
          
          {/* Animated Streaks */}
          <span
            ref={streakOneRef}
            className="absolute left-1/2 top-[45%] h-[1px] w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-pink-300 to-transparent shadow-[0_0_20px_rgba(255,62,157,0.8)]"
          />
          <span
            ref={streakTwoRef}
            className="absolute left-1/2 top-[55%] h-[1px] w-[45%] -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-300 to-transparent shadow-[0_0_15px_rgba(255,154,61,0.6)]"
          />

          <div className="relative flex items-center justify-center">
            {/* TRa Text */}
            <span 
              ref={traRef} 
              className="relative z-10 text-[clamp(4rem,12vw,10rem)] leading-none tracking-tighter text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]"
              style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontWeight: 300 }}
            >
              TRa
            </span>
            
            {/* The X - Positioned absolutely relative to the container */}
            <svg 
              ref={xRef}
              viewBox="0 0 1000 1000" 
              className="absolute left-1/2 top-1/2 h-[2000px] w-[2000px] -translate-x-1/2 -translate-y-1/2 will-change-transform"
              style={{ pointerEvents: 'none' }}
            >
              <path 
                d="M350 200 L450 200 L500 400 L550 200 L650 200 L550 500 L650 800 L550 800 L500 600 L450 800 L350 800 L450 500 Z" 
                fill="none" 
                stroke="url(#luxGradient)" 
                strokeWidth="6"
                strokeLinejoin="miter"
              />
              <defs>
                <linearGradient id="luxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="30%" stopColor="#ffd1e3" />
                  <stop offset="100%" stopColor="#ffb37a" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Reflection */}
          <div
            ref={reflectionRef}
            className="absolute top-[110%] left-1/2 -translate-x-1/2 h-32 w-full max-w-2xl origin-top scale-y-50 bg-gradient-to-b from-white/20 via-pink-500/5 to-transparent opacity-0 blur-md mask-linear-gradient"
            style={{ WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)' }}
          />
        </div>
      </div>
      
      {/* Cinematic Grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
    </div>
  )
}
