'use client'
import React from 'react'
import '../styles/globals.css'
import { getSession } from '@auth0/nextjs-auth0';
import MoodCalendar from '@/components/moodCalendar';
import { ConfigProvider } from 'antd';
import theme from '../theme/themeConfig'


export default function HomePage() {
  
  return (
    <div className='w-full h-full grow md:text-center'>
      {/* { 
      user ?
      <span>User</span>
      :
      <span>NO</span>
      } */}
      <ConfigProvider theme={theme}>
        <MoodCalendar />
      </ConfigProvider>
      
      
    </div> 
  )
}


