import React from 'react'

export default function navbar() {
  return (
    <header className='container mx-auto px-4 py-6'>
      <nav className='flex justify-between items-center'>
        <div className='text-3xl font-bold animate-fade-in-down'>Tellow</div>
        <ul className='flex space-x-6 animate-fade-in-down'>
          {['About', 'Features', 'Testimonials', 'Pricing', 'Contact'].map(
            (item, index) => (
              <li
                key={item}
                className={`animate-fade-in-down animation-delay-${
                  index * 100
                }`}
              >
                <a
                  href={`#${item.toLowerCase()}`}
                  className='hover:text-yellow-300 transition-colors'
                >
                  {item}
                </a>
              </li>
            )
          )}
        </ul>
      </nav>
    </header>
  );
}
