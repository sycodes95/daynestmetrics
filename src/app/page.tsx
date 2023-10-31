'use client'
import React from 'react'
import '../styles/globals.css'
import { getSession } from '@auth0/nextjs-auth0';
import { ConfigProvider } from 'antd';
import theme from '../theme/themeConfig'
import DailyEntryCalendar from './daily-entry-calendar/DailyEntryCalendar';


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
        <DailyEntryCalendar />
      </ConfigProvider>
      
      
    </div> 
  )
}


