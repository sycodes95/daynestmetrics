'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { userRoutes } from "@/lib/userRoutes";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";

export default function UserMenu () {
  const { user, error, isLoading } = useUser();
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false)
  useEffect(() => {
    if(!isLoading && !error && user) {
      setUserIsLoggedIn(true) 
    }

  },[user, error, isLoading])
  return (
    <>
      {
      userIsLoggedIn && user &&
      <Popover>
        <PopoverTrigger className="flex items-center gap-2">
          <img className="rounded-full w-8 h-8 object-contain" src={user ? user.picture : ''} alt="" />
          <span>{user.name}</span>
        </PopoverTrigger>
        <PopoverContent className="text-black w-full h-full rounded-lg ">
          <a className="text-red-600" href={userRoutes.logout}>Logout</a>
        </PopoverContent>
      </Popover>
      }
    </>
  )
}