import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const comments = [
  {
    text: "The definitive intersection of architectural integrity and wearable art. TRax has established a new vocabulary for the modern silhouette.",
    author: "Julian Thorne",
    role: "Global Curator",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
  },
  {
    text: "A masterclass in technical restraint. Every stitch feels intentional, every form serves a higher purpose in the urban landscape.",
    author: "Sasha V.",
    role: "Fashion Editor, L'Aura",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
  },
  {
    text: "Sustainability meets extreme luxury. A rare, flawless execution of purpose that transcends seasonal trends.",
    author: "Marcus Chen",
    role: "Industrial Designer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"
  }
];

const CommentItem: React.FC<{ text: string; author: string; role: string; image: string; index: number }> = ({ text, author, role, image, index }) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const ctx = gsap.context(() => {
      const split = new SplitType(textRef.current!, {
        types: 'lines',
        lineClass: 'overflow-hidden py-1'
      });

      // Text Lines Animation
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

      // Info Animation
      gsap.from(infoRef.current, {
        opacity: 0,
        x: index % 2 === 0 ? -20 : 20,
        duration: 1,
        delay: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 85%',
        }
      });

      // Image Reveal Animation
      gsap.fromTo(imageRef.current, 
        { clipPath: 'inset(100% 0 0 0)', scale: 1.2 },
        { 
          clipPath: 'inset(0% 0 0 0)', 
          scale: 1,
          duration: 1.5, 
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
          }
        }
      );

      // Subtle Image Floating
      gsap.to(imageRef.current, {
        y: -15,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 2
      });
    });

    return () => ctx.revert();
  }, [index]);

  return (
    <div className={`flex flex-col md:flex-row items-center gap-12 md:gap-20 mb-32 md:mb-60 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse text-right'}`}>
      {/* Avatar Image */}
      <div 
        ref={imageRef}
        className="shrink-0 w-32 h-32 md:w-48 md:h-64 bg-neutral-900 overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
      >
        <img src={image} alt={author} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1">
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
        <div className="flex flex-col items-center mb-32 md:mb-48">
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold opacity-40 mb-4">
            The Dialogue
          </span>
          <h2 className="text-4xl md:text-6xl font-light serif italic text-[var(--text-h)] text-center">
            Voices of the Studio
          </h2>
        </div>

        <div className="space-y-20">
          {comments.map((comment, index) => (
            <CommentItem key={index} {...comment} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
