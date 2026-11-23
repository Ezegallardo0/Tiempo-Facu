import Hero from '../components/Hero';
import Features from '../components/Features';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';

export default function PublicLandingPage({ onOpenAuth, onNavigate }) {
  return (
    <main className="main-content-flow">
      <Hero onOpenAuth={onOpenAuth} onNavigate={onNavigate} />
      <Features />
      <Stats />
      <Testimonials />
      <Pricing onOpenAuth={onOpenAuth} onNavigate={onNavigate} />
      <FAQ />
      <CTA onOpenAuth={onOpenAuth} onNavigate={onNavigate} />
    </main>
  );
}

