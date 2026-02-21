"use client";

import type { TechnicalDesign, Actuator, ProductCategory } from "@/lib/data";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/data";

// Engineering cross-section diagram — SVG schematic showing internal geometry
export function CrossSectionDiagram({ actuator }: { actuator: Actuator }) {
  const td = actuator.technicalDesign;
  const color = actuator.manufacturer === "Coster" ? "#ec4899" : "#06b6d4";
  const hasSwirlChannels = td.swirlChannels > 0;
  const isAerosol = ["aerosol_actuator", "aerosol_valve", "spray_pump", "perfumery_pump", "dispenser"].includes(actuator.productCategory);

  return (
    <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[240px]">
      {/* Background grid */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`vg${i}`} x1={i * 20} y1="0" x2={i * 20} y2="180" stroke={color} strokeWidth="0.2" opacity="0.08" />
      ))}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`hg${i}`} x1="0" y1={i * 20} x2="240" y2={i * 20} stroke={color} strokeWidth="0.2" opacity="0.08" />
      ))}

      {/* Body outline — cross-section */}
      <rect x="70" y="20" width="100" height="80" rx="3" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />

      {/* Section hatch (material) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`h${i}`} x1="72" y1={24 + i * 10} x2="168" y2={24 + i * 10} stroke={color} strokeWidth="0.3" opacity="0.1" />
      ))}

      {/* Connection / inlet */}
      {isAerosol ? (
        <>
          {/* Aerosol stem inlet from top */}
          <rect x="112" y="2" width="16" height="22" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
          <line x1="120" y1="2" x2="120" y2="24" stroke={color} strokeWidth="0.5" strokeDasharray="2 1" opacity="0.4" />
          <text x="135" y="14" fill={color} fontSize="6" opacity="0.5">STEM</text>
        </>
      ) : (
        <>
          {/* Pipe inlet from left */}
          <rect x="30" y="48" width="42" height="16" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
          <path d="M30 56 L70 56" stroke={color} strokeWidth="0.5" strokeDasharray="2 1" opacity="0.4" />
          <text x="34" y="45" fill={color} fontSize="6" opacity="0.5">INLET</text>
        </>
      )}

      {/* Swirl chamber */}
      {hasSwirlChannels && (
        <>
          <circle cx="120" cy="58" r="16" fill="none" stroke={color} strokeWidth="1" opacity="0.4" strokeDasharray="3 2" />
          {Array.from({ length: td.swirlChannels }).map((_, i) => {
            const angle = (i * 360 / td.swirlChannels) * Math.PI / 180;
            const x1 = 120 + Math.cos(angle) * 16;
            const y1 = 58 + Math.sin(angle) * 16;
            const x2 = 120 + Math.cos(angle) * 10;
            const y2 = 58 + Math.sin(angle) * 10;
            return (
              <line key={`sw${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.8" opacity="0.4" />
            );
          })}
          <text x="143" y="48" fill={color} fontSize="5" opacity="0.4">{td.swirlChannels}× SWIRL</text>
        </>
      )}

      {/* Orifice exit */}
      <rect x="114" y="96" width="12" height="8" fill={color} opacity="0.15" stroke={color} strokeWidth="1" />
      {td.orificeGeometry === "elliptical" ? (
        <ellipse cx="120" cy="100" rx="4" ry="2" fill="none" stroke={color} strokeWidth="1.5" />
      ) : td.orificeGeometry === "multi_hole" ? (
        <>
          {Array.from({ length: Math.min(td.orificeCount, 6) }).map((_, i) => {
            const angle = (i * 360 / Math.min(td.orificeCount, 6)) * Math.PI / 180;
            const cx = 120 + Math.cos(angle) * 3;
            const cy = 100 + Math.sin(angle) * 3;
            return <circle key={`o${i}`} cx={cx} cy={cy} r="0.8" fill={color} opacity="0.6" />;
          })}
        </>
      ) : td.orificeGeometry === "mesh" ? (
        <>
          <line x1="116" y1="99" x2="124" y2="99" stroke={color} strokeWidth="0.3" opacity="0.4" />
          <line x1="116" y1="101" x2="124" y2="101" stroke={color} strokeWidth="0.3" opacity="0.4" />
          <line x1="118" y1="97" x2="118" y2="103" stroke={color} strokeWidth="0.3" opacity="0.4" />
          <line x1="122" y1="97" x2="122" y2="103" stroke={color} strokeWidth="0.3" opacity="0.4" />
        </>
      ) : (
        <circle cx="120" cy="100" r="2.5" fill="none" stroke={color} strokeWidth="1.5" />
      )}
      <text x="130" y="102" fill={color} fontSize="5" opacity="0.5">Ø{actuator.orificeDiameter_mm}mm</text>

      {/* Spray exit indication */}
      <path d={`M116 106 L${120 - actuator.swirlChamberAngle_deg / 5} 170`} stroke={color} strokeWidth="0.5" opacity="0.2" strokeDasharray="3 2" />
      <path d={`M124 106 L${120 + actuator.swirlChamberAngle_deg / 5} 170`} stroke={color} strokeWidth="0.5" opacity="0.2" strokeDasharray="3 2" />

      {/* Dimension lines */}
      {/* Body width */}
      <line x1="70" y1="110" x2="170" y2="110" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="70" y1="108" x2="70" y2="112" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="170" y1="108" x2="170" y2="112" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <text x="105" y="118" fill={color} fontSize="6" opacity="0.4" textAnchor="middle">Ø{td.bodyDiameter_mm}mm</text>

      {/* Body height */}
      <line x1="178" y1="20" x2="178" y2="100" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="176" y1="20" x2="180" y2="20" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="176" y1="100" x2="180" y2="100" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <text x="192" y="64" fill={color} fontSize="6" opacity="0.4" textAnchor="middle">{td.bodyLength_mm}mm</text>

      {/* Flow arrow */}
      <path d="M120 30 L120 95" stroke={color} strokeWidth="0.8" opacity="0.25" strokeDasharray="2 2" />
      <path d="M117 90 L120 96 L123 90" fill={color} opacity="0.25" />

      {/* Title */}
      <text x="4" y="175" fill={color} fontSize="6" fontFamily="monospace" opacity="0.5">
        {actuator.sku} — CROSS SECTION
      </text>
    </svg>
  );
}

// Flow path diagram — simplified linear flow
export function FlowPathDiagram({ design, color = "#06b6d4" }: { design: TechnicalDesign; color?: string }) {
  const steps = design.flowPathDescription.split(" → ");
  return (
    <div className="flex flex-wrap items-center gap-1">
      {steps.map((step, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && (
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M0 4h8M6 1l3 3-3 3" stroke={color} strokeWidth="1" opacity="0.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <span
            className="rounded border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px]"
            style={{ borderColor: `${color}30`, color }}
          >
            {step}
          </span>
        </span>
      ))}
    </div>
  );
}

// Full technical design panel
export function TechnicalDesignPanel({ actuator }: { actuator: Actuator }) {
  const td = actuator.technicalDesign;
  const color = actuator.manufacturer === "Coster" ? "#ec4899" : "#06b6d4";
  const isCoster = actuator.manufacturer === "Coster";

  return (
    <div className="space-y-6">
      {/* Manufacturer badge */}
      <div className="flex items-center gap-3">
        <span
          className="rounded-md border px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider"
          style={{ borderColor: `${color}50`, color, backgroundColor: `${color}08` }}
        >
          {isCoster ? "COSTER GROUP" : "SPENCER"}
        </span>
        <span className="rounded-md border border-[var(--border)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--muted)]">
          {PRODUCT_CATEGORY_LABELS[actuator.productCategory]}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cross-section diagram */}
        <div className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
          <p className="mb-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
            Engineering Cross-Section
          </p>
          <CrossSectionDiagram actuator={actuator} />
        </div>

        {/* Specs grid */}
        <div className="space-y-4">
          {/* Physical dimensions */}
          <div>
            <h4 className="mb-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
              Physical Dimensions
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
              <Spec label="Body Ø" value={`${td.bodyDiameter_mm} mm`} />
              <Spec label="Body Length" value={`${td.bodyLength_mm} mm`} />
              <Spec label="Weight" value={`${td.weight_g} g`} />
              <Spec label="Connection" value={td.connectionType} />
              {td.stemDiameter_mm && <Spec label="Stem Ø" value={`${td.stemDiameter_mm} mm`} />}
              {td.neckSize_mm && <Spec label="Neck Size" value={`${td.neckSize_mm} mm`} />}
            </div>
          </div>

          {/* Internal geometry */}
          <div>
            <h4 className="mb-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
              Internal Geometry
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
              <Spec label="Swirl Channels" value={td.swirlChannels === 0 ? "None (straight)" : String(td.swirlChannels)} />
              {td.swirlChannelWidth_mm && <Spec label="Channel Width" value={`${td.swirlChannelWidth_mm} mm`} />}
              {td.chamberDiameter_mm && <Spec label="Chamber Ø" value={`${td.chamberDiameter_mm} mm`} />}
              {td.chamberDepth_mm && <Spec label="Chamber Depth" value={`${td.chamberDepth_mm} mm`} />}
              <Spec label="Inlet Ø" value={`${td.inletDiameter_mm} mm`} />
              <Spec label="Orifice Type" value={td.orificeGeometry} />
              <Spec label="Orifice Count" value={String(td.orificeCount)} />
              {td.internalVolume_uL && <Spec label="Dead Volume" value={`${td.internalVolume_uL} µL`} />}
              {td.dosage_uL && <Spec label="Metered Dose" value={`${td.dosage_uL} µL`} />}
              {td.surfaceFinish_Ra_um && <Spec label="Surface Ra" value={`${td.surfaceFinish_Ra_um} µm`} />}
            </div>
          </div>

          {/* Materials */}
          <div>
            <h4 className="mb-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
              Materials of Construction
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
              <Spec label="Body" value={td.bodyMaterial} />
              <Spec label="Seal" value={td.sealMaterial} />
              {td.springMaterial && <Spec label="Spring" value={td.springMaterial} />}
              {td.insertMaterial && <Spec label="Insert" value={td.insertMaterial} />}
            </div>
          </div>
        </div>
      </div>

      {/* Flow path */}
      <div>
        <h4 className="mb-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
          Flow Path
        </h4>
        <FlowPathDiagram design={td} color={color} />
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[var(--muted)]">{label}</span>
      <p className="mt-0.5 font-semibold text-[var(--fg-bright)]">{value}</p>
    </div>
  );
}
