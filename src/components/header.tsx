
import UserMenu from "./userMenu";

export default async function Header(){
  return (
    <div className="h-16 w-full flex items-center justify-between p-4 bg-white max-w-7xl 
    ">
      <a className="text-black font-display text-2xl" href={'/'}>Daynestmetrics</a>
      <UserMenu />
    </div>
  )
}
