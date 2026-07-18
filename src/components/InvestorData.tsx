import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AnimatedCounter } from './AnimatedCounter';

gsap.registerPlugin(ScrollTrigger);

const data = [
  { year: 'Year 1', revenue: 500000, expenses: 710000, netCashFlow: -210000 },
  { year: 'Year 2', revenue: 1750000, expenses: 760000, netCashFlow: 990000 },
  { year: 'Year 3', revenue: 4100000, expenses: 1550000, netCashFlow: 2550000 },
  { year: 'Year 4', revenue: 9000000, expenses: 2575000, netCashFlow: 6425000 },
];

const formatCurrency = (value: number) => {
  if (value >= 1000000 || value <= -1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000 || value <= -1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

export const InvestorData = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.inv-header', {
        scrollTrigger: { trigger: '.inv-header', start: 'top 85%' },
        y: 50, opacity: 0, scale: 0.92, duration: 1, ease: 'power3.out'
      });

      cardsRef.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(card,
          { scale: 0.5, opacity: 0, y: 40 },
          {
            scrollTrigger: { trigger: card, start: 'top 85%', end: 'top 55%', scrub: 1 },
            scale: 1, opacity: 1, y: 0, ease: 'none'
          }
        );
      });

      gsap.fromTo(chartRef.current,
        { scale: 0.85, opacity: 0, y: 60 },
        {
          scrollTrigger: { trigger: chartRef.current, start: 'top 80%', end: 'top 45%', scrub: 1 },
          scale: 1, opacity: 1, y: 0, ease: 'none'
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section">
      <div className="container">
        <div className="inv-header" style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="label">Market Opportunity</span>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1.5rem' }}>
            The Market is <span style={{ color: 'var(--orange)' }}>Waiting.</span>
          </h2>
          <p style={{ fontSize: '1.2rem', maxWidth: '650px', margin: '0 auto' }}>
            A massive global market of creators looking for transparency and intelligence in music production.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
          {[
            { label: "Total Addressable Market", shortLabel: "TAM", target: 6.5, prefix: "$", suffix: "B", sub: "50M+ global music producers", decimals: 1 },
            { label: "Serviceable Addressable Market", shortLabel: "SAM", target: 3, prefix: "$", suffix: "B", sub: "30M DAW users", decimals: 0 },
            { label: "Serviceable Obtainable Market", shortLabel: "SOM", target: 100, prefix: "$", suffix: "M", sub: "1M early adopters", decimals: 0 }
          ].map((item, index) => (
            <div key={index} ref={el => { cardsRef.current[index] = el; }} className="glass zoom-in-element" style={{
              padding: '3rem 2.5rem', textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--white-50)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.shortLabel}</div>
              <div style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, color: 'var(--orange)', marginBottom: '0.5rem', letterSpacing: '-0.05em', lineHeight: 1 }}>
                <AnimatedCounter target={item.target} prefix={item.prefix} suffix={item.suffix} decimals={item.decimals} duration={2.5} />
              </div>
              <div style={{ color: 'var(--white-90)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.sub}</div>
              <div style={{ color: 'var(--white-50)', fontSize: '0.9rem' }}>{item.label}</div>
            </div>
          ))}
        </div>

        <div ref={chartRef} className="glass zoom-in-element" style={{ padding: '3rem', height: '550px' }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '2.5rem', textAlign: 'center' }}>Financial Projections (4 Years)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="year" stroke="var(--white-50)" tick={{ fill: 'var(--white-50)', fontSize: 13 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatCurrency} stroke="var(--white-50)" tick={{ fill: 'var(--white-50)', fontSize: 13 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value: any) => formatCurrency(Number(value))}
                contentStyle={{ backgroundColor: 'var(--black-lighter)', border: '1px solid var(--white-08)', borderRadius: '12px' }}
                itemStyle={{ color: 'var(--white)' }}
                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="revenue" name="Revenue" fill="var(--white-90)" radius={[8, 8, 0, 0]} barSize={32} />
              <Bar dataKey="expenses" name="Expenses" fill="var(--orange)" radius={[8, 8, 0, 0]} barSize={32} />
              <Bar dataKey="netCashFlow" name="Net Cash Flow" fill="var(--white-30)" radius={[8, 8, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};
