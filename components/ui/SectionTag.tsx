interface SectionTagProps {
  label: string
  className?: string
}

export default function SectionTag({ label, className = '' }: SectionTagProps) {
  return (
    <div className={`section-tag ${className}`}>
      {label}
    </div>
  )
}
