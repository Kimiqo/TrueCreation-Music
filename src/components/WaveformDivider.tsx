import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const WaveformDivider = ({ flip = false }: { flip?: boolean }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathsRef = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      pathsRef.current.forEach((path, i) => {
        if (!path) return;

        // Continuous subtle oscillation
        gsap.to(path, {
          attr: {
            d: generateWavePath(i, true)
          },
          duration: 3 + i * 0.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });

        // Scroll-triggered amplitude increase
        gsap.fromTo(path, {
          attr: { 'stroke-dashoffset': 2000 }
        }, {
          scrollTrigger: {
            trigger: svgRef.current,
            start: 'top 90%',
            end: 'bottom 60%',
            scrub: 1
          },
          attr: { 'stroke-dashoffset': 0 },
          ease: 'none'
        });
      });
    }, svgRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="waveform-divider" style={{ transform: flip ? 'scaleY(-1)' : 'none' }}>
      <svg ref={svgRef} viewBox="0 0 1200 80" preserveAspectRatio="none">
        <path
          ref={el => { pathsRef.current[0] = el; }}
          d={generateWavePath(0, false)}
          className="hero-wave-line"
          stroke="var(--color-orange)"
          strokeWidth="2"
          strokeDasharray="2000"
          opacity="0.3"
        />
        <path
          ref={el => { pathsRef.current[1] = el; }}
          d={generateWavePath(1, false)}
          className="hero-wave-line"
          stroke="var(--color-orange)"
          strokeWidth="1.5"
          strokeDasharray="2000"
          opacity="0.15"
        />
        <path
          ref={el => { pathsRef.current[2] = el; }}
          d={generateWavePath(2, false)}
          className="hero-wave-line"
          stroke="var(--color-orange)"
          strokeWidth="1"
          strokeDasharray="2000"
          opacity="0.1"
        />
      </svg>
    </div>
  );
};

function generateWavePath(index: number, alt: boolean): string {
  const amplitude = alt ? 15 + index * 8 : 10 + index * 5;
  const frequency = 3 + index * 0.5;
  const yOffset = 40;
  const points: string[] = [];

  for (let x = 0; x <= 1200; x += 4) {
    const y = yOffset + Math.sin((x / 1200) * Math.PI * frequency + index) * amplitude;
    points.push(`${x},${y.toFixed(1)}`);
  }

  return `M${points.join(' L')}`;
}
