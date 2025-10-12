# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Development Commands

- **Development server**: `yarn dev` (Next.js development server)
- **Build production**: `yarn build` (includes prebuild tasks: sitemap generation and redirects)
- **Type checking**: `yarn lint:ts` or `tsc --noEmit`
- **Linting**: `yarn lint` (Next.js ESLint)
- **Code formatting**: `yarn prettier`
- **Setup**: `yarn install` after cloning

## Code Architecture Overview

This is a Next.js (Pages Router) multilingual website for Alpine Armoring with the following structure:

### Core Technologies

- **Framework**: Next.js (Pages Router) with TypeScript
- **Styling**: SCSS modules with global styles in `styles/`
- **i18n**: Built-in Next.js internationalization (English/Spanish)
- **State Management**: React hooks and context (minimal client-side state)

### Key Architectural Patterns

**Routes System**: Complex multilingual routing managed by `routes.js`

- Defines all page routes with English/Spanish paths
- Handles URL rewrites for localization
- Manages vehicle type categorizations
- Key vehicle types: SUVs, sedans, pickup-trucks, law-enforcement, cash-in-transit, etc.

**Content Structure**:

- Pages in `pages/` directory (standard Next.js Pages Router)
- Components in `components/` with nested organization
- Global components: Layout, SEO, CustomMarkdown
- Icon components in `components/icons/`

**Internationalization**:

- Locale detection disabled (`localeDetection: false`)
- Spanish routes prefixed with locale (e.g., `/es/contacto`)
- Content managed through Strapi CMS collections

### Build Process

- **Prebuild**: Generates sitemaps and redirects automatically
- **Assets**: Images optimized with WebP/AVIF formats
- **Fonts**: Custom fonts (Manrope, Termina) in `public/fonts/`

### Code Quality Tools

- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: 2-space tabs, single quotes, trailing commas
- **Husky + lint-staged**: Pre-commit hooks for linting and formatting
- **TypeScript**: Configured with strict mode disabled for gradual adoption

### Important Files

- `hooks/api.ts`: Fetching from Strapi
- `routes.js`: Master routing configuration and URL management
- `middleware.ts`: Request handling and routing logic
- `next.config.js`: Next.js configuration with image optimization and CORS
- `generate-sitemaps.js` & `generate-redirects.js`: Build-time utilities

### Development Notes

- Uses Yarn package manager
- Requires Node.js >=18
- Environment variables needed (see README.md for Google Docs link)
- Sass preprocessing with global mixins from `styles/_mixins.scss`

### Testing & Reliability

- **Always do eslint tests after any code changes**

### 📚 Documentation & Explainability

- **Comment non-obvious code** and ensure everything is understandable to a mid-level developer.
<!-- - When writing complex logic, **add an inline `# Reason:` comment** explaining the why, not just the what. -->
- Prefer arrow functions
- Annotate return types
- Always destructure props
- Avoid any type, use unknown or strict generics
- Group imports: react → next → libraries → local

### 🧠 AI Behavior Rules

- **Never assume missing context. Ask questions if uncertain.**
- **Never hallucinate libraries or functions** – only use known, verified javascript packages.
- **Always confirm file paths and module names** exist before referencing them in code or tests.
- Use the context7 MCP to fetch up to date documentation that is not available in hex docs, like Next.js
- walk me through your thought process step by step
- before you get started, ask me for any information you need to do a good job
- in git commit, never mention AI or Claude
- Don't remove comments and console.logs that I already had in the script
