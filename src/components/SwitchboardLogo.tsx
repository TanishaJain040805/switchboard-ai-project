interface Props { size?: number; showWordmark?: boolean; className?: string }

export function SwitchboardLogo({ size = 28, showWordmark = true, className = "" }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-label="Switchboard logo">
        <defs>
          <linearGradient id="sb-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="3.2" fill="url(#sb-grad)" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 16 16)`}>
            <line x1="16" y1="6" x2="16" y2="11.5" stroke="url(#sb-grad)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="16" cy="4.5" r="1.8" fill="#7C3AED" />
          </g>
        ))}
      </svg>
      {showWordmark && (
        <span className="text-lg font-semibold tracking-tight">
          <span style={{ color: "#7C3AED" }}>Switch</span>
          <span className="text-white">board</span>
        </span>
      )}
    </div>
  );
}
