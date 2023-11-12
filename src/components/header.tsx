'use client'
import Link from "next/link";
import UserMenu from "./userMenu";
import { usePathname, useRouter } from "next/navigation";
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { Divide as Hamburger } from 'hamburger-react'
import { useState } from "react";

import EditNoteIcon from '@mui/icons-material/EditNote';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import InfoIcon from '@mui/icons-material/Info';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';
import HomeIcon from '@mui/icons-material/Home';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet"

export default function Header(){
  const pathname = usePathname()
  const pageRoutes = [
    {name: 'Entries' , route : '/entries', icon: <EditNoteIcon/>},
    {name: 'Insights' , route : '/insights', icon: <StackedBarChartIcon/>},
    {name: 'Lifestyle Factors' , route : '/lifestyle-factors', icon: <DirectionsRunIcon/>},
    {name: 'About' , route : '/about', icon: <InfoIcon/>}

  ];

  const youtubeLink = process.env.NEXT_MY_YOUTUBE_URL
  const githubLink = process.env.NEXT_MY_GITHUB_URL


  return (
    <div className="sticky top-0 z-50 h-14 w-full flex justify-center items-center  bg-background rounded-b-lg  text-primary border-b border-gray-300
    ">
      <div className="w-full max-w-7xl flex items-center justify-between md:justify-start min-w-max">
        <div className="w-full md:hidden h-fit flex justify-start p-2 rounded-lg">
          <Sheet>
            <SheetTrigger>
              <Hamburger toggled={false} />
            </SheetTrigger>
            <SheetContent className="max-h-screen h-full flex flex-col" side={'left'}>
              <SheetHeader className="flex flex-col gap-2">
                <SheetTitle className="flex justify-start">
                  <QueryStatsIcon />
                </SheetTitle>
                <SheetDescription>
                  <div className="flex flex-col gap-2 h-full">
                    <SheetClose asChild={true}>
                      <Link className={`flex gap-2 w-fit justify-center items-center  text-2xl text-primary border-b-2 h-12 transition-all duration-300 whitespace-nowrap`} 
                      href={`/`}>
                        <HomeIcon/>
                        <span>Home</span>
                        
                      </Link>

                    </SheetClose>
                    {
                    pageRoutes.map((data, index) => (
                      <SheetClose asChild={true} key={data.name}>
                        <Link className={`flex gap-2 w-fit justify-center items-center  text-2xl text-primary border-b-2 h-12 transition-all duration-300 whitespace-nowrap`} 
                        key={index} 
                        href={`${data.route}`}>
                          {data.icon}
                          <span>{data.name}</span>
                          
                        </Link>

                      </SheetClose>
                      
                    ))
                    } 
                    
                  </div>
                  
                  
                </SheetDescription>
              </SheetHeader>
              <div className="max-w-7xl w-full h-full flex justify-start items-end gap-4">
                <span className="text-primary">© 2023 Daynestmetrics</span>
                {
                youtubeLink && githubLink &&
                <>
                <a href={process.env.NEXT_MY_GITHUB_URL} target='_blank'><GitHubIcon/></a>
                <a href={process.env.NEXT_MY_YOUTUBE_URL} target='_blank'><YouTubeIcon/></a>
                </>
                }
                
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <Link className=" font-display text-xl md:pl-2 md:mt-1 flex gap-2 items-center" href={'/'}>
          <QueryStatsIcon />
          <span className="hidden md:contents">Daynestmetrics</span>
          
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
        <div className="w-full flex justify-end p-2 pr-4">
          <UserMenu />
        </div>
      </div>
    </div>
  ) 
}
