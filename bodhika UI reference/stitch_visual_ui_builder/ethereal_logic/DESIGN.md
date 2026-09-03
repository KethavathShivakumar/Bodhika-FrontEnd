---
name: Ethereal Logic
colors:
  surface: '#f9f9fa'
  surface-dim: '#dadadb'
  surface-bright: '#f9f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeef'
  surface-container-high: '#e8e8e9'
  surface-container-highest: '#e2e2e3'
  on-surface: '#1a1c1d'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#416656'
  on-secondary: '#ffffff'
  secondary-container: '#c3ecd7'
  on-secondary-container: '#476c5b'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#231a0c'
  on-tertiary-container: '#90826e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#c3ecd7'
  secondary-fixed-dim: '#a8cfbc'
  on-secondary-fixed: '#002115'
  on-secondary-fixed-variant: '#294e3f'
  tertiary-fixed: '#f2e0c8'
  tertiary-fixed-dim: '#d5c4ad'
  on-tertiary-fixed: '#231a0c'
  on-tertiary-fixed-variant: '#504534'
  background: '#f9f9fa'
  on-background: '#1a1c1d'
  surface-variant: '#e2e2e3'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is rooted in **Modern Minimalism** with a focus on high-fidelity professionalism and an "airy" atmosphere. It is designed for SaaS, fintech, or professional productivity tools where clarity and focus are paramount.

The brand personality is composed, precise, and sophisticated. It utilizes generous whitespace and a restricted color palette to reduce cognitive load, while employing soft depth and organic shapes to feel approachable rather than cold. The emotional response should be one of calm efficiency and premium quality.

## Colors

This design system utilizes a high-contrast grayscale foundation punctuated by soft, desaturated functional accents.

- **Primary & Neutrals**: The core interface is built on a "White-on-Gray" stack. Backgrounds use a very light off-white, while primary surfaces (cards, sidebars) use pure white to create a subtle lift. Text is near-black for maximum legibility.
- **Accents**: 
    - **Mint Green**: Used for positive growth, success states, and active indicators.
    - **Soft Orange**: Used for notifications, warnings, or secondary numerical highlights.
- **Functional Grays**: A range of cool-toned grays are used for borders, icons, and secondary labels to maintain a hierarchy that feels balanced and never heavy.

## Typography

The system relies exclusively on **Inter** to achieve a systematic, utilitarian aesthetic that remains highly readable.

The hierarchy is established through weight and color rather than excessive size differences. Headlines should feel grounded and "tight" with slight negative letter-spacing, while body text and labels benefit from slightly increased letter-spacing to enhance the airy, open feel of the UI. Use `text_muted` for secondary information to ensure the primary data points (like currency values or titles) remain the focal point.

## Layout & Spacing

The layout follows a **Fluid Grid** model with generous safe areas. 

- **Grid**: A 12-column system is used for desktop, 8-column for tablet, and 4-column for mobile.
- **Rhythm**: Spacing is strictly based on a 4px/8px baseline. Large layouts should prioritize "macro-whitespace"—using `xl` (64px) or even larger gaps between major sections to prevent the UI from feeling cluttered.
- **Sidebars**: Navigation is typically docked to the left with a width of 280px on desktop, transitioning to a bottom-sheet or hidden drawer on mobile.
- **Containers**: Content should be grouped in cards with significant internal padding (`md` or `lg`) to emphasize the "clean room" aesthetic.

## Elevation & Depth

This design system uses a **Tonal Layering** approach combined with **Ambient Shadows** to create a high-fidelity sense of depth.

1.  **Level 0 (Base)**: The background (`background_main`).
2.  **Level 1 (Card/Sidebar)**: Pure white surfaces with a very soft, high-diffusion shadow (Color: `Primary` at 4% opacity, Blur: 24px, Offset-Y: 4px).
3.  **Level 2 (Active/Floating)**: Used for active navigation states or dropdowns. These use a slightly more pronounced shadow and may include a 1px soft-gray border (`#E4E4E7`) to define the edge against white backgrounds.

Backdrop blurs (12px to 20px) should be used for modal overlays to maintain the "Ethereal" quality without losing the context of the underlying data.

## Shapes

The shape language is defined by large, organic radii that soften the technical nature of the content.

- **Cards & Containers**: Use `rounded-xl` (24px or 1.5rem) to create a friendly, modern "frame" effect.
- **Buttons & Inputs**: Use `rounded-lg` (16px or 1rem).
- **Badges/Chips**: Always use **Pill-shaped** (full radius) to distinguish them from interactive buttons.
- **Icons**: Icons must be thin-stroke (1.5px) linear icons with rounded terminals to match the container curves.

## Components

### Buttons & Navigation
- **Primary Buttons**: Solid dark text on white with a subtle shadow, or inverted (white text on dark).
- **Active Nav Item**: A white pill-shaped background lifted from the sidebar gray, creating a "pressed out" look.
- **Indicator Dots**: Small 6px circles using accent colors to denote status without using text.

### Inputs & Fields
- **Search/Text Fields**: Use a very light gray fill (`neutral_color_hex`) with no border until focused. On focus, transition to a white background with a primary-colored 1px ring.

### Badges & Chips
- **Status Badges**: Use desaturated background tints (e.g., Mint at 15% opacity) with high-contrast text for the label. They should be compact and pill-shaped.

### Cards
- **Overview Cards**: Feature a title, a large "Display" size value, and a small trend indicator badge. Internal padding should be at least 24px to maintain the professional, airy mood.
- **Progress Bars**: Thin (4px) tracks with rounded caps, using `accent_mint` for completion.

### List Items
- **Tree Structures**: Use vertical guide lines in a light gray (`#F4F4F5`) to show hierarchy in sidebars, keeping the text indentation consistent and clear.