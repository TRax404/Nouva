import React, { useEffect, useRef } from 'react';

const SnowParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let streaks: Streak[] = [];
    const particleCount = 100; // Slightly more particles for a "showy" effect

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      blur: number;

      constructor(width: number, height: number, isInitial = false) {
        this.x = Math.random() * width;
        this.y = isInitial ? Math.random() * height : -20;
        this.size = Math.random() * 3 + 0.8; // Slightly larger for visibility
        // Speed variety: some slow, some "fast"
        this.speedY = (this.size * 0.2) + (Math.random() * 2.5 + 0.5);
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.opacity = (Math.random() * 0.4) + 0.3; // Higher base opacity for better visibility
        this.blur = this.size < 1.5 ? 1 : 0;
      }

      update(width: number, height: number) {
        this.y += this.speedY;
        this.x += this.speedX;

        if (this.y > height) {
          this.y = -20;
          this.x = Math.random() * width;
        }

        if (this.x > width) this.x = 0;
        else if (this.x < 0) this.x = width;
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;

        if (this.blur > 0) {
          context.shadowBlur = this.blur * 3;
          context.shadowColor = 'white';
        }

        context.fill();
      }
    }

    class Streak {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = -150;
        this.length = Math.random() * 200 + 100;
        this.speed = Math.random() * 20 + 15; // Extremely fast "light way"
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update(height: number) {
        this.y += this.speed;
        return this.y > height + this.length;
      }

      draw(context: CanvasRenderingContext2D) {
        const gradient = context.createLinearGradient(this.x, this.y, this.x, this.y - this.length);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        context.beginPath();
        context.strokeStyle = gradient;
        context.lineWidth = 1.5;
        context.moveTo(this.x, this.y);
        context.lineTo(this.x, this.y - this.length);
        context.stroke();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      streaks = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height, true));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      });

      // Periodic "light way" star streaks
      if (Math.random() < 0.015) {
        streaks.push(new Streak(canvas.width, canvas.height));
      }

      streaks = streaks.filter(streak => {
        const isFinished = streak.update(canvas.height);
        if (!isFinished) streak.draw(ctx);
        return !isFinished;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    init();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-[1]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default SnowParticles;
