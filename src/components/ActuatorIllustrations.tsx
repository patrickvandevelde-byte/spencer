// SVG illustrations for each actuator type and their spray patterns

export function FullConeNozzle({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="48" y="8" width="24" height="20" rx="2" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.5"/>
      <rect x="44" y="24" width="32" height="12" rx="2" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.5"/>
      <path d="M52 36 L56 42 L64 42 L68 36" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5"/>
      <circle cx="60" cy="18" r="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="1"/>
      <line x1="58" y1="18" x2="62" y2="18" stroke="#06b6d4" strokeWidth="0.5"/>
      <line x1="50" y1="28" x2="54" y2="32" stroke="#06b6d4" strokeWidth="0.5" opacity="0.5"/>
      <line x1="70" y1="28" x2="66" y2="32" stroke="#06b6d4" strokeWidth="0.5" opacity="0.5"/>
      <path d="M58 44 L30 110 L90 110 L62 44" fill="url(#fullConeGrad)" className="spray-animated"/>
      <circle cx="45" cy="85" r="1.5" fill="#06b6d4" opacity="0.6"/>
      <circle cx="55" cy="75" r="1" fill="#06b6d4" opacity="0.7"/>
      <circle cx="65" cy="80" r="1.2" fill="#06b6d4" opacity="0.5"/>
      <circle cx="75" cy="90" r="1" fill="#06b6d4" opacity="0.6"/>
      <circle cx="50" cy="95" r="1.3" fill="#06b6d4" opacity="0.4"/>
      <circle cx="70" cy="100" r="1" fill="#06b6d4" opacity="0.5"/>
      <circle cx="60" cy="70" r="0.8" fill="#06b6d4" opacity="0.8"/>
      <circle cx="40" cy="100" r="1" fill="#06b6d4" opacity="0.3"/>
      <circle cx="80" cy="95" r="0.8" fill="#06b6d4" opacity="0.4"/>
      <defs>
        <linearGradient id="fullConeGrad" x1="60" y1="44" x2="60" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06b6d4" stopOpacity="0.3"/><stop offset="1" stopColor="#06b6d4" stopOpacity="0.02"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function HollowConeNozzle({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="48" y="8" width="24" height="18" rx="2" fill="#1e293b" stroke="#8b5cf6" strokeWidth="1.5"/>
      <rect x="46" y="22" width="28" height="10" rx="2" fill="#1e293b" stroke="#8b5cf6" strokeWidth="1.5"/>
      <path d="M52 32 L55 38 L65 38 L68 32" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.5"/>
      <circle cx="60" cy="17" r="3" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1"/>
      <path d="M52 26 Q56 28 54 30" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.5" fill="none"/>
      <path d="M68 26 Q64 28 66 30" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.5" fill="none"/>
      <path d="M57 40 L28 108" stroke="#8b5cf6" strokeWidth="2" opacity="0.4" className="spray-animated"/>
      <path d="M63 40 L92 108" stroke="#8b5cf6" strokeWidth="2" opacity="0.4" className="spray-animated"/>
      <path d="M57 40 L42 108" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.25"/>
      <path d="M63 40 L78 108" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.25"/>
      <ellipse cx="60" cy="108" rx="32" ry="4" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.3"/>
      <ellipse cx="60" cy="108" rx="18" ry="2.5" fill="none" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.15" strokeDasharray="2 2"/>
      <circle cx="35" cy="95" r="1" fill="#8b5cf6" opacity="0.6"/>
      <circle cx="85" cy="92" r="1.2" fill="#8b5cf6" opacity="0.5"/>
      <circle cx="32" cy="105" r="0.8" fill="#8b5cf6" opacity="0.4"/>
      <circle cx="88" cy="102" r="1" fill="#8b5cf6" opacity="0.5"/>
      <circle cx="40" cy="80" r="0.8" fill="#8b5cf6" opacity="0.5"/>
      <circle cx="80" cy="82" r="1" fill="#8b5cf6" opacity="0.4"/>
    </svg>
  );
}

export function FlatFanNozzle({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="48" y="8" width="24" height="22" rx="2" fill="#1e293b" stroke="#10b981" strokeWidth="1.5"/>
      <rect x="44" y="26" width="32" height="8" rx="1" fill="#1e293b" stroke="#10b981" strokeWidth="1.5"/>
      <rect x="50" y="34" width="20" height="4" rx="1" fill="#0f172a" stroke="#10b981" strokeWidth="1.5"/>
      <line x1="52" y1="36" x2="68" y2="36" stroke="#10b981" strokeWidth="0.5" opacity="0.5"/>
      <rect x="55" y="16" width="10" height="3" rx="1" fill="#0f172a" stroke="#10b981" strokeWidth="0.8"/>
      <path d="M54 40 L8 100 L112 100 L66 40" fill="url(#flatFanGrad)" className="spray-animated"/>
      <line x1="54" y1="40" x2="8" y2="100" stroke="#10b981" strokeWidth="1" opacity="0.3"/>
      <line x1="66" y1="40" x2="112" y2="100" stroke="#10b981" strokeWidth="1" opacity="0.3"/>
      <line x1="58" y1="40" x2="30" y2="100" stroke="#10b981" strokeWidth="0.5" opacity="0.15"/>
      <line x1="60" y1="40" x2="60" y2="100" stroke="#10b981" strokeWidth="0.5" opacity="0.15"/>
      <line x1="62" y1="40" x2="90" y2="100" stroke="#10b981" strokeWidth="0.5" opacity="0.15"/>
      <circle cx="20" cy="90" r="1" fill="#10b981" opacity="0.4"/>
      <circle cx="40" cy="85" r="0.8" fill="#10b981" opacity="0.5"/>
      <circle cx="60" cy="75" r="1" fill="#10b981" opacity="0.6"/>
      <circle cx="80" cy="82" r="0.8" fill="#10b981" opacity="0.5"/>
      <circle cx="100" cy="92" r="1" fill="#10b981" opacity="0.4"/>
      <defs>
        <linearGradient id="flatFanGrad" x1="60" y1="40" x2="60" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" stopOpacity="0.2"/><stop offset="1" stopColor="#10b981" stopOpacity="0.01"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FineMistActuator({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="52" y="6" width="16" height="16" rx="2" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5"/>
      <rect x="50" y="18" width="20" height="10" rx="2" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5"/>
      <path d="M54 28 L56 34 L64 34 L66 28" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5"/>
      <circle cx="60" cy="14" r="2" fill="#0f172a" stroke="#f59e0b" strokeWidth="0.8"/>
      <ellipse cx="60" cy="60" rx="20" ry="16" fill="url(#mistGrad1)" className="spray-animated"/>
      <ellipse cx="60" cy="75" rx="28" ry="18" fill="url(#mistGrad2)" className="spray-animated" style={{animationDelay: "0.5s"}}/>
      <ellipse cx="60" cy="92" rx="34" ry="20" fill="url(#mistGrad3)" className="spray-animated" style={{animationDelay: "1s"}}/>
      <circle cx="45" cy="65" r="0.6" fill="#f59e0b" opacity="0.6"/>
      <circle cx="75" cy="68" r="0.5" fill="#f59e0b" opacity="0.5"/>
      <circle cx="50" cy="78" r="0.7" fill="#f59e0b" opacity="0.4"/>
      <circle cx="70" cy="75" r="0.5" fill="#f59e0b" opacity="0.6"/>
      <circle cx="55" cy="88" r="0.6" fill="#f59e0b" opacity="0.3"/>
      <circle cx="65" cy="85" r="0.5" fill="#f59e0b" opacity="0.5"/>
      <circle cx="40" cy="90" r="0.5" fill="#f59e0b" opacity="0.3"/>
      <circle cx="80" cy="88" r="0.6" fill="#f59e0b" opacity="0.3"/>
      <defs>
        <radialGradient id="mistGrad1" cx="0.5" cy="0.5" r="0.5"><stop stopColor="#f59e0b" stopOpacity="0.15"/><stop offset="1" stopColor="#f59e0b" stopOpacity="0"/></radialGradient>
        <radialGradient id="mistGrad2" cx="0.5" cy="0.5" r="0.5"><stop stopColor="#f59e0b" stopOpacity="0.1"/><stop offset="1" stopColor="#f59e0b" stopOpacity="0"/></radialGradient>
        <radialGradient id="mistGrad3" cx="0.5" cy="0.5" r="0.5"><stop stopColor="#f59e0b" stopOpacity="0.06"/><stop offset="1" stopColor="#f59e0b" stopOpacity="0"/></radialGradient>
      </defs>
    </svg>
  );
}

export function JetStreamNozzle({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="46" y="6" width="28" height="20" rx="2" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5"/>
      <rect x="44" y="22" width="32" height="10" rx="2" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5"/>
      <path d="M50 32 L52 38 L68 38 L70 32" fill="#0f172a" stroke="#ef4444" strokeWidth="1.5"/>
      <circle cx="60" cy="16" r="5" fill="#0f172a" stroke="#ef4444" strokeWidth="1"/>
      <circle cx="60" cy="16" r="2" fill="#ef4444" opacity="0.2"/>
      <rect x="56" y="40" width="8" height="70" rx="4" fill="url(#jetGrad)" className="spray-animated"/>
      <line x1="60" y1="40" x2="60" y2="112" stroke="#ef4444" strokeWidth="2" opacity="0.3"/>
      <line x1="57" y1="50" x2="57" y2="65" stroke="#ef4444" strokeWidth="0.5" opacity="0.4"/>
      <line x1="63" y1="48" x2="63" y2="60" stroke="#ef4444" strokeWidth="0.5" opacity="0.4"/>
      <line x1="57" y1="75" x2="57" y2="90" stroke="#ef4444" strokeWidth="0.5" opacity="0.3"/>
      <line x1="63" y1="72" x2="63" y2="85" stroke="#ef4444" strokeWidth="0.5" opacity="0.3"/>
      <path d="M50 108 Q55 104 60 108 Q65 104 70 108" stroke="#ef4444" strokeWidth="1" opacity="0.3" fill="none"/>
      <defs>
        <linearGradient id="jetGrad" x1="60" y1="40" x2="60" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ef4444" stopOpacity="0.35"/><stop offset="0.5" stopColor="#ef4444" stopOpacity="0.2"/><stop offset="1" stopColor="#ef4444" stopOpacity="0.05"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// ---- NEW ACTUATOR ILLUSTRATIONS ----

export function AirAtomizingNozzle({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dual-body nozzle */}
      <rect x="42" y="6" width="36" height="16" rx="2" fill="#1e293b" stroke="#ec4899" strokeWidth="1.5"/>
      {/* Liquid inlet */}
      <rect x="54" y="2" width="12" height="8" rx="1" fill="#1e293b" stroke="#ec4899" strokeWidth="1"/>
      {/* Air cap */}
      <path d="M40 22 L42 18 L78 18 L80 22 L80 32 L40 32 Z" fill="#1e293b" stroke="#ec4899" strokeWidth="1.5"/>
      {/* Air inlet arrows */}
      <path d="M35 25 L42 25" stroke="#ec4899" strokeWidth="1" opacity="0.5" strokeDasharray="2 1"/>
      <path d="M85 25 L78 25" stroke="#ec4899" strokeWidth="1" opacity="0.5" strokeDasharray="2 1"/>
      <text x="34" y="23" fill="#ec4899" fontSize="5" opacity="0.4">AIR</text>
      <text x="80" y="23" fill="#ec4899" fontSize="5" opacity="0.4">AIR</text>
      {/* Orifice */}
      <circle cx="60" cy="10" r="2.5" fill="#0f172a" stroke="#ec4899" strokeWidth="0.8"/>
      {/* Converging air-assisted spray */}
      <path d="M55 34 L26 105 L94 105 L65 34" fill="url(#aaGrad)" className="spray-animated"/>
      {/* Air shear lines */}
      <path d="M48 45 Q52 55 44 65" stroke="#ec4899" strokeWidth="0.5" opacity="0.3" fill="none"/>
      <path d="M72 45 Q68 55 76 65" stroke="#ec4899" strokeWidth="0.5" opacity="0.3" fill="none"/>
      <path d="M50 65 Q54 75 46 85" stroke="#ec4899" strokeWidth="0.4" opacity="0.2" fill="none"/>
      <path d="M70 65 Q66 75 74 85" stroke="#ec4899" strokeWidth="0.4" opacity="0.2" fill="none"/>
      {/* Very fine droplets */}
      <circle cx="40" cy="80" r="0.5" fill="#ec4899" opacity="0.5"/>
      <circle cx="50" cy="70" r="0.4" fill="#ec4899" opacity="0.6"/>
      <circle cx="70" cy="72" r="0.5" fill="#ec4899" opacity="0.5"/>
      <circle cx="80" cy="85" r="0.4" fill="#ec4899" opacity="0.4"/>
      <circle cx="55" cy="90" r="0.5" fill="#ec4899" opacity="0.3"/>
      <circle cx="65" cy="88" r="0.4" fill="#ec4899" opacity="0.4"/>
      <circle cx="45" cy="95" r="0.5" fill="#ec4899" opacity="0.3"/>
      <circle cx="75" cy="92" r="0.4" fill="#ec4899" opacity="0.3"/>
      <defs>
        <linearGradient id="aaGrad" x1="60" y1="34" x2="60" y2="105" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ec4899" stopOpacity="0.25"/><stop offset="1" stopColor="#ec4899" stopOpacity="0.01"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SpiralNozzle({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pipe connection */}
      <rect x="50" y="4" width="20" height="12" rx="2" fill="#1e293b" stroke="#14b8a6" strokeWidth="1.5"/>
      {/* Spiral body */}
      <path d="M48 16 L48 34 Q48 38 52 38 L68 38 Q72 38 72 34 L72 16" fill="#1e293b" stroke="#14b8a6" strokeWidth="1.5"/>
      {/* Spiral channels visible */}
      <path d="M52 20 Q60 24 52 28 Q60 32 52 36" stroke="#14b8a6" strokeWidth="0.6" opacity="0.4" fill="none"/>
      <path d="M68 20 Q60 24 68 28 Q60 32 68 36" stroke="#14b8a6" strokeWidth="0.6" opacity="0.4" fill="none"/>
      {/* Large orifice (clog-free) */}
      <ellipse cx="60" cy="38" rx="8" ry="2" fill="#0f172a" stroke="#14b8a6" strokeWidth="1"/>
      {/* Full cone from spiral */}
      <path d="M56 42 L24 110 L96 110 L64 42" fill="url(#spGrad)" className="spray-animated"/>
      {/* Swirl lines in spray */}
      <path d="M55 50 Q65 65 50 80 Q65 95 55 105" stroke="#14b8a6" strokeWidth="0.5" opacity="0.2" fill="none"/>
      <path d="M65 50 Q55 65 70 80 Q55 95 65 105" stroke="#14b8a6" strokeWidth="0.5" opacity="0.2" fill="none"/>
      {/* Droplets */}
      <circle cx="38" cy="90" r="1.5" fill="#14b8a6" opacity="0.4"/>
      <circle cx="82" cy="88" r="1.3" fill="#14b8a6" opacity="0.4"/>
      <circle cx="50" cy="75" r="1" fill="#14b8a6" opacity="0.5"/>
      <circle cx="70" cy="78" r="1.2" fill="#14b8a6" opacity="0.5"/>
      <circle cx="60" cy="65" r="0.8" fill="#14b8a6" opacity="0.6"/>
      <circle cx="30" cy="105" r="1" fill="#14b8a6" opacity="0.3"/>
      <circle cx="90" cy="102" r="1" fill="#14b8a6" opacity="0.3"/>
      <defs>
        <linearGradient id="spGrad" x1="60" y1="42" x2="60" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14b8a6" stopOpacity="0.25"/><stop offset="1" stopColor="#14b8a6" stopOpacity="0.02"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DeflectionNozzle({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pipe body */}
      <rect x="52" y="4" width="16" height="24" rx="2" fill="#1e293b" stroke="#f97316" strokeWidth="1.5"/>
      {/* Orifice */}
      <rect x="56" y="28" width="8" height="3" rx="1" fill="#0f172a" stroke="#f97316" strokeWidth="1"/>
      {/* Deflection plate */}
      <path d="M38 36 L82 36" stroke="#f97316" strokeWidth="2"/>
      <path d="M36 34 L38 36 L36 38" stroke="#f97316" strokeWidth="1" fill="none"/>
      <path d="M84 34 L82 36 L84 38" stroke="#f97316" strokeWidth="1" fill="none"/>
      <ellipse cx="60" cy="36" rx="22" ry="2" fill="#1e293b" stroke="#f97316" strokeWidth="1"/>
      {/* Ultra-wide flat spray */}
      <path d="M38 38 L4 105 L116 105 L82 38" fill="url(#dfGrad)" className="spray-animated"/>
      <line x1="38" y1="38" x2="4" y2="105" stroke="#f97316" strokeWidth="0.8" opacity="0.3"/>
      <line x1="82" y1="38" x2="116" y2="105" stroke="#f97316" strokeWidth="0.8" opacity="0.3"/>
      {/* Sheet lines */}
      <line x1="50" y1="38" x2="25" y2="105" stroke="#f97316" strokeWidth="0.3" opacity="0.15"/>
      <line x1="60" y1="38" x2="60" y2="105" stroke="#f97316" strokeWidth="0.3" opacity="0.15"/>
      <line x1="70" y1="38" x2="95" y2="105" stroke="#f97316" strokeWidth="0.3" opacity="0.15"/>
      {/* Impact dots */}
      <circle cx="15" cy="95" r="1" fill="#f97316" opacity="0.3"/>
      <circle cx="105" cy="92" r="1" fill="#f97316" opacity="0.3"/>
      <circle cx="40" cy="75" r="0.8" fill="#f97316" opacity="0.4"/>
      <circle cx="80" cy="78" r="0.8" fill="#f97316" opacity="0.4"/>
      <circle cx="60" cy="68" r="0.7" fill="#f97316" opacity="0.5"/>
      <defs>
        <linearGradient id="dfGrad" x1="60" y1="38" x2="60" y2="105" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f97316" stopOpacity="0.18"/><stop offset="1" stopColor="#f97316" stopOpacity="0.01"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function UltrasonicAtomizer({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Piezo body */}
      <rect x="44" y="4" width="32" height="10" rx="2" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5"/>
      {/* Horn taper */}
      <path d="M48 14 L52 30 L68 30 L72 14" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5"/>
      {/* Atomizing tip */}
      <ellipse cx="60" cy="32" rx="6" ry="2" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5"/>
      {/* Piezo vibration waves */}
      <path d="M42 8 Q40 10 42 12" stroke="#a855f7" strokeWidth="0.5" opacity="0.4" fill="none"/>
      <path d="M38 7 Q35 10 38 13" stroke="#a855f7" strokeWidth="0.4" opacity="0.3" fill="none"/>
      <path d="M78 8 Q80 10 78 12" stroke="#a855f7" strokeWidth="0.5" opacity="0.4" fill="none"/>
      <path d="M82 7 Q85 10 82 13" stroke="#a855f7" strokeWidth="0.4" opacity="0.3" fill="none"/>
      {/* Ultra-fine mist cloud — very soft */}
      <ellipse cx="60" cy="50" rx="14" ry="10" fill="url(#usGrad1)" className="spray-animated"/>
      <ellipse cx="60" cy="65" rx="22" ry="14" fill="url(#usGrad2)" className="spray-animated" style={{animationDelay: "0.3s"}}/>
      <ellipse cx="60" cy="82" rx="30" ry="16" fill="url(#usGrad3)" className="spray-animated" style={{animationDelay: "0.6s"}}/>
      <ellipse cx="60" cy="98" rx="36" ry="16" fill="url(#usGrad4)" className="spray-animated" style={{animationDelay: "0.9s"}}/>
      {/* Micro-particles */}
      <circle cx="48" cy="55" r="0.3" fill="#a855f7" opacity="0.7"/>
      <circle cx="72" cy="58" r="0.3" fill="#a855f7" opacity="0.6"/>
      <circle cx="44" cy="72" r="0.4" fill="#a855f7" opacity="0.4"/>
      <circle cx="76" cy="70" r="0.3" fill="#a855f7" opacity="0.5"/>
      <circle cx="50" cy="85" r="0.4" fill="#a855f7" opacity="0.3"/>
      <circle cx="70" cy="88" r="0.3" fill="#a855f7" opacity="0.3"/>
      <circle cx="38" cy="95" r="0.4" fill="#a855f7" opacity="0.2"/>
      <circle cx="82" cy="92" r="0.3" fill="#a855f7" opacity="0.2"/>
      <circle cx="55" cy="62" r="0.3" fill="#a855f7" opacity="0.6"/>
      <circle cx="65" cy="78" r="0.3" fill="#a855f7" opacity="0.4"/>
      <defs>
        <radialGradient id="usGrad1" cx="0.5" cy="0.5" r="0.5"><stop stopColor="#a855f7" stopOpacity="0.18"/><stop offset="1" stopColor="#a855f7" stopOpacity="0"/></radialGradient>
        <radialGradient id="usGrad2" cx="0.5" cy="0.5" r="0.5"><stop stopColor="#a855f7" stopOpacity="0.12"/><stop offset="1" stopColor="#a855f7" stopOpacity="0"/></radialGradient>
        <radialGradient id="usGrad3" cx="0.5" cy="0.5" r="0.5"><stop stopColor="#a855f7" stopOpacity="0.08"/><stop offset="1" stopColor="#a855f7" stopOpacity="0"/></radialGradient>
        <radialGradient id="usGrad4" cx="0.5" cy="0.5" r="0.5"><stop stopColor="#a855f7" stopOpacity="0.04"/><stop offset="1" stopColor="#a855f7" stopOpacity="0"/></radialGradient>
      </defs>
    </svg>
  );
}

export function MultiOrificeCluster({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <rect x="40" y="4" width="40" height="18" rx="3" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1.5"/>
      {/* Orifice plate */}
      <rect x="38" y="22" width="44" height="8" rx="2" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1.5"/>
      {/* 8 micro-orifices in ring */}
      <circle cx="52" cy="26" r="1.5" fill="#0f172a" stroke="#0ea5e9" strokeWidth="0.8"/>
      <circle cx="60" cy="24" r="1.5" fill="#0f172a" stroke="#0ea5e9" strokeWidth="0.8"/>
      <circle cx="68" cy="26" r="1.5" fill="#0f172a" stroke="#0ea5e9" strokeWidth="0.8"/>
      <circle cx="48" cy="28" r="1.5" fill="#0f172a" stroke="#0ea5e9" strokeWidth="0.8"/>
      <circle cx="60" cy="28" r="1.5" fill="#0f172a" stroke="#0ea5e9" strokeWidth="0.8"/>
      <circle cx="72" cy="28" r="1.5" fill="#0f172a" stroke="#0ea5e9" strokeWidth="0.8"/>
      {/* Multiple small cone sprays that merge */}
      <path d="M50 32 L38 70" stroke="#0ea5e9" strokeWidth="0.6" opacity="0.3"/>
      <path d="M54 32 L48 70" stroke="#0ea5e9" strokeWidth="0.6" opacity="0.3"/>
      <path d="M60 32 L60 70" stroke="#0ea5e9" strokeWidth="0.6" opacity="0.3"/>
      <path d="M66 32 L72 70" stroke="#0ea5e9" strokeWidth="0.6" opacity="0.3"/>
      <path d="M70 32 L82 70" stroke="#0ea5e9" strokeWidth="0.6" opacity="0.3"/>
      {/* Merged spray region */}
      <ellipse cx="60" cy="80" rx="34" ry="22" fill="url(#moGrad)" className="spray-animated"/>
      {/* Droplets */}
      <circle cx="40" cy="75" r="0.8" fill="#0ea5e9" opacity="0.5"/>
      <circle cx="50" cy="68" r="0.6" fill="#0ea5e9" opacity="0.6"/>
      <circle cx="70" cy="70" r="0.7" fill="#0ea5e9" opacity="0.5"/>
      <circle cx="80" cy="78" r="0.8" fill="#0ea5e9" opacity="0.4"/>
      <circle cx="55" cy="85" r="0.6" fill="#0ea5e9" opacity="0.4"/>
      <circle cx="65" cy="90" r="0.7" fill="#0ea5e9" opacity="0.3"/>
      <circle cx="35" cy="90" r="0.6" fill="#0ea5e9" opacity="0.3"/>
      <circle cx="85" cy="85" r="0.6" fill="#0ea5e9" opacity="0.3"/>
      <defs>
        <radialGradient id="moGrad" cx="0.5" cy="0.5" r="0.5"><stop stopColor="#0ea5e9" stopOpacity="0.2"/><stop offset="1" stopColor="#0ea5e9" stopOpacity="0"/></radialGradient>
      </defs>
    </svg>
  );
}

export function AdjustableConeNozzle({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <rect x="46" y="6" width="28" height="18" rx="2" fill="#1e293b" stroke="#22d3ee" strokeWidth="1.5"/>
      {/* Adjustable collar (knurled) */}
      <rect x="42" y="20" width="36" height="10" rx="2" fill="#1e293b" stroke="#22d3ee" strokeWidth="1.5"/>
      {/* Knurl marks */}
      <line x1="44" y1="22" x2="44" y2="28" stroke="#22d3ee" strokeWidth="0.3" opacity="0.3"/>
      <line x1="47" y1="22" x2="47" y2="28" stroke="#22d3ee" strokeWidth="0.3" opacity="0.3"/>
      <line x1="50" y1="22" x2="50" y2="28" stroke="#22d3ee" strokeWidth="0.3" opacity="0.3"/>
      <line x1="70" y1="22" x2="70" y2="28" stroke="#22d3ee" strokeWidth="0.3" opacity="0.3"/>
      <line x1="73" y1="22" x2="73" y2="28" stroke="#22d3ee" strokeWidth="0.3" opacity="0.3"/>
      <line x1="76" y1="22" x2="76" y2="28" stroke="#22d3ee" strokeWidth="0.3" opacity="0.3"/>
      {/* Needle valve tip */}
      <path d="M54 30 L57 38 L63 38 L66 30" fill="#0f172a" stroke="#22d3ee" strokeWidth="1.5"/>
      <line x1="60" y1="12" x2="60" y2="36" stroke="#22d3ee" strokeWidth="0.8" opacity="0.3" strokeDasharray="2 2"/>
      {/* Variable angle spray (showing wide setting) */}
      <path d="M56 40 L28 108 L92 108 L64 40" fill="url(#acGrad1)" className="spray-animated"/>
      {/* Ghost of narrow setting */}
      <path d="M58 40 L45 108 L75 108 L62 40" fill="none" stroke="#22d3ee" strokeWidth="0.5" opacity="0.15" strokeDasharray="3 3"/>
      {/* Adjust arrow */}
      <path d="M32 25 L37 25" stroke="#22d3ee" strokeWidth="1" opacity="0.4"/>
      <path d="M35 23 L37 25 L35 27" stroke="#22d3ee" strokeWidth="0.8" opacity="0.4" fill="none"/>
      <circle cx="45" cy="85" r="1" fill="#22d3ee" opacity="0.4"/>
      <circle cx="55" cy="72" r="0.8" fill="#22d3ee" opacity="0.6"/>
      <circle cx="65" cy="78" r="0.8" fill="#22d3ee" opacity="0.5"/>
      <circle cx="75" cy="88" r="1" fill="#22d3ee" opacity="0.4"/>
      <circle cx="60" cy="65" r="0.7" fill="#22d3ee" opacity="0.7"/>
      <circle cx="38" cy="100" r="0.8" fill="#22d3ee" opacity="0.3"/>
      <circle cx="82" cy="98" r="0.8" fill="#22d3ee" opacity="0.3"/>
      <defs>
        <linearGradient id="acGrad1" x1="60" y1="40" x2="60" y2="108" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" stopOpacity="0.25"/><stop offset="1" stopColor="#22d3ee" stopOpacity="0.02"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ImpingementNozzle({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Two angled inlet tubes */}
      <rect x="28" y="4" width="14" height="24" rx="2" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.5" transform="rotate(15, 35, 16)"/>
      <rect x="78" y="4" width="14" height="24" rx="2" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.5" transform="rotate(-15, 85, 16)"/>
      {/* Convergence point */}
      <circle cx="60" cy="32" r="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.5"/>
      <circle cx="60" cy="32" r="1.5" fill="#f43f5e" opacity="0.3"/>
      {/* Two converging jet lines */}
      <line x1="38" y1="22" x2="56" y2="32" stroke="#f43f5e" strokeWidth="1.5" opacity="0.4"/>
      <line x1="82" y1="22" x2="64" y2="32" stroke="#f43f5e" strokeWidth="1.5" opacity="0.4"/>
      {/* Flat sheet spray from impingement */}
      <path d="M56 36 L12 108 L108 108 L64 36" fill="url(#imGrad)" className="spray-animated"/>
      <line x1="56" y1="36" x2="12" y2="108" stroke="#f43f5e" strokeWidth="0.8" opacity="0.25"/>
      <line x1="64" y1="36" x2="108" y2="108" stroke="#f43f5e" strokeWidth="0.8" opacity="0.25"/>
      {/* Shatter lines */}
      <line x1="58" y1="36" x2="38" y2="108" stroke="#f43f5e" strokeWidth="0.3" opacity="0.12"/>
      <line x1="60" y1="36" x2="60" y2="108" stroke="#f43f5e" strokeWidth="0.3" opacity="0.12"/>
      <line x1="62" y1="36" x2="82" y2="108" stroke="#f43f5e" strokeWidth="0.3" opacity="0.12"/>
      {/* Fine droplets */}
      <circle cx="30" cy="85" r="0.6" fill="#f43f5e" opacity="0.4"/>
      <circle cx="90" cy="88" r="0.6" fill="#f43f5e" opacity="0.4"/>
      <circle cx="45" cy="72" r="0.5" fill="#f43f5e" opacity="0.5"/>
      <circle cx="75" cy="74" r="0.5" fill="#f43f5e" opacity="0.5"/>
      <circle cx="60" cy="60" r="0.6" fill="#f43f5e" opacity="0.6"/>
      <circle cx="20" cy="100" r="0.5" fill="#f43f5e" opacity="0.2"/>
      <circle cx="100" cy="98" r="0.5" fill="#f43f5e" opacity="0.2"/>
      <defs>
        <linearGradient id="imGrad" x1="60" y1="36" x2="60" y2="108" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f43f5e" stopOpacity="0.2"/><stop offset="1" stopColor="#f43f5e" stopOpacity="0.01"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// ---- SPRAY PATTERN TOP-DOWN VIEWS ----

export function FullConePattern({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="35" fill="url(#fcPat)" className="spray-animated"/>
      <circle cx="40" cy="40" r="35" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3"/>
      <circle cx="40" cy="40" r="25" stroke="#06b6d4" strokeWidth="0.3" opacity="0.2" strokeDasharray="2 2"/>
      <circle cx="40" cy="40" r="15" stroke="#06b6d4" strokeWidth="0.3" opacity="0.15" strokeDasharray="2 2"/>
      <circle cx="40" cy="40" r="3" fill="#06b6d4" opacity="0.8"/>
      <defs><radialGradient id="fcPat"><stop stopColor="#06b6d4" stopOpacity="0.3"/><stop offset="1" stopColor="#06b6d4" stopOpacity="0"/></radialGradient></defs>
    </svg>
  );
}

export function HollowConePattern({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="35" fill="none" stroke="#8b5cf6" strokeWidth="6" opacity="0.2" className="spray-animated"/>
      <circle cx="40" cy="40" r="35" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.4"/>
      <circle cx="40" cy="40" r="28" fill="none" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.15" strokeDasharray="2 2"/>
      <circle cx="40" cy="40" r="3" fill="#8b5cf6" opacity="0.8"/>
    </svg>
  );
}

export function FlatFanPattern({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="40" rx="38" ry="8" fill="url(#ffPat)" className="spray-animated"/>
      <ellipse cx="40" cy="40" rx="38" ry="8" stroke="#10b981" strokeWidth="0.5" opacity="0.4"/>
      <ellipse cx="40" cy="40" rx="28" ry="5" stroke="#10b981" strokeWidth="0.3" opacity="0.2" strokeDasharray="2 2"/>
      <circle cx="40" cy="40" r="3" fill="#10b981" opacity="0.8"/>
      <defs><radialGradient id="ffPat"><stop stopColor="#10b981" stopOpacity="0.3"/><stop offset="1" stopColor="#10b981" stopOpacity="0"/></radialGradient></defs>
    </svg>
  );
}

export function FineMistPattern({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="35" fill="url(#fmPat)" className="spray-animated"/>
      <circle cx="22" cy="28" r="0.6" fill="#f59e0b" opacity="0.4"/>
      <circle cx="55" cy="20" r="0.5" fill="#f59e0b" opacity="0.3"/>
      <circle cx="18" cy="50" r="0.5" fill="#f59e0b" opacity="0.3"/>
      <circle cx="62" cy="55" r="0.6" fill="#f59e0b" opacity="0.4"/>
      <circle cx="30" cy="60" r="0.5" fill="#f59e0b" opacity="0.3"/>
      <circle cx="48" cy="65" r="0.5" fill="#f59e0b" opacity="0.3"/>
      <circle cx="35" cy="35" r="0.4" fill="#f59e0b" opacity="0.5"/>
      <circle cx="50" cy="40" r="0.5" fill="#f59e0b" opacity="0.4"/>
      <circle cx="40" cy="40" r="3" fill="#f59e0b" opacity="0.8"/>
      <defs><radialGradient id="fmPat"><stop stopColor="#f59e0b" stopOpacity="0.15"/><stop offset="1" stopColor="#f59e0b" stopOpacity="0"/></radialGradient></defs>
    </svg>
  );
}

export function JetStreamPattern({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="6" fill="url(#jsPat)" className="spray-animated"/>
      <circle cx="40" cy="40" r="6" stroke="#ef4444" strokeWidth="1" opacity="0.5"/>
      <circle cx="40" cy="40" r="10" stroke="#ef4444" strokeWidth="0.3" opacity="0.2" strokeDasharray="2 2"/>
      <circle cx="40" cy="40" r="3" fill="#ef4444" opacity="0.8"/>
      <circle cx="40" cy="40" r="16" stroke="#ef4444" strokeWidth="0.3" opacity="0.1"/>
      <defs><radialGradient id="jsPat"><stop stopColor="#ef4444" stopOpacity="0.5"/><stop offset="1" stopColor="#ef4444" stopOpacity="0"/></radialGradient></defs>
    </svg>
  );
}

export function AirAtomizingPattern({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="32" fill="url(#aaPat)" className="spray-animated"/>
      <circle cx="40" cy="40" r="32" stroke="#ec4899" strokeWidth="0.5" opacity="0.25"/>
      <circle cx="40" cy="40" r="20" stroke="#ec4899" strokeWidth="0.3" opacity="0.15" strokeDasharray="2 2"/>
      <circle cx="25" cy="30" r="0.4" fill="#ec4899" opacity="0.4"/>
      <circle cx="55" cy="35" r="0.3" fill="#ec4899" opacity="0.5"/>
      <circle cx="30" cy="52" r="0.4" fill="#ec4899" opacity="0.3"/>
      <circle cx="50" cy="50" r="0.3" fill="#ec4899" opacity="0.4"/>
      <circle cx="40" cy="40" r="3" fill="#ec4899" opacity="0.8"/>
      <defs><radialGradient id="aaPat"><stop stopColor="#ec4899" stopOpacity="0.25"/><stop offset="1" stopColor="#ec4899" stopOpacity="0"/></radialGradient></defs>
    </svg>
  );
}

export function SpiralPattern({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="35" fill="url(#spPat)" className="spray-animated"/>
      <circle cx="40" cy="40" r="35" stroke="#14b8a6" strokeWidth="0.5" opacity="0.3"/>
      <path d="M40 40 Q50 30 50 40 Q50 50 40 50 Q30 50 30 40 Q30 30 40 25 Q55 25 55 40 Q55 55 40 55 Q25 55 25 40" stroke="#14b8a6" strokeWidth="0.5" opacity="0.2" fill="none"/>
      <circle cx="40" cy="40" r="3" fill="#14b8a6" opacity="0.8"/>
      <defs><radialGradient id="spPat"><stop stopColor="#14b8a6" stopOpacity="0.25"/><stop offset="1" stopColor="#14b8a6" stopOpacity="0"/></radialGradient></defs>
    </svg>
  );
}

export function DeflectionPattern({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="40" rx="38" ry="12" fill="url(#dfPat)" className="spray-animated"/>
      <ellipse cx="40" cy="40" rx="38" ry="12" stroke="#f97316" strokeWidth="0.5" opacity="0.35"/>
      <ellipse cx="40" cy="40" rx="28" ry="8" stroke="#f97316" strokeWidth="0.3" opacity="0.2" strokeDasharray="2 2"/>
      <circle cx="40" cy="40" r="3" fill="#f97316" opacity="0.8"/>
      <defs><radialGradient id="dfPat"><stop stopColor="#f97316" stopOpacity="0.25"/><stop offset="1" stopColor="#f97316" stopOpacity="0"/></radialGradient></defs>
    </svg>
  );
}

export function UltrasonicPattern({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="35" fill="url(#usPat)" className="spray-animated"/>
      <circle cx="40" cy="40" r="28" stroke="#a855f7" strokeWidth="0.3" opacity="0.1" strokeDasharray="1 2"/>
      <circle cx="40" cy="40" r="18" stroke="#a855f7" strokeWidth="0.3" opacity="0.15" strokeDasharray="1 2"/>
      <circle cx="28" cy="32" r="0.3" fill="#a855f7" opacity="0.4"/>
      <circle cx="52" cy="36" r="0.3" fill="#a855f7" opacity="0.3"/>
      <circle cx="35" cy="50" r="0.3" fill="#a855f7" opacity="0.3"/>
      <circle cx="48" cy="48" r="0.3" fill="#a855f7" opacity="0.4"/>
      <circle cx="40" cy="40" r="3" fill="#a855f7" opacity="0.8"/>
      <defs><radialGradient id="usPat"><stop stopColor="#a855f7" stopOpacity="0.12"/><stop offset="1" stopColor="#a855f7" stopOpacity="0"/></radialGradient></defs>
    </svg>
  );
}

export function MultiOrificePattern({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="32" fill="url(#moPat)" className="spray-animated"/>
      {/* 8 sub-circles for the 8 orifice footprints */}
      <circle cx="40" cy="28" r="8" fill="#0ea5e9" opacity="0.08"/>
      <circle cx="48" cy="30" r="8" fill="#0ea5e9" opacity="0.08"/>
      <circle cx="50" cy="40" r="8" fill="#0ea5e9" opacity="0.08"/>
      <circle cx="48" cy="50" r="8" fill="#0ea5e9" opacity="0.08"/>
      <circle cx="40" cy="52" r="8" fill="#0ea5e9" opacity="0.08"/>
      <circle cx="32" cy="50" r="8" fill="#0ea5e9" opacity="0.08"/>
      <circle cx="30" cy="40" r="8" fill="#0ea5e9" opacity="0.08"/>
      <circle cx="32" cy="30" r="8" fill="#0ea5e9" opacity="0.08"/>
      <circle cx="40" cy="40" r="3" fill="#0ea5e9" opacity="0.8"/>
      <defs><radialGradient id="moPat"><stop stopColor="#0ea5e9" stopOpacity="0.2"/><stop offset="1" stopColor="#0ea5e9" stopOpacity="0"/></radialGradient></defs>
    </svg>
  );
}

export function AdjustableConePattern({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="35" fill="url(#acPat)" className="spray-animated"/>
      <circle cx="40" cy="40" r="35" stroke="#22d3ee" strokeWidth="0.5" opacity="0.25"/>
      {/* Ghost inner ring showing adjustability */}
      <circle cx="40" cy="40" r="18" stroke="#22d3ee" strokeWidth="0.5" opacity="0.15" strokeDasharray="3 3"/>
      <circle cx="40" cy="40" r="8" stroke="#22d3ee" strokeWidth="0.5" opacity="0.1" strokeDasharray="3 3"/>
      <circle cx="40" cy="40" r="3" fill="#22d3ee" opacity="0.8"/>
      <defs><radialGradient id="acPat"><stop stopColor="#22d3ee" stopOpacity="0.25"/><stop offset="1" stopColor="#22d3ee" stopOpacity="0"/></radialGradient></defs>
    </svg>
  );
}

export function ImpingementPattern({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="40" rx="38" ry="10" fill="url(#imPat)" className="spray-animated"/>
      <ellipse cx="40" cy="40" rx="38" ry="10" stroke="#f43f5e" strokeWidth="0.5" opacity="0.35"/>
      {/* Two impact points */}
      <circle cx="35" cy="40" r="2" fill="#f43f5e" opacity="0.2"/>
      <circle cx="45" cy="40" r="2" fill="#f43f5e" opacity="0.2"/>
      <circle cx="40" cy="40" r="3" fill="#f43f5e" opacity="0.8"/>
      <defs><radialGradient id="imPat"><stop stopColor="#f43f5e" stopOpacity="0.25"/><stop offset="1" stopColor="#f43f5e" stopOpacity="0"/></radialGradient></defs>
    </svg>
  );
}

// ---- MAPPING FUNCTIONS ----

export function ActuatorIllustration({ type, size = 120 }: { type: string; size?: number }) {
  switch (type) {
    case "full_cone": return <FullConeNozzle size={size} />;
    case "hollow_cone": return <HollowConeNozzle size={size} />;
    case "flat_fan": return <FlatFanNozzle size={size} />;
    case "fine_mist": return <FineMistActuator size={size} />;
    case "jet_stream": return <JetStreamNozzle size={size} />;
    case "air_atomizing": return <AirAtomizingNozzle size={size} />;
    case "spiral": return <SpiralNozzle size={size} />;
    case "deflection": return <DeflectionNozzle size={size} />;
    case "ultrasonic": return <UltrasonicAtomizer size={size} />;
    case "multi_orifice": return <MultiOrificeCluster size={size} />;
    case "adjustable_cone": return <AdjustableConeNozzle size={size} />;
    case "impingement": return <ImpingementNozzle size={size} />;
    default: return <FullConeNozzle size={size} />;
  }
}

export function SprayPatternIllustration({ type, size = 80 }: { type: string; size?: number }) {
  switch (type) {
    case "full_cone": return <FullConePattern size={size} />;
    case "hollow_cone": return <HollowConePattern size={size} />;
    case "flat_fan": return <FlatFanPattern size={size} />;
    case "fine_mist": return <FineMistPattern size={size} />;
    case "jet_stream": return <JetStreamPattern size={size} />;
    case "air_atomizing": return <AirAtomizingPattern size={size} />;
    case "spiral": return <SpiralPattern size={size} />;
    case "deflection": return <DeflectionPattern size={size} />;
    case "ultrasonic": return <UltrasonicPattern size={size} />;
    case "multi_orifice": return <MultiOrificePattern size={size} />;
    case "adjustable_cone": return <AdjustableConePattern size={size} />;
    case "impingement": return <ImpingementPattern size={size} />;
    default: return <FullConePattern size={size} />;
  }
}

// Color map for actuator types
export const ACTUATOR_COLORS: Record<string, string> = {
  full_cone: "#06b6d4",
  hollow_cone: "#8b5cf6",
  flat_fan: "#10b981",
  fine_mist: "#f59e0b",
  jet_stream: "#ef4444",
  air_atomizing: "#ec4899",
  spiral: "#14b8a6",
  deflection: "#f97316",
  ultrasonic: "#a855f7",
  multi_orifice: "#0ea5e9",
  adjustable_cone: "#22d3ee",
  impingement: "#f43f5e",
};