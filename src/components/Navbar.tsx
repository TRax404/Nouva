import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    
    mm.add({
      isMobile: "(max-width: 767px)",
      isTablet: "(min-width: 768px) and (max-width: 1023px)",
      isDesktop: "(min-width: 1024px)"
    }, (context) => {
      const conditions = context.conditions as Record<string, boolean>;
      const isMobile = conditions.isMobile;
      const isTablet = conditions.isTablet;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: '+=200',
          scrub: 1,
        }
      });

      tl.to(navRef.current, {
        width: isMobile ? '90%' : isTablet ? '80%' : '50%',
        top: '20px',
        borderRadius: '50px',
        backgroundColor: 'rgba(22, 23, 29, 0.8)',
        backdropFilter: 'blur(15px)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        paddingLeft: isMobile ? '16px' : '24px',
        paddingRight: isMobile ? '16px' : '24px',
        duration: 1,
        ease: 'none'
      });

      tl.to(containerRef.current, {
        maxWidth: '100%',
        paddingTop: isMobile ? '12px' : isTablet ? '6px' : '16px',
        paddingBottom: isMobile ? '12px' : isTablet ? '6px' : '16px',
        duration: 1,
        ease: 'none'
      }, 0);
    });

    return () => mm.revert();
  }, { scope: navRef });

  useGSAP(() => {
    if (isOpen) {
      gsap.to(menuRef.current, { 
        clipPath: 'circle(150% at 100% 0%)', 
        duration: 0.6, 
        ease: 'power3.out' 
      });
      gsap.fromTo('.mobile-link', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, delay: 0.2 }
      );
    } else {
      gsap.to(menuRef.current, { 
        clipPath: 'circle(0% at 100% 0%)', 
        duration: 0.4, 
        ease: 'power3.in' 
      });
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full z-[60] flex items-center justify-center 
                   bg-transparent border border-transparent"
      >
        <div 
          ref={containerRef}
          className="w-full max-w-[1200px] flex items-center justify-between px-6 py-4 md:py-2 lg:py-4"
        >
          <div className="text-xl md:text-lg lg:text-2xl font-bold text-[var(--text-h)] tracking-tighter shrink-0">
            FASHION<span className="text-purple-500">.</span>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-4 lg:gap-8 text-[13px] lg:text-sm font-medium text-[var(--text)]">
            <li><a href="#fashion-collection" className="hover:text-[var(--text-h)] transition-colors relative group whitespace-nowrap">Collection
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
            </a></li>
            <li><a href="#fashion-trends" className="hover:text-[var(--text-h)] transition-colors relative group whitespace-nowrap">Trends
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
            </a></li>
            <li><a href="#about-us" className="hover:text-[var(--text-h)] transition-colors relative group whitespace-nowrap">About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
            </a></li>
            <li><a href="#contact-us" className="hover:text-[var(--text-h)] transition-colors relative group whitespace-nowrap">Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
            </a></li>
          </ul>

          <div className="flex items-center gap-4 shrink-0">
            <button className="hidden sm:block px-5 py-2 text-xs lg:text-sm font-semibold text-white bg-purple-600 
                             hover:bg-purple-700 rounded-full transition-all whitespace-nowrap">
              Shop Now
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden z-[70] p-2 text-[var(--text-h)] focus:outline-none"
              aria-label="Toggle Menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between overflow-hidden">
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? 'translate-x-10' : ''}`}></span>
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        ref={menuRef}
        style={{ clipPath: 'circle(0% at 100% 0%)' }}
        className="fixed inset-0 z-[55] bg-[var(--bg)]/95 backdrop-blur-2xl flex flex-col items-center justify-center md:hidden"
      >
        <ul className="flex flex-col gap-8 text-2xl font-bold text-[var(--text-h)] text-center">
          <li className="mobile-link"><a href="#fashion-collection" onClick={toggleMenu}>Collection</a></li>
          <li className="mobile-link"><a href="#fashion-trends" onClick={toggleMenu}>Trends</a></li>
          <li className="mobile-link"><a href="#about-us" onClick={toggleMenu}>About</a></li>
          <li className="mobile-link"><a href="#contact-us" onClick={toggleMenu}>Contact</a></li>
          <li className="mobile-link pt-4">
            <button className="px-8 py-3 text-lg font-semibold text-white bg-purple-600 rounded-full">
              Shop Now
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
