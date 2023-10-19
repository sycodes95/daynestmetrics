'use client'

import Link from "next/link";
import UserMenu from "./userMenu";

export default function Header(){
  return (
    <div className="h-16 w-full flex items-center justify-between p-4 bg-white max-w-7xl 
    ">
      <Link className="text-black font-display text-2xl" href={'/'}>Daynestmetrics</Link>
      <div>
        <Link href={`/settings`}>Settings</Link>
      </div>
      <UserMenu />
    </div>
  ) 
}
