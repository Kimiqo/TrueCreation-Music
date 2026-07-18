import { HeroSection } from '../components/HeroSection';
import { FeatureShowcase } from '../components/FeatureShowcase';
import { CompetitiveLandscape } from '../components/CompetitiveLandscape';
import { InvestorData } from '../components/InvestorData';
import { CallToAction } from '../components/CallToAction';
import { WaveformDivider } from '../components/WaveformDivider';
import { EarVisualization } from '../components/EarVisualization';

export const LandingPage = () => {
  return (
    <>
      <HeroSection />
      
      <WaveformDivider flip />
      <EarVisualization />

      <WaveformDivider />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <FeatureShowcase />
      </div>

      <WaveformDivider flip />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <CompetitiveLandscape />
        <WaveformDivider />
        <InvestorData />
      </div>

      <WaveformDivider flip />
      <CallToAction />
    </>
  );
};
