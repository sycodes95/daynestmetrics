
import React from 'react'
import '../styles/globals.css'
import { getSession } from '@auth0/nextjs-auth0';

export default async function HomePage() {
  
  const session = await getSession();
  const user = session?.user;
 
  const getUserPG = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user`)
  .then(res => res.json())
  
  console.log('PGGGG', getUserPG);   
  return (
    <div className=' '>
      { 
      user ?
      <span>User</span>
      :
      <span>NO</span>
      }
      
    </div> 
  )
}


