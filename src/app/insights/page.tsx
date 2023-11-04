import PageHeading from "@/components/pageHeading";
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
export default function Insights() {
  return (
    <div className="w-full h-full">
      <PageHeading
      header="Insights" 
      body="Get insights into how your lifestyle factors correlates to mood and productivity"
      >
        <StackedBarChartIcon/>
      </PageHeading>
    </div>
  )
}