# Tugnay (Tugon at Ugnay) · Barangay Balibago

An open-access civic operations platform and municipal issue tracking system built for **Barangay Balibago, Angeles City, Pampanga**.

> *"Bawat tugon, panibagong ugnay sa komunidad."*

---

## Executive Summary & Purpose

Local barangay administration frequently faces operational challenges regarding public infrastructure maintenance, drainage reporting, street lighting outages, and emergency response coordination. Information gaps between community residents and municipal government units often result in unverified reports, duplicated work orders, or premature ticket closures without verifiable physical resolution.

**Tugnay** (derived from **Tugon at Ugnay** — *Mabilis na Tugon, Matibay na Ugnay*) was engineered to address these challenges by providing a centralized, transparent platform for civic issue intake, real-time spatial visualization, and resident-backed resolution verification. By combining location-precise reporting with OpenStreetMap geospatial rendering, the system establishes a reliable operational feedback loop between community members, municipal inspectors, and public works departments.

---

## Civic Significance & Operational Impact

1. **Accountability Through Resident Verification**
   Traditional municipal ticketing systems allow administrative staff to close maintenance requests unilaterally. BayanLink introduces a Resident Verification Protocol requiring local community confirmation before a ticket achieves permanent resolution status, preventing unverified closures.

2. **Geospatial Issue Mapping & Spatial Awareness**
   By plotting reports onto real-world geographical coordinates using OpenStreetMap raster tiles, local officials can identify high-density hazard zones, recurring drainage blockages along major thoroughfares (such as Fields Avenue and the MacArthur Highway corridor), and underserved residential puroks.

3. **Streamlined Service Accessibility**
   Beyond issue tracking, the platform serves as an official public service directory, detailing requirements, fee schedules, and processing timelines for essential municipal clearances (including Barangay Certificates, Certificates of Indigency, and Business Permit Clearances).

4. **Emergency Hotline Coordination**
   The platform integrates direct contact routing for local emergency response agencies, including Police Station 4 (Balibago Substation), the Bureau of Fire Protection (BFP), and the Angeles City Disaster Risk Reduction and Management Office (ACDRRMO).

---

## System Architecture & Technical Specifications

BayanLink is built as a full-stack, type-safe web application utilizing modern web standards for fast load speeds, offline-resilient local caching, and low-latency interaction.

### Technology Stack

- **Application Framework**: TanStack Start (React 19)
- **Routing Engine**: TanStack Router (File-Based Type-Safe Routing)
- **Language**: TypeScript
- **Geospatial Engine**: OpenStreetMap (Mercator Projection & Raster Tile Rendering)
- **UI Architecture & Styling**: Tailwind CSS (v4), Radix UI Primitives, Lucide Icons
- **Data Visualization**: Recharts

---

## Local Development & Execution

### Prerequisites

- Node.js version 18.0.0 or higher
- npm package manager

### Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/matthewsardeng/BayanLink.git
   cd BayanLink
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Build production bundle:
   ```bash
   npm run build
   ```

---

## Institutional Context

- **Jurisdiction**: Barangay Balibago, Angeles City, Pampanga, Philippines
- **Region**: Central Luzon (Region III)
- **Postal Code**: 2009
- **Geographical Coordinates**: 15.1663° N, 120.5901° E
