import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const VideoShowcaseSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !videoRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Video Entrance Animation
      // We use a clip-path "iris" reveal for a high-end feel
      gsap.fromTo(videoContainerRef.current,
        { clipPath: 'inset(20% 20% 20% 20% round 20px)', scale: 0.8 },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          scale: 1,
          duration: 2,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1.5,
          }
        }
      );

      // 2. Parallax Video Playback/Movement
      gsap.to(videoRef.current, {
        scale: 1.2,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

      // 3. Text Reveal & Parallax
      const split = new SplitType(textRef.current!, { types: 'chars' });
      gsap.from(split.chars, {
        opacity: 0,
        y: 100,
        rotateX: -90,
        stagger: 0.02,
        duration: 1.5,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 90%',
        }
      });

      // Subtle move for the text as we scroll
      gsap.to(textRef.current, {
        x: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

      // 4. Overlay Color Shift
      gsap.to(overlayRef.current, {
        backgroundColor: 'rgba(0,0,0,0.6)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-40"
    >
      {/* Optimized Video Background Container */}
      <div 
        ref={videoContainerRef}
        className="absolute inset-0 z-0 overflow-hidden will-change-transform"
        data-cursor="Play"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-110"
          poster="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1920"
        >
          <source 
            src="https://player.vimeo.com/external/494163965.sd.mp4?s=6953715c3216c310c14493e87848e063857e4e16&profile_id=164&oauth2_token_id=57447761" 
            type="video/mp4" 
          />
        </video>
        
        {/* Cinematic Overlay */}
        <div 
          ref={overlayRef}
          className="absolute inset-0 bg-black/40 mix-blend-multiply" 
        />
        
        {/* Gradient Fades */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[var(--bg)] to-transparent z-10" />
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[var(--bg)] to-transparent z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-6">
        <span className="block text-[10px] uppercase tracking-[0.8em] text-white/50 mb-12 font-black">
          Motion Study 001
        </span>
        <h2 
          ref={textRef}
          className="text-[12vw] md:text-[8vw] font-black text-white leading-none tracking-tighter mix-blend-difference"
        >
          FLUIDITY<br />
          <span className="serif italic font-light text-pink-500 tracking-normal">In Motion</span>
        </h2>
        
        <div className="mt-20">
          <button className="group relative overflow-hidden px-12 py-5 border border-white/20 text-white text-[10px] uppercase tracking-[0.4em] font-bold">
            <span className="relative z-10">Watch the Film</span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-expo" />
            <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
              Coming Soon
            </span>
          </button>
        </div>
      </div>

      {/* Decorative background text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-white/[0.03] pointer-events-none select-none z-10 whitespace-nowrap">
        AURA MOTION
      </div>
    </section>
  );
};

export default VideoShowcaseSection;
