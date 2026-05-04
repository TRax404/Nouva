import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, MeshReflectorMaterial, PerspectiveCamera } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import * as THREE from 'three'

const LoaderScene = () => {
  const particlesRef = useRef<THREE.Points>(null)
  const gradientRef = useRef<THREE.Mesh>(null)

  const particles = useMemo(() => {
    const positions = new Float32Array(720)

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 9
      positions[i + 1] = (Math.random() - 0.5) * 4.8
      positions[i + 2] = (Math.random() - 0.5) * 4 - 1
    }

    return positions
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.035
      particlesRef.current.position.y = Math.sin(time * 0.4) * 0.03
    }

    if (gradientRef.current) {
      gradientRef.current.rotation.z = Math.sin(time * 0.16) * 0.04
    }
  })

  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight position={[-3, 1.6, 3]} color="#c73cff" intensity={18} distance={8} />
      <pointLight position={[2.6, 1.2, 3]} color="#ff3e9d" intensity={12} distance={7} />
      <pointLight position={[3, -0.7, 2]} color="#ff9a3d" intensity={9} distance={6} />

      <mesh ref={gradientRef} position={[0, 0, -2.8]} scale={[5.4, 2.2, 1]}>
        <planeGeometry args={[1, 1, 32, 32]} />
        <meshBasicMaterial color="#2b102f" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </mesh>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.018} color="#fff1fb" transparent opacity={0.38} sizeAttenuation depthWrite={false} />
      </points>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.08, 0]}>
        <planeGeometry args={[18, 18]} />
        <MeshReflectorMaterial
          blur={[420, 120]}
          resolution={512}
          mixBlur={1.8}
          mixStrength={24}
          roughness={0.58}
          depthScale={0.65}
          minDepthThreshold={0.25}
          maxDepthThreshold={1.2}
          color="#060408"
          metalness={0.72}
          mirror={0.55}
        />
      </mesh>

      <Environment preset="night" />
    </>
  )
}

export const GTAPreloader = ({ onComplete }: { onComplete: () => void }) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const traRef = useRef<HTMLSpanElement>(null)
  const xRef = useRef<HTMLSpanElement>(null)
  const streakOneRef = useRef<HTMLSpanElement>(null)
  const streakTwoRef = useRef<HTMLSpanElement>(null)
  const reflectionRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => gsap.delayedCall(0.55, onComplete),
    })

    tl.fromTo(rootRef.current, { opacity: 0 }, { opacity: 1, duration: 0.55, ease: 'power2.out' })
      .fromTo(
        logoRef.current,
        { scale: 0.96, filter: 'blur(12px)', opacity: 0 },
        { scale: 1, filter: 'blur(0px)', opacity: 1, duration: 0.78 },
        0.18,
      )
      .fromTo(
        traRef.current,
        { y: 24, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9 },
        0.28,
      )
      .fromTo(
        xRef.current,
        { y: 36, opacity: 0, filter: 'blur(16px)', textShadow: '0 0 0 rgba(255, 62, 157, 0)' },
        {
          y: -34,
          opacity: 1,
          filter: 'blur(0px)',
          textShadow: '0 0 20px rgba(255, 62, 157, 0.72), 0 0 54px rgba(199, 60, 255, 0.38)',
          duration: 1.45,
          ease: 'expo.out',
        },
        0.72,
      )
      .fromTo(
        [streakOneRef.current, streakTwoRef.current],
        { xPercent: -180, opacity: 0, scaleX: 0.25 },
        { xPercent: 190, opacity: 1, scaleX: 1, duration: 0.86, stagger: 0.12, ease: 'power4.out' },
        0.86,
      )
      .to([streakOneRef.current, streakTwoRef.current], { opacity: 0, duration: 0.34 }, 1.36)
      .fromTo(
        reflectionRef.current,
        { opacity: 0, scaleY: 0.72, filter: 'blur(12px)' },
        { opacity: 0.32, scaleY: 1, filter: 'blur(5px)', duration: 1.05 },
        0.55,
      )
      .to(logoRef.current, { scale: 1.025, duration: 1.4, ease: 'sine.inOut' }, 1.45)
  }, [onComplete])

  return (
    <div ref={rootRef} className="fixed inset-0 z-[200] overflow-hidden bg-black">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <color attach="background" args={['#030205']} />
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={39} />
        <Suspense fallback={null}>
          <LoaderScene />
        </Suspense>
        <EffectComposer enableNormalPass={false}>
          <Bloom luminanceThreshold={0.16} mipmapBlur intensity={1.25} radius={0.52} />
          <Noise opacity={0.035} />
          <Vignette eskil={false} offset={0.12} darkness={1.15} />
        </EffectComposer>
      </Canvas>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,62,157,0.18),transparent_32%),radial-gradient(circle_at_38%_58%,rgba(199,60,255,0.16),transparent_30%),radial-gradient(circle_at_62%_60%,rgba(255,154,61,0.13),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.48)_0%,rgba(0,0,0,0.06)_44%,rgba(0,0,0,0.62)_100%)]" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div ref={logoRef} className="relative w-[min(78vw,720px)] text-center opacity-0 will-change-transform">
          <span
            ref={streakOneRef}
            className="absolute left-1/2 top-[43%] h-px w-[58%] origin-left -translate-x-1/2 bg-gradient-to-r from-transparent via-pink-200 to-transparent opacity-0 shadow-[0_0_24px_rgba(255,62,157,0.7)]"
          />
          <span
            ref={streakTwoRef}
            className="absolute left-1/2 top-[56%] h-px w-[42%] origin-left -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-200 to-transparent opacity-0 shadow-[0_0_20px_rgba(255,154,61,0.58)]"
          />

          <div className="relative inline-flex items-baseline justify-center font-sans text-[clamp(4rem,15vw,11rem)] font-black leading-none tracking-[0.015em] text-white">
            <span ref={traRef} className="inline-block translate-y-6 opacity-0 [text-shadow:0_0_18px_rgba(255,255,255,0.22)]">
              TRa
            </span>
            <span
              ref={xRef}
              className="ml-[0.02em] inline-block translate-y-9 bg-gradient-to-br from-white via-[#ff4fa9] to-[#ff9a3d] bg-clip-text text-transparent opacity-0 will-change-transform"
            >
              X
            </span>
          </div>

          <div
            ref={reflectionRef}
            className="mx-auto mt-1 h-20 w-[72%] origin-top scale-y-75 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,62,157,0.08)_40%,transparent_82%)] opacity-0 [mask-image:linear-gradient(180deg,black,transparent)]"
          />
        </div>
      </div>
    </div>
  )
}
