import PageHeading from "@/components/pageHeading";
import InfoIcon from '@mui/icons-material/Info';

export default function About(){
  return (
    <div className="w-full h-full">
      <PageHeading
      header="About" 
      >
        <InfoIcon/>
      </PageHeading>

      <div className="w-full h-full gap-4 flex flex-col flex-wrap">
        <h1 className="font-bold text-2xl">How It Works</h1>

        <h2 className="font-bold text-sm">Add Lifestyle Factors:</h2>
        <span className="lg:w-1/2">First thing you want to do is head over to the ( Lifestyle Factors ) tab.
          This is where you should categorize and add all of the lifestyle factors, habits, routines that 
          you would like to track.  You will be using this data in your daily entries.
        </span>

        <h2 className="font-bold text-sm">Add A Daily Entry:</h2>
        <span className="lg:w-1/2">After each day, head over to the home page or dashboard, and click the ( + ) button 
        on the corresponding date to enter details about the day including which lifestyle factors you did 
        or did not do. Don&apos;t worry if you missed a day, you can still add entries to any date before the current day.
        </span>

        <h2 className="font-bold text-sm">Check Entries:</h2>
        <span className="lg:w-1/2">The Entries tab is an alternate view of the calendar from the dashboard. 
        This version allows you to view the entries in more detail at first glance in a table format.
        You can also edit or delete entries from this view.
        </span>

        <h2 className="font-bold text-sm">Insights:</h2>
        <span className="lg:w-1/2">The Insights tab is where the magic happens. This is where after you&apos;ve gathered a good 
        amount of daily entries you can start to see statistics and see the correlations between 
        your lifestyle factors with mood and productivity using the data visualization tools provided. The more entries you have the better.
        </span>

        <h1 className="font-bold text-2xl">Why?</h1>
        <span className="lg:w-1/2">
          We all know everybody is different, what could be poison to one person can be nourishing for another.
          I came up with this idea because I think there are times when we feel like some activity, habits, etc may have an impact on our lives 
          but there either isn&apos;t much scientific research done on it already or there are conflicting research. So I guess this is my 
          attempt to sort of become a self - scientist, there&apos;s also many things science has not caught up to yet. So why not look into your own data and get a better idea of how YOU should live your life?
        </span>

      </div>

    </div>
  )
}