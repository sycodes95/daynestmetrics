'use client'

import { ColumnDef } from "@tanstack/react-table"


import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
 
import { Button } from "@/components/ui/button"

import EntryDialog, { DailyEntry } from "../../entryDialog/entryDialog"
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

import { styled } from '@mui/material/styles';

import { formatDateForUser } from "@/utils/formatDateForUser"
import { getYMDFromDate } from "@/utils/getYMDFromDate"
import { getRatingColor, getRatingColorBG, getRatingColorText } from "@/utils/getRatingColor"

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
import { useUser } from "@auth0/nextjs-auth0/client"



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
    header: ({ column }) => {
      return 
    },
    cell: ({ row }) => {
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
      const date = getYMDFromDate(row.getValue("entry_date"))
      const formattedDate = formatDateForUser(date)
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
        console.log(didFactors);
        return (
          <Popover>
            <PopoverTrigger className="bg-primary text-secondary pl-2 pr-2 rounded-lg hover:bg-secondary hover:text-primary transition-colors">View</PopoverTrigger>
            <PopoverContent className="text-primary flex flex-wrap gap-4 max-w-xxs w-full">

              {
              didFactors.length > 0 ? 
              didFactors.map((factor) => (
                <div className="p-1 border border-black rounded-2xl" key={factor}>
                  {factor}
                </div>
                
              ))
              :
              <span className="text-gray-500">None</span>
              }
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
        console.log(didNotFactors);
        return (
          <Popover>
            <PopoverTrigger className="bg-primary text-secondary pl-2 pr-2 rounded-lg hover:bg-secondary hover:text-primary transition-colors">View</PopoverTrigger>
            <PopoverContent className="text-primary flex flex-wrap gap-4 max-w-xxs w-full" side="top">

              {
              didNotFactors.length > 0 ? 
              didNotFactors.map((factor) => (
                <div className="p-1 border border-black rounded-2xl" key={factor}>
                  {factor}
                </div>
                
              ))
              :
              <span className="text-gray-500">None</span>
              }
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
            <PopoverContent className="text-primary flex flex-wrap gap-4 max-w-xxs w-full  " side="top">

              <span className="text-gray-500 whitespace-pre-wrap word-wrap break-words w-full">{journal ? journal : 'N/A'}</span>
            </PopoverContent>
          </Popover>
        )
      },
  },
  
  {
    
    id: "actions",
    header: ({ table }) => {
      table.setState
    },
    cell: ({ row, table }) => {
      
      const date = getYMDFromDate(row.getValue("entry_date"))
      const user_id = row.getValue("user_id")
      console.log(user_id);
      return (
      <Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            <DialogTrigger className="w-full">
              <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem className="bg-destructive text-white cursor-pointer">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className='shadow-lg shadow-gray-300 h-full  w-full max-w-6xl overflow-y-scroll md:overflow-hidden'>
          <DialogHeader>
            <DialogTitle>How was your day?</DialogTitle>
            <DialogDescription>
              <EntryDialog currentDate={date} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog> 
      )
    },
  },
  
]
