# Web OS Portfolio

A modern, interactive portfolio built as a desktop operating system experience with Ubuntu-inspired theming.

## Features

- **Desktop Environment**: Complete OS-like interface with taskbar, windows, and desktop icons
- **Window Management**: Drag, resize, minimize, maximize, and focus windows with proper z-index layering
- **Ubuntu Theme**: Authentic Ubuntu-inspired color scheme with signature orange accents
- **Applications**:
  - **About**: Personal introduction with skills showcase
  - **Resume**: Professional experience and education
  - **Contact**: Terminal-style contact information with clipboard functionality
- **Context Menus**: Right-click context menus for desktop, taskbar, and windows
- **Responsive Design**: Fully responsive with modern Tailwind CSS styling

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4 with custom Ubuntu theme
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Fonts**: Rubik (sans-serif), JetBrains Mono (monospace)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Bun (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/ilkerozgedik/portfolio.git
cd portfolio

# Install dependencies
bun install

# Start development server
bun dev
```

### Development

```bash
# Start development server
bun dev

# Type checking
bun typecheck

# Linting and formatting
bun lint

# Build for production
bun build

# Preview production build
bun preview
```

## Deployment

The portfolio is automatically deployed to GitHub Pages when pushing to the main branch.

```bash
# Manual deployment
bun deploy
```

## Project Structure

```
├── apps/           # Application components
├── components/     # Reusable UI components
├── contexts/       # React contexts
├── hooks/          # Custom React hooks
├── types.ts        # TypeScript type definitions
├── constants.tsx   # App configurations
└── index.css       # Global styles and theme
```

## Theme

The project features a custom Ubuntu-inspired theme with:
- **Primary Orange**: Ubuntu signature color (#E95420)
- **Ubuntu Grays**: Professional gray palette
- **Typography**: Rubik for UI, JetBrains Mono for code
- **Interactive Elements**: Smooth hover effects and transitions

## License

MIT License - feel free to use this project as inspiration for your own portfolio.

---

**Live Demo**: [https://ilkerozgedik.github.io/portfolio](https://ilkerozgedik.github.io/portfolio)
