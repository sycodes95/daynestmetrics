import PageHeading from "@/components/pageHeading";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

import { AlertCircle } from "lucide-react"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function LifestyleFactorsHeader () {
  return (
    <div className="flex flex-col justify-between gap-4  items-center w-full">
      <PageHeading
      header="Lifestyle Factors"
      body="Add lifestyle factors that you want to track daily."
      >
        <DirectionsRunIcon />
      </PageHeading>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription className="text-xs">
          Deleting any lifestyle factors that are used in a daily entry will also remove it from the entry.
        </AlertDescription>
      </Alert>
    </div>
  )
}