# replit.md

## Overview

This is a full-stack web application built with React, Express, and PostgreSQL. The application appears to be a location-based data query interface with chat functionality, allowing users to select locations and ask questions about data related to those locations. The frontend uses modern React with TypeScript and shadcn/ui components, while the backend provides a REST API with database integration using Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite as the build tool
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API endpoints
- **Database ORM**: Drizzle ORM for PostgreSQL
- **Database**: PostgreSQL (configured for Neon Database)
- **Development**: Hot reloading with Vite integration

### Data Storage
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Schema**: Three main tables - locations, queries, and conversations
- **Temporary Storage**: In-memory storage implementation for development
- **Migration System**: Drizzle Kit for database migrations

## Key Components

### Database Schema
1. **Locations Table**: Stores location data with coordinates and type (auto/map/manual)
2. **Queries Table**: Stores user queries with extracted parameters and responses
3. **Conversations Table**: Tracks chat sessions by location and session ID

### Frontend Components
1. **LocationSelector**: Interface for choosing locations via GPS, map, or manual entry
2. **ChatInterface**: Main chat interface for querying location data
3. **MapModal**: Interactive map component for location selection
4. **SuggestionTags**: Quick-select tags for common query types

### Backend Services
1. **Storage Interface**: Abstracted storage layer with in-memory implementation
2. **Route Handlers**: RESTful endpoints for locations, queries, and geocoding
3. **Vite Integration**: Development server with hot module replacement

## Data Flow

1. **Location Selection**: Users select locations through GPS, map interaction, or manual address entry
2. **Query Processing**: User inputs are processed and stored with extracted parameters
3. **Response Generation**: Mock responses are generated (placeholder for actual data processing)
4. **Session Management**: Conversations are tracked by session ID for continuity
5. **Real-time Updates**: TanStack Query manages cache invalidation and updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon Database PostgreSQL client
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **zod**: Schema validation library

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: Production bundling
- **Drizzle Kit**: Database migration tool

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: ESBuild bundles Node.js server to `dist/index.js`
- **Database**: Drizzle Kit handles schema migrations

### Environment Configuration
- **Development**: Uses `tsx` for TypeScript execution with hot reloading
- **Production**: Compiled JavaScript with optimized builds
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection

### Key Scripts
- `dev`: Development server with hot reloading
- `build`: Production build for both frontend and backend
- `start`: Production server startup
- `db:push`: Database schema deployment

The application follows a monorepo structure with shared schema definitions, making it easy to maintain type safety across the full stack. The architecture supports both development and production environments with appropriate build and deployment strategies.