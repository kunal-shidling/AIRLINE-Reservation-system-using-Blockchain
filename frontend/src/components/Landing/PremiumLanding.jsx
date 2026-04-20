import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const PremiumLanding = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.9
    });

    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const mm = gsap.matchMedia();
    const context = gsap.context(() => {
      gsap.fromTo(
        '.hero-copy > *',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.13, duration: 0.9, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.feature-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.features-section',
            start: 'top 70%'
          }
        }
      );
    }, root);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      mm.revert();
      context.revert();
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-dark-900 text-white" ref={rootRef}>
      {/* Hero Section */}
      <section className="min-h-screen w-full pt-32 px-4 md:px-8 lg:px-16 flex items-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <div className="hero-copy space-y-8">
              {/* Main Heading */}
              <div>
                <h1 className="text-6xl md:text-7xl font-bold font-playfair leading-tight">
                  <span className="bg-gradient-to-r from-gold-500 to-accent-cyan bg-clip-text text-transparent">
                    Elevate Your
                  </span>
                  <br />
                  <span className="text-white">Journey</span>
                </h1>
              </div>

              {/* Subheading */}
              <p className="text-xl text-white/70 leading-relaxed max-w-xl">
                Experience luxury airline reservations like never before.
                Real-time bookings, integrated blockchain payments,
                and an immersive interface designed for modern travelers.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/flights"
                  className="px-8 py-4 rounded-lg bg-gradient-to-r from-gold-500 to-gold-400 text-dark-900 font-bold hover:shadow-lg hover:shadow-gold-500/50 transition-all duration-300 text-center"
                >
                  Explore Flights
                </Link>

                <Link
                  to="/register"
                  className="px-8 py-4 rounded-lg border-2 border-gold-500 text-gold-400 font-bold hover:bg-gold-500/10 transition-all duration-300 text-center"
                >
                  Get Started
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-12 border-t border-white/10">
                <div>
                  <p className="text-3xl font-bold text-gold-400">500+</p>
                  <p className="text-sm text-white/60 mt-2">Flight Routes</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent-cyan">50K+</p>
                  <p className="text-sm text-white/60 mt-2">Happy Travelers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent-purple">99.8%</p>
                  <p className="text-sm text-white/60 mt-2">Uptime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section w-full py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold font-playfair mb-4">
              <span className="bg-gradient-to-r from-gold-500 to-accent-cyan bg-clip-text text-transparent">
                Premium Features
              </span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Cutting-edge technology for seamless travel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="feature-card p-8 rounded-2xl border border-white/10 hover:border-gold-500 transition-all bg-white/5 hover:bg-white/10 backdrop-blur">
              <div className="w-12 h-12 rounded-lg bg-gold-500/20 flex items-center justify-center mb-4">
                <span className="text-2xl">✈️</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Real-Time Search</h3>
              <p className="text-white/70">
                Search and book flights instantly with advanced algorithms
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card p-8 rounded-2xl border border-white/10 hover:border-accent-cyan transition-all bg-white/5 hover:bg-white/10 backdrop-blur">
              <div className="w-12 h-12 rounded-lg bg-accent-cyan/20 flex items-center justify-center mb-4">
                <span className="text-2xl">⛓️</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Blockchain Payment</h3>
              <p className="text-white/70">
                Secure payments using blockchain technology with crypto support
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card p-8 rounded-2xl border border-white/10 hover:border-accent-purple transition-all bg-white/5 hover:bg-white/10 backdrop-blur">
              <div className="w-12 h-12 rounded-lg bg-accent-purple/20 flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold mb-3">AI Recommendations</h3>
              <p className="text-white/70">
                Personalized flight recommendations based on your preferences
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card p-8 rounded-2xl border border-white/10 hover:border-gold-500 transition-all bg-white/5 hover:bg-white/10 backdrop-blur">
              <div className="w-12 h-12 rounded-lg bg-gold-500/20 flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
              <p className="text-white/70">
                Dedicated customer support available round the clock
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card p-8 rounded-2xl border border-white/10 hover:border-accent-cyan transition-all bg-white/5 hover:bg-white/10 backdrop-blur">
              <div className="w-12 h-12 rounded-lg bg-accent-cyan/20 flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Booking</h3>
              <p className="text-white/70">
                Complete your booking in seconds with our streamlined system
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card p-8 rounded-2xl border border-white/10 hover:border-accent-purple transition-all bg-white/5 hover:bg-white/10 backdrop-blur">
              <div className="w-12 h-12 rounded-lg bg-accent-purple/20 flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
              <p className="text-white/70">
                Track your bookings and statistics with comprehensive dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-4 md:px-8 lg:px-16 relative">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-5xl font-bold font-playfair mb-6">
            Ready to Start?
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers experiencing the future of airline reservations
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/flights"
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-gold-500 to-gold-400 text-dark-900 font-bold hover:shadow-lg hover:shadow-gold-500/50 transition-all"
            >
              Book Your Flight
            </Link>
            <Link
              to="/blockchain"
              className="px-8 py-4 rounded-lg border-2 border-accent-cyan text-accent-cyan font-bold hover:bg-accent-cyan/10 transition-all"
            >
              Explore Blockchain
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-dark-800 py-12 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center text-white/60 text-sm">
            <p>&copy; 2026 JetAirline. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PremiumLanding;
