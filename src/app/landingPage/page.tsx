import { GetServerSideProps } from 'next';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/router'
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import conquerMountain from '../../assets/images/conquermountain.webp'
import landingPageBackground from '../../assets/images/lookatmountain.webp'

import insightsDemo from '../../assets/images/features/insights.png'

import Image from 'next/image';
import LandingPageHeader from './components/landingPageHeader';
import LandingPageHeadline from './components/landingPageHeadline';


export default function LandingPage() {
  return(
    <div className="flex flex-col gap-4 w-full h-full items-center ">
      <Image className='absolute top-0 left-0 h-full w-full object-cover -z-10 grayscale opacity-40 max-h-screen rounded-xl  saturate-200' src={landingPageBackground} alt="" />

      <LandingPageHeader />
      
      <LandingPageHeadline />

      
    </div>
  )
}