export function FlowerCluster({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Large flower left */}
      <ellipse cx="30" cy="40" rx="10" ry="16" fill="#F2C4CE" opacity="0.7" transform="rotate(-20 30 40)" />
      <ellipse cx="30" cy="40" rx="10" ry="16" fill="#F2C4CE" opacity="0.7" transform="rotate(20 30 40)" />
      <ellipse cx="30" cy="40" rx="10" ry="16" fill="#FAE8EE" opacity="0.6" transform="rotate(70 30 40)" />
      <ellipse cx="30" cy="40" rx="10" ry="16" fill="#FAE8EE" opacity="0.6" transform="rotate(-70 30 40)" />
      <circle cx="30" cy="40" r="6" fill="#F5E6A3" />

      {/* Medium flower center */}
      <ellipse cx="75" cy="35" rx="8" ry="13" fill="#C9B8E8" opacity="0.65" transform="rotate(-15 75 35)" />
      <ellipse cx="75" cy="35" rx="8" ry="13" fill="#C9B8E8" opacity="0.65" transform="rotate(15 75 35)" />
      <ellipse cx="75" cy="35" rx="8" ry="13" fill="#EDE6F8" opacity="0.55" transform="rotate(75 75 35)" />
      <ellipse cx="75" cy="35" rx="8" ry="13" fill="#EDE6F8" opacity="0.55" transform="rotate(-75 75 35)" />
      <circle cx="75" cy="35" r="5" fill="#F5C6A0" />

      {/* Small flower right */}
      <ellipse cx="130" cy="42" rx="7" ry="11" fill="#A8C8E8" opacity="0.6" transform="rotate(-10 130 42)" />
      <ellipse cx="130" cy="42" rx="7" ry="11" fill="#A8C8E8" opacity="0.6" transform="rotate(10 130 42)" />
      <ellipse cx="130" cy="42" rx="7" ry="11" fill="#DCF0FF" opacity="0.5" transform="rotate(80 130 42)" />
      <ellipse cx="130" cy="42" rx="7" ry="11" fill="#DCF0FF" opacity="0.5" transform="rotate(-80 130 42)" />
      <circle cx="130" cy="42" r="4" fill="#F5E6A3" />

      {/* Stems */}
      <path d="M30 56 Q28 65 24 70" stroke="#A8C8A0" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M30 56 Q33 65 36 72" stroke="#A8C8A0" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M75 48 Q73 58 70 65" stroke="#A8C8A0" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M130 53 Q132 62 128 68" stroke="#A8C8A0" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

      {/* Small leaves */}
      <ellipse cx="26" cy="63" rx="5" ry="2.5" fill="#A8C8A0" opacity="0.6" transform="rotate(-30 26 63)" />
      <ellipse cx="72" cy="57" rx="4" ry="2" fill="#A8C8A0" opacity="0.6" transform="rotate(25 72 57)" />

      {/* Tiny dots scattered */}
      <circle cx="52" cy="28" r="2" fill="#F2C4CE" opacity="0.5" />
      <circle cx="105" cy="55" r="1.5" fill="#C9B8E8" opacity="0.4" />
      <circle cx="15" cy="55" r="1.5" fill="#A8C8E8" opacity="0.4" />
      <circle cx="148" cy="30" r="2" fill="#F5C6A0" opacity="0.4" />
    </svg>
  );
}

export function PawPrint({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="20" cy="26" rx="9" ry="7" fill="currentColor" opacity="0.85" />
      <ellipse cx="11" cy="17" rx="4" ry="5" fill="currentColor" opacity="0.7" />
      <ellipse cx="20" cy="14" rx="4" ry="5" fill="currentColor" opacity="0.7" />
      <ellipse cx="29" cy="17" rx="4" ry="5" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

export function TinyBird({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="32" cy="22" rx="12" ry="8" fill="currentColor" opacity="0.75" />
      <ellipse cx="44" cy="20" rx="5" ry="4" fill="currentColor" opacity="0.75" />
      <path d="M16 18 Q20 12 28 18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M16 18 Q22 24 28 20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
      <circle cx="47" cy="18" r="1.5" fill="#FFF8F0" />
      <path d="M49 21 L52 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <path d="M31 28 Q29 33 33 35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M33 35 L30 35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M33 35 L35 37" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function TinyBook({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="8" y="8" width="26" height="30" rx="3" fill="currentColor" opacity="0.2" />
      <rect x="10" y="8" width="22" height="30" rx="2" fill="currentColor" opacity="0.35" />
      <line x1="10" y1="8" x2="10" y2="38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <line x1="15" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="15" y1="20" x2="28" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="15" y1="24" x2="24" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function SmallFlower({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="18" cy="18" rx="5" ry="9" fill="currentColor" opacity="0.5" />
      <ellipse cx="18" cy="18" rx="5" ry="9" fill="currentColor" opacity="0.5" transform="rotate(60 18 18)" />
      <ellipse cx="18" cy="18" rx="5" ry="9" fill="currentColor" opacity="0.5" transform="rotate(120 18 18)" />
      <ellipse cx="18" cy="18" rx="5" ry="9" fill="currentColor" opacity="0.35" transform="rotate(30 18 18)" />
      <ellipse cx="18" cy="18" rx="5" ry="9" fill="currentColor" opacity="0.35" transform="rotate(90 18 18)" />
      <ellipse cx="18" cy="18" rx="5" ry="9" fill="currentColor" opacity="0.35" transform="rotate(150 18 18)" />
      <circle cx="18" cy="18" r="4.5" fill="#F5E6A3" />
    </svg>
  );
}
