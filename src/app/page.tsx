import React from 'react'
import '../styles/globals.css'
import { getSession } from '@auth0/nextjs-auth0';
import { ConfigProvider } from 'antd';
import theme from '../theme/themeConfig'
import DailyEntryCalendar from './dashboard/components/entryCalendar';
import Dashboard from './dashboard/dashboard';


export default function page() {
  
  return (
    <>
      <ConfigProvider theme={theme}>
        <Dashboard />
      </ConfigProvider>
      {/* <ConfigProvider theme={{ algorithm: theme.}}>
        <Dashboard />
      </ConfigProvider> */}
    </>
  )
}


