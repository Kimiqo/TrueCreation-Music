import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Fingerprint, Library, TrendingUp, Music } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: Fingerprint, title: "One-Tap Audio Identification", desc: "Tap to identify any music. Get the full DNA in seconds — samples, plugins, MIDI, and song structure.", vis: 'bars' },
  { icon: Music, title: "Seamless Integration & Shops", desc: "Direct links to Spotify, Splice, Plugin Boutique, and Loopmasters. Buy samples or add to playlists instantly.", vis: 'grid' },
  { icon: Library, title: "Automatic History-Library", desc: "Every identified song is saved. Search, filter, and revisit your entire sonic journey anytime.", vis: 'list' },
  { icon: TrendingUp, title: "Discovery Features", desc: "Global charts and personalized recommendations based on your identification history.", vis: 'line' },
];

const Vis = ({ type }: { type: string }) => {
  if (type === 'bars') {
    return (
      <svg viewBox="0 0 200 60" style={{ width: '100%', height: '50px' }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const h = 5 + Math.random() * 45;
          return <rect key={i} x={i * 6.5 + 1} y={30 - h / 2} width="4" height={h} rx="2" fill="var(--orange)" opacity={0.3 + Math.random() * 0.5} />;
        })}
      </svg>
    );
  }
  if (type === 'grid') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ height: '40px', borderRadius: '8px', background: i === 1 ? 'var(--orange)' : 'var(--white-08)', opacity: i === 1 ? 0.5 : 0.4 }} />
        ))}
      </div>
    );
  }
  if (type === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: i === 0 ? 'rgba(255,69,0,0.2)' : 'var(--white-08)', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: '8px', width: `${50 + Math.random() * 40}%`, borderRadius: '4px', background: 'var(--white-08)', marginBottom: '4px' }} />
              <div style={{ height: '6px', width: `${30 + Math.random() * 30}%`, borderRadius: '3px', background: 'var(--white-04)' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <svg viewBox="0 0 200 50" style={{ width: '100%', height: '40px' }}>
      <polyline fill="none" stroke="var(--orange)" strokeWidth="2" points="0,40 30,30 60,35 90,15 120,20 150,8 180,12 200,5" opacity="0.5" />
      <polyline fill="none" stroke="var(--white-30)" strokeWidth="1" points="0,42 30,38 60,40 90,30 120,35 150,22 180,28 200,20" opacity="0.3" />
    </svg>
  );
};

export const FeatureShowcase = () => {
  const ref = useRef<HTMLElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feat-header', {
        scrollTrigger: { trigger: '.feat-header', start: 'top 85%' },
        y: 50, opacity: 0, scale: 0.92, duration: 1, ease: 'power3.out'
      });

      rowsRef.current.forEach((row, i) => {
        if (!row) return;
        const dir = i % 2 === 0 ? -100 : 100;
        gsap.fromTo(row,
          { scale: 0.82, opacity: 0, x: dir },
          {
            scrollTrigger: { trigger: row, start: 'top 88%', end: 'top 45%', scrub: 1 },
            scale: 1, opacity: 1, x: 0, ease: 'none'
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="section">
      <div className="container">
        <div className="feat-header" style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <span className="label">Features</span>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            The <span style={{ color: 'var(--orange)' }}>DNA</span> of Digital Music
          </h2>
          <p style={{ fontSize: '1.2rem', maxWidth: '550px', margin: '1rem auto 0' }}>
            A seamless workflow from a curious moment to a saved favorite.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
          {features.map((f, i) => (
            <div key={i} ref={el => { rowsRef.current[i] = el; }} className="mobile-flex-col" style={{
              display: 'flex', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
              alignItems: 'center', gap: '4rem',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'inline-block', padding: '1.2rem', borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(255,69,0,0.15), rgba(255,69,0,0.05))',
                  color: 'var(--orange)', marginBottom: '2rem'
                }}>
                  <f.icon size={36} strokeWidth={1.5} />
                </div>
                <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginBottom: '1.2rem', letterSpacing: '-0.02em' }}>{f.title}</h3>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '420px' }}>{f.desc}</p>
              </div>
              <div className="glass" style={{
                flex: 1, minHeight: '320px', display: 'flex', flexDirection: 'column',
                justifyContent: 'center', padding: '2.5rem', overflow: 'hidden',
              }}>
                {/* Window chrome */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '2rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }} />
                </div>
                <div style={{ padding: '1rem', background: 'var(--white-04)', borderRadius: '12px', marginBottom: '1rem' }}>
                  <Vis type={f.vis} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ height: '10px', width: '65%', borderRadius: '5px', background: 'var(--white-08)' }} />
                  <div style={{ height: '10px', width: '45%', borderRadius: '5px', background: 'var(--white-04)' }} />
                  <div style={{ height: '10px', width: '80%', borderRadius: '5px', background: 'var(--white-04)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
