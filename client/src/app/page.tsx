
import React, { useEffect } from 'react'
import '../../src/styles/globals.css'
import { getSession } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0/client';

export default async function Page() {
  
  
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


