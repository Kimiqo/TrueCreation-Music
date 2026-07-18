import { useEffect, useRef, useState } from 'react';

export const BackgroundWaveform = ({ opacity = 1 }: { opacity?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    // Delay expensive Canvas 2D operations to prioritize UI paint
    const timer = setTimeout(() => {
      setShouldMount(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!shouldMount) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    };
    resize();
    window.addEventListener('resize', resize);

    const wave = (yCenter: number, amp: number, freq: number, speed: number, color: string, lw: number, phase: number) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      for (let x = 0; x < canvas.width; x += 2) {
        const nx = x / canvas.width;
        const y = yCenter
          + Math.sin(nx * Math.PI * freq + t * speed + phase) * amp
          + Math.sin(nx * Math.PI * freq * 2.3 + t * speed * 0.7 + phase) * (amp * 0.35)
          + Math.sin(nx * Math.PI * freq * 0.4 + t * speed * 1.4 + phase) * (amp * 0.5);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const draw = () => {
      t += 0.006;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cy = canvas.height * 0.5;

      // Adjust opacities based on the prop so it sits perfectly in the background
      wave(cy, 90, 3, 0.8, `rgba(255,69,0,${0.25 * opacity})`, 5, 0);
      wave(cy, 60, 5, 1.1, `rgba(255,69,0,${0.15 * opacity})`, 3, 1.2);
      wave(cy, 35, 7, 1.5, `rgba(255,69,0,${0.08 * opacity})`, 2, 2.5);
      wave(cy, 120, 1.5, 0.4, `rgba(255,69,0,${0.04 * opacity})`, 8, 3.8);
      wave(cy - 40, 20, 12, 2, `rgba(255,69,0,${0.06 * opacity})`, 1, 5);
      wave(cy + 50, 18, 14, 2.3, `rgba(255,69,0,${0.04 * opacity})`, 1, 6);

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [opacity, shouldMount]);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden', animation: 'fadeIn 2s forwards' }}>
      {shouldMount && <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />}
    </div>
  );
};
