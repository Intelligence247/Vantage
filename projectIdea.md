# PROJECT BLUEPRINT: Sovereign Estate (PropTech Platform)
> **Version:** 2.0 (Product Scope & Features Only)
> **Vision:** A centralized, government-standard real estate marketplace for Nigeria, merging high-end property discovery with trust, transparency, and modern technology.

---

## 1. Executive Summary
A multi-vendor real estate platform designed to bridge the gap between Nigerian property seekers and legitimate agents/landlords. The system prioritizes **User Verification**, **High-Fidelity Visuals (360° Tours)**, and **Ease of Navigation**. It serves as a digital infrastructure that could eventually be adopted by the Ministry of Housing for national property data.

---

## 2. Visual Identity & Design Philosophy
* **Design Theme:** "Apex Horizon" — Authoritative, Clean, Trustworthy.
* **Core Emotions:** Stability, Innovation, Luxury, Government-Grade Security.
* **Color Palette:**
    * **Dominant:** Midnight Teal (Represents authority and depth).
    * **Support:** Slate Grey (Represents structure and neutrality).
    * **Accent:** Luminous Amber (Used for actions, deals, and highlights).
    * **Canvas:** Cultured White (Soft, clean backgrounds).
* **Typography Style:** Modern Geometric Sans-Serif. Highly readable, professional, and architectural.
* **Layout Principle:** Spacious, grid-based, using "Cards" to display properties cleanly.

---

## 3. User Roles & Permissions

### A. The Visitor (Guest)
* **Goal:** To browse without friction.
* **Permissions:**
    * Browse all active property listings.
    * Use basic search filters (Location, Price, Type).
    * View property details, images, and 360° tours.
    * View Agent profiles (public info only).

### B. The User (Buyer/Renter)
* **Goal:** To find a home and contact agents securely.
* **Permissions:**
    * Create a secure profile.
    * **"Saved Homes":** Bookmark properties to a wishlist.
    * **"Compare Tool":** Select up to 3 properties to view side-by-side features.
    * **Direct Messaging:** Send inquiries to agents.
    * **Schedule Visits:** Request physical inspection dates.
    * **Review System:** Rate agents after a completed transaction.

### C. The Vendor (Agent/Landlord)
* **Goal:** To market properties and close deals.
* **Permissions:**
    * **Dashboard:** View views, clicks, and inquiry stats.
    * **Property Management:** Create, Edit, Delete listings.
    * **Media Management:** Upload high-res images and 360° panoramic photos.
    * **Profile Verification:** Upload ID/CAC documents to get the "Verified" badge.
    * **Availability Status:** Mark properties as "Available," "Under Negotiation," or "Sold."

### D. The Administrator (Govt/Platform Owner)
* **Goal:** Governance, Quality Control, and Revenue.
* **Permissions:**
    * **User Management:** Ban/Suspend fraudulent agents.
    * **Verification Approval:** Review and approve Agent documents.
    * **Content Moderation:** Flag or delete inappropriate listings.
    * **Global Analytics:** View total listings, active users, and regional heatmaps.
    * **Announcement System:** Broadcast messages to all users (e.g., new housing regulations).

---

## 4. Comprehensive Feature List

### Core Functionality
1.  **Smart Search Engine:**
    * Search by State, City, or specific area (e.g., "Ikeja GRA").
    * Filter by Price Range (Min/Max).
    * Filter by Type (Duplex, Flat, Land, Commercial).
    * Filter by Amenities (e.g., "Borehole," "Pop Ceiling," "Prepaid Meter").
2.  **Interactive Map View:**
    * Toggle between "List View" and "Map View" to see properties pinned on a map of the city.
3.  **360° Virtual Tours:**
    * A dedicated interactive viewer for panoramic images, allowing users to "look around" a room.

### Trust & Safety (Crucial for Nigeria)
1.  **The "Verified" Badge:** A visible checkmark for Agents who have submitted valid ID (NIN/Voter Card).
2.  **Scam Alert System:** Automatic warning on listings with suspicious price-to-location ratios.
3.  **Watermark System:** Automatically adds the platform logo to uploaded images to prevent photo theft.

### User Experience Enhancements
1.  **Mortgage/Rent Calculator:** A simple tool on the property page to estimate monthly costs based on interest rates or payment plans.
2.  **Neighborhood Insights:** A section showing nearby landmarks (Schools, Hospitals, Police Stations).
3.  **Share functionality:** One-click sharing of property links to WhatsApp, Twitter, and Facebook.

---

## 5. Standard User Flows

### Flow A: The Discovery (User Journey)
1.  **Landing:** User arrives, sees a high-quality Hero image and a "Search Bar."
2.  **Search:** User types "Abuja" and selects "2 Bedroom Flat."
3.  **Results:** User sees a grid of cards. Filters for "Price: Under N2m."
4.  **Details:** User clicks a card. Views photos, rotates the 360 view, checks amenities.
5.  **Action:** User clicks "WhatsApp Agent" or "Book Inspection."

### Flow B: The Listing (Agent Journey)
1.  **Onboarding:** Agent registers and uploads CAC/ID.
2.  **Listing Creation:** Agent clicks "Add Property."
3.  **Details:** Fills form (Title, Price, Location). Selects features from checkboxes.
4.  **Media:** Uploads 5 standard photos and 1 panoramic photo.
5.  **Submission:** Listing goes to "Pending" status (optional Admin approval) or "Live."
6.  **Management:** Agent receives an email notification when a User sends an inquiry.

---

## 6. Future Roadmap & Scalability
* **Augmented Reality (AR):** Visualizing 3D models of houses on empty plots of land via mobile camera.
* **Government Integration:** Direct payment of Land Use Charge or Tenancy Tax via the platform.
* **Blockchain Registry:** Verifying Certificate of Occupancy (C of O) authenticity using blockchain ledger.






# PROJECT SOURCE OF TRUTH: Multi-Vendor Real Estate Platform
> **Version:** 1.0
> **Target Audience:** Nigerian Real Estate Market / Ministry of Housing
> **Primary Developer:** Full-Stack MERN (Next.js focus)

---

## 1. Project Overview
A centralized, multi-vendor real estate marketplace designed for high scalability and government-grade reliability. The platform allows Agents and Landlords to list properties, and Users to search/filter properties.
* **Core Vibe:** Authority, Trust, Modern Tech, "GovTech meets PropTech."
* **Key Differentiator:** Ready for 360° virtual tours and future Augmented Reality (AR) integration.

---

## 2. Tech Stack (Strict)
**Frontend:**
* **Framework:** Next.js (App Router preferred).
* **Styling:** Tailwind CSS.
* **Animations:** Framer Motion (for micro-interactions).
* **Icons:** Lucide-React or Heroicons.
* **HTTP Client:** Axios.

**Backend (Separate API):**
* **Runtime:** Node.js.
* **Framework:** Express.js.
* **Database:** MongoDB (via Mongoose ODM).
* **Image Storage:** Cloudinary (Authorized for optimization).
* **Auth:** JWT (JSON Web Tokens).

---

## 3. Design System: "Apex Horizon"
**Do not deviate from these hex codes.**

### Color Palette
* **Primary (Midnight Teal):** `#0F2C36` (Navbars, Primary Buttons, Headings)
* **Secondary (Slate Grey):** `#64748B` (Subtext, Borders, Icons)
* **Accent (Luminous Amber):** `#F59E0B` (Call to Actions, Price Tags, Verified Badges)
* **Background (Cultured White):** `#F8FAFC` (Main App Background - Never pure white)
* **Error (Persimmon Red):** `#EF4444`

### Typography
* **Headings:** `Plus Jakarta Sans` or `Space Grotesk` (Bold/700, Tight tracking).
* **Body:** `Inter` or `Geist Sans` (Regular/400, Relaxed line-height).

### UI Rules (The 8pt Grid)
* **Border Radius:** `12px` for cards, `8px` for buttons.
* **Spacing:** All margins/paddings must be multiples of 4 or 8 (e.g., `p-4`, `m-8`, `gap-6`).
* **Shadows:** Soft, diffused shadows. `shadow-sm` or custom `box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05)`.
* **Glassmorphism:** Use subtle blur on sticky headers (`backdrop-blur-md` + `bg-opacity-90`).

---

## 4. User Roles & Permissions
1.  **Guest:** Can view properties, search, filter, view 360 photos.
2.  **User (Buyer/Renter):** Can save favorites, message agents, schedule visits.
3.  **Agent/Landlord:** Can CRUD their own properties, upload images, manage profile.
4.  **Admin (Government/Platform):** Can verify agents, ban users, view global analytics, manage categories.

---

## 5. Core Data Structures (Schema Concepts)

### Property Model
* `title`: String
* `description`: String
* `price`: Number
* `location`: { address, city, state, lat/lng }
* `type`: Enum (Sale, Rent, Lease)
* `category`: Enum (Residential, Commercial, Land)
* `features`: Array (e.g., ["Pool", "24/7 Light"])
* `images`: Array of Strings (Cloudinary URLs)
* `is360`: Boolean (Flag for 360 view)
* `agentId`: ObjectId (Ref to User)
* `status`: Enum (Available, Sold, Pending)

### User Model
* `name`: String
* `email`: String
* `password`: String (Hashed)
* `role`: Enum (user, agent, admin)
* `phone`: String
* `isVerified`: Boolean (Crucial for trust)

---

## 6. Functional Requirements (MVP)

**Authentication:**
* Register/Login with JWT.
* Agent verification flow (Upload ID document).

**Property Management:**
* Multi-image upload with preview.
* "Virtual Tour" toggle (if listing has 360 images).
* Rich text description.

**Discovery:**
* Advanced Search: Filter by Price Range, Location (State/LGA), Property Type.
* Map View (Integration with Google Maps or Mapbox).

**Contact:**
* Direct WhatsApp integration button (easiest for Nigerian market).
* Internal inquiry form.

---

## 7. Future Roadmap (For Context Only)
* **AR Integration:** WebAR using `<model-viewer>` to place 3D house models on empty land.
* **Govt Payment Gateway:** Integration with Remita for tax/land use charges.
* **Blockchain:** Land registry validation via Solidity smart contracts.

---

## 8. Coding Instructions for AI
1.  **Mobile First:** Always write CSS classes for mobile first, then `md:` and `lg:`.
2.  **Components:** Use functional React components. Keep them small and reusable.
3.  **Error Handling:** All backend routes must have `try/catch` blocks.
4.  **Clean Code:** No inline styles. Use Tailwind classes.
5.  **Images:** Always use `next/image` for optimization.