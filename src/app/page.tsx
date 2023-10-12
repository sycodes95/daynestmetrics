
import React from 'react'
import '../styles/globals.css'
import { getSession } from '@auth0/nextjs-auth0';

export default async function HomePage() {
  
  const session = await getSession();
  const user = session?.user;
  console.log(user);  
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


