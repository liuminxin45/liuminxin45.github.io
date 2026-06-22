type EmptyStateProps = {
  className?: string
  rows?: number
}

export default function EmptyState({ className = '', rows = 3 }: EmptyStateProps) {
  return (
    <div className={['empty-state', className].filter(Boolean).join(' ')} aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  )
}
