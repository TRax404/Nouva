import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on mobile/touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    const follower = followerRef.current;
    const text = textRef.current;

    if (!dot || !follower || !text) return;

    // Initial state
    gsap.set([dot, follower], { xPercent: -50, yPercent: -50 });
    gsap.set(text, { opacity: 0, scale: 0.5 });

    // High-performance quick setters for the main dot (instant)
    const xDotSet = gsap.quickSetter(dot, "x", "px");
    const yDotSet = gsap.quickSetter(dot, "y", "px");

    // Smooth quickTo for the follower (delayed)
    const xFollowerTo = gsap.quickTo(follower, "x", { duration: 0.6, ease: "power3.out" });
    const yFollowerTo = gsap.quickTo(follower, "y", { duration: 0.6, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      xDotSet(clientX);
      yDotSet(clientY);
      xFollowerTo(clientX);
      yFollowerTo(clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Global Hover Interaction Logic
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // 1. Clickable Elements (Buttons, Links)
      const isClickable = target.closest('button, a, .cursor-pointer');
      if (isClickable) {
        gsap.to(follower, { 
          scale: 1.6, 
          backgroundColor: 'rgba(255, 255, 255, 0.15)', 
          borderColor: 'rgba(255, 255, 255, 0.4)',
          duration: 0.4,
          ease: 'power2.out'
        });
        gsap.to(dot, { 
          scale: 0.6, 
          duration: 0.3 
        });
      }

      // 2. Interactive Media (Images, Fashion Cards)
      const mediaContainer = target.closest('.fashion-card, .reveal-container, img');
      if (mediaContainer) {
        const cursorText = mediaContainer.getAttribute('data-cursor') || 'View';
        text.innerText = cursorText;

        gsap.to(follower, { 
          scale: 4, 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          borderColor: 'transparent',
          mixBlendMode: 'difference',
          duration: 0.5,
          ease: 'expo.out'
        });
        gsap.to(text, { 
          opacity: 1, 
          scale: 1, 
          duration: 0.4 
        });
        gsap.to(dot, { 
          opacity: 0, 
          scale: 0, 
          duration: 0.2 
        });
      }

      // 3. Text content (Specific headings)
      const isHeading = target.closest('h1, h2, h3, .luxury-text');
      if (isHeading && !mediaContainer) {
        gsap.to(dot, { 
          scale: 1.5, 
          duration: 0.3 
        });
        gsap.to(follower, { 
          scale: 0.8, 
          opacity: 0.5, 
          duration: 0.3 
        });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Reset from Clickable
      if (target.closest('button, a, .cursor-pointer')) {
        gsap.to(follower, { 
          scale: 1, 
          backgroundColor: 'transparent', 
          borderColor: 'rgba(255, 255, 255, 0.3)',
          duration: 0.4 
        });
        gsap.to(dot, { 
          scale: 1, 
          duration: 0.3 
        });
      }

      // Reset from Media
      if (target.closest('.fashion-card, .reveal-container, img')) {
        gsap.to(follower, { 
          scale: 1, 
          backgroundColor: 'transparent', 
          borderColor: 'rgba(255, 255, 255, 0.3)', 
          mixBlendMode: 'normal',
          duration: 0.5 
        });
        gsap.to(text, { 
          opacity: 0, 
          scale: 0.5, 
          duration: 0.3 
        });
        gsap.to(dot, { 
          opacity: 1, 
          scale: 1, 
          duration: 0.2 
        });
      }

      // Reset from Heading
      if (target.closest('h1, h2, h3, .luxury-text')) {
        gsap.to([dot, follower], { 
          scale: 1, 
          opacity: 1, 
          duration: 0.3 
        });
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <div className="custom-cursor-container fixed inset-0 pointer-events-none z-[9999]">
      {/* Outer Follower */}
      <div 
        ref={followerRef} 
        className="cursor-follower fixed w-10 h-10 border border-white/30 rounded-full flex items-center justify-center will-change-transform"
        style={{ backdropFilter: 'blur(2px)' }}
      />
      
      {/* Main Dot */}
      <div 
        ref={dotRef} 
        className="custom-cursor fixed w-1.5 h-1.5 bg-white rounded-full flex items-center justify-center will-change-transform"
      >
        <span 
          ref={textRef} 
          className="cursor-text text-black text-[10px] font-black uppercase tracking-tighter"
        />
      </div>
    </div>
  );
};

export default CustomCursor;
