"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FLUIDS, ACTUATORS as ALL_ACTUATORS, SOLVENT_CLASS_LABELS } from "@/lib/data";
import type { Actuator, Fluid, PredictionResult, SolventClass, RheologyType } from "@/lib/data";
import Link from "next/link";
import { ActuatorIllustration, SprayPatternIllustration, ACTUATOR_COLORS } from "@/components/ActuatorIllustrations";
import { getSavedConfigs, saveConfig, deleteConfig, trackEvent } from "@/lib/store";
import type { SavedConfiguration } from "@/lib/store";

interface ResultRow {
  actuator: Actuator;
  prediction: PredictionResult;
}

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 80 ? "score-excellent" : score >= 50 ? "score-good" : "score-poor";
  return (
    <span className={`inline-block rounded-md border px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11px] font-bold ${cls}`}>
      {score}/100
    </span>
  );
}

function RegimeBadge({ regime }: { regime: string }) {
  const colors: Record<string, string> = {
    Atomization: "var(--success)",
    "Wind-stressed": "var(--accent)",
    "Wind-induced": "var(--warning)",
    Rayleigh: "var(--danger)",
  };
  const color = colors[regime] || "var(--muted)";
  return (
    <span className="rounded-md border px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-bold" style={{ borderColor: color, color }}>
      {regime}
    </span>
  );
}

function CloggingBadge({ risk }: { risk: string }) {
  const colors: Record<string, string> = {
    none: "var(--muted)", low: "var(--success)", moderate: "var(--warning)", high: "var(--danger)",
  };
  if (risk === "none") return null;
  return (
    <span className="rounded-md border px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] font-bold uppercase" style={{ borderColor: colors[risk], color: colors[risk] }}>
      Clog: {risk}
    </span>
  );
}

const ALL_SOLVENT_CLASSES = Object.keys(SOLVENT_CLASS_LABELS) as SolventClass[];

function ConfigureContent() {
  const params = useSearchParams();

  // Deep linking: read pre-selected actuator/fluid from URL
  const urlFluid = params.get("fluid");
  const urlActuator = params.get("actuator");

  const initialFluid = urlFluid && FLUIDS.some((f) => f.id === urlFluid) ? urlFluid : FLUIDS[0].id;

  // Fluid selection
  const [inputMode, setInputMode] = useState<"library" | "custom">("library");
  const [fluidId, setFluidId] = useState(initialFluid);
  const [solventFilter, setSolventFilter] = useState<SolventClass | "all">("all");

  // Custom fluid properties
  const [customViscosity, setCustomViscosity] = useState(1.0);
  const [customDensity, setCustomDensity] = useState(998);
  const [customSurfaceTension, setCustomSurfaceTension] = useState(72.8);
  const [customSolventClass, setCustomSolventClass] = useState<SolventClass>("aqueous");
  const [customRheology, setCustomRheology] = useState<RheologyType>("newtonian");
  const [customPowerLawN, setCustomPowerLawN] = useState(1.0);
  const [customParticleSize, setCustomParticleSize] = useState(0);

  // Operating conditions
  const [pressure, setPressure] = useState(5);

  // Results
  const [results, setResults] = useState<ResultRow[] | null>(null);
  const [selectedFluid, setSelectedFluid] = useState<Fluid | null>(null);
  const [loading, setLoading] = useState(false);

  // Multi-select for comparison
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Saved configurations
  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    setSavedConfigs(getSavedConfigs());
  }, []);

  function handleSave() {
    const cfg = saveConfig({
      name: inputMode === "library"
        ? `${FLUIDS.find((f) => f.id === fluidId)?.name || fluidId} @ ${pressure} bar`
        : `Custom Fluid @ ${pressure} bar`,
      inputMode,
      fluidId,
      customFluid: inputMode === "custom" ? {
        viscosity: customViscosity,
        density: customDensity,
        surfaceTension: customSurfaceTension,
        solventClass: customSolventClass,
        rheology: customRheology,
        powerLawN: customPowerLawN,
        particleSize: customParticleSize,
      } : undefined,
      pressure,
      topActuatorId: results?.[0]?.actuator.id,
      topScore: results?.[0]?.prediction.compatibilityScore,
    });
    setSavedConfigs(getSavedConfigs());
    setSaveMessage(`Saved as "${cfg.name}"`);
    trackEvent("config_save", { configId: cfg.id });
    setTimeout(() => setSaveMessage(""), 3000);
  }

  function handleLoadConfig(cfg: SavedConfiguration) {
    if (cfg.inputMode === "custom" && cfg.customFluid) {
      setInputMode("custom");
      setCustomViscosity(cfg.customFluid.viscosity);
      setCustomDensity(cfg.customFluid.density);
      setCustomSurfaceTension(cfg.customFluid.surfaceTension);
      setCustomSolventClass(cfg.customFluid.solventClass as SolventClass);
      setCustomRheology(cfg.customFluid.rheology as RheologyType);
      setCustomPowerLawN(cfg.customFluid.powerLawN);
      setCustomParticleSize(cfg.customFluid.particleSize);
    } else {
      setInputMode("library");
      setFluidId(cfg.fluidId);
    }
    setPressure(cfg.pressure);
    setShowSaved(false);
    setResults(null);
    setSelectedFluid(null);
  }

  function handleDeleteConfig(id: string) {
    deleteConfig(id);
    setSavedConfigs(getSavedConfigs());
  }

  const filteredFluids = FLUIDS.filter(
    (f) => solventFilter === "all" || f.solventClass === solventFilter
  );

  async function handlePredict() {
    setLoading(true);

    if (inputMode === "custom") {
      // Build a custom fluid object and call predict client-side
      const { ACTUATORS, predict } = await import("@/lib/data");
      const customFluid: Fluid = {
        id: "CUSTOM",
        name: "Custom Fluid",
        viscosity_cP: customViscosity,
        density_kg_m3: customDensity,
        surfaceTension_mN_m: customSurfaceTension,
        pH: 7.0,
        solventClass: customSolventClass,
        flashPoint_C: null,
        cas: "—",
        category: "User-Defined",
        hazards: [],
        ppeRequired: [],
        rheology: customRheology,
        powerLawN: customRheology === "power_law" ? customPowerLawN : undefined,
        powerLawK: customRheology === "power_law" ? customViscosity / 1000 : undefined,
        maxParticleSize_um: customParticleSize > 0 ? customParticleSize : undefined,
      };
      const predResults = ACTUATORS.map((actuator) => ({
        actuator,
        prediction: predict(actuator, customFluid, pressure),
      }));
      predResults.sort((a, b) => b.prediction.compatibilityScore - a.prediction.compatibilityScore);
      setResults(predResults);
      setSelectedFluid(customFluid);
      trackEvent("prediction", { fluidId: "CUSTOM", pressure });
    } else {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fluidId, pressure_bar: pressure }),
      });
      const data = await res.json();
      setResults(data.results);
      setSelectedFluid(data.fluid);
      trackEvent("prediction", { fluidId, pressure });
    }
    setLoading(false);
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 4
          ? [...prev, id]
          : prev
    );
  }

  const compareUrl = compareIds.length >= 2
    ? `/compare?actuators=${compareIds.join(",")}&fluid=${selectedFluid?.id || fluidId}&pressure=${pressure}`
    : null;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--fg-bright)]">
            Actuator Configurator
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Define fluid properties and operating conditions. The engine predicts optimal actuator performance using type-specific atomization models.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="btn-secondary flex items-center gap-2 rounded-lg px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] tracking-wider"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
            </svg>
            Save
          </button>
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="btn-secondary flex items-center gap-2 rounded-lg px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] tracking-wider"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
            Load ({savedConfigs.length})
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="animate-in rounded-lg border border-[var(--success)]/30 bg-[var(--success)]/5 px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] text-[var(--success)]">
          {saveMessage}
        </div>
      )}

      {/* Saved Configurations Panel */}
      {showSaved && (
        <div className="glass animate-in rounded-xl p-6">
          <h2 className="mb-4 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
            Saved Configurations
          </h2>
          {savedConfigs.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No saved configurations. Run a prediction and click Save.</p>
          ) : (
            <div className="space-y-2">
              {savedConfigs.map((cfg) => (
                <div key={cfg.id} className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 transition-all hover:border-[var(--accent)]/50">
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-[var(--fg-bright)]">{cfg.name}</span>
                    <span className="ml-2 font-[family-name:var(--font-mono)] text-[10px] text-[var(--muted)]">
                      {new Date(cfg.createdAt).toLocaleDateString()}
                    </span>
                    {cfg.topScore !== undefined && (
                      <span className={`ml-2 rounded-md border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] font-bold ${
                        cfg.topScore >= 80 ? "border-[var(--success)] text-[var(--success)]" : cfg.topScore >= 50 ? "border-[var(--warning)] text-[var(--warning)]" : "border-[var(--danger)] text-[var(--danger)]"
                      }`}>
                        Best: {cfg.topScore}/100
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleLoadConfig(cfg)}
                    className="rounded-lg border border-[var(--accent)]/30 px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--accent)] transition-all hover:bg-[var(--accent)]/10"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDeleteConfig(cfg.id)}
                    className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pre-selected actuator banner */}
      {urlActuator && (() => {
        const preselected = ALL_ACTUATORS.find((a) => a.id === urlActuator);
        if (!preselected) return null;
        const color = ACTUATOR_COLORS[preselected.type] || "#06b6d4";
        return (
          <div className="glass animate-in rounded-xl p-4">
            <div className="flex items-center gap-4">
              <ActuatorIllustration type={preselected.type} size={48} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider" style={{ color }}>
                    {preselected.sku}
                  </span>
                  <span className="text-xs text-[var(--fg-bright)]">{preselected.name}</span>
                </div>
                <p className="mt-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--muted)]">
                  Selected from catalog — configure fluid properties below, then run prediction to see this actuator&apos;s ranking
                </p>
              </div>
              <Link
                href={`/results?actuator=${preselected.id}&fluid=${fluidId}&pressure=${pressure}`}
                className="btn-secondary rounded-lg px-4 py-2 font-[family-name:var(--font-mono)] text-[10px] tracking-wider no-underline"
              >
                Quick Detail
              </Link>
            </div>
          </div>
        );
      })()}

      {/* ===== STEP 1: FLUID INPUT ===== */}
      <div className="glass-bright rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
            Step 1 — Fluid Properties
          </h2>
          <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
            <button
              onClick={() => setInputMode("library")}
              className={`px-4 py-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider transition-all ${
                inputMode === "library" ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[var(--muted)]"
              }`}
            >
              Library ({FLUIDS.length} fluids)
            </button>
            <button
              onClick={() => setInputMode("custom")}
              className={`px-4 py-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider transition-all ${
                inputMode === "custom" ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[var(--muted)]"
              }`}
            >
              Custom Input
            </button>
          </div>
        </div>

        {inputMode === "library" ? (
          <>
            {/* Solvent class quick-filter */}
            <div>
              <label className="mb-2 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Solvent Class
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setSolventFilter("all"); setFluidId(FLUIDS[0].id); }}
                  className={`rounded-lg border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider transition-all ${
                    solventFilter === "all"
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50"
                  }`}
                >
                  All
                </button>
                {ALL_SOLVENT_CLASSES.map((sc) => {
                  const count = FLUIDS.filter((f) => f.solventClass === sc).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={sc}
                      onClick={() => {
                        setSolventFilter(sc);
                        const first = FLUIDS.find((f) => f.solventClass === sc);
                        if (first) setFluidId(first.id);
                      }}
                      className={`rounded-lg border px-3 py-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider transition-all ${
                        solventFilter === sc
                          ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                          : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50"
                      }`}
                    >
                      {SOLVENT_CLASS_LABELS[sc]} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-2 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Select Fluid
              </label>
              <select
                value={fluidId}
                onChange={(e) => setFluidId(e.target.value)}
                className="input-field w-full rounded-lg px-4 py-3 font-[family-name:var(--font-mono)] text-xs"
              >
                {filteredFluids.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} — {f.viscosity_cP} cP {f.rheology !== "newtonian" ? `(${f.rheology})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          /* Custom fluid input form */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Dynamic Viscosity (cP)
              </label>
              <input
                type="number" min={0.1} max={100000} step={0.1}
                value={customViscosity}
                onChange={(e) => setCustomViscosity(Number(e.target.value))}
                className="input-field w-full rounded-lg px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Density (kg/m³)
              </label>
              <input
                type="number" min={500} max={3000} step={1}
                value={customDensity}
                onChange={(e) => setCustomDensity(Number(e.target.value))}
                className="input-field w-full rounded-lg px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Surface Tension (mN/m)
              </label>
              <input
                type="number" min={10} max={80} step={0.1}
                value={customSurfaceTension}
                onChange={(e) => setCustomSurfaceTension(Number(e.target.value))}
                className="input-field w-full rounded-lg px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Solvent Class
              </label>
              <select
                value={customSolventClass}
                onChange={(e) => setCustomSolventClass(e.target.value as SolventClass)}
                className="input-field w-full rounded-lg px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs"
              >
                {ALL_SOLVENT_CLASSES.map((sc) => (
                  <option key={sc} value={sc}>{SOLVENT_CLASS_LABELS[sc]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Rheology Type
              </label>
              <select
                value={customRheology}
                onChange={(e) => setCustomRheology(e.target.value as RheologyType)}
                className="input-field w-full rounded-lg px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs"
              >
                <option value="newtonian">Newtonian</option>
                <option value="power_law">Power-Law (Shear-Thinning)</option>
                <option value="bingham">Bingham Plastic</option>
                <option value="herschel_bulkley">Herschel-Bulkley</option>
              </select>
            </div>
            {customRheology === "power_law" && (
              <div>
                <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                  Flow Index (n) <span className="normal-case">n&lt;1 = shear-thinning</span>
                </label>
                <input
                  type="number" min={0.1} max={2} step={0.01}
                  value={customPowerLawN}
                  onChange={(e) => setCustomPowerLawN(Number(e.target.value))}
                  className="input-field w-full rounded-lg px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs"
                />
              </div>
            )}
            <div>
              <label className="mb-1.5 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
                Max Particle Size (µm) <span className="normal-case">0 = no particles</span>
              </label>
              <input
                type="number" min={0} max={500} step={1}
                value={customParticleSize}
                onChange={(e) => setCustomParticleSize(Number(e.target.value))}
                className="input-field w-full rounded-lg px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* ===== STEP 2: OPERATING CONDITIONS ===== */}
      <div className="glass-bright rounded-xl p-6 space-y-5">
        <h2 className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
          Step 2 — Operating Conditions
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--muted)]">
              Operating Pressure (bar)
            </label>
            <input
              type="number"
              min={0.5}
              max={350}
              step={0.5}
              value={pressure}
              onChange={(e) => setPressure(Number(e.target.value))}
              className="input-field w-full rounded-lg px-4 py-3 font-[family-name:var(--font-mono)] text-xs"
            />
            <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--muted)]">Range: 0.5–350 bar</p>
          </div>
          <div className="flex items-end">
            <button
              onClick={handlePredict}
              disabled={loading}
              className="btn-primary w-full rounded-lg px-6 py-3 font-[family-name:var(--font-mono)] text-xs tracking-wider"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                    <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Computing...
                </span>
              ) : (
                "Run Prediction"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===== FLUID SUMMARY ===== */}
      {selectedFluid && (
        <div className="glass animate-in rounded-xl p-6">
          <h2 className="mb-4 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
            Fluid Profile — {selectedFluid.name}
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs md:grid-cols-4 lg:grid-cols-5">
            {[
              { label: "Viscosity", value: `${selectedFluid.viscosity_cP} cP` },
              { label: "Density", value: `${selectedFluid.density_kg_m3} kg/m³` },
              { label: "Surface Tension", value: `${selectedFluid.surfaceTension_mN_m} mN/m` },
              { label: "Solvent Class", value: SOLVENT_CLASS_LABELS[selectedFluid.solventClass] },
              { label: "Rheology", value: selectedFluid.rheology.replace("_", " ") },
              ...(selectedFluid.powerLawN ? [{ label: "Flow Index (n)", value: String(selectedFluid.powerLawN) }] : []),
              ...(selectedFluid.yieldStress_Pa ? [{ label: "Yield Stress", value: `${selectedFluid.yieldStress_Pa} Pa` }] : []),
              ...(selectedFluid.maxParticleSize_um ? [{ label: "Max Particle", value: `${selectedFluid.maxParticleSize_um} µm` }] : []),
              ...(selectedFluid.suspensionConcentration_pct ? [{ label: "Solids", value: `${selectedFluid.suspensionConcentration_pct}%` }] : []),
              { label: "pH", value: String(selectedFluid.pH) },
              { label: "Flash Point", value: selectedFluid.flashPoint_C !== null ? `${selectedFluid.flashPoint_C}°C` : "N/A" },
              { label: "CAS", value: selectedFluid.cas },
            ].map((item) => (
              <div key={item.label}>
                <span className="text-[var(--muted)]">{item.label}</span>
                <p className="mt-0.5 font-semibold text-[var(--fg-bright)]">{item.value}</p>
              </div>
            ))}
          </div>
          {(selectedFluid.hazards.length > 0 || selectedFluid.ppeRequired.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-4 border-t border-[var(--border)] pt-4">
              {selectedFluid.hazards.length > 0 && (
                <div>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--danger)]">Hazards</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedFluid.hazards.map((h) => (
                      <span key={h} className="rounded-md border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--danger)]">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedFluid.ppeRequired.length > 0 && (
                <div>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--warning)]">PPE Required</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedFluid.ppeRequired.map((p) => (
                      <span key={p} className="rounded-md border border-[var(--warning)]/30 bg-[var(--warning)]/5 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--warning)]">
                        {p.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===== RESULTS ===== */}
      {results && (
        <div className="animate-in">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--fg-bright)]">
              Predicted Configurations ({results.length} actuators ranked)
            </h2>
            {compareIds.length >= 2 && compareUrl && (
              <Link
                href={compareUrl}
                className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-[family-name:var(--font-mono)] text-[11px] tracking-wider no-underline"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                </svg>
                Compare Selected ({compareIds.length})
              </Link>
            )}
            {compareIds.length === 1 && (
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--muted)]">
                Select 1 more to compare
              </span>
            )}
          </div>

          <div className="space-y-4">
            {results.map((r, i) => {
              const color = ACTUATOR_COLORS[r.actuator.type] || "#06b6d4";
              const hasWarnings = r.prediction.safetyWarnings.length > 0;
              const dist = r.prediction.dropletDistribution;
              const isSelectedForCompare = compareIds.includes(r.actuator.id);
              return (
                <div
                  key={r.actuator.id}
                  className={`glass group rounded-xl p-5 transition-all hover:border-[var(--border-bright)] ${hasWarnings ? "border-l-2 border-l-[var(--danger)]" : ""} ${isSelectedForCompare ? "ring-1 ring-[var(--accent)]/40" : ""}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                      {/* Compare checkbox */}
                      <button
                        onClick={() => toggleCompare(r.actuator.id)}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-all ${
                          isSelectedForCompare
                            ? "border-[var(--accent)] bg-[var(--accent)]/10"
                            : "border-[var(--border)] hover:border-[var(--accent)]/50"
                        }`}
                        title={isSelectedForCompare ? "Remove from comparison" : "Add to comparison"}
                      >
                        {isSelectedForCompare ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        ) : (
                          <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-[var(--muted)]">#{i + 1}</span>
                        )}
                      </button>
                      <div className="flex items-center gap-3">
                        <ActuatorIllustration type={r.actuator.type} size={56} />
                        <SprayPatternIllustration type={r.actuator.type} size={40} />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2 flex-wrap">
                        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider" style={{ color }}>
                          {r.actuator.sku}
                        </span>
                        <span className="text-xs text-[var(--muted)]">{r.actuator.name}</span>
                        <RegimeBadge regime={r.prediction.atomizationRegime} />
                        <CloggingBadge risk={r.prediction.cloggingRisk} />
                      </div>

                      {/* Primary metrics */}
                      <div className="mt-2 flex flex-wrap gap-4 font-[family-name:var(--font-mono)] text-[11px]">
                        <span><span className="text-[var(--muted)]">Cone:</span> <strong className="text-[var(--fg-bright)]">{r.prediction.coneAngle_deg}°</strong></span>
                        <span>
                          <span className="text-[var(--muted)]">Dv10/50/90:</span>{" "}
                          <strong className="text-[var(--fg-bright)]">{dist.Dv10_um}/{dist.Dv50_um}/{dist.Dv90_um} µm</strong>
                        </span>
                        <span><span className="text-[var(--muted)]">Span:</span> <strong className="text-[var(--fg-bright)]">{dist.span}</strong></span>
                        <span><span className="text-[var(--muted)]">Flow:</span> <strong className="text-[var(--fg-bright)]">{r.prediction.flowRate_mL_min} mL/min</strong></span>
                        <span><span className="text-[var(--muted)]">Rate:</span> <strong className="text-[var(--fg-bright)]">{r.prediction.deliveryRate_g_s} g/s</strong></span>
                      </div>

                      {/* Apparent viscosity for non-Newtonian */}
                      {selectedFluid && selectedFluid.rheology !== "newtonian" && (
                        <div className="mt-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--muted)]">
                          Apparent viscosity at orifice: {r.prediction.apparentViscosity_cP} cP
                        </div>
                      )}

                      {/* Material stress indicators */}
                      {(r.prediction.materialStress.swellingRisk || r.prediction.materialStress.stressCrackingRisk) && (
                        <div className="mt-1 flex gap-2">
                          {r.prediction.materialStress.swellingRisk && (
                            <span className="rounded-md border border-[var(--warning)]/40 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-[var(--warning)]">Swelling Risk</span>
                          )}
                          {r.prediction.materialStress.stressCrackingRisk && (
                            <span className="rounded-md border border-[var(--danger)]/40 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-[var(--danger)]">Stress Crack Risk</span>
                          )}
                          {r.prediction.materialStress.leachingRisk && (
                            <span className="rounded-md border border-[var(--warning)]/40 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-[var(--warning)]">Leaching Risk</span>
                          )}
                        </div>
                      )}

                      {/* Safety warnings */}
                      {hasWarnings && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {r.prediction.safetyWarnings.slice(0, 3).map((w, wi) => (
                            <span key={wi} className="rounded-md border border-[var(--danger)]/30 bg-[var(--danger)]/5 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-[var(--danger)]">
                              {w.split(":")[0]}
                            </span>
                          ))}
                          {r.prediction.safetyWarnings.length > 3 && (
                            <span className="text-[var(--danger)] text-[9px]">+{r.prediction.safetyWarnings.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <ScoreBadge score={r.prediction.compatibilityScore} />
                      <Link
                        href={`/results?actuator=${r.actuator.id}&fluid=${selectedFluid?.id}&pressure=${pressure}`}
                        className="btn-secondary rounded-lg px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] tracking-wider no-underline"
                      >
                        Detail
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating compare bar */}
      {compareIds.length >= 1 && results && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 animate-in">
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border-bright)] bg-[var(--bg)]/95 px-5 py-3 shadow-lg backdrop-blur-xl">
            <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--muted)]">
              {compareIds.length} selected
            </span>
            {compareIds.length >= 2 && compareUrl ? (
              <Link
                href={compareUrl}
                className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-2 font-[family-name:var(--font-mono)] text-[11px] tracking-wider no-underline"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                </svg>
                Compare Side-by-Side
              </Link>
            ) : (
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--accent)]">
                Select {2 - compareIds.length} more
              </span>
            )}
            <button
              onClick={() => setCompareIds([])}
              className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] transition-colors"
              title="Clear selection"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConfigurePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <svg className="h-8 w-8 animate-spin text-[var(--accent)]" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
            <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      }
    >
      <ConfigureContent />
    </Suspense>
  );
}
