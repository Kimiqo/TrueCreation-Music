import { useEffect, useRef } from 'react';

const NOTES = ['♩', '♪', '♫', '♬', '♭', '♯', '𝄞', '𝄢'];

export const FloatingNotes = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const els: HTMLSpanElement[] = [];

    for (let i = 0; i < 30; i++) {
      const el = document.createElement('span');
      el.className = 'music-note';
      el.textContent = NOTES[Math.floor(Math.random() * NOTES.length)];

      const left = Math.random() * 100;
      const dur = 15 + Math.random() * 25;
      const delay = Math.random() * 20;
      const size = 1 + Math.random() * 2;
      const opacity = 0.08 + Math.random() * 0.18;

      el.style.left = `${left}%`;
      el.style.animationDuration = `${dur}s`;
      el.style.animationDelay = `${delay}s`;
      el.style.fontSize = `${size}rem`;
      el.style.setProperty('--note-opacity', `${opacity}`);
      el.style.textShadow = `0 0 20px rgba(255,69,0,${opacity})`;

      container.appendChild(el);
      els.push(el);
    }

    return () => { els.forEach(e => e.remove()); };
  }, []);

  return (
    <div ref={containerRef} style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 1,
      overflow: 'hidden'
    }} />
  );
};
