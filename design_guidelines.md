# Medical AI Platform Design Guidelines

## Design Approach: Reference-Based with Healthcare Specialization

**Primary Inspiration**: Medicare Health Center aesthetic with modern healthcare platforms (e.g., Mayo Clinic digital tools, WebMD interfaces)

**Core Principle**: Build trust through professional medical aesthetics while making AI capabilities accessible and understandable. The design must balance technical sophistication with approachability.

---

## Color Palette

**Dark Mode Primary Colors**:
- Primary Brand: 330 75% 55% (Magenta/Medical Pink) - for primary actions, headings
- Secondary: 190 85% 50% (Medical Teal) - for secondary elements, accents
- Background Base: 240 10% 8% (Deep slate)
- Surface: 240 8% 12% (Elevated slate)
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 70%

**Light Mode Colors**:
- Primary Brand: 330 70% 48%
- Secondary: 190 75% 42%
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Text Primary: 240 10% 15%
- Text Secondary: 240 5% 40%

**Semantic Colors**:
- Success (positive results): 150 60% 45%
- Warning (caution): 38 92% 50%
- Error (alerts): 0 70% 50%
- Info (neutral): 210 80% 55%

---

## Typography

**Font Families**:
- Headings: 'Inter', sans-serif (weights: 600, 700) - clean, professional
- Body: 'Inter', sans-serif (weights: 400, 500) - excellent readability
- Code/Technical: 'JetBrains Mono', monospace (for model outputs, technical data)

**Scale**:
- Hero Headlines: text-5xl md:text-6xl lg:text-7xl
- Section Headers: text-3xl md:text-4xl
- Subsections: text-xl md:text-2xl
- Body Large: text-lg
- Body: text-base
- Small/Captions: text-sm

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Micro spacing: 2, 4 (between related elements)
- Component spacing: 6, 8 (within cards, sections)
- Section spacing: 12, 16, 20 (between major sections)

**Grid Structure**:
- Max container width: max-w-7xl
- Content sections: max-w-6xl
- Text content: max-w-4xl
- Sidebar layouts: 2/3 + 1/3 split on desktop

---

## Component Library

### Navigation
- Sticky top navigation with blur backdrop
- Logo left, menu items center-right
- Sections: About, Services (Q&A + Recommendations), Research
- Mobile: Hamburger menu with slide-in drawer
- Height: 16 units with border-b

### Hero Section
- Full-width with medical-themed hero image (80vh)
- Overlay gradient: from magenta/10% to teal/10%
- Large headline introducing the medical AI platform
- Subtitle explaining RAG-based Q&A and recommendation capabilities
- Two primary CTAs: "Try Medical Q&A" (magenta) + "View Research" (teal outline with blur backdrop)
- Trust indicators below CTAs: "Trained on MedQuAD Dataset" badge, "AI-Powered Insights" badge

### About Section
- Two-column layout on desktop (60/40 split)
- Left: Project introduction, mission statement
- Right: Key statistics card (datasets used, models trained, coverage areas)
- Background: subtle medical pattern or texture
- Spacing: py-20

### Services Section (Q&A + Recommendations)
- Two prominent feature cards displayed side-by-side on desktop
- Each card: Icon at top, title, description, "Try Now" CTA
- Gradient borders (magenta for Q&A, teal for Recommendations)
- Hover effect: subtle lift and glow
- Spacing: py-20

### RAG Medical Q&A Interface
- Clean chat-like interface
- Input area: Large textarea with rounded corners, placeholder: "Ask a medical question..."
- Submit button: Magenta with white text
- Response area: Card-based display with medical cross icon
- Source citations: Small pills below each answer showing MedQuAD references
- Loading state: Animated pulse with medical icon
- Character limit indicator

### Medicine Recommendation System
- Form-based interface
- Multi-select symptom checklist with search functionality
- Additional info textarea for patient context
- Submit button: Teal with white text
- Results: Table or card grid showing medications, dosages, precautions
- Warning banner: "AI recommendations - consult healthcare professional"
- Export results button

### Research Section
- Academic paper aesthetic
- Dataset information cards: Title, description, size, coverage
- Model architecture diagrams (placeholder images)
- Training methodology: Step-by-step cards with icons
- Technical specifications in tabbed interface
- Publication-style formatting for credibility
- Spacing: py-20

### Footer
- Three-column layout: Project info, Quick links, Dataset acknowledgments
- Disclaimer: Prominent medical AI disclaimer
- Background: Surface color with top border
- Spacing: py-12

---

## Images

### Hero Image
Large, professional medical technology image showing:
- Modern medical interface or AI visualization
- Healthcare professionals using technology
- Medical data visualization or neural network imagery
- Placement: Full-width background, 80vh height
- Treatment: Subtle overlay to ensure text readability

### Section Supporting Images
- About section: Research lab or AI development environment (optional, right column)
- Research section: Model architecture diagrams, dataset visualizations (2-3 images)
- No team photos (per requirements)

---

## Interaction Patterns

**Buttons**:
- Primary: Solid magenta background, white text, rounded-lg
- Secondary: Teal outline with blur backdrop when over images, rounded-lg
- Sizes: py-3 px-6 (default), py-2 px-4 (small)

**Cards**:
- Elevated shadow: shadow-lg
- Rounded corners: rounded-xl
- Hover: translate-y-[-4px] transition
- Border: 1px subtle with gradient for feature cards

**Forms**:
- Input fields: Rounded-lg, focused ring in brand colors
- Labels: Above inputs, small text with font-medium
- Validation: Inline messages with semantic colors

**Loading States**:
- Skeleton screens for content
- Spinner with medical cross icon for AI processing
- Progress indicators for multi-step processes

---

## Accessibility & Responsiveness

- Consistent dark mode across all inputs and interactive elements
- ARIA labels for all AI interaction components
- Keyboard navigation for Q&A and recommendation forms
- Mobile-first: Stack all multi-column layouts to single column below md breakpoint
- Touch targets: Minimum 44px for all interactive elements
- Focus indicators: Visible ring with brand colors

---

## Unique Design Elements

- **AI Processing Indicator**: Animated medical cross with pulse effect during query processing
- **Citation Badges**: Small, rounded pills showing MedQuAD sources with hover tooltips
- **Medical Gradients**: Subtle magenta-to-teal gradients on hero and section dividers
- **Trust Signals**: Scattered throughout - dataset badges, AI transparency notices, disclaimers
- **Model Placeholder Architecture**: Clearly marked areas with "Connect Your Model" labels in Research section