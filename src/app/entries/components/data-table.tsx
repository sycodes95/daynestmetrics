"use client"
import { useEffect, useState } from "react"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { DataTablePagination } from "./dataTablePagination"
import { useToast } from "@/components/ui/use-toast"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  
}

export function DataTable<TData, TValue>({
  columns,
  data,
  getEntriesData,
  removeEntry
}: DataTableProps<TData, TValue> 
& {getEntriesData : ()=> void, removeEntry : (daily_entry_id: number)=> void}) {

  const { toast } = useToast()

  const [sorting, setSorting] = useState<SortingState>([])

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [rowSelection, setRowSelection] = useState({})
  

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })
  const optimisticHandleDeleteSelected = () => {
    const idsToDelete: number[] = table.getFilteredSelectedRowModel().rows.map((row) => {
      return row.getValue("daily_entry_id")
    });

    // removes deleted entries from parent component state
    idsToDelete.forEach((id) => {
      removeEntry(id)
    })

    //resets table row selection due to weird bug of auto selecting a new row after deletion
    table.resetRowSelection();

  }
  const handleDeleteSelected = async () => {
    try {
      
      const idsToDelete: number[] = table.getFilteredSelectedRowModel().rows.map((row) => {
        return row.getValue("daily_entry_id")
      });

      const fetchDelete = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/daily-entry/delete-selected`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'json/application'
        },
        body: JSON.stringify(idsToDelete)
      })

      const deletedEntries = await fetchDelete.json()

      if(deletedEntries.length < 1) {
        return toast({
          variant: 'destructive',
          title: "Error",
          description: "Whoops, there was an error deleting entries. Please refresh and try again, if that doesn\'t work contact support",
        })
      } 
      return toast({
        title: "Success!",
        description: `${deletedEntries.length} Entries successfully deleted`,
      })

    } catch (error) {
      console.error('Error deleting entries selected from entries table', error)
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Whoops, there was an error deleting entries. Please refresh and try again, if that doesn\'t work contact support",
      })
    }
  }
  
  return (
    <div>
      
      <div className="flex-1 flex items-center gap-4 text-sm text-muted-foreground h-10">
        <div>
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.

        </div>
        
        {
        table.getFilteredSelectedRowModel().rows.length > 0 &&
        <Button className="h-6" 
        variant={'destructive'} 
        onClick={()=> {
          optimisticHandleDeleteSelected()
          handleDeleteSelected()
        }}
        >Delete Selected</Button>
        }
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="px-2" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="p-2" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <DataTablePagination table={table} />
        
      </div>
    </div>
  )
}

