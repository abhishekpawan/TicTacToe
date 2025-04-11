# Tic Tac Toe Online

An online multiplayer Tic Tac Toe game where two random players can match up and play against each other.

## Features

- Real-time multiplayer gameplay
- Automatic player matching
- Modern, minimalistic UI with subtle gradient colors
- Dark/light mode support
- Animated game elements
- Responsive design for all devices

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express, Socket.io
- **Styling**: Plain CSS with component-based styles

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or pnpm

### Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tictactoe.git
   cd tictactoe
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install server dependencies
   cd server
   npm install
   # or using pnpm
   pnpm install

   # Install client dependencies
   cd ../client
   npm install
   # or using pnpm
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both client and server directories (already done)
   - Update the values if needed

### Running the Application

1. Start the server:
   ```bash
   cd server
   npm run dev
   # or using pnpm
   pnpm run dev
   ```

2. In a separate terminal, start the client:
   ```bash
   cd client
   npm run dev
   # or using pnpm
   pnpm run dev
   ```

3. Access the application at `http://localhost:5174` in your browser

## How to Play

1. Open the application in your browser
2. Click "Find a Match" to be paired with another player
3. Wait for an opponent to join
4. Take turns making moves on the board
5. The game will automatically detect wins or draws
6. Play again or find a new match after the game ends

## License

MIT 