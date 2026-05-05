import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface TRaxLoaderProps {
  onComplete: () => void
}

export const TRaxLoader = ({ onComplete }: TRaxLoaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const traRef = useRef<HTMLSpanElement>(null)
  const xRef = useRef<SVGSVGElement>(null)
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
      gsap.set(containerRef.current, { backgroundColor: '#050505', opacity: 1 })
      gsap.set(xRef.current, { y: 100, scale: 0.05, opacity: 0 })
      gsap.set(traRef.current, { opacity: 0, x: -60, filter: 'blur(20px)' })
      gsap.set(glowRef.current, { opacity: 0, scale: 0.1 })
      gsap.set(streakRef.current, { xPercent: -100, opacity: 0 })

      tl.to(containerRef.current, { opacity: 1, duration: 0.6 })
        
        // 1. Ultra-premium reveal of "TRa" (Luxury Serif) and "X"
        .to(traRef.current, {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 1.8,
          ease: 'power3.out'
        }, "+=0.4")
        .to(xRef.current, {
          opacity: 1,
          y: 0,
          scale: 0.08, 
          duration: 2.0,
          ease: 'expo.out'
        }, "-=1.6")

        // 2. Cinematic atmosphere
        .to(glowRef.current, {
          opacity: 0.4,
          scale: 1.5,
          duration: 2.5,
          ease: 'sine.inOut'
        }, "-=1.8")
        .to(streakRef.current, {
          xPercent: 180,
          opacity: 0.5,
          duration: 2.5,
          ease: 'power2.inOut'
        }, "-=2.2")

        // 3. Elegant "breathing" rise
        .to(xRef.current, {
          y: -40, 
          duration: 2.0,
          ease: 'power2.inOut'
        }, "-=0.8")
        
        // 4. Dramatic, high-fidelity expansion reveal
        .to(xRef.current, {
          scale: 1.5, 
          duration: 1.8,
          ease: 'expo.in',
          onStart: () => {
            gsap.to(traRef.current, { opacity: 0, scale: 0.9, y: 20, duration: 0.8, ease: 'power2.in' })
            gsap.to(glowRef.current, { opacity: 1, scale: 10, duration: 1.5, ease: 'power2.in' })
          }
        }, "-=0.3")

        // 5. Seamless reveal
        .to(overlayRef.current, {
          opacity: 1,
          duration: 0.2
        }, "-=0.15")
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power4.out'
        })
    })

    return () => ctx.revert()
  }, [onComplete])

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden font-sans"
      style={{ background: 'radial-gradient(circle at center, #0f0a14 0%, #020202 100%)' }}
    >
      {/* Light Streak Effect */}
      <div 
        ref={streakRef}
        className="absolute h-px w-full bg-gradient-to-r from-transparent via-pink-200/30 to-transparent opacity-0"
        style={{ top: '50%', filter: 'blur(5px)' }}
      />

      <div ref={logoRef} className="relative flex items-center justify-center">
        {/* Cinematic Glow Background */}
        <div 
          ref={glowRef}
          className="absolute h-96 w-96 rounded-full bg-gradient-to-r from-purple-900/20 via-pink-600/15 to-orange-400/10 opacity-0 blur-[150px]"
        />

        <div className="relative z-10 flex items-center justify-center">
          {/* TRa: Luxury Serif Text */}
          <span 
            ref={traRef} 
            className="text-[14vw] sm:text-9xl tracking-[-0.05em] text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontWeight: 300 }}
          >
            TRa
          </span>
          
          {/* Hollow High-Fidelity X: Large base size to prevent pixelation on zoom */}
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
      </div>

      {/* Final Reveal Overlay */}
      <div 
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 bg-black opacity-0"
      />
      
      {/* Luxury Film Grain Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
    </div>
  )
}
