import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const competitors = [
  { name: "Shazam", focus: "Music recognition", limitation: "No production metadata", isHighlight: false },
  { name: "Tracklib", focus: "Sample clearance", limitation: "No plugin/sound tracing", isHighlight: false },
  { name: "ACRCloud", focus: "Audio fingerprinting", limitation: "B2B only, no creator-facing tools", isHighlight: false },
  { name: "LANDR", focus: "Mastering & distribution", limitation: "No recognition or tracing features", isHighlight: false },
  { name: "TrueCreation", focus: "Full production tracing", limitation: "Built for creators & educators", isHighlight: true }
];

export const CompetitiveLandscape = () => {
  const ref = useRef<HTMLElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.comp-header', {
        scrollTrigger: { trigger: '.comp-header', start: 'top 85%' },
        y: 50, opacity: 0, scale: 0.92, duration: 1, ease: 'power3.out'
      });

      gsap.fromTo(tableRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scrollTrigger: { trigger: tableRef.current, start: 'top 80%', end: 'top 50%', scrub: 1 },
          scale: 1, opacity: 1, ease: 'none'
        }
      );

      rowsRef.current.forEach((row, i) => {
        if (!row) return;
        gsap.from(row, {
          scrollTrigger: { trigger: tableRef.current, start: 'top 75%' },
          opacity: 0, x: -30, duration: 0.6, delay: i * 0.1, ease: 'power2.out'
        });
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section">
      <div className="container">
        <div className="comp-header" style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="label">Competitive Edge</span>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1.5rem' }}>
            Sustainable Competitive <span style={{ color: 'var(--orange)' }}>Advantage</span>
          </h2>
          <p style={{ fontSize: '1.2rem', maxWidth: '650px', margin: '0 auto' }}>
            First-mover advantage in production-level music recognition with proprietary engines trained on samples, plugins, and loops.
          </p>
        </div>

        <div ref={tableRef} className="glass" style={{ overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            padding: '1.8rem 2.5rem',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.02), transparent)',
            fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase',
            letterSpacing: '0.06em', color: 'var(--white-50)',
            borderBottom: '1px solid var(--white-08)'
          }}>
            <div>Platform</div><div>Focus</div><div>Limitation / Advantage</div>
          </div>

          {competitors.map((comp, idx) => (
            <div key={idx} ref={el => { rowsRef.current[idx] = el; }} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              padding: '1.8rem 2.5rem',
              borderBottom: idx !== competitors.length - 1 ? '1px solid var(--white-04)' : 'none',
              backgroundColor: comp.isHighlight ? 'rgba(255, 69, 0, 0.08)' : 'transparent',
              color: comp.isHighlight ? 'var(--orange)' : 'var(--white)',
              fontWeight: comp.isHighlight ? 700 : 400,
              transition: 'background-color 0.3s ease',
              fontSize: '1.05rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {comp.isHighlight && <span style={{ marginRight: '0.8rem', fontSize: '1.1rem' }}>🚀</span>}
                {comp.name}
              </div>
              <div style={{ color: comp.isHighlight ? 'var(--orange)' : 'var(--white-70)' }}>{comp.focus}</div>
              <div style={{ color: comp.isHighlight ? 'var(--orange)' : 'var(--white-70)' }}>{comp.limitation}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
