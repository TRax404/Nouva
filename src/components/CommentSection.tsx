import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const CommentSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const ctx = gsap.context(() => {
      // Split text into lines
      const split = new SplitType(textRef.current!, {
        types: 'lines',
        lineClass: 'overflow-hidden py-1'
      });

      // Animate lines
      gsap.from(split.lines, {
        opacity: 0,
        y: 40,
        filter: 'blur(10px)',
        stagger: 0.15,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        }
      });

      // Subtle floating motion for the whole block
      gsap.to(textRef.current, {
        y: -20,
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="py-40 md:py-60 px-6 bg-[var(--accent-bg)] border-b border-[var(--border)] overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        <span className="block text-[10px] uppercase tracking-[0.5em] font-bold opacity-40 mb-12 text-center md:text-left">
          Voices of the Studio
        </span>
        
        <h2 
          ref={textRef}
          className="text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-[var(--text-h)] font-light italic serif text-center md:text-left will-change-transform"
        >
          "The fusion of architectural structure and fluid movement creates a dialogue that transcends mere clothing. TRax isn't just a brand; it's a sensory experience that redefines modern luxury."
        </h2>

        <div className="mt-20 flex items-center gap-6 justify-center md:justify-start">
          <div className="w-12 h-px bg-[var(--text)] opacity-30" />
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-widest uppercase">Elena Vance</span>
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-50">Creative Director, Aura Magazine</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
