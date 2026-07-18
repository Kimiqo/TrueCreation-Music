import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Music note symbols for particles
const NOTES = ['♩', '♪', '♫', '♬', '𝄞'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  note: string;
  angle: number;
  speed: number;
  phase: number;
}

export const EarVisualization = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let t = 0;
    const particles: Particle[] = [];
    const DPR = 2;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * DPR;
      canvas.height = rect.height * DPR;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(DPR, DPR);
    };
    resize();
    window.addEventListener('resize', resize);

    // Create notes for the staff
    for (let i = 0; i < 12; i++) { // Increased number of notes since they travel further
      particles.push({
        x: Math.random() * -800, // Start offscreen left, distributed
        y: 0,
        vx: 0, vy: 0,
        size: 20 + Math.random() * 14,
        opacity: 0.6 + Math.random() * 0.4,
        note: NOTES[Math.floor(Math.random() * NOTES.length)],
        angle: 0,
        speed: 1.2 + Math.random() * 0.8,
        phase: Math.random() * 5, // line index 0 to 4
      });
    }

    const drawEar = (cx: number, cy: number, scale: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      // Scale up the 24x24 SVG coordinate system to fit our canvas size
      const svgScale = scale * 12; // Adjusted for 24x24 grid
      ctx.scale(svgScale, svgScale);

      // Center the 24x24 SVG path (shift by -12)
      ctx.translate(-12, -12);

      // SVG Paths for a geometrically accurate ear contour
      const outerEarPath = new Path2D("M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0");
      const innerEarPath = new Path2D("M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4");

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 3D Effect Layer 1: Deep shadow/base tube
      ctx.strokeStyle = 'rgba(80, 10, 0, 0.9)';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 0;
      ctx.stroke(outerEarPath);
      ctx.stroke(innerEarPath);

      // 3D Effect Layer 2: Core neon tube
      ctx.strokeStyle = 'rgba(255, 69, 0, 1)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(255, 69, 0, 0.6)';
      ctx.shadowBlur = 15;
      ctx.stroke(outerEarPath);
      ctx.stroke(innerEarPath);

      // 3D Effect Layer 3: Specular highlight (bright center line, offset slightly)
      ctx.strokeStyle = 'rgba(255, 200, 150, 0.9)';
      ctx.lineWidth = 0.5;
      ctx.shadowBlur = 5;
      ctx.translate(-0.1, -0.1); // Shift slightly for 3D lighting feel
      ctx.stroke(outerEarPath);
      ctx.stroke(innerEarPath);
      ctx.translate(0.1, 0.1); // Restore

      // Add a stylized glow to the ear canal (center)
      ctx.fillStyle = 'rgba(255, 69, 0, 0.15)';
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(10, 13, 3, 0, Math.PI * 2);
      ctx.fill();

      // Add the tiny lobe piercing from the user's reference!
      ctx.strokeStyle = 'rgba(255, 69, 0, 0.8)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(6, 18.5, 1.2, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    };

    const draw = () => {
      t += 0.015;
      const w = canvas.width / DPR;
      const h = canvas.height / DPR;
      ctx.clearRect(0, 0, w, h);

      const earX = w * 0.5;
      const earY = h * 0.5;
      const earScale = Math.min(w, h) / 450; // Reduced ear size

      // Draw 5-line musical staff (flowing entirely across the canvas)
      const staffSpacing = 12;
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 69, 0, 0.3)';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        for (let x = 0; x < w; x += 5) {
          const y = earY - (staffSpacing * 2) + (i * staffSpacing) + Math.sin(x * 0.01 - t) * 20;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Update & draw music notes moving along the staff across the whole screen
      particles.forEach((p) => {
        p.x += p.speed * 2;
        if (p.x > w + 40) {
          p.x = -50 - Math.random() * 100; // Reset left
          p.phase = Math.floor(Math.random() * 5); // Pick random staff line
        }

        // Calculate Y based on staff line and sine wave
        const lineOffset = - (staffSpacing * 2) + (Math.floor(p.phase) * staffSpacing);
        p.y = earY + lineOffset + Math.sin(p.x * 0.01 - t) * 20;

        ctx.save();
        ctx.font = `bold ${p.size}px serif`;
        ctx.fillStyle = `rgba(255, 69, 0, ${p.opacity})`;
        ctx.shadowColor = `rgba(255, 69, 0, 0.8)`;
        ctx.shadowBlur = 12;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Add subtle rotation to the note
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.sin(p.x * 0.02) * 0.2);
        ctx.fillText(p.note, 0, 0);
        ctx.restore();
      });

      // Draw ear over the staff
      drawEar(earX, earY, earScale);

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // GSAP scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ear-header', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 50, opacity: 0, scale: 0.9, duration: 1, ease: 'power3.out'
      });

      gsap.fromTo('.ear-canvas-wrap', { scale: 0.7, opacity: 0 }, {
        scrollTrigger: { trigger: '.ear-canvas-wrap', start: 'top 85%', end: 'top 40%', scrub: 1 },
        scale: 1, opacity: 1, ease: 'none'
      });

      // Data table
      gsap.from('.ear-data', {
        scrollTrigger: { trigger: '.ear-data', start: 'top 80%' },
        y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const songData = [
    { section: 'Intro', bars: '1-8', tempo: '128 BPM', key: 'Am' },
    { section: 'Verse 1', bars: '9-24', tempo: '128 BPM', key: 'Am' },
    { section: 'Chorus', bars: '25-40', tempo: '128 BPM', key: 'C' },
    { section: 'Verse 2', bars: '41-56', tempo: '128 BPM', key: 'Am' },
    { section: 'Bridge', bars: '57-64', tempo: '130 BPM', key: 'F' },
    { section: 'Outro', bars: '65-72', tempo: '128 BPM', key: 'Am' },
  ];

  return (
    <section ref={sectionRef} className="section">
      <div className="container">
        <div className="ear-header" style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="label">Analyzer</span>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1.5rem' }}>
            Hear the Song.<br /><span style={{ color: 'var(--orange)' }}>See the Blueprint.</span>
          </h2>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Our engine deconstructs any track into its structural DNA — sections, tempo shifts, key changes, and production elements.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          {/* 3D Ear Canvas */}
          <div className="ear-canvas-wrap glass" style={{
            height: '500px', borderRadius: '24px', overflow: 'hidden', position: 'relative'
          }}>
            <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />
          </div>

          {/* Song Structure Data Table */}
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--white-90)' }}>
              Song Structure Analysis
            </h3>
            <div className="glass" style={{ overflow: 'hidden' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
                padding: '1rem 1.5rem', fontWeight: 700, fontSize: '0.8rem',
                textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--orange)',
                borderBottom: '1px solid var(--white-08)'
              }}>
                <div>Section</div><div>Bars</div><div>Tempo</div><div>Key</div>
              </div>
              {songData.map((row, i) => (
                <div key={i} className="ear-data" style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  padding: '1rem 1.5rem',
                  borderBottom: i < songData.length - 1 ? '1px solid var(--white-04)' : 'none',
                  color: 'var(--white-70)', fontSize: '0.95rem',
                  transition: 'background 0.3s ease',
                }}>
                  <div style={{ fontWeight: 600, color: 'var(--white-90)' }}>{row.section}</div>
                  <div>{row.bars}</div>
                  <div>{row.tempo}</div>
                  <div>{row.key}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
