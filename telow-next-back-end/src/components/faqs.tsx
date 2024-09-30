import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';

const FAQs = () => {
  const faqs = [
    {
      question: 'Is Tellow free to use?',
      answer:
        'Yes, Tellow offers a free Basic plan with essential features. We also have Pro and Enterprise plans for more advanced needs.',
    },
    {
      question: 'How secure are Tellow calls?',
      answer:
        'All Tellow calls are protected with end-to-end encryption, ensuring your conversations remain private and secure.',
    },
    {
      question: 'Can I use Tellow on mobile devices?',
      answer:
        'Absolutely! Tellow is available on iOS and Android devices, as well as on desktop browsers.',
    },
  ];

  return (
    <section className='bg-gray-100 py-20'>
      <div className='container mx-auto px-4'>
        <motion.h2
          className='text-4xl font-bold mb-12 text-center text-purple-900'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.div
          className='max-w-2xl mx-auto'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type='single' collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className='text-left font-semibold text-purple-900 hover:text-purple-700'>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className='text-gray-600'>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQs;
