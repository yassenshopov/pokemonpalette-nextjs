'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface GameBackgroundProps {
  colors?: string[];
}

export function GameBackground({ colors = [] }: GameBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Convert RGB colors to more vibrant gradients
  const getGradientColors = () => {
    if (colors.length === 0) return [];
    
    return colors.map(color => {
      const matches = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (!matches) return color;
      const [_, r, g, b] = matches;
      // In dark mode, make colors more saturated and brighter
      if (isDark) {
        const brighten = 40; // Brightness boost for dark mode
        return `rgba(${Math.min(255, parseInt(r) + brighten)}, ${Math.min(255, parseInt(g) + brighten)}, ${Math.min(255, parseInt(b) + brighten)}, 0.2)`;
      }
      return `rgba(${r}, ${g}, ${b}, 0.15)`;
    });
  };

  const gradientColors = getGradientColors();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      x: number = 0;
      y: number = 0;
      size: number = 0;
      speedX: number = 0;
      speedY: number = 0;
      color: string = '';

      constructor() {
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * (isDark ? 4 : 3) + 1; // Larger particles in dark mode
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        
        if (colors.length > 0) {
          const colorIndex = Math.floor(Math.random() * colors.length);
          const baseColor = colors[colorIndex];
          this.color = baseColor.replace(
            /rgb\((\d+),\s*(\d+),\s*(\d+)\)/,
            (_, r, g, b) => {
              if (isDark) {
                // Brighter particles in dark mode
                const brighten = 60;
                return `rgba(${Math.min(255, parseInt(r) + brighten)}, ${Math.min(255, parseInt(g) + brighten)}, ${Math.min(255, parseInt(b) + brighten)}, ${Math.random() * 0.4 + 0.2})`;
              }
              return `rgba(${r}, ${g}, ${b}, ${Math.random() * 0.3 + 0.1})`;
            }
          );
        } else {
          // Default particle colors
          this.color = isDark 
            ? `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1})`
            : `rgba(0, 0, 0, ${Math.random() * 0.3 + 0.1})`;
        }
      }

      update() {
        if (!canvas) return;
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < (isDark ? 120 : 100); i++) { // More particles in dark mode
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [colors, isDark]);

  // Generate gradient background classes based on colors
  const gradientStyle = {
    background: colors.length > 0
      ? `linear-gradient(135deg, ${
          gradientColors.map((color, index) => 
            `${color} ${index * (100 / gradientColors.length)}%`
          ).join(', ')
        })`
      : isDark
        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(147, 51, 234, 0.25), rgba(236, 72, 153, 0.25))'
        : 'linear-gradient(135deg, rgba(191, 219, 254, 0.3), rgba(216, 180, 254, 0.3), rgba(251, 207, 232, 0.3))',
    backdropFilter: isDark ? 'brightness(0.8)' : 'none',
  };

  return (
    <>
      <div 
        className={`fixed inset-0 -z-20 transition-all duration-1000 ${
          isDark ? 'bg-black/40' : ''
        }`}
        style={gradientStyle}
      />
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 transition-opacity duration-700"
      />
    </>
  );
} 