
type CategorySectionProps = {
  children: React.ReactNode;
  className: string;
}

export default function CategorySection ({ children, className } : CategorySectionProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}