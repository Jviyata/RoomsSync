# RoomHub

![RoomHub Logo](client/src/assets/docs/roomhub-logo.png)

## Overview
RoomHub is a React-based collaborative living application designed to streamline roommate interactions and shared space management. 

## Key Features
- Real-time dashboard for tracking shared living spaces
- Guest management and coordination tools
- Reminder system for household tasks and events
- Responsive design for mobile and desktop use
- Temperature and door lock status monitoring

## Project Structure

### Frontend (client/)
- Built with React, TypeScript, and Tailwind CSS
- Uses Shadcn UI components for consistent design
- Organized by feature (dashboard, schedule, reminders, guests)

### Backend (server/)
- Express.js server
- In-memory storage for development
- RESTful API endpoints

### Shared (shared/)
- Shared TypeScript types and schemas
- Used by both frontend and backend for type consistency

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Documentation
Additional documentation is available in the following locations:
- `client/src/assets/docs` - Project information and technical documentation
- `assets` - Component reference files and original project requirements

## Acknowledgements
- Shadcn UI for component library
- Tailwind CSS for styling
- Lucide React for icons
