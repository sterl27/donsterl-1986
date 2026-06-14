# DESIGN.md — Model Citizen (Donsterl)

**Project**: GTA-style open-world game  
**Setting**: Vice City, 1986  
**Tone**: Miami Vice meets modern luxury crime — cinematic, dangerous, expensive, tactile

---

## Visual Direction

**Palette**
- Background: `#0a0c14` (deep navy-black)
- Panels: `#11151f` (rich dark)
- Subtle grid / texture: `#1a1f2e`
- Primary accent: `#ff2d55` (hot Miami Vice rose/pink)
- Secondary: `#f4d03f` (gold for cash & collectibles)
- Tertiary: `#4ade80` (mint for armor/health)
- Text: `#ededed` / `#777` / `#555`

**Typography**
- Display / Headings: Bold, tight tracking (`tracking-[-5px]` to `tracking-[-2px]`), large sizes
- Labels: Uppercase, wide tracking (`tracking-[3px]` to `tracking-[5px]`)
- Numbers & Cash: Monospace, strong weight
- Body: Clean sans, generous line height on cards

**Shape & Radius**
- Cards & major containers: `rounded-3xl`
- Buttons: `rounded-xl`
- HUD elements: `rounded-full` or `rounded-2xl`

**Motion**
- Spring-based (stiffness ~400, damping ~25)
- Subtle scale on hover/active (`active:scale-[0.985]`)
- Cash and bars animate with spring or easeOut

---

## Core Components

### 1. Top Bar
- Massive logo "MODEL CITIZEN" in rose
- Small tagline "VICE CITY • 1986"
- Live cash display (large mono, rose)
- View toggle: MANAGEMENT / 3D WORLD

### 2. Character Card (Vix Lang)
- Role label in rose uppercase
- Large name with line break
- Subtitle
- Two action buttons (Recruit / Dismiss)

### 3. Luxury Fleet Cards
- Car name + model
- Level stars (yellow)
- Upgrade button (disabled state when max)

### 4. Art Gallery
- Influence bars with animated fill (rose)
- Two action buttons side-by-side

### 5. 3D World HUD (Full Screen)
- Top bar (logo + cash + time)
- Large wanted level stars (right)
- Bottom HUD bar:
  - Health (rose)
  - Armor (mint)
  - Weapon + ammo
  - Objective reminder
- Circular minimap (bottom-left)
- Floating mission list
- Floating cash + collectible counter

### 6. Notifications
- Hot pink toast with black text
- Spring enter/exit animation

---

## Interaction Principles

- Every clickable element has clear active state (scale + color shift)
- Rose is used only for emphasis and primary actions
- Gold draws attention to money and collectibles
- Heavy use of tracking and uppercase for "system" feel
- Dark panels with thin rose borders create depth without glassmorphism

---

## Do's and Don'ts

**Do**
- Use very dark backgrounds with subtle texture
- Make cash and numbers feel expensive
- Use rose sparingly but impactfully
- Keep typography bold and confident
- Make the 3D world HUD feel like a real GTA overlay

**Don't**
- Use light backgrounds or pastel colors
- Overuse neon or rainbow effects
- Make buttons too rounded or soft
- Use thin text weights
- Add modern glassmorphism or blur unless extremely subtle

---

## Reference Mood
1986 Miami Vice opening title sequence + modern luxury automotive dashboard + classic GTA HUD.

This document defines the complete visual and interaction language for Model Citizen.
