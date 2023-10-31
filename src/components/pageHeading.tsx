type PageHeadingProps = {
  className?: string;
  header: string;
  body?: string;
  children?: React.ReactNode;
}

export default function PageHeading({className, header, body, children }: PageHeadingProps) {

  return (
    <div className="flex flex-col gap-2 w-full"> 
      <div className="text-primary text-2xl flex gap-2 items-center">
        <span>
          Lifestyle Factors
        </span>
        {
        children
        }
      </div>

      <span className="text-gray-500 ">
        Add lifestyle factors that you want to track daily.
      </span>

    </div>
  )
}