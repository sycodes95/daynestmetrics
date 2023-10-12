
import { UserProvider, useUser } from '@auth0/nextjs-auth0/client';
import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '../components/header'
import { Auth0Provider } from '@auth0/auth0-react';
import { getSession } from '@auth0/nextjs-auth0';
import LandingPage from './landingPage/landingPage';

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

  const session = await getSession();
  
  const user = session?.user;

  return (
    <>

    <html lang="en" className='min-h-screen flex flex-col ' suppressHydrationWarning>
      <UserProvider>
      
        <body className="flex flex-col items-center w-full font-main text-sm">
          {
          user ? 
          <>
          <Header/>
          <div className='grow w-full max-w-7xl p-4'>
            {children}
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
