'use client'

import { ConfigProvider } from "antd";
import theme from '../../theme/themeConfig'
import DailyEntryCalendar from "./components/entryCalendar";
import { useEffect, useState } from "react";
import StatBar from "./components/statBar";


export default function Dashboard () {

  const [showCalendar, setShowCalendar] = useState(false)
  useEffect(()=> {
    // Hacky solution, is necessary due to incompatibility of antd calendar and nextjs 14 causing FOUC issues.
    setShowCalendar(true)
  },[])
  return (
    <div className='w-full h-full grow md:text-center' >
      <StatBar />
      <ConfigProvider theme={theme}>
        {
        showCalendar &&
        <DailyEntryCalendar />

        }
      </ConfigProvider>
      
    </div> 
  )
}