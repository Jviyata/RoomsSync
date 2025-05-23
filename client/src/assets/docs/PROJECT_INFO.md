# RoomHub

## Project Description
RoomHub (formerly RoomSync) is a React-based web application designed to make shared living more organized and less stressful. The app helps roommates coordinate shared space usage, notify each other of visitors, and send friendly cleanup reminders — all in one place.

## Target Audience
- College students living with roommates
- Young professionals in shared housing
- Co-living community residents

## What users can do
- Reserve time slots for shared areas like the kitchen or laundry
- Notify others of incoming guests and view guest information
- Send and receive friendly reminders to maintain shared spaces
- View household activity in one organized dashboard, including AC/heat temperature and door lock status

## Key Features
- **Shared Space Scheduler** – Visual calendar interface for reserving common areas
- **Guest Notifications** – Add visitor info and profiles with dates, tags, and notes
- **Cleanup Reminders** – Send pre-written or custom messages to roommates
- **Dashboard Overview** – Main landing page showing daily schedule, guests, reminders, AC/heat status, and door lock status
- **Mobile-Friendly UI** – Prioritized for usability on phones and tablets

## Page & Component Layout

### Major Pages
- **Dashboard (Main Page)**: Today's schedule, guest list, recent reminders, temperature display, and door lock status
- **Scheduler**: Weekly/monthly calendar for reserving shared spaces
- **Reminders**: Send/view reminders with message log
- **Guest Page**: Add and manage guest visit details

### Component Structure
- **Navbar** – Links to Dashboard, Schedule, Reminders, Guests
- **DashboardCard** – Quick views of schedule, guests, reminders, and system statuses
- **CalendarView** – Displays the schedule with conflict detection
- **ReminderForm** – Custom or predefined reminder messages
- **GuestProfileCard** – Visitor photo, name, tags, and visit info
- **SystemStatusCard** – Displays AC/heat temperature and door lock status

## Tools / Libraries
- **React** – Core framework for building the user interface
- **Tailwind CSS** – Utility-first CSS framework for responsive and modern UI styling
- **Wouter** – Handles page navigation within the app
- **React Query** – State management for API data fetching
- **Shadcn/ui** – Component library for consistent UI elements
- **Date-fns** – Library for working with dates and times (used in scheduling and reminders)
- **Lucide React** – For consistent, easy-to-use iconography throughout the app
