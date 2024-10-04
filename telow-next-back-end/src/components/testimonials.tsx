import React from 'react';
import { motion } from 'framer-motion';

const TestimonialCard: React.FC<{
  name: string;
  role: string;
  text: string;
}> = ({ name, role, text }) => (
  <motion.div
    className='bg-white rounded-lg shadow-lg p-6 mb-6'
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <p className='text-gray-600 italic mb-4'>&ldquo;{text}&ldquo;</p>
    <div className='font-semibold'>{name}</div>
    <div className='text-sm text-gray-500'>{role}</div>
  </motion.div>
);

const Testimonials = () => {
  const testimonials = [
    {
      name: 'John Doe',
      role: 'CEO, Tech Co',
      text: 'Tellow has revolutionized our remote work setup. The quality and reliability are unmatched.',
    },
    {
      name: 'Jane Smith',
      role: 'Freelance Designer',
      text: 'I love how easy it is to connect with clients worldwide. Tellow makes distance irrelevant.',
    },
    {
      name: 'Alex Johnson',
      role: 'Teacher',
      text: 'Teaching online has never been easier. My students love the interactive features of Tellow.',
    },
  ];

  return (
    <section className='p-4 md:p-2 bg-purple-100 py-20'>
      <div className='container mx-auto px-4'>
        <h2 className='text-4xl font-bold mb-12 text-center text-purple-900'>
          What Our Users Say
        </h2>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
