# Design System Strategy: The Curated Void

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Curated Void."** 

This is not a "minimalist" template; it is an editorial statement. We are treating the digital screen as a physical gallery wall. In a gallery, the art is the focus, and the architecture—while stark—is intentional, expensive, and precise. We move beyond standard UI by utilizing "The Curated Void" to drive focus through extreme contrast, aggressive white space, and a rejection of traditional decorative elements. 

This system breaks the "template" look by using typography as a structural element and asymmetry as a tool for rhythm. We don't use lines to separate ideas; we use distance and tonal depth.

## 2. Colors & Tonal Architecture
The palette is rooted in absolute contrast, utilizing a sophisticated range of greys to provide depth that pure black and white cannot achieve alone.

### Core Palette
*   **Primary (Action/Focus):** `#000000` (Deep Black)
*   **Surface (Background):** `#f9f9f9` (Gallery White)
*   **On-Surface (Text):** `#1a1c1c` (Softened Black for readability)
*   **Error:** `#ba1a1a` (The only permitted chromatic color, used sparingly)

### The "No-Line" Rule
Designers are strictly prohibited from using 1px solid borders to define sections or containers. To separate content, you must use:
1.  **Background Shifts:** Transition from `surface` (#f9f9f9) to `surface-container-low` (#f3f3f4) or `surface-container-highest` (#e2e2e2).
2.  **Negative Space:** Utilize the Spacing Scale (specifically `spacing.16` to `spacing.24`) to create "cliffs" of white space that signal a change in context.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked sheets of high-grade paper.
*   **Base:** `surface` (#f9f9f9)
*   **Nested Elements (Cards/Modals):** Use `surface-container-lowest` (#ffffff) to create a subtle "lift" against the gallery-white background without needing a drop shadow.
*   **Depth through Glass:** For navigation overlays or floating technical details, use `surface` with an 80% opacity and a heavy `backdrop-blur` (20px+). This creates a "frosted glass" effect that maintains the stark aesthetic while adding professional polish.

## 3. Typography: Editorial Authority
Typography is the primary visual "material" of this design system. It is not just for reading; it is for layout.

*   **Display & Headlines (Manrope):** Use these as architectural anchors. Large-scale headings (`display-lg` at 3.5rem) should feel heavy and grounded. Use intentional tight letter-spacing (-0.02em) for headlines to create a "blocky," sophisticated feel.
*   **Technical Metadata (Space Grotesk):** This is our "Mono" surrogate. Use this for labels, technical specs, and dates. It provides a calculated, engineered contrast to the fluid elegance of the headlines.
*   **Body (Inter):** Reserved for long-form reading. High legibility, neutral character.

**Signature Layout Move:** Overlap large `display-lg` typography with images or container edges by using `primary-fixed` (#5e5e5e) at low opacity to create a layered, "z-axis" editorial feel.

## 4. Elevation & Depth
In this design system, "sharpness" is a requirement. All corners are set to **0px radius**.

### The Layering Principle
Depth is achieved through **Tonal Layering** rather than traditional structural lines.
*   **Ambient Shadows:** Use only for high-priority floating elements (like a "Contact" FAB). The shadow must be almost invisible: `rgba(0,0,0,0.04)` with a 40px blur and 20px offset. It should look like a natural shadow cast by a piece of cardstock.
*   **The "Ghost Border" Fallback:** If a divider is absolutely necessary for accessibility (e.g., in a complex data table), use the `outline-variant` (#c6c6c6) at **10% opacity**. It should be a whisper, not a statement.

## 5. Components

### Buttons
*   **Primary:** Solid `#000000` background, `#ffffff` text. 0px border-radius. High-padding (use `spacing.4` vertical, `spacing.8` horizontal).
*   **Secondary:** Ghost style. No background, 1px `outline` (#777777). 
*   **Hover State:** Primary buttons should invert to `primary-fixed` (#5e5e5e) or slightly shift in tone. Avoid "glow" effects.

### Cards & Project Previews
*   **Style:** No borders. Use `surface-container-lowest` (#ffffff) for the card background.
*   **Spacing:** Use `spacing.10` internal padding to ensure the content "breathes" within the card.
*   **Separation:** Do not use dividers between cards in a list. Use `spacing.6` of vertical white space.

### Technical Metadata Labels
*   Utilize `label-md` (Space Grotesk) in all-caps with `0.1rem` letter-spacing. This should be used for project categories, dates, or tool stacks to provide a "blueprint" aesthetic.

### Input Fields
*   **Default:** Bottom-border only (1px `outline`). No side or top borders.
*   **Focus:** The bottom border transitions to 2px `primary` (#000000). 
*   **Labels:** Always use `label-sm` (Space Grotesk) positioned above the field for a clean, architectural look.

## 6. Do's and Don'ts

### Do:
*   **Embrace Asymmetry:** Align text to the left but place images on a 12-column grid with intentional offsets (e.g., start an image on column 3 instead of 1).
*   **Use Massive Scale:** Don't be afraid to make a headline "too big." In this system, typography is the hero.
*   **Respect the "Void":** If a page feels empty, resist the urge to fill it. The emptiness communicates confidence and luxury.

### Don't:
*   **No Rounded Corners:** Never use a border-radius. Everything must be sharp (0px).
*   **No Shadows on Cards:** Use background color shifts (`surface-variant`) instead of shadows to show hierarchy.
*   **No Generic Icons:** Avoid thin, "friendly" rounded icons. Use sharp-edged, geometric icons or text-based triggers.
*   **No 100% Black Text on 100% White:** Use `on_surface` (#1a1c1c) on `surface` (#f9f9f9) to avoid "vibration" and eye strain while maintaining a high-contrast look.

## 7. Interaction Design
Transitions should be swift and linear. Avoid "bouncy" or "organic" easing. Use a `cubic-bezier(0.2, 1, 0.3, 1)` for transitions—it feels fast, precise, and high-end. When a user hovers over a portfolio item, use a subtle tonal shift (e.g., from `surface` to `surface-container-high`) rather than a scale-up effect.