'use client'
import Link from "next/link";
import UserMenu from "./userMenu";
import { usePathname, useRouter } from "next/navigation";
import QueryStatsIcon from '@mui/icons-material/QueryStats';


export default function Header(){
  const pathname = usePathname()
  const pageRoutes = [
    {name: 'Entries' , route : '/entries'},
    {name: 'Lifestyle Factors' , route : '/lifestyle-factors'}
  ]

  return (
    <div className="sticky top-0 z-50 h-14 w-full pl-4 pr-4 flex justify-center items-center  bg-background rounded-b-lg  text-primary border-b border-gray-300
    ">
      <div className="w-full max-w-7xl flex items-center min-w-max">

      
        <Link className=" font-display text-xl mt-1 flex gap-2 items-center" href={'/'}>
          <QueryStatsIcon />
          <span>Daynestmetrics</span>
          
        </Link>
        
        <div className="hidden md:flex items-center h-full pl-4">
          {
          pageRoutes.map((data, index) => (
            <Link className={`flex w-fit p-4 justify-center items-center border-b-2 h-full ${pathname === data.route ? 'border-b-primary' : 'border-b-transparent'} hover:text-gray-500 transition-all duration-300 whitespace-nowrap`} 

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
    </div>
  ) 
}
