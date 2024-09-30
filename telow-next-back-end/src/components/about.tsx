import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section className='p-4 md:p-2 bg-gradient-to-r from-purple-900 to-indigo-800 text-white py-20'>
      <div className='container mx-auto px-4'>
        <motion.h2
          className='text-4xl font-bold mb-8 text-center'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Tellow
        </motion.h2>
        <motion.p
          className='text-lg max-w-3xl mx-auto text-center leading-relaxed'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Tellow is more than just a video calling app. It's a revolution in
          digital communication, seamlessly blending cutting-edge technology
          with intuitive design to create an unparalleled connection experience.
          Our mission is to break down barriers and bring people together, no
          matter the distance.
        </motion.p>
      </div>
    </section>
  );
};

export default About;
