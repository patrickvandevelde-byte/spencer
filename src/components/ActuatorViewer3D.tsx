"use client";

import { useState, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";
import type { Actuator, ActuatorType, ProductCategory } from "@/lib/data";

// ---- Material colors by actuator body material ----
const MATERIAL_COLORS: Record<string, string> = {
  PP: "#e8e8e0",
  POM: "#d4cfc0",
  "316SS": "#b0b8c0",
  PVDF: "#c0d0d8",
  Titanium: "#a0a8b0",
  PEEK: "#c8b890",
  ceramic: "#f0ece0",
  ruby: "#c04040",
};

const SEAL_COLORS: Record<string, string> = {
  "Buna-N": "#2a2a2a",
  EPDM: "#1a1a1a",
  FKM: "#3a2a1a",
  PTFE: "#f0f0f0",
  Silicone: "#808080",
};

// Accent color for type-specific features (insert material, air cap, etc.)
const ACCENT_COLOR = "#06b6d4";
const INSERT_COLOR = "#556070";

interface ScaledDims {
  bodyDia: number;
  bodyLen: number;
  bodyR: number;
  orificeDia: number;
  orificeR: number;
  chamberDia: number;
  chamberDepth: number;
  inletDia: number;
  neckSize: number;
}

interface MatProps {
  wireframe?: boolean;
  color: string;
  roughness?: number;
  metalness?: number;
}

// ---- Nozzle type-specific geometry renderers ----

function FullConeGeometry({ d, mat, sealColor }: { d: ScaledDims; mat: MatProps; sealColor: string }) {
  return (
    <>
      {/* Main body cylinder — slight taper */}
      <mesh position={[0, d.bodyLen / 2, 0]}>
        <cylinderGeometry args={[d.bodyR, d.bodyR * 0.88, d.bodyLen, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Hex collar (connection end) */}
      <mesh position={[0, d.bodyLen * 0.95, 0]}>
        <cylinderGeometry args={[d.bodyR * 1.15, d.bodyR * 1.15, d.bodyLen * 0.12, 6]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Swirl chamber (translucent) */}
      {d.chamberDia > 0 && (
        <mesh position={[0, d.bodyLen * 0.1, 0]}>
          <cylinderGeometry args={[d.chamberDia / 2, d.chamberDia / 2, d.chamberDepth, 24]} />
          <meshStandardMaterial color="#334455" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* Converging tip taper */}
      <mesh position={[0, -d.bodyLen * 0.05, 0]}>
        <cylinderGeometry args={[d.orificeR * 3, d.bodyR * 0.88, d.bodyLen * 0.2, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Orifice ring */}
      <mesh position={[0, -d.bodyLen * 0.16, 0]}>
        <torusGeometry args={[d.orificeR * 1.5, d.orificeR * 0.4, 8, 24]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </>
  );
}

function HollowConeGeometry({ d, mat }: { d: ScaledDims; mat: MatProps }) {
  return (
    <>
      {/* Slender body */}
      <mesh position={[0, d.bodyLen / 2, 0]}>
        <cylinderGeometry args={[d.bodyR * 0.9, d.bodyR * 0.8, d.bodyLen, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Hex collar */}
      <mesh position={[0, d.bodyLen * 0.95, 0]}>
        <cylinderGeometry args={[d.bodyR * 1.1, d.bodyR * 1.1, d.bodyLen * 0.1, 6]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Elongated swirl section — taller, narrower */}
      {d.chamberDia > 0 && (
        <mesh position={[0, d.bodyLen * 0.12, 0]}>
          <cylinderGeometry args={[d.chamberDia / 2 * 0.8, d.chamberDia / 2, d.chamberDepth * 1.5, 24]} />
          <meshStandardMaterial color="#334466" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* Tangential entry ports (3 small cylinders at angle) */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * 2 * Math.PI) / 3) * d.bodyR * 0.6,
            d.bodyLen * 0.15,
            Math.sin((i * 2 * Math.PI) / 3) * d.bodyR * 0.6,
          ]}
          rotation={[0, (i * 2 * Math.PI) / 3, Math.PI / 4]}
        >
          <cylinderGeometry args={[d.orificeR * 1.5, d.orificeR * 1.5, d.bodyR * 0.6, 8]} />
          <meshStandardMaterial color={ACCENT_COLOR} transparent opacity={0.5} />
        </mesh>
      ))}
      {/* Fine converging tip */}
      <mesh position={[0, -d.bodyLen * 0.08, 0]}>
        <cylinderGeometry args={[d.orificeR * 2, d.bodyR * 0.8, d.bodyLen * 0.25, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Orifice */}
      <mesh position={[0, -d.bodyLen * 0.21, 0]}>
        <cylinderGeometry args={[d.orificeR, d.orificeR, d.bodyLen * 0.02, 16]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </>
  );
}

function FlatFanGeometry({ d, mat }: { d: ScaledDims; mat: MatProps }) {
  return (
    <>
      {/* Wide squat body */}
      <mesh position={[0, d.bodyLen / 2, 0]}>
        <cylinderGeometry args={[d.bodyR * 1.05, d.bodyR, d.bodyLen * 0.85, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Hex collar */}
      <mesh position={[0, d.bodyLen * 0.92, 0]}>
        <cylinderGeometry args={[d.bodyR * 1.2, d.bodyR * 1.2, d.bodyLen * 0.12, 6]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Elliptical slot tip — box shape to represent the slot orifice */}
      <mesh position={[0, -d.bodyLen * 0.05, 0]}>
        <boxGeometry args={[d.bodyR * 1.4, d.bodyLen * 0.15, d.bodyR * 0.5]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Slot orifice (thin dark slit) */}
      <mesh position={[0, -d.bodyLen * 0.14, 0]}>
        <boxGeometry args={[d.bodyR * 1.0, d.bodyLen * 0.015, d.orificeR * 2]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Fan spray guide lines (visual hint at spray pattern) */}
      <mesh position={[0, -d.bodyLen * 0.2, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[d.bodyR * 1.8, 0.01, 0.01]} />
        <meshStandardMaterial color={ACCENT_COLOR} transparent opacity={0.4} />
      </mesh>
    </>
  );
}

function FineMistGeometry({ d, mat, sealColor }: { d: ScaledDims; mat: MatProps; sealColor: string }) {
  return (
    <>
      {/* Compact cylindrical body */}
      <mesh position={[0, d.bodyLen * 0.3, 0]}>
        <cylinderGeometry args={[d.bodyR, d.bodyR * 0.95, d.bodyLen * 0.55, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Rounded top cap */}
      <mesh position={[0, d.bodyLen * 0.6, 0]}>
        <sphereGeometry args={[d.bodyR * 0.85, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Micro swirl insert visible at front (accent) */}
      <mesh position={[0, d.bodyLen * 0.02, 0]}>
        <cylinderGeometry args={[d.bodyR * 0.6, d.bodyR * 0.7, d.bodyLen * 0.12, 24]} />
        <meshStandardMaterial color={INSERT_COLOR} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Micro-orifice tip */}
      <mesh position={[0, -d.bodyLen * 0.08, 0]}>
        <cylinderGeometry args={[d.orificeR * 2, d.bodyR * 0.6, d.bodyLen * 0.12, 24]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Orifice */}
      <mesh position={[0, -d.bodyLen * 0.15, 0]}>
        <cylinderGeometry args={[d.orificeR, d.orificeR, 0.02, 12]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Stem socket at bottom */}
      <mesh position={[0, -d.bodyLen * 0.25, 0]}>
        <cylinderGeometry args={[d.inletDia / 2 * 1.5, d.inletDia / 2 * 1.2, d.bodyLen * 0.15, 16]} />
        <meshStandardMaterial color={sealColor} />
      </mesh>
      {/* Spring coil representation (3 torus rings) */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, d.bodyLen * 0.1 + i * d.bodyLen * 0.06, 0]}>
          <torusGeometry args={[d.bodyR * 0.35, d.orificeR * 0.8, 6, 20]} />
          <meshStandardMaterial color="#888899" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </>
  );
}

function JetStreamGeometry({ d, mat }: { d: ScaledDims; mat: MatProps }) {
  return (
    <>
      {/* Long straight body — emphasizing the elongated bore */}
      <mesh position={[0, d.bodyLen * 0.45, 0]}>
        <cylinderGeometry args={[d.bodyR, d.bodyR * 0.95, d.bodyLen * 0.8, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Heavy hex collar at top */}
      <mesh position={[0, d.bodyLen * 0.92, 0]}>
        <cylinderGeometry args={[d.bodyR * 1.2, d.bodyR * 1.2, d.bodyLen * 0.15, 6]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Long converging nozzle section */}
      <mesh position={[0, -d.bodyLen * 0.05, 0]}>
        <cylinderGeometry args={[d.orificeR * 3, d.bodyR * 0.95, d.bodyLen * 0.3, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Precision bore insert (darker accent) */}
      <mesh position={[0, d.bodyLen * 0.2, 0]}>
        <cylinderGeometry args={[d.inletDia / 2, d.orificeR * 2.5, d.bodyLen * 0.5, 16]} />
        <meshStandardMaterial color={INSERT_COLOR} transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
      {/* Sharp orifice exit */}
      <mesh position={[0, -d.bodyLen * 0.21, 0]}>
        <cylinderGeometry args={[d.orificeR, d.orificeR, d.bodyLen * 0.03, 16]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </>
  );
}

function AirAtomizingGeometry({ d, mat }: { d: ScaledDims; mat: MatProps }) {
  return (
    <>
      {/* Large main body (wider than typical) */}
      <mesh position={[0, d.bodyLen * 0.45, 0]}>
        <cylinderGeometry args={[d.bodyR, d.bodyR * 0.9, d.bodyLen * 0.65, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Hex collar */}
      <mesh position={[0, d.bodyLen * 0.85, 0]}>
        <cylinderGeometry args={[d.bodyR * 1.15, d.bodyR * 1.15, d.bodyLen * 0.1, 6]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Second inlet port (air) — cylinder on the side */}
      <mesh position={[d.bodyR * 0.7, d.bodyLen * 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[d.bodyR * 0.25, d.bodyR * 0.3, d.bodyR * 0.6, 16]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Air inlet port ring */}
      <mesh position={[d.bodyR * 1.0, d.bodyLen * 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[d.bodyR * 0.2, d.orificeR * 0.8, 8, 16]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Central liquid tube protruding down */}
      <mesh position={[0, d.bodyLen * 0.03, 0]}>
        <cylinderGeometry args={[d.orificeR * 2, d.orificeR * 2.5, d.bodyLen * 0.2, 16]} />
        <meshStandardMaterial color={INSERT_COLOR} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Air cap (dome/cone around liquid tip) — distinctive feature */}
      <mesh position={[0, -d.bodyLen * 0.1, 0]}>
        <cylinderGeometry args={[d.bodyR * 0.7, d.bodyR * 0.9, d.bodyLen * 0.15, 32]} />
        <meshStandardMaterial color={ACCENT_COLOR} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Air cap retaining ring */}
      <mesh position={[0, -d.bodyLen * 0.03, 0]}>
        <torusGeometry args={[d.bodyR * 0.85, d.bodyLen * 0.015, 8, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Annular air gap (visible) */}
      <mesh position={[0, -d.bodyLen * 0.18, 0]}>
        <torusGeometry args={[d.orificeR * 3, d.orificeR * 0.5, 8, 24]} />
        <meshStandardMaterial color="#222233" />
      </mesh>
      {/* Center orifice */}
      <mesh position={[0, -d.bodyLen * 0.19, 0]}>
        <cylinderGeometry args={[d.orificeR, d.orificeR, 0.02, 12]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </>
  );
}

function SpiralGeometry({ d, mat }: { d: ScaledDims; mat: MatProps }) {
  // Spiral nozzle: open helical ramp, no enclosed passages
  const helixSegments = 8;
  return (
    <>
      {/* Large inlet connection (threaded) */}
      <mesh position={[0, d.bodyLen * 0.85, 0]}>
        <cylinderGeometry args={[d.bodyR * 1.1, d.bodyR * 1.1, d.bodyLen * 0.2, 6]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Central post */}
      <mesh position={[0, d.bodyLen * 0.35, 0]}>
        <cylinderGeometry args={[d.bodyR * 0.3, d.bodyR * 0.35, d.bodyLen * 0.7, 16]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Helical ramp segments (torus sections arranged in spiral) */}
      {Array.from({ length: helixSegments }).map((_, i) => {
        const angle = (i / helixSegments) * Math.PI * 2.5;
        const y = d.bodyLen * 0.65 - (i / helixSegments) * d.bodyLen * 0.7;
        const radius = d.bodyR * (0.6 + (i / helixSegments) * 0.3);
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius * 0.5, y, Math.sin(angle) * radius * 0.5]}
            rotation={[0, -angle, Math.PI / 6]}
          >
            <boxGeometry args={[d.bodyR * 0.5, d.bodyLen * 0.04, d.bodyR * 0.25]} />
            <meshStandardMaterial {...mat} />
          </mesh>
        );
      })}
      {/* Outer spiral guide ring (visual) */}
      <mesh position={[0, d.bodyLen * 0.3, 0]}>
        <torusGeometry args={[d.bodyR * 0.85, d.bodyR * 0.08, 8, 32]} />
        <meshStandardMaterial {...mat} transparent opacity={0.6} />
      </mesh>
      {/* Bottom exit edge */}
      <mesh position={[0, -d.bodyLen * 0.08, 0]}>
        <torusGeometry args={[d.bodyR * 0.7, d.bodyR * 0.05, 8, 32]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
    </>
  );
}

function DeflectionGeometry({ d, mat }: { d: ScaledDims; mat: MatProps }) {
  return (
    <>
      {/* Cylindrical body */}
      <mesh position={[0, d.bodyLen / 2, 0]}>
        <cylinderGeometry args={[d.bodyR, d.bodyR * 0.95, d.bodyLen * 0.8, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Hex collar */}
      <mesh position={[0, d.bodyLen * 0.9, 0]}>
        <cylinderGeometry args={[d.bodyR * 1.15, d.bodyR * 1.15, d.bodyLen * 0.1, 6]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Straight bore exit */}
      <mesh position={[0, d.bodyLen * 0.02, 0]}>
        <cylinderGeometry args={[d.orificeR * 2.5, d.bodyR * 0.95, d.bodyLen * 0.15, 24]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Orifice */}
      <mesh position={[0, -d.bodyLen * 0.06, 0]}>
        <cylinderGeometry args={[d.orificeR, d.orificeR, 0.03, 12]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* DEFLECTION PLATE — the distinctive feature */}
      <mesh position={[0, -d.bodyLen * 0.18, 0]} rotation={[Math.PI / 7, 0, 0]}>
        <cylinderGeometry args={[d.bodyR * 1.1, d.bodyR * 1.1, d.bodyLen * 0.03, 32]} />
        <meshStandardMaterial {...mat} metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Plate support arm */}
      <mesh position={[0, -d.bodyLen * 0.1, -d.bodyR * 0.3]}>
        <boxGeometry args={[d.bodyR * 0.15, d.bodyLen * 0.15, d.bodyR * 0.15]} />
        <meshStandardMaterial {...mat} />
      </mesh>
    </>
  );
}

function UltrasonicGeometry({ d, mat }: { d: ScaledDims; mat: MatProps }) {
  // Long stepped horn shape with piezo element
  return (
    <>
      {/* Luer-lock fitting at top (narrow inlet) */}
      <mesh position={[0, d.bodyLen * 0.95, 0]}>
        <cylinderGeometry args={[d.bodyR * 0.25, d.bodyR * 0.35, d.bodyLen * 0.08, 16]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Upper housing (wider, holds piezo) */}
      <mesh position={[0, d.bodyLen * 0.75, 0]}>
        <cylinderGeometry args={[d.bodyR, d.bodyR, d.bodyLen * 0.3, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Piezo element ring — accent color */}
      <mesh position={[0, d.bodyLen * 0.58, 0]}>
        <torusGeometry args={[d.bodyR * 0.85, d.bodyR * 0.08, 12, 32]} />
        <meshStandardMaterial color={ACCENT_COLOR} metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Step-down transition */}
      <mesh position={[0, d.bodyLen * 0.52, 0]}>
        <cylinderGeometry args={[d.bodyR * 0.6, d.bodyR, d.bodyLen * 0.08, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Mid horn section (narrower) */}
      <mesh position={[0, d.bodyLen * 0.3, 0]}>
        <cylinderGeometry args={[d.bodyR * 0.55, d.bodyR * 0.6, d.bodyLen * 0.35, 24]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Second step-down */}
      <mesh position={[0, d.bodyLen * 0.1, 0]}>
        <cylinderGeometry args={[d.bodyR * 0.35, d.bodyR * 0.55, d.bodyLen * 0.06, 24]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Horn tip (narrow, tapered) */}
      <mesh position={[0, -d.bodyLen * 0.08, 0]}>
        <cylinderGeometry args={[d.bodyR * 0.15, d.bodyR * 0.35, d.bodyLen * 0.3, 24]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Atomizing surface at tip */}
      <mesh position={[0, -d.bodyLen * 0.24, 0]}>
        <sphereGeometry args={[d.bodyR * 0.18, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color={ACCENT_COLOR} metalness={0.8} roughness={0.1} />
      </mesh>
      {/* BNC connector on side */}
      <mesh position={[d.bodyR * 0.8, d.bodyLen * 0.7, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[d.bodyR * 0.12, d.bodyR * 0.15, d.bodyR * 0.4, 12]} />
        <meshStandardMaterial color="#444444" metalness={0.7} roughness={0.3} />
      </mesh>
    </>
  );
}

function MultiOrificeGeometry({ d, mat }: { d: ScaledDims; mat: MatProps }) {
  const orificeCount = 8;
  return (
    <>
      {/* Body */}
      <mesh position={[0, d.bodyLen / 2, 0]}>
        <cylinderGeometry args={[d.bodyR, d.bodyR * 0.9, d.bodyLen, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Hex collar */}
      <mesh position={[0, d.bodyLen * 0.95, 0]}>
        <cylinderGeometry args={[d.bodyR * 1.15, d.bodyR * 1.15, d.bodyLen * 0.12, 6]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Wide flat face plate */}
      <mesh position={[0, -d.bodyLen * 0.08, 0]}>
        <cylinderGeometry args={[d.bodyR * 0.95, d.bodyR * 0.9, d.bodyLen * 0.08, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Ring of 8 orifice holes */}
      {Array.from({ length: orificeCount }).map((_, i) => {
        const angle = (i / orificeCount) * Math.PI * 2;
        const r = d.bodyR * 0.55;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, -d.bodyLen * 0.13, Math.sin(angle) * r]}
          >
            <cylinderGeometry args={[d.orificeR * 1.2, d.orificeR * 1.2, d.bodyLen * 0.03, 8]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
        );
      })}
      {/* Central plenum (translucent) */}
      <mesh position={[0, d.bodyLen * 0.15, 0]}>
        <cylinderGeometry args={[d.bodyR * 0.5, d.bodyR * 0.5, d.bodyLen * 0.3, 24]} />
        <meshStandardMaterial color="#334455" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      {/* Ceramic insert disc */}
      <mesh position={[0, -d.bodyLen * 0.03, 0]}>
        <cylinderGeometry args={[d.bodyR * 0.75, d.bodyR * 0.75, d.bodyLen * 0.03, 32]} />
        <meshStandardMaterial color={INSERT_COLOR} metalness={0.3} roughness={0.5} />
      </mesh>
    </>
  );
}

function AdjustableConeGeometry({ d, mat }: { d: ScaledDims; mat: MatProps }) {
  return (
    <>
      {/* Longer body */}
      <mesh position={[0, d.bodyLen * 0.45, 0]}>
        <cylinderGeometry args={[d.bodyR, d.bodyR * 0.92, d.bodyLen * 0.75, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Hex collar at top */}
      <mesh position={[0, d.bodyLen * 0.9, 0]}>
        <cylinderGeometry args={[d.bodyR * 1.15, d.bodyR * 1.15, d.bodyLen * 0.1, 6]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* KNURLED ADJUSTMENT COLLAR — distinctive feature */}
      <mesh position={[0, d.bodyLen * 0.55, 0]}>
        <cylinderGeometry args={[d.bodyR * 1.08, d.bodyR * 1.08, d.bodyLen * 0.12, 24]} />
        <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.6} />
      </mesh>
      {/* Knurl texture rings */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, d.bodyLen * 0.51 + i * d.bodyLen * 0.025, 0]}>
          <torusGeometry args={[d.bodyR * 1.09, d.bodyLen * 0.004, 6, 32]} />
          <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.4} />
        </mesh>
      ))}
      {/* Internal needle (visible through body) */}
      <mesh position={[0, d.bodyLen * 0.2, 0]}>
        <cylinderGeometry args={[d.orificeR * 0.5, d.orificeR * 3, d.bodyLen * 0.5, 12]} />
        <meshStandardMaterial color={ACCENT_COLOR} transparent opacity={0.25} />
      </mesh>
      {/* Converging seat */}
      <mesh position={[0, -d.bodyLen * 0.05, 0]}>
        <cylinderGeometry args={[d.orificeR * 2, d.bodyR * 0.92, d.bodyLen * 0.15, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Annular orifice gap */}
      <mesh position={[0, -d.bodyLen * 0.14, 0]}>
        <torusGeometry args={[d.orificeR * 2, d.orificeR * 0.4, 8, 24]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </>
  );
}

function ImpingementGeometry({ d, mat }: { d: ScaledDims; mat: MatProps }) {
  const halfAngle = Math.PI / 8; // 22.5 degrees each side
  return (
    <>
      {/* Wide body block */}
      <mesh position={[0, d.bodyLen * 0.45, 0]}>
        <cylinderGeometry args={[d.bodyR, d.bodyR * 0.95, d.bodyLen * 0.7, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Two separate inlet ports at top */}
      <mesh position={[-d.bodyR * 0.35, d.bodyLen * 0.88, 0]}>
        <cylinderGeometry args={[d.bodyR * 0.3, d.bodyR * 0.3, d.bodyLen * 0.12, 6]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      <mesh position={[d.bodyR * 0.35, d.bodyLen * 0.88, 0]}>
        <cylinderGeometry args={[d.bodyR * 0.3, d.bodyR * 0.3, d.bodyLen * 0.12, 6]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Left converging bore */}
      <mesh
        position={[-d.bodyR * 0.25, d.bodyLen * 0.05, 0]}
        rotation={[0, 0, -halfAngle]}
      >
        <cylinderGeometry args={[d.orificeR * 1.5, d.orificeR * 2.5, d.bodyLen * 0.35, 12]} />
        <meshStandardMaterial color={INSERT_COLOR} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Right converging bore */}
      <mesh
        position={[d.bodyR * 0.25, d.bodyLen * 0.05, 0]}
        rotation={[0, 0, halfAngle]}
      >
        <cylinderGeometry args={[d.orificeR * 1.5, d.orificeR * 2.5, d.bodyLen * 0.35, 12]} />
        <meshStandardMaterial color={INSERT_COLOR} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Impingement point marker (where jets collide) */}
      <mesh position={[0, -d.bodyLen * 0.18, 0]}>
        <sphereGeometry args={[d.orificeR * 3, 16, 16]} />
        <meshStandardMaterial color={ACCENT_COLOR} transparent opacity={0.4} />
      </mesh>
      {/* Two orifice exits */}
      <mesh position={[-d.bodyR * 0.12, -d.bodyLen * 0.12, 0]}>
        <cylinderGeometry args={[d.orificeR, d.orificeR, 0.02, 8]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[d.bodyR * 0.12, -d.bodyLen * 0.12, 0]}>
        <cylinderGeometry args={[d.orificeR, d.orificeR, 0.02, 8]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </>
  );
}

// ---- Coster product category geometry renderers ----

function AerosolActuatorGeometry({ d, mat, sealColor }: { d: ScaledDims; mat: MatProps; sealColor: string }) {
  return (
    <>
      {/* Cap body */}
      <mesh position={[0, d.bodyLen * 0.3, 0]}>
        <cylinderGeometry args={[d.bodyR, d.bodyR * 0.95, d.bodyLen * 0.4, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Finger pad (top, wider) */}
      <mesh position={[0, d.bodyLen * 0.55, 0]}>
        <cylinderGeometry args={[d.bodyR * 1.05, d.bodyR * 1.0, d.bodyLen * 0.1, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Spray tip protrusion */}
      <mesh position={[d.bodyR * 0.5, d.bodyLen * 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[d.orificeR * 2.5, d.orificeR * 3.5, d.bodyR * 0.35, 16]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Orifice */}
      <mesh position={[d.bodyR * 0.5 + d.bodyR * 0.18, d.bodyLen * 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[d.orificeR, d.orificeR, 0.01, 12]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Stem socket (inside, darker) */}
      <mesh position={[0, d.bodyLen * 0.05, 0]}>
        <cylinderGeometry args={[d.inletDia / 2 * 1.2, d.inletDia / 2 * 1.5, d.bodyLen * 0.15, 16]} />
        <meshStandardMaterial color={sealColor} />
      </mesh>
    </>
  );
}

function AerosolValveGeometry({ d, mat, sealColor }: { d: ScaledDims; mat: MatProps; sealColor: string }) {
  return (
    <>
      {/* Valve body (metering chamber) */}
      <mesh position={[0, d.bodyLen * 0.2, 0]}>
        <cylinderGeometry args={[d.bodyR * 0.7, d.bodyR * 0.8, d.bodyLen * 0.45, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Mounting cup flange (top) */}
      <mesh position={[0, d.bodyLen * 0.5, 0]}>
        <cylinderGeometry args={[d.bodyR * 1.3, d.bodyR * 1.2, d.bodyLen * 0.05, 32]} />
        <meshStandardMaterial color="#999999" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Stem protruding up */}
      <mesh position={[0, d.bodyLen * 0.7, 0]}>
        <cylinderGeometry args={[d.inletDia / 2 * 0.8, d.inletDia / 2, d.bodyLen * 0.35, 16]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Stem orifice at top */}
      <mesh position={[0, d.bodyLen * 0.88, 0]}>
        <cylinderGeometry args={[d.orificeR, d.orificeR, 0.02, 8]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Upper gasket */}
      <mesh position={[0, d.bodyLen * 0.48, 0]}>
        <torusGeometry args={[d.bodyR * 0.6, d.inletDia / 2 * 0.6, 8, 24]} />
        <meshStandardMaterial color={sealColor} />
      </mesh>
      {/* Lower gasket */}
      <mesh position={[0, d.bodyLen * 0.02, 0]}>
        <torusGeometry args={[d.bodyR * 0.5, d.inletDia / 2 * 0.5, 8, 24]} />
        <meshStandardMaterial color={sealColor} />
      </mesh>
      {/* Spring coil */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, -d.bodyLen * 0.05 - i * d.bodyLen * 0.07, 0]}>
          <torusGeometry args={[d.bodyR * 0.35, d.orificeR * 0.6, 6, 20]} />
          <meshStandardMaterial color="#888899" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {/* Dip tube */}
      <mesh position={[0, -d.bodyLen * 0.55, 0]}>
        <cylinderGeometry args={[d.inletDia / 2 * 0.6, d.inletDia / 2 * 0.6, d.bodyLen * 0.6, 12]} />
        <meshStandardMaterial color={sealColor} transparent opacity={0.7} />
      </mesh>
    </>
  );
}

function SprayPumpGeometry({ d, mat, sealColor }: { d: ScaledDims; mat: MatProps; sealColor: string }) {
  return (
    <>
      {/* Actuator button head */}
      <mesh position={[0, d.bodyLen * 0.45, 0]}>
        <cylinderGeometry args={[d.bodyR, d.bodyR * 0.9, d.bodyLen * 0.15, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Nozzle protrusion */}
      <mesh position={[d.bodyR * 0.6, d.bodyLen * 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[d.orificeR * 3, d.orificeR * 4, d.bodyR * 0.4, 16]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Orifice dot */}
      <mesh position={[d.bodyR * 0.6 + d.bodyR * 0.2, d.bodyLen * 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[d.orificeR, d.orificeR, 0.02, 12]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Collar / closure */}
      <mesh position={[0, d.bodyLen * 0.28, 0]}>
        <cylinderGeometry args={[d.neckSize / 2 * 1.1, d.neckSize / 2 * 1.1, d.bodyLen * 0.12, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Pump body (cylinder) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[d.bodyR * 0.5, d.bodyR * 0.5, d.bodyLen * 0.5, 24]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Dip tube */}
      <mesh position={[0, -d.bodyLen * 0.5, 0]}>
        <cylinderGeometry args={[d.inletDia / 2, d.inletDia / 2, d.bodyLen * 0.6, 12]} />
        <meshStandardMaterial color={sealColor} transparent opacity={0.7} />
      </mesh>
      {/* Seal ring */}
      <mesh position={[0, d.bodyLen * 0.22, 0]}>
        <torusGeometry args={[d.bodyR * 0.5, d.inletDia / 2 * 0.5, 8, 24]} />
        <meshStandardMaterial color={sealColor} />
      </mesh>
    </>
  );
}

function PerfumeryPumpGeometry({ d, mat, sealColor }: { d: ScaledDims; mat: MatProps; sealColor: string }) {
  return (
    <>
      {/* Elegant button (rounded top) */}
      <mesh position={[0, d.bodyLen * 0.48, 0]}>
        <cylinderGeometry args={[d.bodyR * 0.85, d.bodyR * 0.9, d.bodyLen * 0.1, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      <mesh position={[0, d.bodyLen * 0.55, 0]}>
        <sphereGeometry args={[d.bodyR * 0.85, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Fine spray nozzle (slimmer) */}
      <mesh position={[d.bodyR * 0.55, d.bodyLen * 0.48, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[d.orificeR * 2, d.orificeR * 3, d.bodyR * 0.35, 16]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Orifice */}
      <mesh position={[d.bodyR * 0.55 + d.bodyR * 0.18, d.bodyLen * 0.48, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[d.orificeR * 0.8, d.orificeR * 0.8, 0.01, 8]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Metallic crimp collar — distinctive for perfumery */}
      <mesh position={[0, d.bodyLen * 0.32, 0]}>
        <cylinderGeometry args={[d.neckSize / 2 * 1.15, d.neckSize / 2 * 1.0, d.bodyLen * 0.1, 32]} />
        <meshStandardMaterial color="#ccccbb" metalness={0.85} roughness={0.15} />
      </mesh>
      {/* Crimp detail rings */}
      <mesh position={[0, d.bodyLen * 0.36, 0]}>
        <torusGeometry args={[d.neckSize / 2 * 1.1, d.bodyLen * 0.005, 6, 32]} />
        <meshStandardMaterial color="#bbbbaa" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Slim pump body */}
      <mesh position={[0, d.bodyLen * 0.05, 0]}>
        <cylinderGeometry args={[d.bodyR * 0.4, d.bodyR * 0.45, d.bodyLen * 0.45, 24]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Slim dip tube */}
      <mesh position={[0, -d.bodyLen * 0.45, 0]}>
        <cylinderGeometry args={[d.inletDia / 2 * 0.7, d.inletDia / 2 * 0.7, d.bodyLen * 0.55, 12]} />
        <meshStandardMaterial color={sealColor} transparent opacity={0.6} />
      </mesh>
    </>
  );
}

function DispenserGeometry({ d, mat, sealColor }: { d: ScaledDims; mat: MatProps; sealColor: string }) {
  return (
    <>
      {/* Wide pump head */}
      <mesh position={[0, d.bodyLen * 0.45, 0]}>
        <cylinderGeometry args={[d.bodyR * 1.1, d.bodyR, d.bodyLen * 0.15, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Dispensing spout (wide opening, angled) */}
      <mesh position={[d.bodyR * 0.6, d.bodyLen * 0.42, 0]} rotation={[0, 0, Math.PI / 2.5]}>
        <cylinderGeometry args={[d.orificeR * 4, d.orificeR * 5, d.bodyR * 0.5, 16]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Wide dispensing opening */}
      <mesh position={[d.bodyR * 0.85, d.bodyLen * 0.5, 0]} rotation={[0, 0, Math.PI / 2.5]}>
        <cylinderGeometry args={[d.orificeR * 3, d.orificeR * 3, 0.02, 12]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Lock ring */}
      <mesh position={[0, d.bodyLen * 0.3, 0]}>
        <cylinderGeometry args={[d.neckSize / 2 * 1.2, d.neckSize / 2 * 1.15, d.bodyLen * 0.08, 32]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Pump body */}
      <mesh position={[0, d.bodyLen * 0.05, 0]}>
        <cylinderGeometry args={[d.bodyR * 0.55, d.bodyR * 0.6, d.bodyLen * 0.4, 24]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Dip tube */}
      <mesh position={[0, -d.bodyLen * 0.45, 0]}>
        <cylinderGeometry args={[d.inletDia / 2, d.inletDia / 2, d.bodyLen * 0.6, 12]} />
        <meshStandardMaterial color={sealColor} transparent opacity={0.7} />
      </mesh>
    </>
  );
}

// ---- Map of nozzle type → geometry renderer ----
const NOZZLE_RENDERERS: Record<ActuatorType, React.FC<{ d: ScaledDims; mat: MatProps; sealColor: string }>> = {
  full_cone: FullConeGeometry,
  hollow_cone: HollowConeGeometry,
  flat_fan: FlatFanGeometry,
  fine_mist: FineMistGeometry,
  jet_stream: JetStreamGeometry,
  air_atomizing: AirAtomizingGeometry,
  spiral: SpiralGeometry,
  deflection: DeflectionGeometry,
  ultrasonic: UltrasonicGeometry,
  multi_orifice: MultiOrificeGeometry,
  adjustable_cone: AdjustableConeGeometry,
  impingement: ImpingementGeometry,
};

// ---- Parametric Actuator 3D Mesh ----
function ActuatorMesh({ actuator, wireframe }: { actuator: Actuator; wireframe: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const td = actuator.technicalDesign;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const bodyColor = MATERIAL_COLORS[td.bodyMaterial] || "#d0d0d0";
  const sealColor = SEAL_COLORS[td.sealMaterial] || "#2a2a2a";

  const scale = 0.08;
  const d: ScaledDims = {
    bodyDia: td.bodyDiameter_mm * scale,
    bodyLen: td.bodyLength_mm * scale,
    bodyR: (td.bodyDiameter_mm * scale) / 2,
    orificeDia: actuator.orificeDiameter_mm * scale,
    orificeR: (actuator.orificeDiameter_mm * scale) / 2,
    chamberDia: (td.chamberDiameter_mm || 0) * scale,
    chamberDepth: (td.chamberDepth_mm || 0) * scale,
    inletDia: td.inletDiameter_mm * scale,
    neckSize: (td.neckSize_mm || td.bodyDiameter_mm * 0.8) * scale,
  };

  const mat: MatProps = wireframe
    ? { wireframe: true, color: "#06b6d4" }
    : {
        color: bodyColor,
        roughness: 0.4,
        metalness: td.bodyMaterial.includes("SS") || td.bodyMaterial === "Titanium" || td.bodyMaterial.includes("Stainless") ? 0.8 : 0.1,
      };

  // Choose geometry based on product category, then type
  const renderGeometry = () => {
    if (actuator.productCategory === "nozzle") {
      const NozzleRenderer = NOZZLE_RENDERERS[actuator.type];
      if (NozzleRenderer) {
        return <NozzleRenderer d={d} mat={mat} sealColor={sealColor} />;
      }
    }

    switch (actuator.productCategory) {
      case "aerosol_actuator":
        return <AerosolActuatorGeometry d={d} mat={mat} sealColor={sealColor} />;
      case "aerosol_valve":
        return <AerosolValveGeometry d={d} mat={mat} sealColor={sealColor} />;
      case "spray_pump":
        return <SprayPumpGeometry d={d} mat={mat} sealColor={sealColor} />;
      case "perfumery_pump":
        return <PerfumeryPumpGeometry d={d} mat={mat} sealColor={sealColor} />;
      case "dispenser":
        return <DispenserGeometry d={d} mat={mat} sealColor={sealColor} />;
      default: {
        // Fallback for any nozzle type if productCategory doesn't match
        const FallbackRenderer = NOZZLE_RENDERERS[actuator.type];
        if (FallbackRenderer) {
          return <FallbackRenderer d={d} mat={mat} sealColor={sealColor} />;
        }
        return <FullConeGeometry d={d} mat={mat} sealColor={sealColor} />;
      }
    }
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {renderGeometry()}

      {/* === DIMENSION ANNOTATIONS (HTML overlays) === */}
      <Html position={[d.bodyR + 0.5, d.bodyLen / 2, 0]} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded bg-black/70 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-cyan-400">
          ⌀{td.bodyDiameter_mm}mm
        </div>
      </Html>
      <Html position={[-d.bodyR - 0.3, 0, 0]} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded bg-black/70 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-cyan-400">
          {td.bodyLength_mm}mm
        </div>
      </Html>
      <Html position={[0, -d.bodyLen * 0.3, 0]} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded bg-black/70 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-orange-400">
          orifice ⌀{actuator.orificeDiameter_mm}mm
        </div>
      </Html>
    </group>
  );
}

// ---- STL Export Utility ----
function buildSTLScene(actuator: Actuator): THREE.Scene {
  const td = actuator.technicalDesign;
  const scene = new THREE.Scene();

  const bodyR = td.bodyDiameter_mm / 2;
  const bodyH = td.bodyLength_mm;
  const orificeR = actuator.orificeDiameter_mm / 2;
  const chamberR = (td.chamberDiameter_mm || 0) / 2;
  const chamberD = td.chamberDepth_mm || 0;
  const inletR = td.inletDiameter_mm / 2;

  function addCyl(radiusTop: number, radiusBottom: number, height: number, y: number, segments = 32) {
    const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments);
    const mesh = new THREE.Mesh(geo);
    mesh.position.set(0, y, 0);
    scene.add(mesh);
  }

  if (actuator.productCategory === "nozzle") {
    switch (actuator.type) {
      case "full_cone":
        addCyl(bodyR, bodyR * 0.88, bodyH, bodyH / 2);
        addCyl(bodyR * 1.15, bodyR * 1.15, bodyH * 0.12, bodyH * 0.95, 6);
        addCyl(orificeR * 3, bodyR * 0.88, bodyH * 0.2, -bodyH * 0.05);
        if (chamberR > 0) addCyl(chamberR, chamberR, chamberD, bodyH * 0.1, 24);
        break;
      case "hollow_cone":
        addCyl(bodyR * 0.9, bodyR * 0.8, bodyH, bodyH / 2);
        addCyl(bodyR * 1.1, bodyR * 1.1, bodyH * 0.1, bodyH * 0.95, 6);
        addCyl(orificeR * 2, bodyR * 0.8, bodyH * 0.25, -bodyH * 0.08);
        break;
      case "flat_fan": {
        addCyl(bodyR * 1.05, bodyR, bodyH * 0.85, bodyH / 2);
        addCyl(bodyR * 1.2, bodyR * 1.2, bodyH * 0.12, bodyH * 0.92, 6);
        const slotGeo = new THREE.BoxGeometry(bodyR * 1.4, bodyH * 0.15, bodyR * 0.5);
        const slotMesh = new THREE.Mesh(slotGeo);
        slotMesh.position.set(0, -bodyH * 0.05, 0);
        scene.add(slotMesh);
        break;
      }
      case "fine_mist":
        addCyl(bodyR, bodyR * 0.95, bodyH * 0.55, bodyH * 0.3);
        addCyl(bodyR * 0.6, bodyR * 0.7, bodyH * 0.12, bodyH * 0.02);
        addCyl(orificeR * 2, bodyR * 0.6, bodyH * 0.12, -bodyH * 0.08);
        addCyl(inletR * 1.5, inletR * 1.2, bodyH * 0.15, -bodyH * 0.25);
        break;
      case "jet_stream":
        addCyl(bodyR, bodyR * 0.95, bodyH * 0.8, bodyH * 0.45);
        addCyl(bodyR * 1.2, bodyR * 1.2, bodyH * 0.15, bodyH * 0.92, 6);
        addCyl(orificeR * 3, bodyR * 0.95, bodyH * 0.3, -bodyH * 0.05);
        break;
      case "air_atomizing":
        addCyl(bodyR, bodyR * 0.9, bodyH * 0.65, bodyH * 0.45);
        addCyl(bodyR * 1.15, bodyR * 1.15, bodyH * 0.1, bodyH * 0.85, 6);
        addCyl(bodyR * 0.7, bodyR * 0.9, bodyH * 0.15, -bodyH * 0.1);
        addCyl(orificeR * 2, orificeR * 2.5, bodyH * 0.2, bodyH * 0.03);
        break;
      case "spiral":
        addCyl(bodyR * 1.1, bodyR * 1.1, bodyH * 0.2, bodyH * 0.85, 6);
        addCyl(bodyR * 0.3, bodyR * 0.35, bodyH * 0.7, bodyH * 0.35);
        break;
      case "deflection":
        addCyl(bodyR, bodyR * 0.95, bodyH * 0.8, bodyH / 2);
        addCyl(bodyR * 1.15, bodyR * 1.15, bodyH * 0.1, bodyH * 0.9, 6);
        addCyl(bodyR * 1.1, bodyR * 1.1, bodyH * 0.03, -bodyH * 0.18);
        break;
      case "ultrasonic":
        addCyl(bodyR, bodyR, bodyH * 0.3, bodyH * 0.75);
        addCyl(bodyR * 0.55, bodyR * 0.6, bodyH * 0.35, bodyH * 0.3);
        addCyl(bodyR * 0.15, bodyR * 0.35, bodyH * 0.3, -bodyH * 0.08);
        break;
      case "multi_orifice":
        addCyl(bodyR, bodyR * 0.9, bodyH, bodyH / 2);
        addCyl(bodyR * 1.15, bodyR * 1.15, bodyH * 0.12, bodyH * 0.95, 6);
        addCyl(bodyR * 0.95, bodyR * 0.9, bodyH * 0.08, -bodyH * 0.08);
        break;
      case "adjustable_cone":
        addCyl(bodyR, bodyR * 0.92, bodyH * 0.75, bodyH * 0.45);
        addCyl(bodyR * 1.15, bodyR * 1.15, bodyH * 0.1, bodyH * 0.9, 6);
        addCyl(bodyR * 1.08, bodyR * 1.08, bodyH * 0.12, bodyH * 0.55, 24);
        addCyl(orificeR * 2, bodyR * 0.92, bodyH * 0.15, -bodyH * 0.05);
        break;
      case "impingement":
        addCyl(bodyR, bodyR * 0.95, bodyH * 0.7, bodyH * 0.45);
        addCyl(bodyR * 0.3, bodyR * 0.3, bodyH * 0.12, bodyH * 0.88, 6);
        break;
    }
  } else {
    // Coster products — simplified STL shapes
    switch (actuator.productCategory) {
      case "aerosol_actuator":
        addCyl(bodyR, bodyR * 0.95, bodyH * 0.4, bodyH * 0.3);
        addCyl(bodyR * 1.05, bodyR, bodyH * 0.1, bodyH * 0.55);
        addCyl(inletR * 1.2, inletR * 1.5, bodyH * 0.15, bodyH * 0.05);
        break;
      case "aerosol_valve":
        addCyl(bodyR * 0.7, bodyR * 0.8, bodyH * 0.45, bodyH * 0.2);
        addCyl(bodyR * 1.3, bodyR * 1.2, bodyH * 0.05, bodyH * 0.5);
        addCyl(inletR * 0.8, inletR, bodyH * 0.35, bodyH * 0.7);
        addCyl(inletR * 0.6, inletR * 0.6, bodyH * 0.6, -bodyH * 0.55);
        break;
      case "spray_pump":
        addCyl(bodyR, bodyR * 0.9, bodyH * 0.15, bodyH * 0.45);
        addCyl(bodyR * 0.5, bodyR * 0.5, bodyH * 0.5, 0, 24);
        addCyl(inletR, inletR, bodyH * 0.6, -bodyH * 0.5);
        break;
      case "perfumery_pump":
        addCyl(bodyR * 0.85, bodyR * 0.9, bodyH * 0.1, bodyH * 0.48);
        addCyl(bodyR * 0.4, bodyR * 0.45, bodyH * 0.45, bodyH * 0.05);
        addCyl(inletR * 0.7, inletR * 0.7, bodyH * 0.55, -bodyH * 0.45);
        break;
      default:
        addCyl(bodyR, bodyR * 0.9, bodyH, bodyH / 2);
        addCyl(orificeR * 2, bodyR * 0.9, bodyH * 0.15, -bodyH * 0.05);
        break;
    }
  }

  return scene;
}

function generateSTL(actuator: Actuator): string {
  const scene = buildSTLScene(actuator);

  let stl = `solid ${actuator.sku}\n`;

  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      const geo = obj.geometry;
      const pos = geo.attributes.position;
      const idx = geo.index;

      obj.updateMatrixWorld(true);
      const matrix = obj.matrixWorld;

      if (idx) {
        for (let i = 0; i < idx.count; i += 3) {
          const vA = new THREE.Vector3().fromBufferAttribute(pos, idx.getX(i)).applyMatrix4(matrix);
          const vB = new THREE.Vector3().fromBufferAttribute(pos, idx.getX(i + 1)).applyMatrix4(matrix);
          const vC = new THREE.Vector3().fromBufferAttribute(pos, idx.getX(i + 2)).applyMatrix4(matrix);

          const normal = new THREE.Vector3()
            .crossVectors(
              new THREE.Vector3().subVectors(vB, vA),
              new THREE.Vector3().subVectors(vC, vA)
            )
            .normalize();

          stl += `facet normal ${normal.x} ${normal.y} ${normal.z}\n`;
          stl += `  outer loop\n`;
          stl += `    vertex ${vA.x} ${vA.y} ${vA.z}\n`;
          stl += `    vertex ${vB.x} ${vB.y} ${vB.z}\n`;
          stl += `    vertex ${vC.x} ${vC.y} ${vC.z}\n`;
          stl += `  endloop\n`;
          stl += `endfacet\n`;
        }
      }
    }
  });

  stl += `endsolid ${actuator.sku}\n`;

  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose();
    }
  });

  return stl;
}

export function downloadSTL(actuator: Actuator) {
  const stl = generateSTL(actuator);
  const blob = new Blob([stl], { type: "application/sla" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${actuator.sku}_parametric.stl`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---- Generate STEP file description (metadata export) ----
export function downloadSTEPMetadata(actuator: Actuator) {
  const td = actuator.technicalDesign;
  const content = `ISO-10303-21;
HEADER;
/* Generated by AeroSpec Configurator */
FILE_DESCRIPTION(('Parametric actuator geometry'), '2;1');
FILE_NAME('${actuator.sku}.step', '${new Date().toISOString()}', ('AeroSpec'), (''), '', 'AeroSpec Configurator', '');
FILE_SCHEMA(('AUTOMOTIVE_DESIGN'));
ENDSEC;
DATA;

/* ============================================= */
/* ACTUATOR: ${actuator.sku} — ${actuator.name} */
/* TYPE: ${actuator.type}                        */
/* ============================================= */

/* BODY GEOMETRY */
/* Body Diameter: ${td.bodyDiameter_mm} mm */
/* Body Length: ${td.bodyLength_mm} mm */
/* Body Material: ${td.bodyMaterial} */
/* Weight: ${td.weight_g} g */

/* ORIFICE GEOMETRY */
/* Orifice Diameter: ${actuator.orificeDiameter_mm} mm */
/* Orifice Geometry: ${td.orificeGeometry} */
/* Orifice Count: ${td.orificeCount} */

/* SWIRL CHAMBER */
/* Swirl Channels: ${td.swirlChannels} */
/* Channel Width: ${td.swirlChannelWidth_mm || "N/A"} mm */
/* Chamber Diameter: ${td.chamberDiameter_mm || "N/A"} mm */
/* Chamber Depth: ${td.chamberDepth_mm || "N/A"} mm */
/* Swirl Angle: ${actuator.swirlChamberAngle_deg} deg */

/* INLET */
/* Inlet Diameter: ${td.inletDiameter_mm} mm */
/* Connection: ${td.connectionType} */

/* SEAL */
/* Seal Material: ${td.sealMaterial} */
/* Surface Finish: ${td.surfaceFinish_Ra_um || "N/A"} Ra µm */

/* INTERNAL FLOW */
/* Internal Volume: ${td.internalVolume_uL || "N/A"} µL */
/* Dosage: ${td.dosage_uL || "Continuous"} µL */
/* Flow Path: ${td.flowPathDescription} */

/* MATERIALS */
/* Body: ${td.bodyMaterial} */
/* Seal: ${td.sealMaterial} */
/* Spring: ${td.springMaterial || "None"} */
/* Insert: ${td.insertMaterial || "None"} */

/* NOTE: Full STEP B-rep geometry requires OpenCASCADE server. */
/* This file contains parametric metadata for CAD reconstruction. */
/* Import into SolidWorks/Fusion 360 with parameter table. */

ENDSEC;
END-ISO-10303-21;
`;
  const blob = new Blob([content], { type: "application/step" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${actuator.sku}_parametric.step`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---- Main 3D Viewer Component ----
export default function ActuatorViewer3D({
  actuator,
  height = 400,
}: {
  actuator: Actuator;
  height?: number;
}) {
  const [wireframe, setWireframe] = useState(false);

  const handleExportSTL = useCallback(() => downloadSTL(actuator), [actuator]);
  const handleExportSTEP = useCallback(() => downloadSTEPMetadata(actuator), [actuator]);

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
        <h2 className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-[var(--muted)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0022 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          3D Parametric View — {actuator.sku}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`rounded-md border px-2.5 py-1 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider transition-all ${
              wireframe ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--muted)]"
            }`}
          >
            Wireframe
          </button>
          <button
            onClick={handleExportSTL}
            className="rounded-md border border-[var(--accent)]/40 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--accent)] transition-all hover:bg-[var(--accent)]/10"
          >
            Export STL
          </button>
          <button
            onClick={handleExportSTEP}
            className="rounded-md border border-[var(--accent-secondary)]/40 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[var(--accent-secondary)] transition-all hover:bg-[var(--accent-secondary)]/10"
          >
            Export STEP
          </button>
        </div>
      </div>

      <div style={{ height }}>
        <Canvas
          camera={{ position: [4, 3, 5], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <directionalLight position={[-3, 2, -3]} intensity={0.3} />
          <pointLight position={[0, -3, 0]} intensity={0.2} color="#06b6d4" />

          <ActuatorMesh actuator={actuator} wireframe={wireframe} />

          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.3}
            scale={10}
            blur={2}
          />

          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={15}
            autoRotate={false}
          />

          {/* Grid */}
          <gridHelper args={[10, 20, "#1a2030", "#1a2030"]} position={[0, -2.5, 0]} />
        </Canvas>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] px-5 py-2">
        <span className="font-[family-name:var(--font-mono)] text-[9px] text-[var(--muted)]">
          Drag to rotate — Scroll to zoom — Dimensions in mm
        </span>
        <div className="flex gap-4 font-[family-name:var(--font-mono)] text-[9px]">
          <span className="text-[var(--muted)]">Body: <span className="text-[var(--fg-bright)]">{actuator.technicalDesign.bodyMaterial}</span></span>
          <span className="text-[var(--muted)]">Seal: <span className="text-[var(--fg-bright)]">{actuator.technicalDesign.sealMaterial}</span></span>
          <span className="text-[var(--muted)]">Orifice: <span className="text-[var(--accent)]">{actuator.technicalDesign.orificeGeometry}</span></span>
        </div>
      </div>
    </div>
  );
}
