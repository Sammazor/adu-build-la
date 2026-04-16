import { cn } from "@/lib/utils";

// Schematic floor plan illustrations — clean architectural line drawings
// Each plan is a simplified but recognizable layout diagram

interface FloorPlanSvgProps {
  svgKey: string;
  className?: string;
}

export function FloorPlanSvg({ svgKey, className }: FloorPlanSvgProps) {
  const base = cn("w-full h-full", className);

  switch (svgKey) {
    case "studio-400":
      return (
        <svg viewBox="0 0 200 160" className={base} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer walls */}
          <rect x="10" y="10" width="180" height="140" fill="#fafaf9" stroke="#44403c" strokeWidth="2.5" />
          {/* Kitchen area - top right */}
          <rect x="120" y="10" width="70" height="50" fill="#fef3c7" stroke="#44403c" strokeWidth="1.5" />
          <text x="155" y="40" textAnchor="middle" fontSize="8" fill="#78716c" fontFamily="sans-serif">Kitchen</text>
          {/* Counter L-shape */}
          <line x1="120" y1="45" x2="175" y2="45" stroke="#92400e" strokeWidth="2" />
          <line x1="155" y1="20" x2="155" y2="45" stroke="#92400e" strokeWidth="2" />
          {/* Bathroom - top left */}
          <rect x="10" y="10" width="55" height="50" fill="#dbeafe" stroke="#44403c" strokeWidth="1.5" />
          <text x="37" y="38" textAnchor="middle" fontSize="7.5" fill="#1d4ed8" fontFamily="sans-serif">Bath</text>
          {/* Toilet */}
          <rect x="15" y="15" width="14" height="18" rx="3" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1" />
          {/* Vanity */}
          <rect x="35" y="15" width="20" height="12" rx="1" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" />
          {/* Main living area */}
          <text x="100" y="105" textAnchor="middle" fontSize="8.5" fill="#57534e" fontFamily="sans-serif">Living / Sleeping</text>
          {/* Closet */}
          <rect x="10" y="60" width="40" height="30" fill="#f5f5f4" stroke="#a8a29e" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="30" y="79" textAnchor="middle" fontSize="6.5" fill="#a8a29e" fontFamily="sans-serif">Closet</text>
          {/* Entry door */}
          <line x1="90" y1="150" x2="130" y2="150" stroke="white" strokeWidth="3" />
          <path d="M90 150 Q90 135 105 135" stroke="#44403c" strokeWidth="1.5" fill="none" />
          <text x="112" y="148" textAnchor="middle" fontSize="7" fill="#78716c" fontFamily="sans-serif">Entry</text>
          {/* Compass */}
          <text x="185" y="155" fontSize="8" fill="#a8a29e" fontFamily="sans-serif">N↑</text>
        </svg>
      );

    case "1bed-500":
      return (
        <svg viewBox="0 0 200 180" className={base} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="180" height="160" fill="#fafaf9" stroke="#44403c" strokeWidth="2.5" />
          {/* Bedroom - left */}
          <rect x="10" y="10" width="85" height="80" fill="#fef3c7" stroke="#44403c" strokeWidth="1.5" />
          <text x="52" y="52" textAnchor="middle" fontSize="8.5" fill="#78716c" fontFamily="sans-serif">Bedroom</text>
          {/* Bed symbol */}
          <rect x="18" y="18" width="40" height="28" rx="2" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
          <rect x="20" y="18" width="36" height="8" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
          {/* Closet */}
          <rect x="62" y="15" width="28" height="22" fill="#f5f5f4" stroke="#a8a29e" strokeWidth="1" strokeDasharray="2 2" />
          <text x="76" y="29" textAnchor="middle" fontSize="6" fill="#a8a29e" fontFamily="sans-serif">WIC</text>
          {/* Bathroom */}
          <rect x="10" y="90" width="55" height="55" fill="#dbeafe" stroke="#44403c" strokeWidth="1.5" />
          <text x="37" y="120" textAnchor="middle" fontSize="7.5" fill="#1d4ed8" fontFamily="sans-serif">Bath</text>
          <rect x="15" y="95" width="14" height="18" rx="3" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1" />
          <rect x="35" y="95" width="20" height="12" rx="1" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" />
          <rect x="15" y="120" width="40" height="20" rx="2" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" />
          {/* Kitchen */}
          <rect x="100" y="10" width="90" height="55" fill="#fef3c7" stroke="#44403c" strokeWidth="1.5" />
          <text x="145" y="40" textAnchor="middle" fontSize="8" fill="#78716c" fontFamily="sans-serif">Kitchen</text>
          <line x1="100" y1="48" x2="175" y2="48" stroke="#92400e" strokeWidth="2" />
          <line x1="165" y1="15" x2="165" y2="48" stroke="#92400e" strokeWidth="2" />
          {/* Living area */}
          <rect x="65" y="90" width="125" height="80" fill="#f5f5f4" stroke="#44403c" strokeWidth="1.5" />
          <text x="127" y="132" textAnchor="middle" fontSize="8.5" fill="#57534e" fontFamily="sans-serif">Living / Dining</text>
          {/* Entry door */}
          <line x1="100" y1="170" x2="140" y2="170" stroke="white" strokeWidth="3" />
          <path d="M100 170 Q100 155 115 155" stroke="#44403c" strokeWidth="1.5" fill="none" />
          <text x="185" y="175" fontSize="8" fill="#a8a29e" fontFamily="sans-serif">N↑</text>
        </svg>
      );

    case "1bed-650":
      return (
        <svg viewBox="0 0 220 190" className={base} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="200" height="170" fill="#fafaf9" stroke="#44403c" strokeWidth="2.5" />
          {/* Bedroom */}
          <rect x="10" y="10" width="95" height="90" fill="#fef3c7" stroke="#44403c" strokeWidth="1.5" />
          <text x="57" y="58" textAnchor="middle" fontSize="8.5" fill="#78716c" fontFamily="sans-serif">Bedroom</text>
          <rect x="18" y="18" width="48" height="32" rx="2" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
          <rect x="20" y="18" width="44" height="9" rx="1" fill="#fbbf24" />
          {/* Walk-in closet */}
          <rect x="68" y="15" width="30" height="28" fill="#f5f5f4" stroke="#a8a29e" strokeWidth="1" strokeDasharray="2 2" />
          <text x="83" y="31" textAnchor="middle" fontSize="6" fill="#a8a29e" fontFamily="sans-serif">W.I.C</text>
          {/* Bath */}
          <rect x="10" y="100" width="60" height="60" fill="#dbeafe" stroke="#44403c" strokeWidth="1.5" />
          <text x="40" y="132" textAnchor="middle" fontSize="7.5" fill="#1d4ed8" fontFamily="sans-serif">Bath</text>
          <rect x="16" y="105" width="16" height="20" rx="3" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1" />
          <rect x="38" y="105" width="24" height="14" rx="1" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" />
          <rect x="16" y="132" width="44" height="22" rx="2" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" />
          {/* Kitchen */}
          <rect x="115" y="10" width="95" height="65" fill="#fef3c7" stroke="#44403c" strokeWidth="1.5" />
          <text x="162" y="45" textAnchor="middle" fontSize="8" fill="#78716c" fontFamily="sans-serif">Kitchen</text>
          <line x1="115" y1="55" x2="195" y2="55" stroke="#92400e" strokeWidth="2" />
          <line x1="182" y1="15" x2="182" y2="55" stroke="#92400e" strokeWidth="2" />
          {/* Island */}
          <rect x="130" y="40" width="38" height="18" rx="2" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
          {/* Living */}
          <rect x="70" y="100" width="140" height="80" fill="#f5f5f4" stroke="#44403c" strokeWidth="1.5" />
          <text x="140" y="142" textAnchor="middle" fontSize="8.5" fill="#57534e" fontFamily="sans-serif">Living / Dining</text>
          {/* Patio door */}
          <line x1="130" y1="180" x2="180" y2="180" stroke="white" strokeWidth="3" />
          <rect x="130" y="174" width="50" height="6" fill="none" stroke="#44403c" strokeWidth="1" />
          <text x="155" y="171" textAnchor="middle" fontSize="6" fill="#a8a29e" fontFamily="sans-serif">Patio door</text>
          {/* Entry */}
          <line x1="90" y1="180" x2="120" y2="180" stroke="white" strokeWidth="3" />
          <path d="M90 180 Q90 165 105 165" stroke="#44403c" strokeWidth="1.5" fill="none" />
          <text x="210" y="185" fontSize="8" fill="#a8a29e" fontFamily="sans-serif">N↑</text>
        </svg>
      );

    case "2bed-750":
      return (
        <svg viewBox="0 0 240 200" className={base} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="220" height="180" fill="#fafaf9" stroke="#44403c" strokeWidth="2.5" />
          {/* Bedroom 1 */}
          <rect x="10" y="10" width="95" height="85" fill="#fef3c7" stroke="#44403c" strokeWidth="1.5" />
          <text x="57" y="55" textAnchor="middle" fontSize="8" fill="#78716c" fontFamily="sans-serif">Bedroom 1</text>
          <rect x="18" y="18" width="44" height="30" rx="2" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
          <rect x="20" y="18" width="40" height="8" rx="1" fill="#fbbf24" />
          <rect x="70" y="15" width="28" height="20" fill="#f5f5f4" stroke="#a8a29e" strokeWidth="1" strokeDasharray="2 2" />
          <text x="84" y="28" textAnchor="middle" fontSize="5.5" fill="#a8a29e" fontFamily="sans-serif">Closet</text>
          {/* Bedroom 2 */}
          <rect x="115" y="10" width="115" height="85" fill="#fef3c7" stroke="#44403c" strokeWidth="1.5" />
          <text x="172" y="55" textAnchor="middle" fontSize="8" fill="#78716c" fontFamily="sans-serif">Bedroom 2</text>
          <rect x="180" y="18" width="44" height="30" rx="2" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
          <rect x="182" y="18" width="40" height="8" rx="1" fill="#fbbf24" />
          <rect x="118" y="15" width="30" height="20" fill="#f5f5f4" stroke="#a8a29e" strokeWidth="1" strokeDasharray="2 2" />
          <text x="133" y="28" textAnchor="middle" fontSize="5.5" fill="#a8a29e" fontFamily="sans-serif">Closet</text>
          {/* Hall */}
          <rect x="95" y="10" width="20" height="85" fill="#e7e5e4" stroke="#44403c" strokeWidth="1" />
          <text x="105" y="56" textAnchor="middle" fontSize="6" fill="#a8a29e" fontFamily="sans-serif" transform="rotate(-90, 105, 56)">Hall</text>
          {/* Bath */}
          <rect x="10" y="95" width="65" height="65" fill="#dbeafe" stroke="#44403c" strokeWidth="1.5" />
          <text x="42" y="128" textAnchor="middle" fontSize="7.5" fill="#1d4ed8" fontFamily="sans-serif">Bath</text>
          <rect x="16" y="100" width="16" height="20" rx="3" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1" />
          <rect x="38" y="100" width="28" height="14" rx="1" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" />
          <rect x="16" y="128" width="48" height="26" rx="2" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" />
          {/* Kitchen */}
          <rect x="155" y="95" width="75" height="65" fill="#fef3c7" stroke="#44403c" strokeWidth="1.5" />
          <text x="192" y="130" textAnchor="middle" fontSize="8" fill="#78716c" fontFamily="sans-serif">Kitchen</text>
          <line x1="155" y1="140" x2="220" y2="140" stroke="#92400e" strokeWidth="2" />
          <line x1="210" y1="100" x2="210" y2="140" stroke="#92400e" strokeWidth="2" />
          {/* Living / Dining */}
          <rect x="75" y="95" width="80" height="65" fill="#f5f5f4" stroke="#44403c" strokeWidth="1.5" />
          <text x="115" y="132" textAnchor="middle" fontSize="7.5" fill="#57534e" fontFamily="sans-serif">Living</text>
          {/* Entry/patio */}
          <line x1="95" y1="190" x2="145" y2="190" stroke="white" strokeWidth="3" />
          <path d="M95 190 Q95 175 110 175" stroke="#44403c" strokeWidth="1.5" fill="none" />
          <text x="230" y="196" fontSize="8" fill="#a8a29e" fontFamily="sans-serif">N↑</text>
        </svg>
      );

    case "garage-450":
      return (
        <svg viewBox="0 0 200 170" className={base} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="180" height="150" fill="#fafaf9" stroke="#44403c" strokeWidth="2.5" />
          {/* Garage door converted to glass wall */}
          <line x1="10" y1="160" x2="190" y2="160" stroke="#44403c" strokeWidth="2.5" />
          <rect x="10" y="148" width="180" height="12" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
          <text x="100" y="158" textAnchor="middle" fontSize="6.5" fill="#1d4ed8" fontFamily="sans-serif">Converted garage opening · Glass / Sliding door</text>
          {/* Bedroom */}
          <rect x="10" y="10" width="80" height="75" fill="#fef3c7" stroke="#44403c" strokeWidth="1.5" />
          <text x="50" y="50" textAnchor="middle" fontSize="8" fill="#78716c" fontFamily="sans-serif">Bedroom</text>
          <rect x="18" y="18" width="38" height="26" rx="2" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
          <rect x="20" y="18" width="34" height="7" rx="1" fill="#fbbf24" />
          {/* Closet */}
          <rect x="62" y="15" width="22" height="20" fill="#f5f5f4" stroke="#a8a29e" strokeWidth="1" strokeDasharray="2 2" />
          <text x="73" y="28" textAnchor="middle" fontSize="5.5" fill="#a8a29e" fontFamily="sans-serif">Cls</text>
          {/* Bath */}
          <rect x="10" y="85" width="55" height="55" fill="#dbeafe" stroke="#44403c" strokeWidth="1.5" />
          <text x="37" y="114" textAnchor="middle" fontSize="7.5" fill="#1d4ed8" fontFamily="sans-serif">Bath</text>
          <rect x="15" y="90" width="14" height="18" rx="3" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1" />
          <rect x="35" y="90" width="22" height="12" rx="1" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" />
          <rect x="15" y="115" width="42" height="20" rx="2" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" />
          {/* Kitchen */}
          <rect x="100" y="10" width="90" height="55" fill="#fef3c7" stroke="#44403c" strokeWidth="1.5" />
          <text x="145" y="38" textAnchor="middle" fontSize="8" fill="#78716c" fontFamily="sans-serif">Kitchen</text>
          <line x1="100" y1="46" x2="176" y2="46" stroke="#92400e" strokeWidth="2" />
          <line x1="165" y1="15" x2="165" y2="46" stroke="#92400e" strokeWidth="2" />
          {/* Living */}
          <rect x="65" y="85" width="125" height="55" fill="#f5f5f4" stroke="#44403c" strokeWidth="1.5" />
          <text x="127" y="114" textAnchor="middle" fontSize="8.5" fill="#57534e" fontFamily="sans-serif">Living / Dining</text>
          {/* Vaulted ceiling indicator */}
          <path d="M65 10 L100 2 L190 10" fill="none" stroke="#92400e" strokeWidth="1" strokeDasharray="3 2" />
          <text x="127" y="8" textAnchor="middle" fontSize="5.5" fill="#92400e" fontFamily="sans-serif">Vaulted ceiling option</text>
          <text x="190" y="165" fontSize="8" fill="#a8a29e" fontFamily="sans-serif">N↑</text>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 200 160" className={base} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="180" height="140" fill="#f5f5f4" stroke="#a8a29e" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="100" y="85" textAnchor="middle" fontSize="11" fill="#a8a29e" fontFamily="sans-serif">Floor plan preview</text>
          <text x="100" y="100" textAnchor="middle" fontSize="8" fill="#d6d3d1" fontFamily="sans-serif">Complete your selections</text>
        </svg>
      );
  }
}
