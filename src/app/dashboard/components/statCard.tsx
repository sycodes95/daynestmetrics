import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type StatCardProps = {
  className?: string;
}

export default function StatCard ({className} : StatCardProps) {
  return (
    <Card className={`${className} p-2  h-32 relative`}>
      <CardHeader className="p-0 text-left absolute top-0 left-0">
        <CardTitle className="text-sm text-secondary p-2 font-semibold flex flex-col bg-black bg-opacity-50 rounded-lg">
          <span>Overall</span>
          <span className="font-normal text-xs">Monthly</span>

        </CardTitle>
        
      </CardHeader>
      <CardContent className="p-0">
        <p>Card Content</p>
      </CardContent>
      
    </Card>
  )

}