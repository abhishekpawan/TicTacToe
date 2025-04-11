# TicTacToe Fullstack Application

A fullstack React application with Vite, TypeScript, Node.js, and Supabase.

## Project Structure

- `/client` - React frontend built with Vite and TypeScript
- `/server` - Node.js backend with Express and Supabase integration

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- pnpm

### Client Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Server Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
pnpm install

# Configure environment variables
# Copy the .env.example to .env and update with your Supabase credentials
cp .env.example .env

# Start development server
pnpm dev
```

### Supabase Setup

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key from the API settings
4. Update the `.env` file in the server directory with your credentials

## Development

- Client runs on: http://localhost:5173
- Server runs on: http://localhost:3000 