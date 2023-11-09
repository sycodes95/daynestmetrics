


export default function LandingPageHeadline() {
  return (
    <div className=" h-fit flex grow flex-col items-center gap-8 max-w-7xl w-full p-4 rounded-lg ">
      <div className="flex flex-col w-full items-center ">
        <div className='flex flex-col gap-2  text-5xl md:text-6xl text-black text-opacity-90'>
          <span className="font-display-2 max-w-xl text-center">Track Your Life To Optimize Mood & Productivity</span>
        </div>
        <span className="text-gray-600 mt-4 text-center">Unlock the secrets of your well-being with data-driven insights to foster a healthier, happier you.</span>
      </div>
      <div className="w-full h-fit flex flex-col gap-4 items-center">
        <a className="p-2 w-fit h-fit whitespace-nowrap text-white  rounded-lg flex items-center justify-center transition-all bg-black" href="/api/auth/login">Try For Free!</a>
      </div>
    </div>
  )
}