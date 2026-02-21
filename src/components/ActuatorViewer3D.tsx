"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";
import type { Actuator } from "@/lib/data";

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

// ---- Parametric Actuator 3D Mesh ----
function ActuatorMesh({ actuator, wireframe }: { actuator: Actuator; wireframe: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const td = actuator.technicalDesign;

  // Slow rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const bodyColor = MATERIAL_COLORS[td.bodyMaterial] || "#d0d0d0";
  const sealColor = SEAL_COLORS[td.sealMaterial] || "#2a2a2a";

  // Normalize dimensions to scene scale (mm → scene units, scale down)
  const scale = 0.08;
  const bodyDia = td.bodyDiameter_mm * scale;
  const bodyLen = td.bodyLength_mm * scale;
  const orificeDia = actuator.orificeDiameter_mm * scale;
  const chamberDia = (td.chamberDiameter_mm || td.bodyDiameter_mm * 0.6) * scale;
  const chamberDepth = (td.chamberDepth_mm || bodyLen * 0.3) * scale;
  const inletDia = td.inletDiameter_mm * scale;
  const neckSize = (td.neckSize_mm || td.bodyDiameter_mm * 0.8) * scale;

  // Determine actuator shape based on type
  const isNozzle = actuator.type.includes("nozzle") || actuator.type.includes("fan") || actuator.type.includes("cone");
  const isPump = actuator.productCategory === "spray_pump" || actuator.productCategory === "perfumery_pump";
  const isAerosol = actuator.productCategory === "aerosol_actuator";
  const isDispenser = actuator.productCategory === "dispenser";

  const matProps = wireframe
    ? { wireframe: true, color: "#06b6d4" }
    : { color: bodyColor, roughness: 0.4, metalness: td.bodyMaterial.includes("SS") || td.bodyMaterial === "Titanium" ? 0.8 : 0.1 };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* === BODY === */}
      {isNozzle ? (
        // Industrial nozzle: tapered cylinder body
        <>
          {/* Main body cylinder */}
          <mesh position={[0, bodyLen / 2, 0]}>
            <cylinderGeometry args={[bodyDia / 2, bodyDia / 2 * 0.85, bodyLen, 32]} />
            <meshStandardMaterial {...matProps} />
          </mesh>
          {/* Hex collar (connection end) */}
          <mesh position={[0, bodyLen * 0.95, 0]}>
            <cylinderGeometry args={[bodyDia / 2 * 1.15, bodyDia / 2 * 1.15, bodyLen * 0.12, 6]} />
            <meshStandardMaterial {...matProps} />
          </mesh>
          {/* Nozzle tip taper */}
          <mesh position={[0, -bodyLen * 0.05, 0]}>
            <cylinderGeometry args={[orificeDia * 2, bodyDia / 2 * 0.85, bodyLen * 0.2, 32]} />
            <meshStandardMaterial {...matProps} />
          </mesh>
          {/* Orifice (dark) */}
          <mesh position={[0, -bodyLen * 0.16, 0]}>
            <cylinderGeometry args={[orificeDia / 2, orificeDia / 2, bodyLen * 0.02, 16]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
        </>
      ) : isPump ? (
        // Spray pump: actuator head + dip tube
        <>
          {/* Actuator head (button) */}
          <mesh position={[0, bodyLen * 0.45, 0]}>
            <cylinderGeometry args={[bodyDia / 2, bodyDia / 2 * 0.9, bodyLen * 0.15, 32]} />
            <meshStandardMaterial {...matProps} />
          </mesh>
          {/* Nozzle protrusion */}
          <mesh position={[bodyDia / 2 * 0.6, bodyLen * 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[orificeDia * 3, orificeDia * 4, bodyDia * 0.4, 16]} />
            <meshStandardMaterial {...matProps} />
          </mesh>
          {/* Orifice dot */}
          <mesh position={[bodyDia / 2 * 0.6 + bodyDia * 0.2, bodyLen * 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[orificeDia / 2, orificeDia / 2, 0.02, 12]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
          {/* Collar / closure */}
          <mesh position={[0, bodyLen * 0.28, 0]}>
            <cylinderGeometry args={[neckSize / 2 * 1.1, neckSize / 2 * 1.1, bodyLen * 0.12, 32]} />
            <meshStandardMaterial {...matProps} />
          </mesh>
          {/* Pump body (cylinder) */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[bodyDia / 2 * 0.5, bodyDia / 2 * 0.5, bodyLen * 0.5, 24]} />
            <meshStandardMaterial {...matProps} />
          </mesh>
          {/* Dip tube */}
          <mesh position={[0, -bodyLen * 0.5, 0]}>
            <cylinderGeometry args={[inletDia / 2, inletDia / 2, bodyLen * 0.6, 12]} />
            <meshStandardMaterial color={sealColor} transparent opacity={0.7} />
          </mesh>
          {/* Seal ring */}
          <mesh position={[0, bodyLen * 0.22, 0]}>
            <torusGeometry args={[bodyDia / 2 * 0.5, inletDia / 2 * 0.5, 8, 24]} />
            <meshStandardMaterial color={sealColor} />
          </mesh>
        </>
      ) : isAerosol ? (
        // Aerosol actuator: cap + stem socket + spray tip
        <>
          {/* Cap body */}
          <mesh position={[0, bodyLen * 0.3, 0]}>
            <cylinderGeometry args={[bodyDia / 2, bodyDia / 2 * 0.95, bodyLen * 0.4, 32]} />
            <meshStandardMaterial {...matProps} />
          </mesh>
          {/* Finger pad (top, wider) */}
          <mesh position={[0, bodyLen * 0.55, 0]}>
            <cylinderGeometry args={[bodyDia / 2 * 1.05, bodyDia / 2 * 1.0, bodyLen * 0.1, 32]} />
            <meshStandardMaterial {...matProps} />
          </mesh>
          {/* Spray tip */}
          <mesh position={[bodyDia / 2 * 0.5, bodyLen * 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[orificeDia * 2.5, orificeDia * 3.5, bodyDia * 0.35, 16]} />
            <meshStandardMaterial {...matProps} />
          </mesh>
          {/* Orifice */}
          <mesh position={[bodyDia / 2 * 0.5 + bodyDia * 0.18, bodyLen * 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[orificeDia / 2, orificeDia / 2, 0.01, 12]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
          {/* Stem socket (inside, darker) */}
          <mesh position={[0, bodyLen * 0.05, 0]}>
            <cylinderGeometry args={[inletDia / 2 * 1.2, inletDia / 2 * 1.5, bodyLen * 0.15, 16]} />
            <meshStandardMaterial color={sealColor} />
          </mesh>
        </>
      ) : (
        // Generic / dispenser: simple body + tip
        <>
          <mesh position={[0, bodyLen / 2, 0]}>
            <cylinderGeometry args={[bodyDia / 2, bodyDia / 2 * 0.9, bodyLen, 32]} />
            <meshStandardMaterial {...matProps} />
          </mesh>
          {/* Tip */}
          <mesh position={[0, -bodyLen * 0.05, 0]}>
            <cylinderGeometry args={[orificeDia * 2, bodyDia / 2 * 0.9, bodyLen * 0.15, 24]} />
            <meshStandardMaterial {...matProps} />
          </mesh>
          {/* Orifice */}
          <mesh position={[0, -bodyLen * 0.14, 0]}>
            <cylinderGeometry args={[orificeDia / 2, orificeDia / 2, 0.02, 12]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
        </>
      )}

      {/* === SWIRL CHAMBER (visible as internal detail) === */}
      {td.swirlChannels > 0 && chamberDia > 0 && (
        <mesh position={[0, bodyLen * 0.08, 0]}>
          <cylinderGeometry args={[chamberDia / 2, chamberDia / 2, chamberDepth, 24]} />
          <meshStandardMaterial color="#333340" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* === DIMENSION ANNOTATIONS (HTML overlays) === */}
      <Html position={[bodyDia / 2 + 0.5, bodyLen / 2, 0]} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded bg-black/70 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-cyan-400">
          ⌀{td.bodyDiameter_mm}mm
        </div>
      </Html>
      <Html position={[-bodyDia / 2 - 0.3, 0, 0]} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded bg-black/70 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-cyan-400">
          {td.bodyLength_mm}mm
        </div>
      </Html>
      <Html position={[0, -bodyLen * 0.2, 0]} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded bg-black/70 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-orange-400">
          orifice ⌀{actuator.orificeDiameter_mm}mm
        </div>
      </Html>
    </group>
  );
}

// ---- STL Export Utility ----
function generateSTL(actuator: Actuator): string {
  // Build simple triangulated geometry for STL export
  const td = actuator.technicalDesign;
  const scene = new THREE.Scene();

  const bodyR = td.bodyDiameter_mm / 2;
  const bodyH = td.bodyLength_mm;
  const orificeR = actuator.orificeDiameter_mm / 2;

  // Main body
  const bodyGeo = new THREE.CylinderGeometry(bodyR, bodyR * 0.85, bodyH, 32);
  const bodyMesh = new THREE.Mesh(bodyGeo);
  bodyMesh.position.set(0, bodyH / 2, 0);
  scene.add(bodyMesh);

  // Nozzle tip
  const tipGeo = new THREE.CylinderGeometry(orificeR * 4, bodyR * 0.85, bodyH * 0.2, 32);
  const tipMesh = new THREE.Mesh(tipGeo);
  tipMesh.position.set(0, -bodyH * 0.05, 0);
  scene.add(tipMesh);

  // Orifice bore (subtracted conceptually - for STL we just include it as a small cylinder)
  const orificeGeo = new THREE.CylinderGeometry(orificeR, orificeR, bodyH * 0.15, 16);
  const orificeMesh = new THREE.Mesh(orificeGeo);
  orificeMesh.position.set(0, -bodyH * 0.13, 0);
  scene.add(orificeMesh);

  // Swirl chamber
  if (td.chamberDiameter_mm && td.chamberDepth_mm) {
    const chamberGeo = new THREE.CylinderGeometry(
      td.chamberDiameter_mm / 2,
      td.chamberDiameter_mm / 2,
      td.chamberDepth_mm,
      24
    );
    const chamberMesh = new THREE.Mesh(chamberGeo);
    chamberMesh.position.set(0, bodyH * 0.1, 0);
    scene.add(chamberMesh);
  }

  // Hex collar
  const hexGeo = new THREE.CylinderGeometry(bodyR * 1.15, bodyR * 1.15, bodyH * 0.12, 6);
  const hexMesh = new THREE.Mesh(hexGeo);
  hexMesh.position.set(0, bodyH * 0.95, 0);
  scene.add(hexMesh);

  // Generate ASCII STL
  let stl = `solid ${actuator.sku}\n`;

  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      const geo = obj.geometry;
      const pos = geo.attributes.position;
      const idx = geo.index;

      // Apply mesh world transform
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

  // Cleanup
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
