# ANAROS Beauty Institute - Design Guidelines

## Design Approach
**Reference-Based Luxury Spa**: Drawing inspiration from high-end hospitality and beauty brands (Airbnb's photography, Apple's minimalism, luxury spa aesthetics). This is an experience-focused, visually-rich beauty institute requiring elegant visual differentiation.

## Core Design Principles
1. **Refined Elegance**: Sophisticated, calming luxury without ostentation
2. **French Femininity**: Graceful, delicate, premium aesthetic
3. **Sensorial Experience**: Every element should evoke relaxation and beauty
4. **Trust & Professionalism**: Medical-grade cleanliness meets boutique warmth

## Typography System
- **Display/Headings**: Serif font (Playfair Display, Cormorant Garamond, or Crimson Pro) for elegance
- **Body Text**: Clean sans-serif (Inter, Source Sans Pro) for readability
- **Hierarchy**: 
  - Hero: 4xl-8xl (responsive)
  - Section Headers: 3xl-4xl serif
  - Subsections: xl-2xl serif
  - Body: base-lg sans-serif, light/normal weight
  - Labels: xs-sm uppercase, wide letter-spacing (tracking-widest)

## Layout & Spacing
**Tailwind spacing primitives**: 2, 4, 6, 8, 12, 16, 24, 32
- Section padding: py-16 (mobile) to py-24 (desktop)
- Container: max-w-7xl with px-4 sm:px-6 lg:px-8
- Grid gaps: gap-4 to gap-12 depending on density
- Generous whitespace for breathing room

## Component Library

### Navigation
- Fixed/sticky header with transparency on hero, solid white on scroll
- Logo: Uppercase serif, tracking-widest
- Desktop: Horizontal inline nav with icons
- Mobile: Slide-out overlay menu
- Active state: Rounded pill with amber background

### Hero Section
- Full viewport height (h-screen) with overlay
- Large, atmospheric spa/beauty imagery
- Centered text with subtitle, title, divider line, description, CTA
- Semi-transparent dark overlay (bg-black/40)

### Service Cards
- 2x2 or 4-column grid on desktop, single column mobile
- Each card: Icon, title, short description, "Discover" CTA
- Hover: Transform scale, background shift to amber, white text
- Detail views: Two-column layout (text + full-bleed image)

### Gallery
- Masonry/grid layout: 2-3-4 columns responsive
- Rounded corners, subtle shadow
- Hover: Scale transform (1.05)
- Instagram CTA below

### Team Showcase
- Compact cards with circular avatar, name, role
- 2-column grid within About section
- Amber accent for role text

### Testimonials
- Dark background (stone-900) with subtle texture overlay
- Centered layout with star rating
- Large serif quote, author in small caps

### Footer
- Three-column layout: Contact, Logo Center, Hours
- Icons with contact details
- Light background (stone-50)

## Color Palette (Reference Only)
- Primary: Warm amber/gold tones
- Neutrals: Stone palette (50-900)
- Backgrounds: White, stone-50, stone-100, stone-900
- Text: Stone-800, stone-600, white
- Accents: Amber for CTAs and highlights

## Images Strategy
**Essential Images**:
1. **Hero**: Full-screen luxury spa interior (massage room, ambient lighting, serene)
2. **Services**: High-quality beauty treatment photos (hair salon, hammam, nail art, facial treatment)
3. **Gallery**: 6-8 images showing results, ambiance, treatments
4. **About**: Team or welcoming interior shot
5. **News Articles**: Relevant treatment/product images
6. **Team**: Professional headshots (circular crops)

All images should have warm, natural lighting, professional quality, and convey luxury and cleanliness.

## Interactions & Animations
**Minimal & Purposeful**:
- Smooth scroll behavior
- Gentle hover transforms (scale 1.02-1.05)
- Fade-in on scroll for sections
- Navbar background transition on scroll
- Button hover: subtle background shift
- Card hover: lift effect with shadow
- No distracting or excessive animations

## Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus states with visible outlines
- Sufficient color contrast (WCAG AA minimum)
- Semantic HTML structure
- Alt text for all images

## Mobile Optimization
- Single-column stacking below md breakpoint
- Touch-optimized button sizes (min 44px)
- Readable font sizes (minimum 16px body)
- Simplified navigation with hamburger menu
- Optimized image sizes for mobile bandwidth

## Content Density
- Generous padding and margins
- Maximum 2-3 columns on mobile
- 3-4 columns on desktop for service/feature grids
- Full-width sections with centered max-width containers
- Breathing room between sections (py-16 minimum)