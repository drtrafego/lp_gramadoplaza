interface GoogleWordmarkProps {
  size?: number
  className?: string
}

const LETTERS = [
  { char: "G", color: "#4285F4" },
  { char: "o", color: "#EA4335" },
  { char: "o", color: "#FBBC05" },
  { char: "g", color: "#4285F4" },
  { char: "l", color: "#34A853" },
  { char: "e", color: "#EA4335" },
] as const

export default function GoogleWordmark({
  size = 28,
  className = "",
}: GoogleWordmarkProps) {
  return (
    <span
      className={`google-wordmark ${className}`.trim()}
      aria-label="Google"
      role="img"
      style={{
        fontSize: `${size}px`,
        lineHeight: 1,
        fontFamily: "var(--font-inter), Arial, sans-serif",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        display: "inline-flex",
        alignItems: "baseline",
      }}
    >
      {LETTERS.map((letter, i) => (
        <span key={i} style={{ color: letter.color }}>
          {letter.char}
        </span>
      ))}
    </span>
  )
}
