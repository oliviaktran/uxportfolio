/** Small pixel envelope mark - blue outline on light canvas (inverse theme). */
export function PixelEnvelope({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="72"
      height="56"
      viewBox="0 0 72 56"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ color: "#1a35c5" }}
    >
      <rect
        x="6"
        y="12"
        width="60"
        height="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M6 12 L36 34 L66 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect x="30" y="22" width="12" height="12" fill="#e8301a" />
    </svg>
  );
}
