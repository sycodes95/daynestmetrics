import { useState } from "react"
import StatCard from "./statCard"

export default function StatBar () {

  const [basicStats , setBasicStats] = useState({
    overall: {
      month: -1,
      week: -1
    },
    mood: {
      month: -1,
      week: -1
    },
    productivity: {
      month: -1,
      week: -1
    }
  })
 
  return (
    <div className="flex items-center gap-2">
      {
      Object.entries(basicStats).map(([statName, obj]) => (
        <>
        {
          Object.entries(obj).map(([range, value], index) => (
            <StatCard className="w-full" key={index} />
          ))
        }
        </>
      ))
      }

    </div>
  )
}