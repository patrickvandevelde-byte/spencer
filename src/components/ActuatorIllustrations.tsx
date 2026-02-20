// SVG illustrations for each actuator type and their spray patterns

export function FullConeNozzle({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Nozzle body */}
      <rect x="48" y="8" width="24" height="20" rx="2" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.5"/>
      <rect x="44" y="24" width="32" height="12" rx="2" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.5"/>
      <path d="M52 36 L56 42 L64 42 L68 36" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5"/>
      {/* Orifice detail */}
      <circle cx="60" cy="18" r="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="1"/>
      <line x1="58" y1="18" x2="62" y2="18" stroke="#06b6d4" strokeWidth="0.5"/>
      {/* Swirl chamber lines */}
      <line x1="50" y1="28" x2="54" y2="32" stroke="#06b6d4" strokeWidth="0.5" opacity="0.5"/>
      <line x1="70" y1="28" x2="66" y2="32" stroke="#06b6d4" strokeWidth="0.5" opacity="0.5"/>
      {/* Full cone spray pattern */}
      <path d="M58 44 L30 110 L90 110 L62 44" fill="url(#fullConeGrad)" className="spray-animated"/>
      {/* Spray droplets */}
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
          <stop stopColor="#06b6d4" stopOpacity="0.3"/>
          <stop offset="1" stopColor="#06b6d4" stopOpacity="0.02"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function HollowConeNozzle({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Nozzle body */}
      <rect x="48" y="8" width="24" height="18" rx="2" fill="#1e293b" stroke="#8b5cf6" strokeWidth="1.5"/>
      <rect x="46" y="22" width="28" height="10" rx="2" fill="#1e293b" stroke="#8b5cf6" strokeWidth="1.5"/>
      <path d="M52 32 L55 38 L65 38 L68 32" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.5"/>
      {/* Orifice */}
      <circle cx="60" cy="17" r="3" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1"/>
      {/* Swirl detail */}
      <path d="M52 26 Q56 28 54 30" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.5" fill="none"/>
      <path d="M68 26 Q64 28 66 30" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.5" fill="none"/>
      {/* Hollow cone spray — outer ring only */}
      <path d="M57 40 L28 108" stroke="#8b5cf6" strokeWidth="2" opacity="0.4" className="spray-animated"/>
      <path d="M63 40 L92 108" stroke="#8b5cf6" strokeWidth="2" opacity="0.4" className="spray-animated"/>
      <path d="M57 40 L42 108" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.25"/>
      <path d="M63 40 L78 108" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.25"/>
      {/* Hollow center */}
      <ellipse cx="60" cy="108" rx="32" ry="4" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.3"/>
      <ellipse cx="60" cy="108" rx="18" ry="2.5" fill="none" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.15" strokeDasharray="2 2"/>
      {/* Spray droplets on edges */}
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
      {/* Nozzle body */}
      <rect x="48" y="8" width="24" height="22" rx="2" fill="#1e293b" stroke="#10b981" strokeWidth="1.5"/>
      <rect x="44" y="26" width="32" height="8" rx="1" fill="#1e293b" stroke="#10b981" strokeWidth="1.5"/>
      {/* Flat slot orifice */}
      <rect x="50" y="34" width="20" height="4" rx="1" fill="#0f172a" stroke="#10b981" strokeWidth="1.5"/>
      <line x1="52" y1="36" x2="68" y2="36" stroke="#10b981" strokeWidth="0.5" opacity="0.5"/>
      {/* Orifice detail */}
      <rect x="55" y="16" width="10" height="3" rx="1" fill="#0f172a" stroke="#10b981" strokeWidth="0.8"/>
      {/* Wide flat fan spray */}
      <path d="M54 40 L8 100 L112 100 L66 40" fill="url(#flatFanGrad)" className="spray-animated"/>
      {/* Fan edge lines */}
      <line x1="54" y1="40" x2="8" y2="100" stroke="#10b981" strokeWidth="1" opacity="0.3"/>
      <line x1="66" y1="40" x2="112" y2="100" stroke="#10b981" strokeWidth="1" opacity="0.3"/>
      {/* Spray pattern lines */}
      <line x1="58" y1="40" x2="30" y2="100" stroke="#10b981" strokeWidth="0.5" opacity="0.15"/>
      <line x1="60" y1="40" x2="60" y2="100" stroke="#10b981" strokeWidth="0.5" opacity="0.15"/>
      <line x1="62" y1="40" x2="90" y2="100" stroke="#10b981" strokeWidth="0.5" opacity="0.15"/>
      {/* Droplets */}
      <circle cx="20" cy="90" r="1" fill="#10b981" opacity="0.4"/>
      <circle cx="40" cy="85" r="0.8" fill="#10b981" opacity="0.5"/>
      <circle cx="60" cy="75" r="1" fill="#10b981" opacity="0.6"/>
      <circle cx="80" cy="82" r="0.8" fill="#10b981" opacity="0.5"/>
      <circle cx="100" cy="92" r="1" fill="#10b981" opacity="0.4"/>
      <defs>
        <linearGradient id="flatFanGrad" x1="60" y1="40" x2="60" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" stopOpacity="0.2"/>
          <stop offset="1" stopColor="#10b981" stopOpacity="0.01"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FineMistActuator({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Nozzle body — slimmer for fine mist */}
      <rect x="52" y="6" width="16" height="16" rx="2" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5"/>
      <rect x="50" y="18" width="20" height="10" rx="2" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5"/>
      <path d="M54 28 L56 34 L64 34 L66 28" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5"/>
      {/* Tiny orifice */}
      <circle cx="60" cy="14" r="2" fill="#0f172a" stroke="#f59e0b" strokeWidth="0.8"/>
      {/* Fine mist cloud spray */}
      <ellipse cx="60" cy="60" rx="20" ry="16" fill="url(#mistGrad1)" className="spray-animated"/>
      <ellipse cx="60" cy="75" rx="28" ry="18" fill="url(#mistGrad2)" className="spray-animated" style={{animationDelay: "0.5s"}}/>
      <ellipse cx="60" cy="92" rx="34" ry="20" fill="url(#mistGrad3)" className="spray-animated" style={{animationDelay: "1s"}}/>
      {/* Fine mist particles */}
      <circle cx="45" cy="65" r="0.6" fill="#f59e0b" opacity="0.6"/>
      <circle cx="75" cy="68" r="0.5" fill="#f59e0b" opacity="0.5"/>
      <circle cx="50" cy="78" r="0.7" fill="#f59e0b" opacity="0.4"/>
      <circle cx="70" cy="75" r="0.5" fill="#f59e0b" opacity="0.6"/>
      <circle cx="55" cy="88" r="0.6" fill="#f59e0b" opacity="0.3"/>
      <circle cx="65" cy="85" r="0.5" fill="#f59e0b" opacity="0.5"/>
      <circle cx="40" cy="90" r="0.5" fill="#f59e0b" opacity="0.3"/>
      <circle cx="80" cy="88" r="0.6" fill="#f59e0b" opacity="0.3"/>
      <circle cx="58" cy="72" r="0.4" fill="#f59e0b" opacity="0.7"/>
      <circle cx="62" cy="55" r="0.5" fill="#f59e0b" opacity="0.6"/>
      <circle cx="52" cy="98" r="0.5" fill="#f59e0b" opacity="0.2"/>
      <circle cx="68" cy="96" r="0.4" fill="#f59e0b" opacity="0.3"/>
      <defs>
        <radialGradient id="mistGrad1" cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="#f59e0b" stopOpacity="0.15"/>
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="mistGrad2" cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="#f59e0b" stopOpacity="0.1"/>
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="mistGrad3" cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="#f59e0b" stopOpacity="0.06"/>
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0"/>
        </radialGradient>
      </defs>
    </svg>
  );
}

export function JetStreamNozzle({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Nozzle body — larger bore */}
      <rect x="46" y="6" width="28" height="20" rx="2" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5"/>
      <rect x="44" y="22" width="32" height="10" rx="2" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5"/>
      <path d="M50 32 L52 38 L68 38 L70 32" fill="#0f172a" stroke="#ef4444" strokeWidth="1.5"/>
      {/* Large orifice */}
      <circle cx="60" cy="16" r="5" fill="#0f172a" stroke="#ef4444" strokeWidth="1"/>
      <circle cx="60" cy="16" r="2" fill="#ef4444" opacity="0.2"/>
      {/* Jet stream — tight focused beam */}
      <rect x="56" y="40" width="8" height="70" rx="4" fill="url(#jetGrad)" className="spray-animated"/>
      <line x1="60" y1="40" x2="60" y2="112" stroke="#ef4444" strokeWidth="2" opacity="0.3"/>
      {/* Velocity lines */}
      <line x1="57" y1="50" x2="57" y2="65" stroke="#ef4444" strokeWidth="0.5" opacity="0.4"/>
      <line x1="63" y1="48" x2="63" y2="60" stroke="#ef4444" strokeWidth="0.5" opacity="0.4"/>
      <line x1="57" y1="75" x2="57" y2="90" stroke="#ef4444" strokeWidth="0.5" opacity="0.3"/>
      <line x1="63" y1="72" x2="63" y2="85" stroke="#ef4444" strokeWidth="0.5" opacity="0.3"/>
      {/* Impact splash at bottom */}
      <path d="M50 108 Q55 104 60 108 Q65 104 70 108" stroke="#ef4444" strokeWidth="1" opacity="0.3" fill="none"/>
      <circle cx="52" cy="106" r="0.8" fill="#ef4444" opacity="0.4"/>
      <circle cx="68" cy="107" r="0.6" fill="#ef4444" opacity="0.3"/>
      <defs>
        <linearGradient id="jetGrad" x1="60" y1="40" x2="60" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ef4444" stopOpacity="0.35"/>
          <stop offset="0.5" stopColor="#ef4444" stopOpacity="0.2"/>
          <stop offset="1" stopColor="#ef4444" stopOpacity="0.05"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// Spray pattern top-down views
export function FullConePattern({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="35" fill="url(#fcPat)" className="spray-animated"/>
      <circle cx="40" cy="40" r="35" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3"/>
      <circle cx="40" cy="40" r="25" stroke="#06b6d4" strokeWidth="0.3" opacity="0.2" strokeDasharray="2 2"/>
      <circle cx="40" cy="40" r="15" stroke="#06b6d4" strokeWidth="0.3" opacity="0.15" strokeDasharray="2 2"/>
      <circle cx="40" cy="40" r="3" fill="#06b6d4" opacity="0.8"/>
      <defs>
        <radialGradient id="fcPat"><stop stopColor="#06b6d4" stopOpacity="0.3"/><stop offset="1" stopColor="#06b6d4" stopOpacity="0"/></radialGradient>
      </defs>
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
      <defs>
        <radialGradient id="hcPat"><stop stopColor="transparent"/><stop offset="0.7" stopColor="transparent"/><stop offset="0.85" stopColor="#8b5cf6" stopOpacity="0.2"/><stop offset="1" stopColor="#8b5cf6" stopOpacity="0"/></radialGradient>
      </defs>
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
      <defs>
        <radialGradient id="ffPat"><stop stopColor="#10b981" stopOpacity="0.3"/><stop offset="1" stopColor="#10b981" stopOpacity="0"/></radialGradient>
      </defs>
    </svg>
  );
}

export function FineMistPattern({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="35" fill="url(#fmPat)" className="spray-animated"/>
      {/* Scattered particles */}
      {Array.from({length: 24}, (_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const r = 10 + Math.random() * 22;
        const x = 40 + Math.cos(angle) * r;
        const y = 40 + Math.sin(angle) * r;
        return <circle key={i} cx={x} cy={y} r={0.5 + Math.random() * 0.5} fill="#f59e0b" opacity={0.2 + Math.random() * 0.4}/>;
      })}
      <circle cx="40" cy="40" r="3" fill="#f59e0b" opacity="0.8"/>
      <defs>
        <radialGradient id="fmPat"><stop stopColor="#f59e0b" stopOpacity="0.15"/><stop offset="1" stopColor="#f59e0b" stopOpacity="0"/></radialGradient>
      </defs>
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
      {/* Impact ripples */}
      <circle cx="40" cy="40" r="16" stroke="#ef4444" strokeWidth="0.3" opacity="0.1"/>
      <circle cx="40" cy="40" r="22" stroke="#ef4444" strokeWidth="0.2" opacity="0.05"/>
      <defs>
        <radialGradient id="jsPat"><stop stopColor="#ef4444" stopOpacity="0.5"/><stop offset="1" stopColor="#ef4444" stopOpacity="0"/></radialGradient>
      </defs>
    </svg>
  );
}

// Map actuator type to illustration component
export function ActuatorIllustration({ type, size = 120 }: { type: string; size?: number }) {
  switch (type) {
    case "full_cone": return <FullConeNozzle size={size} />;
    case "hollow_cone": return <HollowConeNozzle size={size} />;
    case "flat_fan": return <FlatFanNozzle size={size} />;
    case "fine_mist": return <FineMistActuator size={size} />;
    case "jet_stream": return <JetStreamNozzle size={size} />;
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
};
