import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import Navbar from './components/Navbar'
import { SmoothScroll } from './components/SmoothScroll'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
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
  }, [])

  return (
    <SmoothScroll>
      <div ref={containerRef} className="bg-[var(--bg)] text-[var(--text)] transition-colors duration-500 overflow-x-hidden">
        <Navbar />
        <main className="relative pt-20">
          <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <div className="max-w-5xl w-full">
              <span className="block mb-8 text-[10px] md:text-xs tracking-[0.5em] opacity-50 uppercase font-bold">Collection 2026 — Studio Excellence</span>
              <h1 className="text-[13vw] md:text-[11vw] mb-12 split-text leading-[0.8] tracking-tighter text-[var(--text-h)]">Silence<br /><span className="italic serif font-light">&</span> Sound</h1>
              <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12 opacity-40 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-semibold">
                <span>Sculptural Forms</span><span>Sustainable Luxury</span><span>Avant-Garde</span>
              </div>
            </div>
          </section>
          <section className="py-40 px-6 border-y border-[var(--border)] bg-[var(--accent-bg)]">
            <div className="max-w-5xl mx-auto text-center md:text-left">
              <h2 className="text-3xl md:text-6xl leading-[1.1] split-text serif italic font-light text-[var(--text-h)]">"We believe in the beauty of the unspoken. Clothes that breathe, move, and define a legacy."</h2>
              <div className="mt-16 flex items-center justify-center md:justify-start gap-6">
                <div className="h-[1px] w-12 md:w-20 bg-[var(--text)] opacity-30"></div>
                <span className="text-[10px] uppercase tracking-[0.4em] opacity-50 font-bold">The Philosophy</span>
              </div>
            </div>
          </section>
          <section className="py-40 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
              <div className="md:col-span-5 space-y-12 order-2 md:order-1">
                <h3 className="text-5xl md:text-8xl split-text leading-[0.9] text-[var(--text-h)]">The<br />Architect<br />Draft</h3>
                <p className="luxury-text text-xl md:text-2xl opacity-80 max-w-md leading-relaxed">A study in volume and light. Our latest collection explores the intersection of brutalist architecture and organic silk.</p>
                <button className="group relative inline-flex items-center gap-6 text-[10px] uppercase tracking-[0.4em] font-black pt-4">Explore Collection<span className="w-12 h-[1px] bg-[var(--text)] transition-all group-hover:w-24"></span></button>
              </div>
              <div className="md:col-start-7 md:col-span-6 reveal-container aspect-[4/5] bg-neutral-100 order-1 md:order-2 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200" alt="Minimal fashion" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
              </div>
            </div>
          </section>
          <section className="py-60 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden bg-black text-white">
            <h2 className="text-[25vw] leading-none opacity-10 select-none pointer-events-none absolute font-black tracking-tighter text-white/20">STUDIO</h2>
            <div className="z-10 relative">
              <h3 className="text-7xl md:text-[12rem] split-text serif italic font-light leading-none mb-12 text-white">Unveiling</h3>
              <p className="text-[10px] uppercase tracking-[0.6em] opacity-60 mb-16">Join the exclusive waiting list</p>
              <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                <input type="email" placeholder="EMAIL ADDRESS" className="bg-transparent border-b border-white/30 px-6 py-4 text-[10px] tracking-[0.4em] focus:outline-none focus:border-white w-full md:w-80 transition-all uppercase text-white" />
                <button className="w-full md:w-auto px-12 py-4 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-black hover:bg-neutral-200 transition-colors">Notify Me</button>
              </div>
            </div>
          </section>
          <footer className="py-24 px-10 border-t border-[var(--border)] bg-[var(--bg)] flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div className="space-y-4"><h2 className="text-2xl font-black tracking-[0.6em] text-[var(--text-h)]">FASHION.</h2><p className="text-[9px] uppercase tracking-[0.3em] opacity-30 italic">Crafted for the avant-garde.</p></div>
            <div className="flex flex-wrap justify-center gap-10 md:gap-16 text-[10px] uppercase tracking-[0.3em] font-bold">
              <a href="#" className="opacity-50 hover:opacity-100 transition-opacity">Instagram</a><a href="#" className="opacity-50 hover:opacity-100 transition-opacity">Archive</a><a href="#" className="hover:opacity-100 transition-opacity border-b border-[var(--text)] pb-1">Journal</a>
            </div>
            <p className="text-[9px] uppercase tracking-[0.4em] opacity-30">© 2026 Studio Excellence</p>
          </footer>
        </main>
      </div>
    </SmoothScroll>
  )
}

export default App
