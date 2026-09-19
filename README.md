# 🏗️ Tawreed Platform — Chapter One: Contracting (منصّة توريد)

> **Next-Generation Saudi Procurement Platform** unifying general contractors, MEP specialists, and developers into a frictionless, instant quotation engine.

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Saudi Vision 2030](https://img.shields.io/badge/Saudi_Vision-2030-006C35?style=for-the-badge)](https://www.vision2030.gov.sa/)

---

## 🌟 Overview & Problem Statement

In the traditional construction procurement workflow, obtaining official supplier quotes often requires endless WhatsApp group inquiries, unstandardized pricing sheets, and multi-day delays.

**Tawreed Platform (منصّة توريد)** re-engineers this workflow:
1. **Standardized Bill of Quantities (BoQ)**: Clients configure requirements with line-item precision.
2. **Instant Price Book Matching**: Generates certified price quotes within seconds from live supplier books.
3. **Zero Platform Leakage**: Solves the classic commission dispute problem using a transparent **Lead Fee** unlock model.
4. **Bilingual Engine**: Fully responsive in English (`LTR`) and Arabic (`RTL`) powered by Google Translate integration in `index.html`.

---

## ✨ Key Features & Architectural Sections

### 1. 🎬 Cinematic Hero Section (`Hero.jsx`)
* Theatrical letterbox curtain opening transition upon page mount.
* Ambient luxury gold radial glow (`#d9a441`) with corner-bracket architectural motifs.
* Clear trust badges: Verified Saudi Contractors, Instant Quotation Engine, Zero Middleman Friction.

### 2. 🏛️ Chapter One: Contracting Divisions (`Acts.jsx`)
* Comprehensive catalog of contracting specializations:
  * **Civil & Structural Construction** (Concrete casting, brickwork, excavation)
  * **MEP Engineering** (Electrical panels, main plumbing conduits)
  * **HVAC & Industrial Cooling** (Split units, centralized ducts, Freon)
  * **Finishing & Fitout** (Gypsum board, interior coating, architectural lighting)
  * **Waterproofing & Thermal Insulation** (Saudi code-compliant membranes)
* Interactive division filter pills and future chapters roadmap teaser (Heavy Equipment & Bulk Materials).

### 3. 🛡️ The Players & Compliance Standards (`Crew.jsx`)
* Dossiers of participating entities: **Smatinbox Establishment** (Verified Supplier) & **Karam Al-Watan Co.** (Commercial Developer).
* 4-Stage Saudi Government Compliance Verification (Commercial Registration CR via MoCI, Chamber of Commerce GCCI, ZATCA 15% VAT, and physical site audits).

### 4. 🎞️ Five Scenes Workflow (`Scenes.jsx`)
* Interactive clickable timeline reel demonstrating the entire life cycle:
  1. *Structured Request Intake*
  2. *Automated Categorization & SBC Code Validation*
  3. *Targeted Regional Dispatch*
  4. *Standardized Quotation Matrix*
  5. *Award & Direct Contact Unlock*
* Live mock terminal simulation logs for each step.

### 5. ⚡ Interactive Live Quotation Demo (`Demo.jsx`)
* **Spacious Configurator**: Select category, city (Riyadh, Jeddah, Dammam, Khobar), and line items with interactive `+` / `-` quantity steppers.
* **Live Calculation**: Auto-computes Subtotal, ZATCA 15% VAT, and Grand Total.
* **Official Quote Sheet**: Generates an authentic printable quotation document complete with reference number, dates, itemized table, and a functional `window.print()` PDF button.
* **Lead Fee Unlock Simulation**: Simulates unlocking direct phone and WhatsApp contact details.

### 6. 💼 Sustainable Monetization Model (`Model.jsx`)
* Explains why percentage commissions fail in construction (offline transaction evasion) and why the upfront **Lead Fee** model guarantees 100% cash flow capture.
* Transparent tiered fee schedule (35 SAR / 75 SAR / 150 SAR).
* **Interactive Contractor ROI Calculator**: Demonstrates customer acquisition savings compared to traditional 8-10% broker fees.

### 7. 🚀 Dual Call-to-Action & Footer (`Closing.jsx` & `Footer.jsx`)
* Two dedicated pathways for Project Owners (Submit RFQ) and Contractors (Register License).
* Comprehensive corporate footer with regional coverage and back-to-top navigation.

---

## 🛠️ Tech Stack

* **Frontend**: React (Vite)
* **Styling**: Tailwind CSS / Modern CSS Variables
* **Typography**: Google Fonts (*Tajawal* & *Noto Kufi Arabic*)
* **Internationalization**: Real-time Arabic (RTL) / English (LTR) switcher
* **Icons & Assets**: Custom SVG & Unicode geometric emblems

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/tawreed-platform.git
cd tawreed-platform