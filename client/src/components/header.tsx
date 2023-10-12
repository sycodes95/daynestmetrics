'use client'

import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react"

export default function Header(){
  const { user, error, isLoading } = useUser();
  const route = useRouter()
  useEffect(() => {
    if(error) route.push('/')
    console.log(user);
    console.log(process.env.AUTH0_DOMAIN);
  },[user, error])

  return (
    <div className="h-16 w-full flex items-center justify-between p-4 bg-white max-w-5xl 
    ">
      <a className="text-black font-display text-2xl" href={'/'}>Daynestmetrics</a>

      <div>
        <a className="w-20 h-10 rounded-lg bg-blue-400 p-2" href="/api/auth/login">Login</a>
        <a className="w-20 h-10 rounded-lg bg-blue-400 p-2" href="/api/auth/logout">Logout</a>
      </div>
    </div>
  )
}
