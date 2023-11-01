import { Skeleton } from "@mui/material";

export default function StatBarSkeleton () {
  return (
    <div className="w-full" >
      <Skeleton sx={{ bgcolor: 'lightgrey' }} variant="circular" width={40} height={40} />
      <Skeleton sx={{ bgcolor: 'lightgrey', width: '60%' }} />
      <Skeleton sx={{ bgcolor: 'lightgrey', width: '80%' }} animation="wave" />
    </div>
  )
}