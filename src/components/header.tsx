'use client'

import Link from "next/link";
import UserMenu from "./userMenu";
import { usePathname, useRouter } from "next/navigation";

export default function Header(){
  const pathname = usePathname()
  console.log(pathname);
  const pageRoutes = [
    'entries',
  ]

  return (
    <div className="h-14 w-full pl-4 pr-4 flex items-center  bg-white max-w-7xl 
    ">
      <Link className="text-black font-display text-xl mt-1" href={'/'}>Daynestmetrics</Link>
      <div className="flex items-center h-full pl-4">
        {
        pageRoutes.map((route) => (
          <Link className={`flex w-24 justify-center items-center border-b-2 h-full ${pathname.slice(1, pathname.length) === route ? 'border-b-cyan-500' : 'border-b-transparent'} hover:text-gray-500 transition-all duration-300 text-primary`} 
          key={route} 
          href={`${route}`}>
            {`${route.slice(0, 1).toUpperCase() + route.slice(1, route.length)}`}
          </Link>
        ))
        }
      </div>
      <div className="w-full flex justify-end">
        <UserMenu />
      </div>
    </div>
  ) 
}
