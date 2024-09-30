import React from 'react';
import { motion } from 'framer-motion';

const ContactUs = () => {
  return (
    <section className='bg-gradient-to-r from-purple-900 to-indigo-800 text-white py-20'>
      <div className='container mx-auto px-4'>
        <motion.h2
          className='text-4xl font-bold mb-8 text-center'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Get in Touch
        </motion.h2>
        <motion.form
          className='max-w-lg mx-auto'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className='mb-4'>
            <input
              type='text'
              placeholder='Your Name'
              className='w-full px-4 py-4 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300'
            />
          </div>
          <div className='mb-4'>
            <input
              type='email'
              placeholder='Your Email'
              className='w-full px-4 py-4 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300'
            />
          </div>
          <div className='mb-4'>
            <textarea
              placeholder='Your Message'
              rows={6}
              className='w-full px-4 py-4 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300'
            ></textarea>
          </div>
          <button
            type='submit'
            className='w-full text-white rounded-full font-semibold py-2 px-4  hover:bg-yellow-400 transition duration-300 bg-transparent outline outline-1 outline-yellow-300  hover:text-purple-900 '
          >
            Send Message
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default ContactUs;
