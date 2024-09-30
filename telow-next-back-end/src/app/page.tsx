import React from 'react';
import Head from 'next/head';
import { FaVideo, FaLock, FaGlobe, FaRocket, FaUsers } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Header from '@/components/navbar';
const LandingPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-purple-600 to-indigo-800 text-white'>
      <main>
        <Header />

        <section className='container mx-auto px-4 py-20 text-center'>
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

        {/* About Section */}
        <section id='about' className='bg-white text-purple-900 py-20'>
          <div className='container mx-auto px-4'>
            <h2 className='text-4xl font-bold mb-8 text-center animate-fade-in-up'>
              About Tellow
            </h2>
            <p className='text-xl max-w-3xl mx-auto text-center animate-fade-in-up animation-delay-200'>
              Tellow is more than just a video calling app. It's a revolution in
              digital communication, seamlessly blending cutting-edge technology
              with intuitive design to create an unparalleled connection
              experience. Our mission is to break down barriers and bring people
              together, no matter the distance.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id='features' className='py-20'>
          <div className='container mx-auto px-4'>
            <h2 className='text-4xl font-bold mb-12 text-center animate-fade-in-up'>
              Why Tellow Stands Out
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <FeatureCard
                icon={<FaVideo />}
                title='Crystal Clear Quality'
                description='Enjoy high-definition video and crisp audio for an immersive calling experience.'
              />
              <FeatureCard
                icon={<FaLock />}
                title='Uncompromising Security'
                description='Your calls are protected with state-of-the-art end-to-end encryption, ensuring your privacy.'
              />
              <FeatureCard
                icon={<FaGlobe />}
                title='Global Connectivity'
                description='Connect with anyone, anywhere in the world, breaking down geographical barriers.'
              />
              <FeatureCard
                icon={<FaRocket />}
                title='Lightning Fast'
                description='Experience minimal lag with our optimized servers and cutting-edge technology.'
              />
              <FeatureCard
                icon={<FaUsers />}
                title='Group Calls'
                description='Host large meetings or intimate gatherings with our scalable group call feature.'
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id='testimonials' className='bg-purple-800 py-20'>
          <div className='container mx-auto px-4'>
            <h2 className='text-4xl font-bold mb-12 text-center animate-fade-in-up'>
              What Our Users Say
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <TestimonialCard
                name='Sarah J.'
                role='Remote Team Lead'
                content="Tellow has transformed the way our team collaborates. The video quality is unmatched, and the interface is so intuitive. It's become an indispensable tool for us!"
              />
              <TestimonialCard
                name='Michael R.'
                role='Global Entrepreneur'
                content="As someone who's constantly connecting with partners worldwide, Tellow's reliability and crystal-clear calls have been a game-changer. It's like being in the same room, no matter the distance."
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id='pricing' className='py-20'>
          <div className='container mx-auto px-4'>
            <h2 className='text-4xl font-bold mb-12 text-center animate-fade-in-up'>
              Choose Your Plan
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <PricingCard
                title='Basic'
                price='Free'
                features={[
                  '1-on-1 video calls',
                  'Group calls up to 4 people',
                  'Screen sharing',
                  '24/7 support',
                ]}
              />
              <PricingCard
                title='Pro'
                price='$9.99/mo'
                features={[
                  'Everything in Basic',
                  'Group calls up to 50 people',
                  'Recording feature',
                  'Custom backgrounds',
                  'Priority support',
                ]}
              />
              <PricingCard
                title='Enterprise'
                price='Custom'
                features={[
                  'Everything in Pro',
                  'Unlimited participants',
                  'Advanced admin controls',
                  'Dedicated account manager',
                ]}
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id='faq' className='bg-white text-purple-900 py-20'>
          <div className='container mx-auto px-4'>
            <h2 className='text-4xl font-bold mb-12 text-center animate-fade-in-up'>
              Frequently Asked Questions
            </h2>
            <Accordion type='single' collapsible className='max-w-2xl mx-auto'>
              <AccordionItem value='item-1'>
                <AccordionTrigger>Is Tellow free to use?</AccordionTrigger>
                <AccordionContent>
                  Yes, Tellow offers a free Basic plan with essential features.
                  We also have Pro and Enterprise plans for more advanced needs.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-2'>
                <AccordionTrigger>
                  How secure are Tellow calls?
                </AccordionTrigger>
                <AccordionContent>
                  All Tellow calls are protected with end-to-end encryption,
                  ensuring your conversations remain private and secure.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-3'>
                <AccordionTrigger>
                  Can I use Tellow on mobile devices?
                </AccordionTrigger>
                <AccordionContent>
                  Absolutely! Tellow is available on iOS and Android devices, as
                  well as on desktop browsers.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Contact Section */}
        <section id='contact' className='bg-purple-900 py-20'>
          <div className='container mx-auto px-4'>
            <h2 className='text-4xl font-bold mb-8 text-center animate-fade-in-up'>
              Get in Touch
            </h2>
            <form className='max-w-lg mx-auto space-y-4'>
              <Input type='text' placeholder='Your Name' required />
              <Input type='email' placeholder='Your Email' required />
              <Textarea placeholder='Your Message' required className='h-32' />
              <Button
                type='submit'
                className='w-full bg-transparent outline outline-1 outline-yellow-300  hover:text-purple-900 hover:bg-yellow-300'
              >
                Send Message
              </Button>
            </form>
          </div>
        </section>
      </main>

      <footer className='bg-purple-800 py-6'>
        <div className='container mx-auto px-4 text-center'>
          <p>&copy; 2024 Tellow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className='animate-fade-in-up'>
    <Card className='bg-purple-800 text-white'>
      <CardHeader>
        <CardTitle className='flex items-center space-x-2'>
          {React.cloneElement(icon as React.ReactElement, {
            className: 'text-3xl',
          })}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  </div>
);

const TestimonialCard: React.FC<{
  name: string;
  role: string;
  content: string;
}> = ({ name, role, content }) => (
  <div className='animate-fade-in-up'>
    <Card className='bg-white text-purple-900'>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{role}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className='italic'>"{content}"</p>
      </CardContent>
    </Card>
  </div>
);

const PricingCard: React.FC<{
  title: string;
  price: string;
  features: string[];
}> = ({ title, price, features }) => (
  <div className='animate-fade-in-up'>
    <Card className='bg-purple-800 text-white h-[350px ]'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className='text-3xl font-bold text-yellow-300'>
          {price}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className='space-y-2'>
          {features.map((feature, index) => (
            <li key={index} className='flex items-center space-x-2'>
              <FaRocket className='text-yellow-300' />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className='w-full bg-transparent outline outline-1 outline-yellow-300  hover:text-purple-900 hover:bg-yellow-300 '>
          Choose Plan
        </Button>
      </CardFooter>
    </Card>
  </div>
);

export default LandingPage;
