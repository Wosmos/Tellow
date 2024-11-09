'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Moon,
  Sun,
  Github,
  Linkedin,
  Mail,
  Terminal,
  Code,
  Layout,
  Smartphone,
  Database,
  Chrome,
  Star,
  Award,
  ExternalLink,
  Sparkles,
  Briefcase,
  Building2,
  Calendar,
  ChevronRight,
  Twitter,
  Instagram,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ExperienceSection } from './Experience';
import Link from 'next/link';

// Animated gradient background component
const GradientBackground = () => (
  <div
    className='absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]'
    style={{
      background: `
        radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 30%),
        radial-gradient(circle at 100% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 30%),
        radial-gradient(circle at 100% 100%, rgba(217, 70, 239, 0.15) 0%, transparent 30%),
        radial-gradient(circle at 0% 100%, rgba(79, 70, 229, 0.15) 0%, transparent 30%),
        radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)
      `,
    }}
  >
    <div className='absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 dark:bg-blue-600 opacity-20 blur-[100px]'></div>
  </div>
);

// Animated text reveal component
const AnimatedText = ({ text, className }) => (
  <motion.span
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={className}
  >
    {text}
  </motion.span>
);

// Skill card component for bento grid
const SkillCard = ({ title, skills, icon: Icon, className }) => (
  <Card className={`p-4 hover:scale-[1.02] transition-transform ${className}`}>
    <CardContent className='p-0'>
      <div className='flex items-center gap-2 mb-3'>
        <Icon className='w-5 h-5 text-blue-600' />
        <h3 className='font-semibold'>{title}</h3>
      </div>
      <div className='flex flex-wrap gap-2'>
        {skills.map((skill) => (
          <span
            key={skill}
            className='px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-md'
          >
            {skill}
          </span>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Project card with hover effects
const ProjectCard = ({ project }) => (
  <motion.div whileHover={{ y: -5 }} className='relative group'>
    <Card className='overflow-hidden'>
      <CardContent className='p-6'>
        <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity'>
          <a href={project.link} target='_blank' rel='noopener noreferrer'>
            <ExternalLink className='w-5 h-5' />
          </a>
        </div>
        <h3 className='text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors'>
          {project.title}
        </h3>
        <p className='text-gray-600 dark:text-gray-400 mb-4'>
          {project.description}
        </p>
        <div className='flex flex-wrap gap-2'>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className='px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm'
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const Portfolio = () => {
  const [isDark, setIsDark] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const skills = {
    frontend: ['React', 'Next.js', 'TypeScript', 'Redux'],
    backend: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
    mobile: ['React Native', 'Expo'],
    other: ['Git', 'AWS', 'Redux', 'Firebase'],
  };

  const projects = [
    {
      title: 'Tellow',
      description: 'Cross-platform video calling app with advanced features',
      tags: ['React Native', 'Next.js', 'Expo', 'GetStream'],
      link: '#',
      featured: true,
    },
    // ... other projects
  ];
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div
      className={`min-h-screen  ${
        isDark ? 'dark text-gray-300 bg-zinc-950' : ''
      }`}
    >
      <GradientBackground />

      {/* Navbar with blur effect */}
      <section className='flex justify-center '>
        <nav className='mt-4 max-w-4xl fixed flex items-center px-4 overflow-hidden backdrop-blur-md bg-white/75 dark:bg-gray-900/75 z-50 border-b border-gray-200 dark:border-gray-800 mx-auto rounded-lg '>
          <div className='container  px-4 py-4'>
            <div className='flex justify-between items-center '>
              

              <div className='flex items-center gap-6'>
                <nav className=' flex gap-6'>
                  {['About', 'Projects', 'Experience', 'Contact'].map(
                    (item) => (
                      <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        className='text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                      >
                        {item}
                      </a>
                    )
                  )}
                </nav>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDark(!isDark)}
                  className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300 transition-colors'
                >
                  {isDark ? (
                    <Sun className='w-5 h-5' />
                  ) : (
                    <Moon className='w-5 h-5' />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </nav>
      </section>

      {/* Hero Section with animated background */}
      <section className='min-h-screen flex items-center relative overflow-hidden'>
        <div className='container mx-auto px-4 py-32'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='max-w-4xl mx-auto'
          >
            <h1 className='text-5xl md:text-7xl font-bold mb-6'>
              <AnimatedText
                text='Full Stack Developer'
                className='block mb-2 dark:text-gray-300'
              />
              <AnimatedText
                text='& AI Engineer'
                className=' bg-gradient-to-tr from-blue-400 via-purple-500 to-orange-500 bg-clip-text text-transparent'
              />
            </h1>
            <p className='text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl'>
              Crafting exceptional digital experiences with modern technologies
              and creative solutions.
            </p>
            <div className='flex gap-4 items-center'>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href='#contact'
                className='px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors'
              >
                Get in Touch
              </motion.a>
              <div className='flex gap-4 ml-4'>
                {[
                  { icon: Github, link: 'https://github.com/Wosmos' },
                  {
                    icon: Linkedin,
                    link: 'https://linkedin.com/in/wasif-malik-79205a1bb',
                  },
                  { icon: Mail, link: 'mailto:m.wasifmalik17@gmail.com' },
                ].map(({ icon: Icon, link }) => (
                  <motion.a
                    key={link}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                  >
                    <Icon className='w-5 h-5' />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section with Bento Grid */}
      <section
        id='about'
        className='py-32 relative dark:bg-zinc-900 dark:text-gray-300'
      >
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className='max-w-4xl mx-auto'
          >
            <h2 className='text-3xl font-bold mb-16 flex items-center gap-2'>
              <Sparkles className='w-6 h-6 text-blue-600' />
              About Me
            </h2>

            {/* Bento Grid Layout */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {/* Main About Card */}
              <Card className='md:col-span-2 p-6'>
                <CardContent className='p-0 space-y-4'>
                  <h3 className='text-xl font-semibold mb-4'>Background</h3>
                  <p className='text-gray-600 dark:text-gray-400'>
                    A passionate Full Stack Developer pursuing Software
                    Engineering, combining academic excellence with practical
                    development experience. I specialize in creating scalable
                    web applications with modern technologies.
                  </p>
                  <div className='pt-4'>
                    <h4 className='font-semibold mb-2'>Education</h4>
                    <div className='space-y-2'>
                      <div>
                        <p className='font-medium'>Software Engineering</p>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                          Undergraduate • 2022-2026 • GPA: 3.0
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Cards in Bento Grid */}
              <div className='space-y-6'>
                <SkillCard
                  title='Frontend'
                  skills={skills.frontend}
                  icon={Layout}
                />
                <SkillCard
                  title='Backend'
                  skills={skills.backend}
                  icon={Terminal}
                />
              </div>

              {/* Additional skill cards */}
              <SkillCard
                title='Mobile'
                skills={skills.mobile}
                icon={Smartphone}
                className='md:col-span-2'
              />
              <SkillCard title='Other' skills={skills.other} icon={Code} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id='projects' className='py-32 bg-gray-50 dark:bg-zinc-900'>
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className='max-w-4xl mx-auto'
          >
            <h2 className='text-3xl font-bold mb-16 flex items-center gap-2'>
              <Star className='w-6 h-6 text-blue-600' />
              Featured Projects
            </h2>

            <div className='grid md:grid-cols-2 gap-8'>
              {projects.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}

      <ExperienceSection />

      {/* Contact Section */}
      <section id='contact' className='py-32 bg-gray-50 dark:bg-zinc-900'>
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className='max-w-4xl mx-auto text-center'
          >
            <h2 className='text-3xl font-bold mb-8'>
              Let's Create Something Amazing
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto'>
              I'm currently available for freelance work and full-time
              positions. Let's discuss how we can work together to bring your
              ideas to life.
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href='mailto:m.wasifmalik17@gmail.com'
              className='inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors'
            >
              <Mail className='w-5 h-5' />
              Get in Touch
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400">
              © 2024 Muhammad Wasif Malik. All rights reserved.
            </p> */}

      {/* Footer */}
      <footer className='py-16 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden'>
        <div className='container mx-auto px-4'>
          <div className='max-w-6xl mx-auto'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-12'>
              {/* Brand Section */}
              <div className='col-span-1 md:col-span-2'>
                <span className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4 block'>
                  WM.
                </span>
                <p className='text-gray-600 dark:text-gray-400 mb-6 max-w-md'>
                  Crafting exceptional digital experiences with modern
                  technologies and creative solutions.
                </p>
                <div className='flex gap-4'>
                  {[
                    { icon: Github, link: 'https://github.com/Wosmos' },
                    { icon: Twitter, link: '#' },
                    {
                      icon: Linkedin,
                      link: 'https://linkedin.com/in/wasif-malik-79205a1bb',
                    },
                    { icon: Instagram, link: '#' },
                  ].map(({ icon: Icon, link }) => (
                    <motion.a
                      key={link}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      href={link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                    >
                      <Icon className='w-5 h-5' />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className='font-semibold mb-4'>Quick Links</h3>
                <ul className='space-y-3'>
                  {['About', 'Projects', 'Experience', 'Contact'].map(
                    (item) => (
                      <li key={item}>
                        <a
                          href={`#${item.toLowerCase()}`}
                          className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className='font-semibold mb-4'>Contact</h3>
                <ul className='space-y-3'>
                  <li>
                    <a
                      href='mailto:m.wasifmalik17@gmail.com'
                      className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2'
                    >
                      <Mail className='w-4 h-4' />
                      Email
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className='mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center'>
              <p className='text-gray-600 dark:text-gray-400'>
                © 2024 Muhammad Wasif Malik. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
