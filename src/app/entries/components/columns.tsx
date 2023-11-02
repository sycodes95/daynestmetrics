'use client'

import { ColumnDef } from "@tanstack/react-table"


import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
 
import { Button } from "@/components/ui/button"
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

import { DailyEntry } from "@/app/daily-entry/dailyEntry"
import { formatDateForUser } from "@/utils/formatDateForUser"
import { getYMDFromDate } from "@/utils/getYMDFromDate"
import { getRatingColor, getRatingColorBG, getRatingColorText } from "@/utils/getRatingColor"

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75',
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47',
  },
});

export const columns: ColumnDef<DailyEntry>[] = [
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
    accessorKey: "entry_date",
    header: ({ column }) => {
      return (
        <Button
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
        className=""
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
        className=""
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Produvtivity Rating
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
  
  // ...
  {
    
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  
  // ...
]

// export const columns: ColumnDef<Payment>[] = [
//   {
//     accessorKey: "amount",
//     header: () => <div className="text-right">Amount</div>,
//     cell: ({ row }) => {
//       const amount = parseFloat(row.getValue("amount"))
//       const formatted = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//       }).format(amount)
 
//       return <div className="text-right font-medium">{formatted}</div>
//     },
//   },
//   {
//     accessorKey: "amount",
//     header: () => <div className="text-right">Amount</div>,
//     cell: ({ row }) => {
//       const amount = parseFloat(row.getValue("amount"))
//       const formatted = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//       }).format(amount)
 
//       return <div className="text-right font-medium">{formatted}</div>
//     },
//   },
//   {
//     accessorKey: "amount",
//     header: () => <div className="text-right">Amount</div>,
//     cell: ({ row }) => {
//       const amount = parseFloat(row.getValue("amount"))
//       const formatted = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//       }).format(amount)
 
//       return <div className="text-right font-medium">{formatted}</div>
//     },
//   },
// ]