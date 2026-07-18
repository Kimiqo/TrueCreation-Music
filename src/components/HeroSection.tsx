import React, { useEffect, useRef, useState, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TypeAnimation } from 'react-type-animation';
import { SearchX, Lock, HelpCircle } from 'lucide-react';
import { triggerComingSoon } from './ComingSoonToast';

const HeroWaveform3D = React.lazy(() => import('./HeroWaveform3D').then(m => ({ default: m.HeroWaveform3D })));

gsap.registerPlugin(ScrollTrigger);

const problems = [
  { icon: SearchX, title: "Manual Reverse-Engineering", desc: "Hours on forums and guesswork trying to trace the plugins, presets, and samples behind a track." },
  { icon: Lock, title: "Copyright Opacity", desc: "No clear way to learn production techniques or understand rights for reused digital elements." },
  { icon: HelpCircle, title: "The Creative Black Box", desc: "Inability to understand the creative DNA behind professionally produced music." },
];

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scene1Ref = useRef<HTMLDivElement>(null);
  const scene2Ref = useRef<HTMLDivElement>(null);
  const typeContainerRef = useRef<HTMLDivElement>(null);
  const [shouldMount3D, setShouldMount3D] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShouldMount3D(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro animations for Hero text
      const words = scene1Ref.current?.querySelectorAll('.hw');
      if (words) {
        gsap.fromTo(words,
          { y: 100, opacity: 0, rotateX: 50 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1.4, stagger: 0.18, ease: 'power4.out', delay: 0.3 }
        );
      }
      gsap.fromTo('.hero-sub', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 1, ease: 'power3.out' });
      gsap.fromTo('.hero-btns', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 1.2, ease: 'power3.out' });

      // Master Timeline for Scroll Transition
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%', // Pin for 150vh to allow a long cinematic transition
          scrub: true,
          pin: true,
          anticipatePin: 1
        }
      });

      // Force timeline duration to 1 for easy percentage-based calculations
      tl.to({}, { duration: 1 });

      // Scene 1: Zoom in, blur out, fade out
      tl.to(scene1Ref.current, {
        z: 500, // Zoom towards camera
        filter: 'blur(15px)',
        opacity: 0,
        ease: 'power1.inOut',
        duration: 0.6
      }, 0);

      // Hero Wave: Blur out
      tl.to('.hero-wave-blur', {
        filter: 'blur(30px)',
        ease: 'power1.inOut',
        duration: 0.8
      }, 0);

      // Black overlay: Darken the background to prepare for next section
      tl.to('.hero-black-overlay', {
        opacity: 0.85,
        ease: 'power1.inOut',
        duration: 0.8
      }, 0);

      // Scene 2: Emerge from behind, unblur, fade in
      tl.fromTo(scene2Ref.current, 
        { z: -300, filter: 'blur(10px)', opacity: 0 },
        {
          z: 0,
          filter: 'blur(0px)',
          opacity: 1,
          ease: 'power1.inOut',
          duration: 0.6
        },
        0.2 // Start emerging slightly after Scene 1 starts zooming
      );

      // Reveal typewriter container and cards smoothly as part of the scroll
      tl.to(typeContainerRef.current, {
        opacity: 1,
        duration: 0.2,
      }, 0.3); // Reveal text just as Scene 2 gets visible

      tl.fromTo('.prob-card', 
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: 'power2.out',
          duration: 0.4
        },
        0.4 // Cards slide up while scrolling
      );

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="hero-pin-wrapper">
      <section ref={containerRef} className="hero-section" style={{
        position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
      }}>
        {/* 3D Waveform Background */}
        {shouldMount3D && (
          <Suspense fallback={null}>
            <HeroWaveform3D />
          </Suspense>
        )}

        {/* Performant black overlay that fades IN to hide the wave during scroll */}
        <div className="hero-black-overlay" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          backgroundColor: '#050505', opacity: 0, pointerEvents: 'none', zIndex: 1
        }} />

        {/* CSS 3D Camera for Scene Transitions */}
        <div className="hero-camera" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          perspective: '1200px', transformStyle: 'preserve-3d', zIndex: 3, pointerEvents: 'none'
        }}>
          
          {/* SCENE 1: HERO */}
          <div ref={scene1Ref} style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transformStyle: 'preserve-3d', willChange: 'transform, filter, opacity', pointerEvents: 'auto'
          }}>
            {/* Radial glow behind text */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: '800px', height: '800px',
              background: 'radial-gradient(circle, rgba(10,10,10,0.6) 0%, transparent 60%)',
              pointerEvents: 'none', zIndex: -1
            }} />

            <div className="container" style={{ textAlign: 'center' }}>
              <div style={{ perspective: '1000px' }}>
                <h1 style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)', marginBottom: '2rem', textTransform: 'uppercase' }}>
                  <span className="hw" style={{ display: 'block', overflow: 'hidden' }}>
                    <span style={{ display: 'inline-block' }}>Identify.</span>
                  </span>
                  <span className="hw" style={{ display: 'block', overflow: 'hidden' }}>
                    <span style={{ display: 'inline-block', color: 'var(--orange)' }}>Decode.</span>
                  </span>
                  <span className="hw" style={{ display: 'block', overflow: 'hidden' }}>
                    <span style={{ display: 'inline-block' }}>Create.</span>
                  </span>
                </h1>
              </div>

              <p className="hero-sub" style={{
                fontSize: 'clamp(1rem, 2.2vw, 1.4rem)', color: 'var(--white-70)',
                maxWidth: '550px', margin: '0 auto 3rem', opacity: 0
              }}>
                Empowering creators to decode the DNA of digital music. Understand what makes every track unique.
              </p>

              <div className="hero-btns" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', opacity: 0 }}>
                <button onClick={triggerComingSoon} className="btn-primary" style={{ padding: '1.1rem 2.8rem', fontSize: '1.1rem' }}>Enter TrueCreation</button>
                <button onClick={triggerComingSoon} className="btn-ghost" style={{ padding: '1.1rem 2.8rem', fontSize: '1.1rem' }}>Watch Demo</button>
              </div>
            </div>
          </div>

          {/* SCENE 2: THE PROBLEM */}
          <div ref={scene2Ref} style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transformStyle: 'preserve-3d', willChange: 'transform, filter, opacity', pointerEvents: 'auto',
            opacity: 0, transform: 'translateZ(-300px)', filter: 'blur(10px)'
          }}>
            <div className="container" style={{ textAlign: 'center', width: '100%' }}>
              <span className="label">The Problem</span>
              
              <div ref={typeContainerRef} style={{ opacity: 0, transition: 'opacity 0.3s ease', maxWidth: '1000px', margin: '0 auto' }}>
                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem', minHeight: '60px' }}>
                  <TypeAnimation
                    sequence={[
                      'Ignorance in Digital Music Production',
                    ]}
                    wrapper="span"
                    cursor={true}
                    speed={50}
                    style={{ display: 'inline-block' }}
                  />
                </h2>
                <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                  Producers waste time, money, and creative energy trying to decode the sounds they hear.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
                  {problems.map((item, i) => (
                    <div key={i} className="glass prob-card" style={{
                      padding: '2rem 1.5rem', cursor: 'default', opacity: 0, transform: 'translateY(40px)'
                    }}>
                      <div style={{
                        padding: '1rem', borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(255,69,0,0.15), rgba(255,69,0,0.05))',
                        color: 'var(--orange)', marginBottom: '1.2rem', display: 'inline-block'
                      }}>
                        <item.icon size={28} strokeWidth={1.5} />
                      </div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', fontWeight: 700 }}>{item.title}</h3>
                      <p style={{ fontSize: '0.9rem' }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
