'use client';
import { motion } from 'framer-motion';
import { Briefcase, Building2, Calendar, ChevronRight } from 'lucide-react';
import { useState } from 'react';

// Animation variants for container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Animation variants for each experience card
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export function ExperienceSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const experiences = [
    {
      id: 1,
      company: 'TechCorp Solutions',
      role: 'Senior Software Engineer',
      period: '2022 - Present',
      description:
        'Led development of cloud-native applications using React and Node.js',
      achievements: [
        'Architected and deployed microservices reducing system latency by 40%',
        'Mentored junior developers and established coding standards',
        'Implemented CI/CD pipeline reducing deployment time by 60%',
      ],
      tech: ['React', 'Node.js', 'AWS', 'Docker'],
    },
    {
      id: 2,
      company: 'Innovation Labs',
      role: 'Full Stack Developer',
      period: '2020 - 2022',
      description: 'Developed and maintained enterprise-scale applications',
      achievements: [
        'Built real-time analytics dashboard used by 10K+ users',
        'Optimized database queries improving performance by 50%',
        'Led migration from monolith to microservices architecture',
      ],
      tech: ['Vue.js', 'Python', 'PostgreSQL', 'Redis'],
    },
    {
      id: 3,
      company: 'StartupX',
      role: 'Frontend Developer',
      period: '2018 - 2020',
      description:
        'Created responsive web applications for fast-growing startup',
      achievements: [
        'Implemented new design system reducing UI inconsistencies',
        'Developed reusable component library used across projects',
        'Improved web vitals scores by 25+ points',
      ],
      tech: ['React', 'TypeScript', 'Tailwind', 'Jest'],
    },
  ];

  return (
    <section id='experience' className='py-32 bg-gray-50 dark:bg-zinc-900'>
      <div className='container mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className='max-w-4xl mx-auto'
        >
          <h2 className='text-3xl font-bold mb-16 flex items-center gap-2'>
            <Briefcase className='w-6 h-6 text-blue-600' />
            Experience
          </h2>

          <motion.div
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='space-y-6'
          >
            {experiences.map((exp) => (
              <motion.div
                key={exp.id}
                variants={cardVariants}
                className='bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] 
                          hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] 
                          transition-all duration-300 overflow-hidden
                          transform hover:-translate-y-1'
              >
                {/* Header Section */}
                <div
                  onClick={() =>
                    setExpandedId(expandedId === exp.id ? null : exp.id)
                  }
                  className='p-6 cursor-pointer flex items-start justify-between gap-4'
                >
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <Building2 className='w-5 h-5 text-blue-600' />
                      <h3 className='font-semibold text-lg text-slate-900 dark:text-white'>
                        {exp.company}
                      </h3>
                    </div>
                    <h4 className='text-slate-700 dark:text-slate-300 font-medium mb-2'>
                      {exp.role}
                    </h4>
                    <div className='flex items-center gap-2 text-slate-500 dark:text-slate-400'>
                      <Calendar className='w-4 h-4' />
                      <span className='text-sm'>{exp.period}</span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedId === exp.id ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight className='w-5 h-5 text-slate-400' />
                  </motion.div>
                </div>

                {/* Expanded Content */}
                <motion.div
                  animate={{
                    height: expandedId === exp.id ? 'auto' : 0,
                    opacity: expandedId === exp.id ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                  }}
                  className='overflow-hidden'
                >
                  <div className='px-6 pb-6 space-y-4'>
                    <p className='text-slate-600 dark:text-slate-300'>
                      {exp.description}
                    </p>

                    <div className='space-y-2'>
                      <h5 className='font-medium text-slate-900 dark:text-white'>
                        Key Achievements
                      </h5>
                      <ul className='space-y-2'>
                        {exp.achievements.map((achievement, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className='flex items-start gap-2 text-slate-600 dark:text-slate-300'
                          >
                            <span className='text-blue-600 mt-1'>•</span>
                            {achievement}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className='font-medium text-slate-900 dark:text-white mb-2'>
                        Technologies
                      </h5>
                      <div className='flex flex-wrap gap-2'>
                        {exp.tech.map((tech, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className='px-3 py-1 bg-blue-50 dark:bg-blue-900/30 
                                     text-blue-600 dark:text-blue-400 
                                     rounded-full text-sm'
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
