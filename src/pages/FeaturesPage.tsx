import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Fingerprint, Layers, Map, ShoppingCart, ShieldCheck, History, Users, MonitorPlay } from 'lucide-react';
import { WaveformDivider } from '../components/WaveformDivider';

gsap.registerPlugin(ScrollTrigger);

const featuresList = [
  {
    id: 'extraction',
    icon: Fingerprint,
    title: "One-Tap Audio DNA Extraction",
    desc: "Instantly identify samples, loops, plugins, and MIDI data from any audio source. Understand exactly what makes a track tick within seconds.",
    color: "#ff4500" // Orange
  },
  {
    id: 'stems',
    icon: Layers,
    title: "Stem Separation & Analysis",
    desc: "Isolate vocals, drums, bass, and melody. Study individual mixing techniques, panning, and spatial effects with pristine clarity.",
    color: "#00d2ff" // Cyan
  },
  {
    id: 'structure',
    icon: Map,
    title: "Song Structure & Key Mapping",
    desc: "Automatically map out arrangements (Intro, Verse, Chorus), tempo shifts, and key signatures over time on an interactive timeline.",
    color: "#ff007f" // Pink
  },
  {
    id: 'commerce',
    icon: ShoppingCart,
    title: "Seamless Commerce Integration",
    desc: "Direct links to Splice, Plugin Boutique, and Loopmasters to instantly buy or download the exact assets identified in the scan.",
    color: "#ffbc00" // Yellow
  },
  {
    id: 'rights',
    icon: ShieldCheck,
    title: "Rights & Clearance Dashboard",
    desc: "Instantly see if a sample or track is copyrighted, public domain, or available for licensing via seamless Tracklib integration.",
    color: "#00ff88" // Green
  },
  {
    id: 'history',
    icon: History,
    title: "Automatic History Vault",
    desc: "Every scanned song is saved to your personal library with auto-generated metadata tags for advanced search and filtering later.",
    color: "#b000ff" // Purple
  },
  {
    id: 'collab',
    icon: Users,
    title: "Creator Collaboration Network",
    desc: "Connect with the original producers or find other artists who utilize similar sample libraries and plugin chains.",
    color: "#ff6a00" // Bright Orange
  },
  {
    id: 'daw',
    icon: MonitorPlay,
    title: "Direct DAW Integration",
    desc: "A companion VST3/AU plugin that brings TrueCreation's real-time analysis directly into Ableton Live, FL Studio, or Logic Pro.",
    color: "#ffffff" // White
  }
];

export const FeaturesPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [showHint, setShowHint] = useState(true);
  const playNote = (index: number) => {
    try {
      if (!(window as any).globalAudioCtx) {
        (window as any).globalAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = (window as any).globalAudioCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // C major scale frequencies: C4 to C5
      const freqs = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
      const freq = freqs[index % freqs.length];

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine'; // Smooth tone
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Envelope to make it sound like a soft bell/chime and prevent clicking
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  };

  useEffect(() => {
    // Scroll to top when landing on page
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from('.features-hero-title', {
        y: 60, opacity: 0, duration: 1.2, ease: 'power4.out', delay: 0.2
      });
      gsap.from('.features-hero-desc', {
        y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.6
      });

      // Staggered Feature Cards on Scroll
      cardsRef.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(card,
          { opacity: 0, y: 100, scale: 0.9 },
          {
            scrollTrigger: { trigger: card, start: 'top 85%', end: 'top 50%', scrub: 1 },
            opacity: 1, y: 0, scale: 1, ease: 'none'
          }
        );
      });
    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={pageRef}>
      {/* Features Hero */}
      <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', paddingTop: '150px', paddingBottom: '100px' }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span className="label" style={{ opacity: 0, animation: 'fadeIn 1s forwards' }}>The Arsenal</span>
          <h1 className="features-hero-title" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
            The <span style={{ color: 'var(--orange)' }}>Anatomy</span><br />of Sound.
          </h1>
          <p className="features-hero-desc" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: 'var(--white-70)', maxWidth: '750px', margin: '0 auto' }}>
            TrueCreation provides an unprecedented suite of analytical tools designed specifically for modern music producers, engineers, and educators.
          </p>
        </div>
      </section>

      <WaveformDivider />

      {/* Expanded Features Grid */}
      <section className="section" style={{ paddingBottom: '150px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
            {featuresList.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={feat.id} ref={el => { cardsRef.current[i] = el; }} className="glass" style={{
                  padding: '3rem 2.5rem',
                  display: 'flex', flexDirection: 'column',
                  position: 'relative', overflow: 'hidden',
                  transition: 'all 0.4s var(--ease)',
                }}
                onPointerDown={() => {
                  if (i === 0 && showHint) setShowHint(false);
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)';
                  (e.currentTarget as HTMLElement).style.borderColor = feat.color;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px ${feat.color}20`;
                  playNote(i);
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--white-08)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
                >
                  {i === 0 && showHint && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      animation: 'bounceHint 2s infinite',
                      pointerEvents: 'none',
                      zIndex: 10
                    }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--orange)', backgroundColor: 'var(--orange-glow-soft)', padding: '0.3rem 0.8rem', borderRadius: '100px', border: '1px solid var(--orange)' }}>Click & hover</span>
                      <span style={{ color: 'var(--orange)', fontSize: '1.2rem', marginTop: '-4px' }}>↓</span>
                    </div>
                  )}

                  {/* Subtle background glow based on icon color */}
                  <div style={{
                    position: 'absolute', top: '-50px', right: '-50px',
                    width: '150px', height: '150px', borderRadius: '50%',
                    background: `radial-gradient(circle, ${feat.color}30 0%, transparent 70%)`,
                    pointerEvents: 'none', zIndex: 0
                  }} />

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '60px', height: '60px', borderRadius: '16px',
                      background: `linear-gradient(135deg, ${feat.color}25, ${feat.color}05)`,
                      color: feat.color, marginBottom: '2rem',
                      border: `1px solid ${feat.color}30`
                    }}>
                      <Icon size={30} strokeWidth={1.5} />
                    </div>
                    <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--white)' }}>
                      {feat.title}
                    </h3>
                    <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--white-70)' }}>
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
