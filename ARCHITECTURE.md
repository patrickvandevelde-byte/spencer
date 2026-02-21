# AeroSpec — System Architecture

> Last updated: 2026-02-21 | Version: 0.3.0 (Phase 3 Complete)

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16.1.6 (App Router) | SSR/SSG, API routes, edge deployment |
| **Language** | TypeScript 5.9 | Type-safe codebase |
| **Styling** | Tailwind CSS 4 | "Clinical Brutalist" design system |
| **3D Rendering** | React Three Fiber + Three.js | Interactive actuator visualization |
| **ORM** | Drizzle ORM | Type-safe DB schema (PostgreSQL) |
| **Auth** | jose + bcryptjs | JWT tokens, password hashing |
| **Payments** | Stripe SDK | Payment integration (ready, not wired) |
| **Validation** | Zod 4 | Runtime schema validation |
| **Deployment** | Vercel Edge | Sub-100ms global response times |

---

## Directory Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage — catalog, search, hero
│   ├── layout.tsx                # Root layout with nav, footer
│   ├── globals.css               # Design system (CSS variables)
│   ├── configure/page.tsx        # Actuator configurator (save/load configs)
│   ├── results/page.tsx          # Prediction detail (PDF/CSV export, stem/ergonomics)
│   ├── compare/page.tsx          # Side-by-side actuator comparison
│   ├── procurement/page.tsx      # Order placement (stock status, pricing tiers)
│   ├── cart/page.tsx             # Shopping cart with checkout
│   ├── orders/page.tsx           # Order tracking and history
│   ├── analytics/page.tsx        # Usage dashboard (metrics, top SKUs)
│   └── api/                      # API routes
│       ├── predict/route.ts      # POST prediction endpoint
│       ├── compatibility/route.ts # Compatibility matrix
│       ├── configurations/       # CRUD for saved configurations
│       ├── procurements/route.ts # Procurement orders
│       ├── auth/                 # Login, signup, logout, invite
│       ├── billing/              # Stripe subscription endpoints
│       ├── tenants/              # Multi-tenant member management
│       └── webhooks/             # Stripe webhook handler
├── components/
│   ├── ActuatorIllustrations.tsx  # SVG actuator type illustrations
│   ├── ActuatorViewer3D.tsx       # R3F 3D parametric viewer
│   └── TechnicalDesign.tsx        # Engineering spec panel
├── lib/
│   ├── data.ts                    # Core data + physics engine (~2000 lines)
│   └── store.ts                   # Client-side persistence (localStorage)
├── db/
│   └── schema.ts                  # Drizzle PostgreSQL schema
└── middleware.ts                   # Auth middleware (JWT verification)
```

---

## Physics Engine (`src/lib/data.ts`)

The prediction engine is a deterministic, physics-based model — not ML. It implements:

### Atomization Models
| Model | Actuator Type | Source |
|-------|--------------|--------|
| **Lefebvre Swirl** | full_cone, hollow_cone, fine_mist, adjustable_cone | Swirl number → cone angle |
| **Dombrowski & Johns** | flat_fan | Slot aspect ratio correlation |
| **Nukiyama & Tanasawa** | air_atomizing | Air-to-liquid pressure ratio |
| **Lang** | ultrasonic | Frequency-dependent droplet size |
| **Rayleigh** | jet_stream | Jet breakup length |
| **Metered-dose** | spray_pump, perfumery_pump | Spring force + dosage model |

### Flow Equations
- **Bernoulli** with type-specific discharge coefficients (12 types)
- **Non-Newtonian apparent viscosity** at orifice shear rate
- **Dimensionless numbers**: Reynolds, Weber, Ohnesorge
- **Regime classification**: Rayleigh → Wind-induced → Wind-stressed → Atomization

### Droplet Distribution
Full Dv10/Dv50/Dv90 distribution with span calculation:
- Dv50 from type-specific correlations
- Dv10 ≈ 0.45 × Dv50 (adjusted by regime)
- Dv90 ≈ 1.8 × Dv50 (adjusted by regime)
- Span = (Dv90 - Dv10) / Dv50

### Material Compatibility
Multi-factor scoring (0–100):
- 50 pts: Polymer–solvent compatibility matrix
- 12–20 pts: Pressure ratio (operating/max)
- 0–15 pts: Atomization quality (regime-dependent)
- 0–10 pts: Viscosity suitability
- -10 pts per chemical attack (ketone/POM, ester/Buna-N, etc.)
- +5 pts seal material match

### Tooling Recommendations
Volume-driven process selection:
| Volume | Process | Lead Time | Tool Cost |
|--------|---------|-----------|-----------|
| 1–5 | FDM 3D Print | 2 days | $0 |
| 6–25 | SLA Resin | 3 days | $0 |
| 26–100 | SLS Nylon | 5 days | $150 |
| 101–1,000 | Soft Tooling | 10–14 days | $1,200–$3,000 |
| 1,000+ | Hardened Steel | 21–35 days | $32K–$256K |

---

## Data Model

### Actuators (27 total)
- **12 Spencer** precision industrial nozzles
- **15 Coster** aerosol/perfume/consumer actuators
- **12 spray types**: full_cone, hollow_cone, flat_fan, fine_mist, jet_stream, air_atomizing, spiral, deflection, ultrasonic, multi_orifice, adjustable_cone, impingement

Each actuator includes:
- Technical design (dimensions, materials, geometry, stem profile)
- Kinematic limits (actuation force, stroke, return speed, prime strokes)
- Regulatory flags (CR, FDA, cleanroom class)
- Cost, lead time, compatible industries

### Fluids (25 total)
- **9 solvent classes**: aqueous, alcohol, hydrocarbon, silicone, glycol, ketone, ester, emulsion, caustic
- **4 rheology types**: Newtonian, power-law, Bingham, Herschel-Bulkley
- Full properties: viscosity, density, surface tension, pH, flash point, CAS, hazards, PPE

---

## Client-Side Persistence (`src/lib/store.ts`)

All user state is stored in `localStorage` (no backend required):

| Store | Key | Data |
|-------|-----|------|
| **Saved Configurations** | `aerospec_configs` | Fluid params, pressure, top result |
| **Shopping Cart** | `aerospec_cart` | Actuator IDs, quantities, order type |
| **Orders** | `aerospec_orders` | PO numbers, items, status, totals |
| **Analytics** | `aerospec_analytics` | Event log (predictions, exports, etc.) |

Stock levels are deterministically simulated from actuator ID hash.

---

## Database Schema (`src/db/schema.ts`)

PostgreSQL via Drizzle ORM (for future multi-tenant deployment):

| Table | Purpose |
|-------|---------|
| `users` | User accounts with bcrypt-hashed passwords |
| `tenants` | Multi-tenant organizations |
| `tenantMembers` | User-tenant membership with roles |
| `invitations` | Team invitation tokens |
| `configurations` | Saved actuator configurations |
| `configurationVersions` | Version history per configuration |
| `procurements` | Purchase orders |
| `procurementItems` | Line items per PO |
| `feedback` | Prediction accuracy feedback |
| `subscriptions` | Stripe subscription records |

---

## API Routes

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/predict` | POST | No | Run physics prediction |
| `/api/compatibility` | POST | No | Compatibility matrix |
| `/api/configurations` | GET/POST | Yes | List/create configs |
| `/api/configurations/[id]` | GET/PUT/DELETE | Yes | Config CRUD |
| `/api/procurements` | GET/POST | Yes | List/create orders |
| `/api/auth/login` | POST | No | JWT login |
| `/api/auth/signup` | POST | No | User registration |
| `/api/auth/logout` | POST | Yes | Clear session |
| `/api/auth/accept-invitation` | POST | No | Join tenant |
| `/api/tenants/members` | GET | Yes | List team members |
| `/api/tenants/members/invite` | POST | Yes | Send invitation |
| `/api/billing/subscribe` | POST | Yes | Create Stripe subscription |
| `/api/billing/subscription` | GET | Yes | Get subscription status |
| `/api/webhooks/stripe` | POST | No | Stripe event handler |

---

## Page Architecture

### `/configure` — Actuator Configurator
**Input**: Fluid selection (library or custom) + operating pressure
**Output**: Ranked list of 27 actuators with compatibility scores
**Features**: Save/load configurations, solvent class filtering, non-Newtonian support

### `/results` — Prediction Detail
**Input**: Actuator ID + Fluid ID + Pressure (query params)
**Output**: Full technical report
**Sections**: Score banner, material stress, safety warnings, droplet distribution, spray physics, dimensionless numbers, performance vs. pressure chart, 3D viewer, spray pattern visualization, valve stem/ergonomics, tooling recommendation, regulatory compliance, actuator specs, technical design
**Export**: CSV, PDF (print-based), Add to Cart

### `/compare` — Side-by-Side Comparison
**Input**: 2–4 actuator selections + fluid + pressure
**Output**: Comparison table with highlighted best-in-class metrics

### `/procurement` — Order Placement
**Input**: Actuator selection + quantity + order type (sample/bulk)
**Output**: Order confirmation with PO number
**Features**: Stock status, volume discounts, lead times, add to cart

### `/cart` — Shopping Cart
**Input**: Cart items from any page
**Output**: Order summary with checkout
**Features**: Quantity adjustment, line totals, volume discount calculation

### `/orders` — Order Tracking
**Output**: Order list with status progression, delivery estimates, item details

### `/analytics` — Usage Dashboard
**Output**: Stat cards, activity heatmap (30 days), top actuators/fluids, recent orders

---

## Design System

The "Clinical Brutalist" design system uses CSS custom properties:

```css
--bg: #0a0a0a          /* Deep black background */
--surface: #141414     /* Elevated surface */
--border: #1f1f1f      /* Subtle borders */
--fg: #a1a1a1          /* Body text */
--fg-bright: #e5e5e5   /* Headings */
--accent: #06b6d4      /* Cyan primary */
--accent-secondary: #8b5cf6  /* Purple secondary */
--success: #22c55e     /* Green */
--warning: #f59e0b     /* Amber */
--danger: #ef4444      /* Red */
```

Typography: JetBrains Mono (monospace) for data, system sans-serif for prose.

---

## Deployment

- **Frontend**: Vercel Edge (static prerendering + dynamic API routes)
- **Database**: PostgreSQL (Neon/Supabase recommended)
- **3D Assets**: Client-side procedural generation (no external models)
- **No external APIs required**: All physics computation is client/server-side

### Environment Variables
```
DATABASE_URL=           # PostgreSQL connection string
JWT_SECRET=             # HS256 signing secret
STRIPE_SECRET_KEY=      # Stripe API key
STRIPE_WEBHOOK_SECRET=  # Stripe webhook verification
```

---

## What's Next (Phase 4+)

| Feature | Phase | Effort |
|---------|-------|--------|
| CAD generation (STEP/IGES) | 4 | 3–4 weeks |
| Live supplier API integration | 4 | 2–3 weeks |
| Propellant-liquid interaction models | 4 | 2 weeks |
| Temperature-dependent viscosity | 4 | 1 week |
| Post-purchase feedback loop | 5 | 1–2 weeks |
| ML surrogate model training | 5 | 4–6 weeks |
| ERP webhooks (SAP, NetSuite) | 5 | 3–4 weeks |
| SAML/OAuth SSO | 5 | 2 weeks |
| White-label SaaS | 6 | 4–6 weeks |
