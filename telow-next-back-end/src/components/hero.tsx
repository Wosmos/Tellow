import React from 'react';
import { Button } from './ui/button';

export default function hero() {
  return (
    <section className='p-4 md:p-2 container mx-auto px-4 py-20 text-center section flex flex-col justify-center items-center'>
      <h1 className='text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up'>
        Redefine Connection with Tellow
      </h1>
      <p className='text-xl mb-8 animate-fade-in-up animation-delay-200'>
        Experience the future of video calling - crystal-clear, secure, and
        effortless.
      </p>
      <div className='animate-fade-in-up animation-delay-400'>
        <Button
          size='lg'
          className='bg-transparent outline outline-1 outline-yellow-300  hover:text-purple-900 hover:bg-yellow-300'
        >
          Start Your Journey
        </Button>
      </div>
    </section>
  );
}
