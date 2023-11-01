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
import { Rating } from "./statBar";

type StatCardProps = {
  className?: string;
  statName: string;
  data: Rating[];
  lineColor: string;
}

// const data = [
//   {
//     "name": "Page A",
//     "uv": 4000,
//     "pv": 2400,
//     "amt": 2400
//   },
//   {
//     "name": "Page B",
//     "uv": 3000,
//     "pv": 1398,
//     "amt": 2210
//   },
//   {
//     "name": "Page C",
//     "uv": 2000,
//     "pv": 9800,
//     "amt": 2290
//   },
//   {
//     "name": "Page D",
//     "uv": 2780,
//     "pv": 3908,
//     "amt": 2000
//   },
//   {
//     "name": "Page E",
//     "uv": 1890,
//     "pv": 4800,
//     "amt": 2181
//   },
//   {
//     "name": "Page F",
//     "uv": 2390,
//     "pv": 3800,
//     "amt": 2500
//   },
//   {
//     "name": "Page G",
//     "uv": 3490,
//     "pv": 4300,
//     "amt": 2100
//   }
// ]

export default function StatCard ({className, statName, data, lineColor} : StatCardProps) {
  return (
    <Card className={`${className}  h-32 relative w-full flex border-gray-400`}>
      <CardHeader className="p-0 text-left absolute top-0 left-0 z-10">
        <CardTitle className="text-sm text-primary font-semibold flex flex-col gap-1 bg-black bg-opacity-10 rounded-lg w-fit backdrop-blur-sm">
          <span>{statName.slice(0, 1).toUpperCase() + statName.slice(1)}</span>
          <span className="font-normal text-xs">Past Month</span>

        </CardTitle>
        
      </CardHeader>
      <CardContent className="p-0  w-full flex justify-center">
        <ResponsiveContainer className={`flex transition-all`} width="90%" height="99%">
          <LineChart className="h-32"  data={data}
            margin={{ top: 10, right: 5, left: 5, bottom: 0 }}>
            <Tooltip />
            <Line type="monotone" dataKey="rating" stroke="#AAAAAA" strokeWidth={`2px`} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      
    </Card>
  )

}