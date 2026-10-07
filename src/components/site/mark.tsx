export function Mark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="13" cy="16" r="8.2" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="19" cy="16" r="8.2" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="wordmark">
      <Mark />
      The Mingle
    </span>
  );
}
