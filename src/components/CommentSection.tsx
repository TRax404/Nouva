import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const comments = [
  {
    text: "The definitive intersection of architectural integrity and wearable art. TRax has established a new vocabulary for the modern silhouette.",
    author: "Julian Thorne",
    role: "Global Curator"
  },
  {
    text: "A masterclass in technical restraint. Every stitch feels intentional, every form serves a higher purpose in the urban landscape.",
    author: "Sasha V.",
    role: "Fashion Editor, L'Aura"
  },
  {
    text: "Sustainability meets extreme luxury. A rare, flawless execution of purpose that transcends seasonal trends.",
    author: "Marcus Chen",
    role: "Industrial Designer"
  }
];

const CommentItem: React.FC<{ text: string; author: string; role: string; index: number }> = ({ text, author, role, index }) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const ctx = gsap.context(() => {
      const split = new SplitType(textRef.current!, {
        types: 'lines',
        lineClass: 'overflow-hidden py-1'
      });

      gsap.from(split.lines, {
        opacity: 0,
        y: 30,
        filter: 'blur(10px)',
        stagger: 0.1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });

      gsap.from(infoRef.current, {
        opacity: 0,
        x: -20,
        duration: 1,
        delay: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 85%',
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className={`max-w-3xl mb-32 md:mb-48 ${index % 2 === 0 ? 'mr-auto' : 'ml-auto text-right'}`}>
      <p 
        ref={textRef}
        className="text-2xl md:text-4xl lg:text-5xl leading-tight text-[var(--text-h)] font-light italic serif mb-8 will-change-transform"
      >
        "{text}"
      </p>
      
      <div ref={infoRef} className={`flex items-center gap-6 ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
        <div className="w-8 h-px bg-[var(--text)] opacity-30" />
        <div className="flex flex-col">
          <span className="text-xs font-bold tracking-widest uppercase">{author}</span>
          <span className="text-[9px] uppercase tracking-[0.2em] opacity-50">{role}</span>
        </div>
      </div>
    </div>
  );
};

const CommentSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={sectionRef} 
      className="py-40 md:py-60 px-6 bg-[var(--bg)] border-b border-[var(--border)] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-32">
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold opacity-40 mb-4">
            The Dialogue
          </span>
          <h2 className="text-4xl md:text-6xl font-light serif italic text-[var(--text-h)]">
            Voices of the Studio
          </h2>
        </div>

        <div className="relative">
          {/* Vertical Guide Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--border)] opacity-30 hidden md:block" />
          
          {comments.map((comment, index) => (
            <CommentItem key={index} {...comment} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
