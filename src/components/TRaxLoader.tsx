import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface TRaxLoaderProps {
  onComplete: () => void
}

export const TRaxLoader = ({ onComplete }: TRaxLoaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const traRef = useRef<HTMLSpanElement>(null)
  const xRef = useRef<HTMLSpanElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const streakRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete()
        }
      })

      // Initial state
      gsap.set(containerRef.current, { backgroundColor: '#050505' })
      gsap.set(xRef.current, { y: 0, scale: 1, opacity: 0 })
      gsap.set(traRef.current, { opacity: 0, x: -20 })
      gsap.set(glowRef.current, { opacity: 0, scale: 0.5 })
      gsap.set(streakRef.current, { xPercent: -100, opacity: 0 })

      tl.to(containerRef.current, { opacity: 1, duration: 0.3 })
        
        // 1. Reveal "TRa" and "X"
        .to([traRef.current, xRef.current], {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power4.out',
          stagger: 0.08
        }, "+=0.1")

        // 2. Add glow and light streak
        .to(glowRef.current, {
          opacity: 0.6,
          scale: 1.2,
          duration: 1.0,
          ease: 'sine.inOut'
        }, "-=0.6")
        .to(streakRef.current, {
          xPercent: 200,
          opacity: 1,
          duration: 1.0,
          ease: 'power2.inOut'
        }, "-=1.0")

        // 3. The letter "X" rises upward smoothly
        .to(xRef.current, {
          y: -80,
          duration: 1.2,
          ease: 'expo.out'
        }, "-=0.4")
        
        // 4. "X" scales up dramatically to fill the screen
        .to(xRef.current, {
          scale: 100,
          duration: 0.8,
          ease: 'power4.in',
          onStart: () => {
            gsap.to(traRef.current, { opacity: 0, duration: 0.3 })
            gsap.to(glowRef.current, { opacity: 1, scale: 4, duration: 0.6 })
          }
        }, "-=0.3")

        // 5. Expand overlay to white/transparent reveal
        .to(overlayRef.current, {
          opacity: 1,
          duration: 0.05
        }, "-=0.2")
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out'
        })
    })

    return () => ctx.revert()
  }, [onComplete])

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden font-sans"
      style={{ background: 'radial-gradient(circle at center, #1a0b1e 0%, #050505 100%)' }}
    >
      {/* Light Streak Effect */}
      <div 
        ref={streakRef}
        className="absolute h-px w-full bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-0"
        style={{ top: '50%', filter: 'blur(2px)' }}
      />

      <div ref={logoRef} className="relative flex items-center justify-center">
        {/* Cinematic Glow Background */}
        <div 
          ref={glowRef}
          className="absolute h-64 w-64 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 opacity-0 blur-[80px]"
        />

        <div className="relative z-10 flex items-baseline text-[12vw] font-black tracking-tighter sm:text-9xl">
          <span 
            ref={traRef} 
            className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            TRa
          </span>
          <span 
            ref={xRef} 
            className="relative bg-gradient-to-br from-white via-pink-500 to-orange-400 bg-clip-text text-transparent will-change-transform"
            style={{ 
              filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.5))',
              textShadow: '0 0 40px rgba(255, 255, 255, 0.2)' 
            }}
          >
            X
          </span>
        </div>
      </div>

      {/* Reveal Overlay */}
      <div 
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 bg-white opacity-0"
      />
      
      {/* Film Grain / Noise Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
    </div>
  )
}
