import React from 'react';
import PricingCard from './cards/pricingCard';

export default function pricing() {
  return (
    <section id='pricing' className='py-24 p-4 md:p-2'>
      <div className='container mx-auto px-4'>
        <h2 className='text-4xl font-bold mb-12 text-center animate-fade-in-up'>
          Choose Your Plan
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <PricingCard
            title='Basic'
            price='Free'
            features={[
              '1-on-1 video calls',
              'Group calls up to 4 people',
              'Screen sharing',
              '24/7 support',
            ]}
          />
          <PricingCard
            title='Pro'
            price='$9.99/mo'
            features={[
              'Everything in Basic',
              'Group calls up to 50 people',
              'Recording feature',
              'Custom backgrounds',
              'Priority support',
            ]}
          />
          <PricingCard
            title='Enterprise'
            price='Custom'
            features={[
              'Everything in Pro',
              'Unlimited participants',
              'Advanced admin controls',
              'Dedicated account manager',
            ]}
          />
        </div>
      </div>
    </section>
  );
}
