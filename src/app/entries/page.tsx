import PageHeading from '@/components/pageHeading';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Skeleton } from '@mui/material';
import { DataTable } from './components/data-table';
import { Payment, columns } from "./components/columns"
export default function Entries() {
  const data: Payment[] = [
    {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  ]
  return (
    <div className="w-full grow h-full flex flex-col gap-4">
      <PageHeading header='Entries' body='View all daily entries.'>
          <EditNoteIcon />
      </PageHeading>
      <DataTable columns={columns} data={data} />
    </div>
  )
}