import React, { useRef, useEffect } from 'react';
import { FaGlobe, FaLock, FaRocket, FaUsers, FaVideo } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <motion.div
    className='flex-shrink-0 w-96 cursor-pointer bg-white rounded-lg shadow-lg p-8 mr-4'
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
  >
    <Icon className='text-4xl text-purple-600 mb-4' />
    <h3 className='text-xl font-semibold mb-2 text-purple-600'>{title}</h3>
    <p className='text-gray-600'>{description}</p>
  </motion.div>
);

const Features: React.FC = () => {
  const features = [
    {
      icon: FaVideo,
      title: 'Crystal Clear Quality',
      description:
        'Enjoy high-definition video and crisp audio for an immersive calling experience.',
    },
    {
      icon: FaLock,
      title: 'Uncompromising Security',
      description:
        'Your calls are protected with state-of-the-art end-to-end encryption, ensuring your privacy.',
    },
    {
      icon: FaGlobe,
      title: 'Global Connectivity',
      description:
        'Connect with anyone, anywhere in the world, breaking down geographical barriers.',
    },
    {
      icon: FaRocket,
      title: 'Lightning Fast',
      description:
        'Experience minimal lag with our optimized servers and cutting-edge technology.',
    },
    {
      icon: FaUsers,
      title: 'Group Calls',
      description:
        'Host large meetings or intimate gatherings with our scalable group call feature.',
    },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    let scrollInterval: NodeJS.Timeout;

    const startScroll = () => {
      scrollInterval = setInterval(() => {
        if (
          carousel &&
          carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth
        ) {
          carousel.scrollLeft = 0;
        } else if (carousel) {
          carousel.scrollLeft += 1;
        }
      }, 30);
    };

    const stopScroll = () => {
      clearInterval(scrollInterval);
    };

    if (carousel) {
      startScroll();
      carousel.addEventListener('mouseenter', stopScroll);
      carousel.addEventListener('mouseleave', startScroll);

      return () => {
        stopScroll();
        carousel.removeEventListener('mouseenter', stopScroll);
        carousel.removeEventListener('mouseleave', startScroll);
      };
    }
  }, []);

  return (
    <section className='bg-gray-100 py-20'>
      <div className='container mx-auto px-4'>
        <h2 className='text-4xl font-bold mb-12 text-center text-purple-900'>
          Why Tellow Stands Out
        </h2>
        <div
          ref={carouselRef}
          className='overflow-hidden'
          style={{
            maskImage:
              'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          <div
            className='flex space-x-4 py-4'
            style={{ width: `${features.length * 280}px` }}
          >
            {features.concat(features).map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;