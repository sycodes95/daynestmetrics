
import { UserProvider, useUser } from '@auth0/nextjs-auth0/client';
import '../styles/globals.css'
import type { GetServerSidePropsContext, Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '../components/header'
import LandingPage from './landingPage/page';
import NextTopLoader from 'nextjs-toploader';
import StyledComponentsRegistry from '../lib/AntdRegistry';
import { getUserAndSyncDB } from '@/lib/user/getUserAndSyncDB';
import { getUser } from '@/lib/user/getUser';
import Footer from '@/components/footer';
import 'react-circular-progressbar/dist/styles.css';

import { Provider } from 'react-redux'
import { Toaster } from "@/components/ui/toaster"
import { redirect } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  const user = await getUser()
  getUserAndSyncDB(user)

  return (
    <>

    <html lang="en" className='flex' suppressHydrationWarning>

      <UserProvider>
      
        <body className="flex flex-col gap-2 items-center w-full font-main text-sm min-h-screen ">
          <NextTopLoader showSpinner={false} color="#08a4a7" />
          {
          user ? 
          <>
          <Header/>
          <StyledComponentsRegistry>
            <div className=' w-full h-full max-w-7xl p-4 flex'>
              {children} 
            </div>
            <Toaster/>
          </StyledComponentsRegistry>

          <Footer />
          
          </>
          :
          <LandingPage/>
          }
          
          
        </body>
      </UserProvider>
    </html>
    
    </>
  )
}
