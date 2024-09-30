import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

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

export default FeatureCard;
