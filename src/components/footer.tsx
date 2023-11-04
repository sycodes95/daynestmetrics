import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';
export default function Footer() {
  return(
    <div className=" bottom-0 h-20 w-full pl-4 pr-4 flex justify-center items-center border-t border-gray-300 bg-background">
      
      <div className="max-w-7xl w-full flex justify-center items-center gap-4">
        <span className="text-primary">© 2023 Daynestmetrics</span>
        <a href={process.env.NEXT_MY_GITHUB_URL} target='_blank'><GitHubIcon/></a>
        <a href={process.env.NEXT_MY_YOUTUBE_URL} target='_blank'><YouTubeIcon/></a>


      </div>
    </div>
  )
}