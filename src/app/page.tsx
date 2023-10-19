import { Calendar } from 'antd';
import React from 'react'
import '../styles/globals.css'
import { getSession } from '@auth0/nextjs-auth0';
import MoodCalendar from '@/components/moodCalendar';

export default async function HomePage() {
  
  const session = await getSession();
  const user = session?.user;
  
  if(user) {
    console.log(user);
    const getUserFromPG = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user?sub=${user.sub}`)
    .then(res => res.json())
    if(getUserFromPG){
      const userAuth0KeyValues = Object.entries(user) 
      const userPGKeyValues = Object.entries(getUserFromPG) 

      let auth0AndPGIsSynced = true;
      for(let i = 0; i < userPGKeyValues.length; i++) {
        if(!userAuth0KeyValues[i]) break;
        if(userAuth0KeyValues[i][1] !== userPGKeyValues[i + 1][1] ){
          auth0AndPGIsSynced = false;
          break;
        } 
      } 

      if(!auth0AndPGIsSynced){
        const patchPGUser = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        })
      } 

    } else {
      const postPGUser = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
    }
    
  }
  
  return (
    <div className=' '>
      {/* { 
      user ?
      <span>User</span>
      :
      <span>NO</span>
      } */}

      <Calendar />
      
    </div> 
  )
}


