# Tugnay (Tugon at Ugnay) · Barangay Balibago

An open-access civic operations platform and municipal issue tracking system built for **Barangay Balibago, Angeles City, Pampanga**.

> *"Bawat tugon, panibagong ugnay sa komunidad."*

---

## Executive Summary & Purpose

**Tugnay** (derived from **Tugon at Ugnay** — *Mabilis na Tugon, Matibay na Ugnay*) is an integrated civic operations platform engineered for Barangay Balibago. Local barangay administration frequently faces operational challenges regarding public infrastructure maintenance, drainage reporting, street lighting outages, and emergency response coordination.

**Tugnay** provides a centralized, transparent platform for civic issue intake, real-time spatial visualization, online clearance applications, and resident-backed resolution verification.

---

## Civic Significance & Operational Impact

1. **Accountability Through Resident Verification**
   Traditional municipal ticketing systems allow administrative staff to close maintenance requests unilaterally. Tugnay introduces a Resident Verification Protocol requiring local community confirmation before a ticket achieves permanent resolution status.

2. **Geospatial Issue Mapping & Spatial Awareness**
   By plotting reports onto real-world geographical coordinates using OpenStreetMap raster tiles, local officials can identify high-density hazard zones, recurring drainage blockages along major thoroughfares (Fields Avenue, MacArthur Highway), and underserved residential puroks.

3. **Streamlined Service Accessibility**
   Serves as an official public service directory for online clearance applications (Barangay Certificates, Certificates of Indigency, and Business Permit Clearances).

4. **Emergency Hotline Coordination**
   Integrates direct contact routing for local emergency response agencies, including Police Station 4 (Balibago Substation), the Bureau of Fire Protection (BFP), and ACDRRMO.

---

## System Architecture & Technical Specifications

- **Application Framework**: TanStack Start (React 19)
- **Routing Engine**: TanStack Router (File-Based Type-Safe Routing)
- **Language**: TypeScript
- **Geospatial Engine**: OpenStreetMap (Mercator Projection & Raster Tile Rendering)
- **UI Architecture & Styling**: Tailwind CSS, Radix UI Primitives, Lucide Icons

---

## Local Development & Execution

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build production bundle:
   ```bash
   npm run build
   ```

---

## Institutional Context

- **Jurisdiction**: Barangay Balibago, Angeles City, Pampanga, Philippines
- **Region**: Central Luzon (Region III)
- **Postal Code**: 2009
- **Geographical Coordinates**: 15.1663° N, 120.5901° E
