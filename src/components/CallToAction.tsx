import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { triggerComingSoon } from './ComingSoonToast';

gsap.registerPlugin(ScrollTrigger);

export const CallToAction = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { scale: 0.88, opacity: 0 },
        {
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', end: 'top 40%', scrub: 1 },
          scale: 1, opacity: 1, ease: 'none'
        }
      );

      gsap.fromTo(glowRef.current,
        { opacity: 0, scale: 0.5 },
        {
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', end: 'top 20%', scrub: 1 },
          opacity: 1, scale: 1.2, ease: 'none'
        }
      );

      gsap.to('.cta-glow-ring', {
        boxShadow: '0 0 40px rgba(255, 69, 0, 0.4), 0 0 80px rgba(255, 69, 0, 0.15)',
        duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section" style={{ paddingBottom: '10rem' }}>
      <div ref={glowRef} style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '900px', height: '900px',
        background: 'radial-gradient(circle, var(--orange-glow-soft) 0%, transparent 60%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div ref={contentRef} className="glass zoom-in-element" style={{
          padding: 'clamp(3rem, 6vw, 6rem) clamp(2rem, 4vw, 4rem)',
          maxWidth: '900px', margin: '0 auto',
          border: '1px solid var(--orange-glow-soft)',
        }}>
          <span className="label" style={{ marginBottom: '2rem' }}>Join Us</span>

          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '2rem', textTransform: 'uppercase' }}>
            Your Next Hit<br /><span style={{ color: 'var(--orange)' }}>Starts Here.</span>
          </h2>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', marginBottom: '3rem', maxWidth: '650px', margin: '0 auto 3rem' }}>
            To build TrueCreation for the first 2 years, we need approximately{' '}
            <strong style={{ color: 'var(--white)' }}>$1.37M in seed funding</strong>.
            We're seeking partners, investors, and early adopters to help reshape how music is understood and created.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <a href="#" onClick={triggerComingSoon} className="btn-primary cta-glow-ring" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem' }}>
              Get Started
            </a>
            <a href="mailto:gilbertakwetteh@gmail.com" className="btn-ghost" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem' }}>
              Contact Us
            </a>
          </div>

          <p style={{ color: 'var(--white-50)', fontSize: '0.95rem' }}>
            gilbertakwetteh@gmail.com  ·  +233 59 203 8080
          </p>
        </div>
      </div>
    </section>
  );
};
