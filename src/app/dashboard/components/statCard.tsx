'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { ResponsiveLine } from '@nivo/line'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type StatCardProps = {
  className?: string;
  statName: string;
}

const data = [
  {
    "name": "Page A",
    "uv": 4000,
    "pv": 2400,
    "amt": 2400
  },
  {
    "name": "Page B",
    "uv": 3000,
    "pv": 1398,
    "amt": 2210
  },
  {
    "name": "Page C",
    "uv": 2000,
    "pv": 9800,
    "amt": 2290
  },
  {
    "name": "Page D",
    "uv": 2780,
    "pv": 3908,
    "amt": 2000
  },
  {
    "name": "Page E",
    "uv": 1890,
    "pv": 4800,
    "amt": 2181
  },
  {
    "name": "Page F",
    "uv": 2390,
    "pv": 3800,
    "amt": 2500
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  }
]

export default function StatCard ({className, statName} : StatCardProps) {
  return (
    <Card className={`${className} p-2  h-32 relative w-full flex`}>
      <CardHeader className="p-0 text-left absolute top-0 left-0">
        <CardTitle className="text-sm text-secondary p-2 font-semibold flex flex-col bg-black bg-opacity-60 rounded-lg w-24">
          <span>{statName.slice(0, 1).toUpperCase() + statName.slice(1)}</span>
          <span className="font-normal text-xs">Past Month</span>

        </CardTitle>
        
      </CardHeader>
      <CardContent className="p-0 h-32 w-full flex justify-center">
        <ResponsiveContainer className={`flex transition-all`} width="90%" height="90%">
          <LineChart className="h-32 w-72"  data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={`2px`} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      
    </Card>
  )

}