import { useState } from "react"

export default function StatBar () {

  const [overall, setOverall] = useState({
    month: 0,
    week: 0
  })

  const [mood, setMood] = useState({
    month: 0,
    week: 0
  })

  const [productivity, setProductivity] = useState({
    month: 0,
    week: 0
  })

  return (
    <div>

    </div>
  )
}