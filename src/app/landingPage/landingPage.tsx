export default function LandingPage() {
  return(
    <div className="flex flex-col gap-4 w-full h-full items-center justify-center">
      <div className="w-full h-full flex flex-col gap-4 items-center p-4">
        <span className="text-black text-xl font-display w-full text-center">DAYNESTMETRICS</span>
        <a className="p-2 w-fit h-fit whitespace-nowrap bg-background text-black border-2 border-black text-center rounded-lg flex items-center justify-center" href="/api/auth/login">Try For Free!</a>
      </div>
      
    </div>
  )
}