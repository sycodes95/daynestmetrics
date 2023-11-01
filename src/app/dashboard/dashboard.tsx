import { ConfigProvider } from "antd";
import theme from '../../theme/themeConfig'
import DailyEntryCalendar from "./components/entryCalendar";


export default function Dashboard () {
  return (
    <div className='w-full h-full grow md:text-center'>
      
      <ConfigProvider theme={theme}>
        <DailyEntryCalendar />
      </ConfigProvider>
      
    </div> 
  )
}