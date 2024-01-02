
export default function NotFound () {
  return (
    <div className="h-full w-full flex grow items-center justify-center flex-col gap-2">
      <span className="">
        Oops! Nothing to be found here
      </span>
      <a className="text-white rounded-lg bg-black p-1" href="/">Return Home</a>
    </div>
  )
}