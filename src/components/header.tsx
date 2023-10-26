'use client'

import Link from "next/link";
import UserMenu from "./userMenu";
import { usePathname, useRouter } from "next/navigation";

export default function Header(){
  const pathname = usePathname()
  console.log(pathname);
  const pageRoutes = [
    {name: 'Entries' , route : '/entries'},
    {name: 'Lifestyle Factors' , route : '/lifestyle-factors'}
  ]

  return (
    <div className="sticky top-0 z-50 h-14 w-full pl-4 pr-4 flex items-center max-w-7xl bg-white
    ">
      <Link className="text-black font-display text-xl mt-1" href={'/'}>Daynestmetrics</Link>
      
      <div className="hidden md:flex items-center h-full pl-4">
        {
        pageRoutes.map((data, index) => (
          <Link className={`flex w-fit p-4 justify-center items-center border-b-2 h-full ${pathname === data.route ? 'border-b-black' : 'border-b-transparent'} hover:text-gray-500 transition-all duration-300 text-primary whitespace-nowrap`} 

          key={index} 
          href={`${data.route}`}>
            {data.name}
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
