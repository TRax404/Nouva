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
        this.size = Math.random() * 2.5 + 0.5;
        // Much slower, graceful speed
        this.speedY = (this.size * 0.05) + (Math.random() * 0.4 + 0.2);
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.opacity = (Math.random() * 0.3) + 0.2;
        this.blur = this.size < 1.2 ? 1 : 0;
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
      angle: number;
      vx: number;
      vy: number;

      constructor(width: number, height: number) {
        // Broaden entry points
        this.x = Math.random() * width;
        this.y = -200;
        this.length = Math.random() * 100 + 50;
        this.speed = Math.random() * 4 + 3; // Much slower
        this.opacity = Math.random() * 0.4 + 0.2;
        
        // Random angle: 45 to 135 degrees (wider range)
        this.angle = (Math.random() * Math.PI / 2) + Math.PI / 4;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;

        // Offset X to ensure they don't all start from the top
        if (this.vx > 0) {
          this.x -= 200;
        } else {
          this.x += 200;
        }
      }

      update(width: number, height: number) {
        this.x += this.vx;
        this.y += this.vy;
        // Check if the streak is off-screen
        return (
          this.y > height + this.length || 
          this.x < -this.length || 
          this.x > width + this.length
        );
      }

      draw(context: CanvasRenderingContext2D) {
        // Draw the streak tailing behind the current position
        const endX = this.x - Math.cos(this.angle) * this.length;
        const endY = this.y - Math.sin(this.angle) * this.length;

        const gradient = context.createLinearGradient(this.x, this.y, endX, endY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        context.beginPath();
        context.strokeStyle = gradient;
        context.lineWidth = 1.2;
        context.moveTo(this.x, this.y);
        context.lineTo(endX, endY);
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
      if (Math.random() < 0.01) { // Slightly less frequent
        streaks.push(new Streak(canvas.width, canvas.height));
      }

      streaks = streaks.filter(streak => {
        const isFinished = streak.update(canvas.width, canvas.height);
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
