import React, { useEffect, useState, Suspense } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FloatingNotes } from './FloatingNotes';
import { SmoothScroll } from './SmoothScroll';
import { ComingSoonToast, triggerComingSoon } from './ComingSoonToast';

const BackgroundWaveform = React.lazy(() => import('./BackgroundWaveform').then(m => ({ default: m.BackgroundWaveform })));

export const Layout = () => {
  const [shouldMountWave, setShouldMountWave] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShouldMountWave(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const unlockAudio = () => {
      try {
        if (!(window as any).globalAudioCtx) {
          (window as any).globalAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if ((window as any).globalAudioCtx.state === 'suspended') {
          (window as any).globalAudioCtx.resume();
        }
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      } catch (e) {}
    };

    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);
  return (
    <SmoothScroll>
      <div style={{ position: 'relative' }}>
        {/* Ambient background waveform - runs once globally for maximum performance */}
        {shouldMountWave && (
          <Suspense fallback={null}>
            <BackgroundWaveform opacity={0.2} />
          </Suspense>
        )}
        
        {/* Ambient floating music notes - persistent across pages */}
        <FloatingNotes />

        {/* Global Coming Soon Toast */}
        <ComingSoonToast />

        {/* Navigation */}
        <nav style={{
          position: 'fixed', top: 0, width: '100%', padding: '1.2rem 2rem', zIndex: 100,
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(10,10,10,0.6)', borderBottom: '1px solid var(--white-08)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            <Link to="/" style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.05em', color: 'var(--white)' }}>
              TRUE<span style={{ color: 'var(--orange)' }}>CREATION</span>
            </Link>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/features" style={{ color: 'var(--white-70)', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--white-70)'}>Features</Link>
              <Link to="/" style={{ color: 'var(--white-70)', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--white-70)'}>Market</Link>
              <a href="#" onClick={triggerComingSoon} className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.95rem' }}>Login / Sign Up</a>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main>
          <Outlet />
        </main>

        {/* Footer */}
        <footer style={{
          textAlign: 'center', padding: '3rem 2rem',
          borderTop: '1px solid var(--white-08)',
          color: 'var(--white-50)', background: 'var(--black-light)',
          fontSize: '0.9rem', position: 'relative', zIndex: 1,
        }}>
          <p>© 2026 TrueCreation. All rights reserved.</p>
        </footer>
      </div>
    </SmoothScroll>
  );
};
