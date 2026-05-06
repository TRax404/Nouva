import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FashionCardProps {
  image: string;
  title: string;
  description: string;
  collection: string;
}

const FashionCard: React.FC<FashionCardProps> = ({ image, title, description, collection }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={cardRef}
      className="fashion-card shrink-0 w-[85vw] md:w-[65vw] lg:w-[45vw] h-[70vh] relative group overflow-hidden bg-neutral-900 mx-4 md:mx-8"
      data-cursor="View"
    >
      {/* Parallax Image Container */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          ref={imageRef}
          src={image}
          alt={title}
          className="w-full h-[120%] object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 will-change-transform"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
      </div>

      {/* Content */}
      <div 
        className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end text-white z-10"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] mb-4 opacity-70 block translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          {collection}
        </span>
        <h3 className="text-4xl md:text-6xl font-light mb-6 leading-tight translate-y-8 group-hover:translate-y-0 transition-transform duration-700 delay-75 whitespace-pre-line">
          {title}
        </h3>
        <p className="luxury-text text-lg md:text-xl opacity-0 group-hover:opacity-80 translate-y-8 group-hover:translate-y-0 transition-all duration-700 delay-150 max-w-sm mb-8">
          {description}
        </p>
        <button className="self-start px-8 py-3 border border-white/30 text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500 opacity-0 group-hover:opacity-100">
          Explore
        </button>
      </div>
    </div>
  );
};

const FashionCardsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const fashionItems = [
    {
      image: 'https://images.unsplash.com/photo-1539109132314-3475d24c217b?auto=format&fit=crop&q=80&w=1200',
      title: 'Ethereal\nSilence',
      collection: 'Winter 2026',
      description: 'A study in monochromatic textures and minimalist silhouettes for the urban winter.'
    },
    {
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
      title: 'Liquid\nMetals',
      collection: 'Avant-Garde',
      description: 'Shifting forms that catch the light. Exploring the boundary between skin and fabric.'
    },
    {
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1200',
      title: 'Urban\nNomad',
      collection: 'Spring Drop',
      description: 'Functional elegance for the traveler. High-performance textiles meet high-fashion design.'
    },
    {
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200',
      title: 'Midnight\nVelvet',
      collection: 'Limited Edition',
      description: 'Rich textures and deep tones. The definitive collection for the modern evening.'
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.fashion-card');
      
      // Horizontal Scroll Animation
      gsap.to(cards, {
        xPercent: -100 * (cards.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (cards.length - 1),
          start: 'top top',
          end: () => `+=${sectionRef.current?.offsetWidth}`,
        }
      });

      // Individual card entrance and parallax
      cards.forEach((card) => {
        const img = card.querySelector('img');
        
        // Parallax effect on images within the pinned section
        gsap.to(img, {
          y: '15%',
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            containerAnimation: gsap.getById('mainScroll') || undefined,
            start: 'left right',
            end: 'right left',
            scrub: true,
          }
        });
      });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} className="overflow-hidden bg-[var(--bg)] border-b border-[var(--border)]">
      <section ref={sectionRef} className="min-h-screen flex items-center px-[5vw]">
        <div className="flex whitespace-nowrap pt-20 pb-20">
          <div className="flex flex-col justify-center min-w-[40vw] mr-20">
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold opacity-50 mb-6">Showcase</span>
            <h2 className="text-6xl md:text-8xl leading-none text-[var(--text-h)]">
              The<br />Season<br />Edits
            </h2>
          </div>
          
          <div className="flex items-center">
            {fashionItems.map((item, index) => (
              <FashionCard key={index} {...item} />
            ))}
          </div>

          <div className="min-w-[20vw]" />
        </div>
      </section>
    </div>
  );
};

export default FashionCardsSection;
