/**
 * Atoms and Bits mark: an atom (two orbits + nucleus) whose
 * nucleus is a square "bit". Inherits size from className.
 */
export default function AtomsBitsLogo({ className = "h-6 w-6", mono = false }: { className?: string; mono?: boolean }) {
  const orbit = mono ? "currentColor" : "var(--cyan)";
  const core = mono ? "currentColor" : "var(--amber)";
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden>
      <ellipse cx="16" cy="16" rx="14" ry="6" stroke={orbit} strokeWidth="2" transform="rotate(30 16 16)" />
      <ellipse cx="16" cy="16" rx="14" ry="6" stroke={orbit} strokeWidth="2" transform="rotate(-30 16 16)" />
      <rect x="12.5" y="12.5" width="7" height="7" rx="1.2" fill={core} />
      <circle cx="28.1" cy="9" r="1.8" fill={orbit} />
      <circle cx="3.9" cy="23" r="1.8" fill={orbit} />
    </svg>
  );
}
