# Tic Tac Toe Online

A real-time multiplayer Tic Tac Toe game with automatic player matching and modern UI.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)

![Tic Tac Toe Banner](https://via.placeholder.com/1200x300?text=Tic+Tac+Toe+Online)

## 📋 About

Tic Tac Toe Online is a full-stack web application that allows players to enjoy the classic game of Tic Tac Toe in real-time with opponents from anywhere in the world. The project solves the challenge of finding opponents for casual gaming by implementing automatic matchmaking and real-time gameplay.

### Core Technologies

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express, Socket.io
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Styling**: Plain CSS with component-based architecture

## ✨ Features

### User Experience
- Modern, minimalistic UI with subtle gradient colors
- Dark/light mode toggle with theme persistence
- Responsive design for all devices (desktop, tablet, mobile)
- Animated game elements for a dynamic feel

### Gameplay
- Real-time multiplayer matches via WebSockets
- Automatic player matching system
- Turn-based gameplay with clear indicators
- Win/draw detection and game state management

### Account Management
- User authentication with Supabase
- Profile page for personal stats and settings
- Protected routes for authenticated users
- Guest play option without registration

### Technical
- Real-time communication with Socket.io
- Persistent game stats (for authenticated users)
- Route protection and navigation guards
- Structured component hierarchy

## 🚀 Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm or pnpm
- Supabase account (for database and authentication)

### Environment Setup

1. **Supabase Configuration**:
   - Create a project on [Supabase](https://supabase.com/)
   - Note your project URL and anon key for environment variables

2. **Environment Variables**:
   - Client variables:
     ```
     VITE_SERVER_URL=http://localhost:3000
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_KEY=your_supabase_anon_key
     ```
   - Server variables:
     ```
     PORT=3000
     SUPABASE_URL=your_supabase_url
     SUPABASE_KEY=your_supabase_anon_key
     CLIENT_URL=http://localhost:5174
     ```

### Installation Steps

1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/tictactoe-online.git](https://github.com/abhishekpawan/TicTacToe.git)
   cd TicTacToe
   ```

2. Install all dependencies with a single command:
   ```bash
   npm run install:all
   # or using pnpm
   pnpm install && cd client && pnpm install && cd ../server && pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both client and server directories
   - Update with your Supabase credentials

## 💻 Local Development

### Running the Development Environment

Start both client and server concurrently:
```bash
npm run dev
# or using pnpm
pnpm run dev
```

Or run them individually:
```bash
# Client only
npm run client

# Server only
npm run server
```

### Accessible Endpoints

- **Client**: http://localhost:5174
- **Server**: http://localhost:3000
- **API**: http://localhost:3000/api

### Development Tips

- Check the Network tab in browser DevTools to debug Socket.io connections
- Use React DevTools to inspect component hierarchy and state
- Server logs will show socket connections and game events
- Modify the `.env` files for different configurations

## 🎮 Usage

### Playing a Game

1. Navigate to the application in your browser
2. Sign in or continue as a guest
3. Click "Find a Match" to start matchmaking
4. Wait for an opponent to be paired with you
5. Take turns making moves on the board
6. The game will automatically detect wins or draws
7. Play again or find a new match after the game ends

### Game UI

![Game Board](https://via.placeholder.com/800x400?text=Game+Board)
*Main game board showing X and O marks with current player indicator*

![Matchmaking Screen](https://via.placeholder.com/800x400?text=Matchmaking+Screen)
*Matchmaking interface with waiting animation*

### Account Management

1. Create an account to track your stats
2. View your profile to see your win/loss record
3. Toggle between dark and light mode in the settings

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user
- `GET /api/auth/profile` - Get user profile

### Game Data
- `GET /api/game/stats` - Get player statistics
- `GET /api/game/history` - Get game history

### WebSocket Events
- `find-match` - Start matchmaking
- `cancel-matchmaking` - Cancel matchmaking
- `make-move` - Make a move on the board
- `game-update` - Receive game state updates
- `game-over` - Game conclusion notification

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Socket.io for real-time communication
- Supabase for backend services
- React and Vite for frontend development
- All contributors and players! 
