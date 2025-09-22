import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

dotenv.config();

const findAvailablePort = async (startPort) => {
  const net = await import('net');
  
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        server.listen(startPort + 1);
      } else {
        reject(err);
      }
    });

    server.on('listening', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });

    server.listen(startPort);
  });
};

async function startServer() {
  try {
    const app = express();
    app.use(express.json());
    app.use(cors());

    // Connect to database
    await connectDB(process.env.MONGO_URI);
    console.log('Database connected successfully');

    // API routes
    const authRoutes = await import('./routes/auth.js');
    const postsRoutes = await import('./routes/posts.js');
    const commentsRoutes = await import('./routes/comments.js');
    const leaderboardRoutes = await import('./routes/leaderboard.js');

    app.use('/api/auth', authRoutes.default);
    app.use('/api/posts', postsRoutes.default);
    app.use('/api/comments', commentsRoutes.default);
    app.use('/api/leaderboard', leaderboardRoutes.default);

    // Find available port
    const desiredPort = process.env.PORT || 5000;
    const availablePort = await findAvailablePort(desiredPort);
    
    app.listen(availablePort, () => {
      console.log(`Server running on port ${availablePort}`);
    });

  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
}

startServer();

// http://localhost:5000/api/leaderboard
