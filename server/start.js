// Simple start script for Render deployment
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from 'socket.io';

// Set environment variables for Render
process.env.RENDER = 'true';

// Load the built server app
const __dirname = dirname(fileURLToPath(import.meta.url));
const { default: app } = await import(join(__dirname, 'dist', 'index.js'));

// Create HTTP server if not already created in the app
const PORT = process.env.PORT || 3000;
console.log(`Starting server on port ${PORT}`);

// For Render, we need to ensure we're listening on the port
const server = createServer(app);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 