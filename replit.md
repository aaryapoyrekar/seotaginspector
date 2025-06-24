# SEO Analyzer Application

## Overview

This is a full-stack SEO analysis tool built with React and Express. The application allows users to analyze websites for SEO performance, providing detailed insights into meta tags, scoring, and actionable recommendations. It features a modern UI built with shadcn/ui components and a robust backend that scrapes and analyzes web content.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Web Scraping**: Cheerio for HTML parsing and meta tag extraction
- **Development**: TSX for TypeScript execution in development

### Data Flow
1. User submits URL through the frontend form
2. Frontend sends POST request to `/api/analyze` endpoint
3. Backend validates URL and fetches webpage content
4. SEOAnalyzer service extracts meta tags and calculates scores
5. Analysis results are stored in memory storage
6. Frontend displays comprehensive analysis results

## Key Components

### SEO Analysis Engine
- **URL Validation**: Ensures proper HTTP/HTTPS protocol support
- **Content Fetching**: Retrieves webpage HTML content
- **Meta Tag Extraction**: Parses title, description, keywords, canonical URLs, Open Graph, and Twitter Card tags
- **Scoring Algorithm**: Calculates overall SEO score based on various factors
- **Recommendation Engine**: Generates actionable SEO improvement suggestions

### Storage Layer
- **Current Implementation**: In-memory storage using Map data structures
- **Schema**: Drizzle ORM with PostgreSQL schema definitions
- **Models**: Users and SEO analyses with full type safety

### UI Components
- **URLAnalysisForm**: Input form for website URL submission
- **SEOScoreDashboard**: Visual dashboard showing overall scores and metrics
- **MetaTagsAnalysis**: Detailed breakdown of meta tag optimization
- **GoogleSearchPreview**: Simulated Google search result preview
- **SocialMediaPreviews**: Facebook, Twitter, and LinkedIn sharing previews
- **SEORecommendations**: Prioritized list of improvement suggestions
- **QuickActions**: Export reports and additional functionality

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database adapter (configured but not actively used)
- **drizzle-orm**: Type-safe database ORM
- **cheerio**: Server-side HTML parsing and manipulation
- **@tanstack/react-query**: Powerful data synchronization for React
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **vite**: Next-generation frontend tooling

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev`
- **Port**: 5000 (configured in .replit)
- **Hot Reload**: Vite HMR with Express middleware integration

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Start Command**: `npm start` runs the production server

### Replit Configuration
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Auto-deployment**: Configured for autoscale deployment
- **Port Mapping**: Internal port 5000 mapped to external port 80

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 24, 2025. Initial setup
- June 24, 2025. Enhanced visual design with category summaries and beginner-friendly interface