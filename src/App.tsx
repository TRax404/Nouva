import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import Navbar from './components/Navbar'
import { SmoothScroll } from './components/SmoothScroll'
import { GTAPreloader } from './components/GTAPreloader'
import FashionCardsSection from './components/FashionCardsSection'
import CommentSection from './components/CommentSection'
import VideoShowcaseSection from './components/VideoShowcaseSection'
import CustomCursor from './components/CustomCursor'
import SnowParticles from './components/SnowParticles'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const preloaderContainerRef = useRef<HTMLDivElement>(null)
  const [isIntroComplete, setIsIntroComplete] = useState(false)

  useEffect(() => {
    // We only initialize main animations after the intro is complete
    if (isIntroComplete) {
      const ctx = gsap.context(() => {
        // Specific Hero Title Animation
        const heroTitle = document.querySelector('.hero-title')
        if (heroTitle) {
          const text = new SplitType(heroTitle as HTMLElement, { types: 'chars,words' })
          
          // Set initial visibility (handles both opacity and visibility)
          gsap.set(heroTitle, { autoAlpha: 1 })
          
          gsap.fromTo(text.chars, 
            {
              y: 80,
              opacity: 0,
              filter: 'blur(15px)',
              rotateX: -10,
            },
            {
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              rotateX: 0,
              stagger: 0.03,
              duration: 2.2,
              ease: 'expo.out',
              delay: 0.8
            }
          )
        }

        const splitTargets = document.querySelectorAll('.split-text')
        splitTargets.forEach((target) => {
          const text = new SplitType(target as HTMLElement, { types: 'chars,words' })
          gsap.from(text.chars, {
            y: '100%', opacity: 0, rotateX: -90, stagger: 0.02, duration: 1.2, ease: 'power4.out',
            scrollTrigger: { trigger: target, start: 'top 90%', toggleActions: 'play none none none' }
          })
        })

        const revealContainers = document.querySelectorAll('.reveal-container')
        revealContainers.forEach((container) => {
          gsap.fromTo(container, 
            { clipPath: 'inset(0 0 100% 0)' },
            { clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'power4.inOut', scrollTrigger: { trigger: container, start: 'top 80%' } }
          )
        })
      }, containerRef)
      return () => ctx.revert()
    }
  }, [isIntroComplete])

  const handlePreloaderComplete = () => {
    // The GTAPreloader handles its own fade out
    setIsIntroComplete(true)
    gsap.set(preloaderContainerRef.current, { display: 'none', delay: 1.2 })
  };

  return (
    <>
      <CustomCursor />
      <SnowParticles />
      
      <div ref={preloaderContainerRef} className="fixed inset-0 z-[200]">
        <GTAPreloader onComplete={handlePreloaderComplete} />
      </div>

      <SmoothScroll>
        <div ref={containerRef} className={`bg-[var(--bg)] text-[var(--text)] transition-colors duration-500 overflow-x-hidden ${!isIntroComplete ? 'h-screen overflow-hidden' : ''}`}>
          <Navbar />
          <main className="relative pt-20">
            {/* Hero Section */}
            <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
              <div className="max-w-5xl w-full">
                <span className="block mb-8 text-[10px] md:text-xs tracking-[0.5em] opacity-50 uppercase font-bold">Est. 2026 — Global Excellence</span>
                <h1 className="text-[13vw] md:text-[11vw] mb-12 hero-title leading-[0.8] tracking-tighter text-[var(--text-h)]">
                  TRax<br /><span className="italic serif font-light text-pink-500">Luxury</span>
                </h1>
                <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12 opacity-40 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-semibold">
                  <span>Sculptural Forms</span><span>Sustainable Luxury</span><span>Avant-Garde</span>
                </div>
              </div>
            </section>

            {/* Manifesto Section */}
            <section className="py-40 px-6 border-y border-[var(--border)] bg-[var(--accent-bg)]">
              <div className="max-w-5xl mx-auto text-center md:text-left">
                <h2 className="text-3xl md:text-6xl leading-[1.1] split-text serif italic font-light text-[var(--text-h)]">
                  "Movement is our manifesto. TRax defines the path for the modern wanderer."
                </h2>
              </div>
            </section>

            {/* Featured Image Section */}
            <section className="py-40 px-6">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
                <div className="md:col-span-5 space-y-12 order-2 md:order-1">
                  <h3 className="text-5xl md:text-8xl split-text leading-[0.9] text-[var(--text-h)]">The<br />Urban<br />Vessel</h3>
                  <p className="luxury-text text-xl md:text-2xl opacity-70 max-w-md leading-relaxed">
                    Designed for transition. Engineered for excellence. The TRax collection merges technical performance with editorial elegance.
                  </p>
                  <button className="group relative inline-flex items-center gap-6 text-[10px] uppercase tracking-[0.4em] font-black pt-4">
                    Explore Now
                    <span className="w-12 h-[1px] bg-[var(--text)] transition-all group-hover:w-24"></span>
                  </button>
                </div>
                <div className="md:col-start-7 md:col-span-6 reveal-container aspect-[4/5] bg-neutral-100 order-1 md:order-2 shadow-2xl border border-[var(--border)]" data-cursor="View">
                  <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200" alt="TRax Fashion" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                </div>
              </div>
            </section>

            <VideoShowcaseSection />

            <FashionCardsSection />
            
            <CommentSection />

            <footer className="relative bg-black pt-40 pb-20 px-6 md:px-12 overflow-hidden text-white">
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
              <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-pink-500/5 blur-[120px] rounded-full pointer-events-none" />

              <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-20 items-end">
                  {/* Left Column: Huge Branding */}
                  <div className="md:col-span-7">
                    <h2 className="text-[22vw] md:text-[16vw] font-black leading-[0.7] tracking-tighter mix-blend-difference">
                      TRax<span className="text-pink-500">.</span>
                    </h2>
                  </div>

                  {/* Right Column: Nav & Info */}
                  <div className="md:col-span-5 grid grid-cols-2 gap-12 pb-4">
                    <div className="space-y-8">
                      <h4 className="text-[10px] uppercase tracking-[0.5em] font-bold text-neutral-500">Collections</h4>
                      <ul className="space-y-4 text-sm font-medium">
                        <li><a href="#" className="hover:text-pink-500 transition-colors duration-300">Winter 2026</a></li>
                        <li><a href="#" className="hover:text-pink-500 transition-colors duration-300">Archive</a></li>
                        <li><a href="#" className="hover:text-pink-500 transition-colors duration-300">Limited Drop</a></li>
                      </ul>
                    </div>
                    <div className="space-y-8">
                      <h4 className="text-[10px] uppercase tracking-[0.5em] font-bold text-neutral-500">Studio</h4>
                      <ul className="space-y-4 text-sm font-medium">
                        <li><a href="#" className="hover:text-pink-500 transition-colors duration-300">Instagram</a></li>
                        <li><a href="#" className="hover:text-pink-500 transition-colors duration-300">Journal</a></li>
                        <li><a href="#" className="hover:text-pink-500 transition-colors duration-300">Contact</a></li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex items-center gap-12 text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-500">
                    <span>Paris / NYC / Tokyo</span>
                    <span className="hidden md:inline w-1 h-1 bg-white/20 rounded-full" />
                    <span className="hidden md:inline uppercase">Available 24/7</span>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <button 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.5em] font-black hover:text-pink-500 transition-all"
                    >
                      Top
                      <span className="w-8 h-px bg-white/30 group-hover:w-12 group-hover:bg-pink-500 transition-all" />
                    </button>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30">© 2026 TRax Studio</p>
                  </div>
                </div>
              </div>

              {/* Decorative Large Text in Background */}
              <div className="absolute bottom-[-10%] right-[-5%] text-[30vw] font-black text-white/[0.02] select-none pointer-events-none leading-none">
                AURA
              </div>
            </footer>
          </main>
        </div>
      </SmoothScroll>
    </>
  )
}

export default App
