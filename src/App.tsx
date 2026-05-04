import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import Navbar from './components/Navbar'
import { SmoothScroll } from './components/SmoothScroll'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const preloaderRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsLoaded(true)
          initMainAnimations()
        }
      })
      tl.to('.preloader-char', { y: 0, stagger: 0.1, duration: 1, ease: 'expo.out' })
        .to('.preloader-char', { y: '-100%', stagger: 0.05, duration: 0.8, ease: 'expo.in', delay: 0.5 })
        .to(preloaderRef.current, { yPercent: -100, duration: 1.2, ease: 'power4.inOut' })

      function initMainAnimations() {
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
          gsap.fromTo(container, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'power4.inOut', scrollTrigger: { trigger: container, start: 'top 80%' } })
        })
      }
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <div ref={preloaderRef} className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
        <div className="flex text-white text-7xl md:text-9xl font-black tracking-tighter overflow-hidden">
          {['T', 'R', 'A', 'X'].map((char, i) => (
            <div key={i} className="relative overflow-hidden">
              <span className="preloader-char block translate-y-[100%]">{char}</span>
            </div>
          ))}
        </div>
      </div>
      <SmoothScroll>
        <div ref={containerRef} className={`bg-[var(--bg)] text-[var(--text)] transition-colors duration-500 overflow-x-hidden ${!isLoaded ? 'h-screen overflow-hidden' : ''}`}>
          <Navbar />
          <main className="relative pt-20">
            <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
              <div className="max-w-5xl w-full">
                <span className="block mb-8 text-[10px] md:text-xs tracking-[0.5em] opacity-50 uppercase font-bold">Est. 2026 — Studio Excellence</span>
                <h1 className="text-[13vw] md:text-[11vw] mb-12 split-text leading-[0.8] tracking-tighter text-[var(--text-h)]">TRAX<br /><span className="italic serif font-light">Fashion</span></h1>
                <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12 opacity-40 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-semibold">
                  <span>Sculptural Forms</span><span>Sustainable Luxury</span><span>Avant-Garde</span>
                </div>
              </div>
            </section>
            <section className="py-40 px-6 border-y border-[var(--border)] bg-[var(--accent-bg)]">
              <div className="max-w-5xl mx-auto text-center md:text-left">
                <h2 className="text-3xl md:text-6xl leading-[1.1] split-text serif italic font-light text-[var(--text-h)]">"Movement is our manifesto. TRAX defines the path for the modern wanderer."</h2>
              </div>
            </section>
            <section className="py-40 px-6">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
                <div className="md:col-span-5 space-y-12 order-2 md:order-1">
                  <h3 className="text-5xl md:text-8xl split-text leading-[0.9] text-[var(--text-h)]">The<br />Urban<br />Vessel</h3>
                  <p className="luxury-text text-xl md:text-2xl opacity-80 max-w-md leading-relaxed">Designed for transition. Engineered for excellence. The TRAX collection merges technical performance with editorial elegance.</p>
                  <button className="group relative inline-flex items-center gap-6 text-[10px] uppercase tracking-[0.4em] font-black pt-4">Explore Now<span className="w-12 h-[1px] bg-[var(--text)] transition-all group-hover:w-24"></span></button>
                </div>
                <div className="md:col-start-7 md:col-span-6 reveal-container aspect-[4/5] bg-neutral-100 order-1 md:order-2 shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200" alt="TRAX Fashion" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                </div>
              </div>
            </section>
            <footer className="py-24 px-10 border-t border-[var(--border)] bg-[var(--bg)] flex flex-col md:flex-row justify-between items-center gap-12">
              <h2 className="text-2xl font-black tracking-[0.6em] text-[var(--text-h)]">TRAX.</h2>
              <div className="flex gap-16 text-[10px] uppercase tracking-[0.3em] font-bold opacity-50"><a href="#">Instagram</a><a href="#">Archive</a><a href="#">Contact</a></div>
              <p className="text-[9px] uppercase tracking-[0.4em] opacity-30">© 2026 TRAX Studio</p>
            </footer>
          </main>
        </div>
      </SmoothScroll>
    </>
  )
}

export default App
