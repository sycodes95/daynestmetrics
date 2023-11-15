'use client'

import PageHeading from '@/components/pageHeading';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { DataTable } from './components/data-table';
import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getUserPG } from '@/lib/user/getUserPG';
import { LifestyleFactor } from '@/types/lifestyleFactors';
import { DailyEntryFactor } from '@/types/dailyEntryFactor';
import { getAllLSFactors } from '@/lib/lifestyle-factors/getAllLSFactors';
import { getEntriesData } from './services/getEntriesData';

import { ColumnDef } from "@tanstack/react-table"

import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
 
import { Button } from "@/components/ui/button"

import EntryDialog, { DailyEntry } from "../entryDialog/entryDialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EmojiEventsBorderIcon from '@mui/icons-material/EmojiEvents';


import { formatDateForUser } from "@/utils/formatDateForUser"
import { getYMDFromDate } from "@/utils/getYMDFromDate"


import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { styled } from '@mui/material';
import { deleteEntry } from './services/deleteEntry';

type DailyEntryData = {
  daily_entry_id?: number | null,
  entry_date: string,
  journal: string,
  mood_rating: number,
  productivity_rating: number,
  user_id?: number | null,
  didFactors: string[],
  didNotFactors: string[],
}
export default function Entries() {

  const { user, error, isLoading } = useUser();
  
  const [entriesData, setEntriesData] = useState<DailyEntryData[]>([])

  const getEntries = useCallback(() => {
    if(!user || error || isLoading) return
    getEntriesData(user).then(result => setEntriesData(result))
  },[user, error, isLoading])

  const removeEntry = useCallback((daily_entry_id: number) => {
    const newEntriesData = [...entriesData]

    const deleteIndex = newEntriesData.findIndex(data => data.daily_entry_id === daily_entry_id)
    
    newEntriesData.splice(deleteIndex, 1)

    setEntriesData(newEntriesData)
  },[entriesData])

  useEffect(() => {
    getEntries()
  },[ user, error, isLoading, getEntries])

  const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
      color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
      color: '#ff3d47',
    },
  });
  
  const columns: ColumnDef<DailyEntry>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "user_id",
      header: () => {
        return 
      },
      cell: () => {
        return 
      },
    },
    {
      accessorKey: "daily_entry_id",
      header: () => {
        return 
      },
      cell: () => {
        return 
      },
    },
    {
      accessorKey: "entry_date",
      header: ({ column }) => {
        return (
          <Button
            className="p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {

        const date:string = row.getValue("entry_date")
        const [formattedDate, _] = date.split('T') 
        return <div className="text-left font-medium">{formattedDate}</div>
      },
    },
    {
      accessorKey: "mood_rating",
      header: ({ column }) => {
        return (
          <Button
          className="p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mood Rating
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
        },
        cell: ({ row }) => {
          const mood: number = row.getValue("mood_rating")
          return <StyledRating
            className="text-black"
            name="customized-color"
            readOnly
            defaultValue={mood / 2}
            getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
            precision={0.5}
            icon={<FavoriteIcon fontSize="inherit" />}
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
          />
        },
    },
    {
      accessorKey: "productivity_rating",
      header: ({ column }) => {
        return (
          <Button
          className="p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Productivity Rating
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
        },
        cell: ({ row }) => {
          const productivity: number = row.getValue("productivity_rating")
          return <StyledRating
            className="text-black"
            name="customized-color"
            readOnly
            defaultValue={productivity / 2}
            getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
            precision={0.5}
            icon={<EmojiEventsIcon className="text-yellow-500" fontSize="inherit" />}
            emptyIcon={<EmojiEventsBorderIcon fontSize="inherit" />}
          />
        },
    },
    {
      accessorKey: "didFactors",
      header: ({ column }) => (<div>Did Factors</div>),
        cell: ({ row }) => {
          const didFactors: string[] = row.getValue("didFactors")
          return (
            <Popover>
              <PopoverTrigger className="bg-primary text-secondary pl-2 pr-2 rounded-lg hover:bg-secondary hover:text-primary transition-colors">View</PopoverTrigger>
              <PopoverContent className="text-primary flex flex-col gap-4 max-w-xxs w-full shadow-md shadow-gray-300">
                <span className='font-semibold'>Did Factors</span>

                <div className='flex flex-wrap gap-2 '>
                  {
                  didFactors &&
                  didFactors.length > 0 ? 
                  didFactors.map((factor) => (
                    <div className="p-2 border-black border text-primary rounded-lg" key={factor}>
                      {factor}
                    </div>
                    
                  ))
                  :
                  <span className="text-gray-500">N/A</span>
                  }

                </div>
                
              </PopoverContent>
            </Popover>
          )
        },
    },
    {
      accessorKey: "didNotFactors",
      header: ({ column }) => (<div>Did Not Factors</div>),
        cell: ({ row }) => {
          const didNotFactors: string[] = row.getValue("didNotFactors")
          return (
            <Popover>
              <PopoverTrigger className="bg-primary text-secondary pl-2 pr-2 rounded-lg hover:bg-secondary hover:text-primary transition-colors">View</PopoverTrigger>
              <PopoverContent className="text-primary flex flex-col gap-4 max-w-xxs w-full shadow-md shadow-gray-300">
                <span className='font-semibold'>Did Not Factors</span>

                <div className='flex flex-wrap gap-2 '>
                  {
                  didNotFactors &&
                  didNotFactors.length > 0 ? 
                  didNotFactors.map((factor) => (
                    <div className="p-2 border-black border text-primary rounded-lg" key={factor}>
                      {factor}
                    </div>
                    
                  ))
                  :
                  <span className="text-gray-500">N/A</span>
                  }

                </div>
                
              </PopoverContent>
            </Popover>
          )
        },
    },
    {
      accessorKey: "journal",
      header: ({ column }) => (<div>Journal</div>),
        cell: ({ row }) => {
          const journal: string = row.getValue("journal")
          return (
            <Popover>
              <PopoverTrigger className="bg-primary text-secondary pl-2 pr-2 rounded-lg hover:bg-secondary hover:text-primary transition-colors">View</PopoverTrigger>
              <PopoverContent className="text-primary flex flex-wrap gap-4 max-w-xxs w-full shadow-md shadow-gray-300 " side="bottom">
                <span className='font-semibold '>Journal</span>
                <span className="text-gray-500 whitespace-pre-wrap word-wrap break-words w-full">{journal ? journal : 'N/A'}</span>
              </PopoverContent>
            </Popover>
          )
        },
    },
    {
      
      id: "actions",
      cell: ({ row }) => {
        
        const date:string = row.getValue("entry_date")
        const [formattedDate, _] = date.split('T') 
        const user_id : number = row.getValue("user_id")
        const daily_entry_id : number = row.getValue("daily_entry_id")

        return (
        <Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='shadow-md shadow-gray-300' align="end">
              <DropdownMenuLabel className='border-b border-gray-300'>Actions</DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              <DialogTrigger className="w-full">
                <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem className="bg-destructive text-white cursor-pointer" onClick={()=> deleteEntry(user_id, formattedDate).then(
                deleted => {
                  if(deleted) removeEntry(daily_entry_id)
                }
              )}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className='shadow-lg p-2 md:p-8 shadow-gray-300 w-full max-w-6xl overflow-y-scroll md:overflow-hidden min-h-screen h-full'>
            <DialogDescription className='grow h-full'>
                <EntryDialog currentDate={date} />
              </DialogDescription>
          </DialogContent>
        </Dialog> 
        )
      },
    },
    
  ];

  return (
    <div className="w-full grow h-full flex flex-col gap-4">
      <PageHeading header='Entries' body='View all daily entries.'>
          <EditNoteIcon />
      </PageHeading>
      <DataTable columns={columns} data={entriesData} getEntriesData={getEntries} removeEntry={removeEntry} />
    </div>
  )
}

// so i delete selected then right after a random row gets selected automatically... weird bug