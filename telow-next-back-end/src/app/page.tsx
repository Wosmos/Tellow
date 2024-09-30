'use client';
import React from 'react';

import Header from '@/components/navbar';
import Hero from '@/components/hero';
import About from '../components/about';
import ContactUs from '@/components/contactUs';
import Faqs from '../components/faqs';
import Features from '../components/features';
import Testimonials from '@/components/testimonials';
import Pricing from '@/components/pricing';
import data from '@/app/data/data.json';
const LandingPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-purple-600 to-indigo-800 text-white'>
      <main >
       
          <Header logo={data.header.logo} menuItems={data.header.menuItems} />
     
        {/* Hero section */}
        <Hero />
        {/* About Section */}
        <About />
        {/* Features Section */}
        <Features />
        {/* Testimonials Section */}
        <Testimonials />
        {/* Pricing Section */}
        <Pricing />
        {/* FAQ Section */}
        <Faqs />
        {/* Contact Section */}
        <ContactUs />
      </main>
      <footer className='bg-purple-800 py-6'>
        <div className='container mx-auto px-4 text-center'>
          <p>© 2024 Tellow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
