import EditNoteIcon from '@mui/icons-material/EditNote';


export default function Entries() {
  return (
    <div className="w-full grow h-full flex flex-col gap-4">
      <div className="flex flex-col gap-2 w-full"> 
        <div className="text-primary text-2xl flex gap-2 items-center">
          <span>
            Entries
          </span>
          <EditNoteIcon />
        </div>

        <span className="text-gray-500 ">
          View all daily entries.
        </span>

      </div>
    </div>
  )
}