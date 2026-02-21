# AeroSpec: Features & Improvements

## New Features Added (This Session)

### 1. Type-Specific Physics Models
The prediction engine now uses empirically-validated models tailored to each actuator geometry:

- **Lefebvre Model** (Swirl Nozzles): Derives cone angle from swirl number calculated from actual internal channel dimensions
- **Dombrowski & Johns** (Flat Fan): Specific droplet size correlation for flat fan atomization
- **Nukiyama & Tanasawa** (Air-Atomizing): Accounts for the liquid-to-air pressure ratio relationship
- **Lang Model** (Ultrasonic): Frequency-dependent droplet size calculation
- **Metered-Dose Pump Model**: Flow rate and dispersion profiles for pump-actuated systems

### 2. Geometry-Based Swirl Calculation
Instead of generic assumptions, the engine now calculates **swirl number** from actual chamber dimensions:
- Number of swirl channels
- Channel width and depth
- Tangential entry dimensions
- Chamber diameter and length

This produces **precision predictions** that scale to your exact hardware geometry.

### 3. Material-Specific Chemical Attack Detection
Automatic warnings for incompatibilities between fluids and materials:
- **Ketones** attack POM (Delrin) and Buna-N
- **Esters** degrade Buna-N
- **Hydrocarbons** swell EPDM
- **Silicone fluids** dissolve silicone seals
- **Caustics** corrode aluminum and attack certain elastomers

Each incompatibility carries a –10 point penalty in the compatibility score.

### 4. Enhanced Compatibility Scoring Algorithm
Multi-factor weighted scoring (previously: simple material + pressure):

| Factor | Points | Description |
|--------|--------|-------------|
| Material match | 50 | Base compatibility |
| Pressure ratio optimization | 12–20 | How well the actuator operates at your pressure |
| Atomization regime quality | 0–15 | Whether the fluid-pressure combination produces good atomization |
| Viscosity suitability | 0–10 | Actuator type-specific viscosity performance |
| **Penalties** | — | —
| Material chemical attack | –10 | Per incompatibility (e.g., ketones + POM) |
| **Bonuses** | — | —
| Seal material match | +5 | When seals are specifically suitable |

**Result**: More accurate top-3 recommendations that account for real-world performance factors.

### 5. Discharge Coefficient Empirical Table
Per-actuator-type discharge coefficients from experimental data:
- Full cone: Cd = 0.55
- Hollow cone: Cd = 0.45
- Flat fan: Cd = 0.65
- Fine mist: Cd = 0.40
- Jet stream: Cd = 0.82
- Air-atomizing: Cd = 0.60
- Spiral: Cd = 0.70
- Deflection: Cd = 0.75
- Ultrasonic: Cd = 0.30
- Multi-orifice: Cd = 0.50
- Adjustable cone: Cd = 0.50
- Impingement: Cd = 0.72

---

## Existing Core Features

### Prediction Configurator
1. **Fluid Selection**: Choose from 25 pre-loaded Newtonian fluids or enter custom properties
   - Viscosity, density, surface tension, flash point
   - Hazard and PPE data
   - 9 solvent classes (ester, ketone, hydrocarbon, caustic, silicone, alcohol, water, acid, nitrate)

2. **Pressure Input**: 1–350 bar operating range
   - Real-time Ohnesorge and Weber number classification
   - Automatic atomization regime prediction (full cone, mist, etc.)

3. **Prediction Results**: Ranked list of 27 compatible actuators
   - Compatibility score (0–100)
   - Predicted spray angle ±10°
   - Predicted SMD droplet size
   - Safety warnings
   - Material compatibility flags

### Comparison Tool
Side-by-side comparison of up to 3 actuators:
- Spray angle and pattern visualization
- Droplet size ranges
- Material compatibility
- Price per unit
- Industries served
- Direct link to procurement

### Actuator Catalog
- **27 total actuators**: 12 Spencer precision nozzles + 15 Coster aerosol/perfume nozzles
- Full technical specifications:
  - Body and seal materials
  - Orifice diameter
  - Swirl angle
  - Max operating pressure
  - Spray pattern (cone, flat, mist, etc.)
- Filtered by manufacturer and industry
- Inline industry and material badges

### Fluid Library
- **25 Newtonian test fluids** with complete data
- Searchable by solvent class
- Hazard warnings (flammable, health, environmental)
- PPE recommendations
- Chemical properties (viscosity, density, surface tension, flash point)

### Procurement System
- Sample and bulk ordering
- Volume-based discounts (10 units: 10%, 50 units: 15%, 500+: 20%)
- Ship-to address entry
- Order status tracking (future: integration with supplier APIs)

---

## Homepage Redesign

### New Sections

#### 1. Hero + Value Proposition
"Find the Right Actuator Instantly" with emphasis on:
- Physics-based predictions (not guesswork)
- Material compatibility detection
- Real-time regime classification
- Two primary CTAs: "Start Configuration" and "Learn How It Works"

#### 2. Key Stats Cards
Display at a glance:
- 27 actuator types
- 25 fluid database
- 7 industries served
- 9 solvent classes

#### 3. "How It Works" Workflow
Step-by-step visual guide:
1. **Select Fluid**: Choose from 25 fluids or enter custom properties
2. **Set Pressure**: Define operating range (1–350 bar); engine classifies regime
3. **Get Predictions**: Receive ranked, compatible actuators with scores
4. **Compare & Order**: Side-by-side comparison with material warnings and procurement

#### 4. "Why AeroSpec" Features
Four key differentiators:
- **Type-Specific Physics**: Lefebvre, Dombrowski & Johns, Nukiyama & Tanasawa, Lang models
- **Material Compatibility**: Automatic chemical attack detection (ketones on POM, hydrocarbons on EPDM, etc.)
- **Regime Classification**: Real-time Ohnesorge and Weber number calculations
- **Geometry-Based Predictions**: Swirl number from actual chamber dimensions

#### 5. Improved Catalog Section
- Better filter organization ("By Brand", "By Industry")
- Cleaner cards with key specs (orifice, pressure, angle, price)
- Industry badges with overflow handling (+2 more)
- Material compatibility tags

#### 6. Fluid Library Section
- Solvent class filters
- Sortable table with hazard indicators
- Flash point color-coding (red for < 23°C flammables)
- Hazard overflow with count (e.g., "+3 more hazards")

#### 7. Bottom CTA
Persistent call-to-action: "Ready to find your actuator?"

---

## UX/UI Best Practices Applied

✅ **Clear Information Hierarchy**: Hero → education → discovery → action
✅ **Progressive Disclosure**: "How It Works" before asking to use the tool
✅ **Visual Feedback**: Hover states, color-coded hazards, badges
✅ **Mobile-First Layout**: Responsive grid, horizontal scroll tables
✅ **Accessibility**: ARIA labels, semantic HTML, sufficient color contrast
✅ **Scannable Design**: Short paragraphs, numbered steps, emoji iconography
✅ **Trust Signals**: Extensive data (27 actuators, 25 fluids), scientific foundation
✅ **Multiple CTAs**: Different entry points for different user intent
✅ **Consistent Typography**: Monospace for technical terms (SKU, pressure, viscosity)
✅ **Glass Morphism**: Modern card design with subtle transparency

---

## Cost Efficiency

✅ **Zero environment variables** required to deploy
✅ **Zero external tools** needed for core app
✅ **Zero database** required
✅ **Vercel free tier** deployment ready

SaaS infrastructure (auth, billing, teams, saved configs) is dormant and ready to activate with env vars when needed — no code changes required.

---

## Files Modified

- **`src/app/page.tsx`**: Complete homepage redesign (271 insertions, 172 deletions)
- **`src/lib/data.ts`**: Type-specific physics models, improved compatibility scoring, material attack warnings (already committed)
- **`drizzle.config.ts`**, **SaaS routes**, **middleware**: Lazy initialization (already committed)

---

## Next Steps (Not Included)

If interested in future enhancements:
1. **Non-Newtonian fluid support**: Power-law and Bingham models for paints, gels
2. **Propellant-liquid interaction** for aerosol products (Coster focus)
3. **Temperature-dependent viscosity** curves
4. **Historical prediction feedback loop**: Track which predictions matched real-world tests
5. **API access tier**: Programmatic access to prediction engine
6. **Custom actuator database**: Allow users to upload their own geometries for prediction
