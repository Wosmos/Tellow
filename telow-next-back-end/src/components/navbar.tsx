// import React from 'react';

// export default function navbar() {
//   return (
//     <header className='container mx-auto px-4 py-6 shadow-md bg-[#6804ffa9] static backdrop-blur-sm'>
//       <nav className='flex justify-between items-center'>
//         <div className='text-3xl font-bold animate-fade-in-down'>Tellow</div>
//         <ul className='flex space-x-6 animate-fade-in-down'>
//           {['About', 'Features', 'Testimonials', 'Pricing', 'Contact'].map(
//             (item, index) => (
//               <li
//                 key={item}
//                 className={`animate-fade-in-down animation-delay-${
//                   index * 100
//                 }`}
//               >
//                 <a
//                   href={`#${item.toLowerCase()}`}
//                   className='hover:text-yellow-300 transition-colors'
//                 >
//                   {item}
//                 </a>
//               </li>
//             )
//           )}
//         </ul>
//       </nav>
//     </header>
//   );
// }




import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

interface HeaderProps {
  logo: string;
  menuItems: string[];
}

const Header: React.FC<HeaderProps> = ({ logo, menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <header className='fixed w-full z-[999] shadow-lg bg-opacity-90 backdrop-filter backdrop-blur-lg bg-purple-700/50'>
      <div className='container mx-auto px-4 py-4 md:py-6'>
        <nav className='flex justify-between items-center'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className='text-2xl md:text-3xl font-bold text-white'
          >
            {logo}
          </motion.div>

          {/* Desktop Menu */}
          <motion.ul
            initial='closed'
            animate='open'
            variants={menuVariants}
            className='hidden md:flex space-x-8'
          >
            {menuItems.map((item) => (
              <motion.li key={item} variants={itemVariants}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className='text-white hover:text-yellow-300 transition-colors duration-300 text-lg font-medium'
                >
                  {item}
                </a>
              </motion.li>
            ))}
          </motion.ul>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenu}
            className='md:hidden text-white focus:outline-none'
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className='md:hidden mt-4'
            >
              <motion.ul
                variants={menuVariants}
                initial='closed'
                animate='open'
                exit='closed'
                className='flex flex-col space-y-8 h-screen justify-center'
              >
                {menuItems.map((item) => (
                  <motion.li key={item} variants={itemVariants}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className='block text-white hover:text-yellow-300 transition-colors duration-300 text-lg font-medium  text-center'
                      onClick={toggleMenu}
                    >
                      {item}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;