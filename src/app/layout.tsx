
import { UserProvider, useUser } from '@auth0/nextjs-auth0/client';
import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '../components/header'
import { Auth0Provider } from '@auth0/auth0-react';
import { getSession } from '@auth0/nextjs-auth0';
import LandingPage from './landingPage/landingPage';
import NextTopLoader from 'nextjs-toploader';
import StyledComponentsRegistry from '../lib/AntdRegistry';
import { getUserAndSyncDB } from '@/lib/getUserAndSyncDB';
import { getUser } from '@/lib/getUser';
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

    <html lang="en" className='min-h-screen flex flex-col ' suppressHydrationWarning>
      <UserProvider>
      
        <body className="flex flex-col grow items-center w-full font-main text-sm">
          <NextTopLoader showSpinner={false} color="#08a4a7" />
          {
          user ? 
          <>
          <Header/>
          
          <div className='grow w-full h-full max-w-7xl p-4'>
            <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
          </div>
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
