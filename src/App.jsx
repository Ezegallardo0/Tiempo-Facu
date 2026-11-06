import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AppShowcase from './components/AppShowcase';
import PromoCalculator from './components/PromoCalculator';
import TaskManagerDemo from './components/TaskManagerDemo';
import Features from './components/Features';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import './App.css';

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('register');

  const handleOpenAuth = (mode = 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setAuthModalOpen(false);
  };

  return (
    <div className="tiempofacu-root">
      <Navbar onOpenAuth={handleOpenAuth} />
      <main className="main-content-flow">
        <Hero onOpenAuth={handleOpenAuth} />
        <AppShowcase />
        <PromoCalculator onOpenAuth={handleOpenAuth} />
        <TaskManagerDemo />
        <Features />
        <Stats />
        <Testimonials />
        <Pricing onOpenAuth={handleOpenAuth} />
        <FAQ />
        <CTA onOpenAuth={handleOpenAuth} />
      </main>
      <Footer onOpenAuth={handleOpenAuth} />

      <AuthModal
        isOpen={authModalOpen}
        mode={authModalMode}
        onClose={handleCloseAuth}
      />
    </div>
  );
}
