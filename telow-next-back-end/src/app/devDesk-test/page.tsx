import React from 'react';
// import { Layout } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const DevDeskDashboard = () => {
  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900 p-4'>
      <Card className='mb-4 flex flex-col items-center justify-center text-center'>
        <CardHeader>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white '>
            DevDesk
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Your All-in-One Developer Workspace
          </p>
        </CardHeader>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {/* Productivity Hub */}
        <Card className='col-span-full lg:col-span-2'>
          <CardHeader>
            <CardTitle>Productivity Hub</CardTitle>
          </CardHeader>
          <CardContent className='grid grid-cols-2 gap-4'>
            <div className='p-4 bg-blue-100 dark:bg-blue-900 rounded-lg'>
              <h3 className='font-semibold'>Task Manager</h3>
              <p className='text-sm'>Enhanced Todo with Pomodoro</p>
            </div>
            <div className='p-4 bg-green-100 dark:bg-green-900 rounded-lg'>
              <h3 className='font-semibold'>Smart Notes</h3>
              <p className='text-sm'>Markdown + Code Snippets</p>
            </div>
            <div className='p-4 bg-purple-100 dark:bg-purple-900 rounded-lg'>
              <h3 className='font-semibold'>Time Dashboard</h3>
              <p className='text-sm'>Clock + Timer + Time Zones</p>
            </div>
            <div className='p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg'>
              <h3 className='font-semibold'>Quick Calculate</h3>
              <p className='text-sm'>Dev Math Tools</p>
            </div>
          </CardContent>
        </Card>

        {/* Developer Tools */}
        <Card className='col-span-full lg:col-span-1'>
          <CardHeader>
            <CardTitle>Dev Tools</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='p-4 bg-red-100 dark:bg-red-900 rounded-lg'>
              <h3 className='font-semibold'>Form Builder</h3>
              <p className='text-sm'>Templates + Validation</p>
            </div>
            <div className='p-4 bg-indigo-100 dark:bg-indigo-900 rounded-lg'>
              <h3 className='font-semibold'>Color Tools</h3>
              <p className='text-sm'>Palette + Accessibility</p>
            </div>
          </CardContent>
        </Card>

        {/* Media Center */}
        <Card className='col-span-full md:col-span-1'>
          <CardHeader>
            <CardTitle>Media Center</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='p-4 bg-pink-100 dark:bg-pink-900 rounded-lg'>
              <h3 className='font-semibold'>Code Radio</h3>
              <p className='text-sm'>Focus Music + Player</p>
            </div>
            <div className='p-4 bg-orange-100 dark:bg-orange-900 rounded-lg'>
              <h3 className='font-semibold'>Resource Gallery</h3>
              <p className='text-sm'>Asset Management</p>
            </div>
          </CardContent>
        </Card>

        {/* Break Zone */}
        <Card className='col-span-full md:col-span-2'>
          <CardHeader>
            <CardTitle>Break Zone</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='p-4 bg-teal-100 dark:bg-teal-900 rounded-lg'>
              <h3 className='font-semibold'>Mind Games</h3>
              <p className='text-sm'>Memory + Logic Games</p>
            </div>
            <div className='p-4 bg-cyan-100 dark:bg-cyan-900 rounded-lg'>
              <h3 className='font-semibold'>Weather Break</h3>
              <p className='text-sm'>Local Weather + Breaks</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DevDeskDashboard;
