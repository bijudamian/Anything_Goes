const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// In a real scenario you might want more restricted CORS,
// but Nginx reverse proxy simplifies this.
app.use(cors());
app.use(express.json());

// Set up Socket.io
// Since Nginx handles the routing and upgrading, we just need to bind it
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// REST API Endpoints
const apiRouter = express.Router();

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

apiRouter.get('/message', (req, res) => {
  res.json({
    message: 'Hello from the REST API!'
  });
});

// Mount the router on /api since Nginx routes /api traffic here
// Wait, if Nginx strips the prefix (e.g. rewrite ^/api/(.*) /$1 break), we would mount at /.
// Let's assume we DO NOT strip the prefix in Nginx, so we mount at /api.
app.use('/api', apiRouter);

// WebSocket logic
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Simulate real-time background task pushing data to clients
setInterval(() => {
  const cpuSim = (Math.random() * 20 + 5).toFixed(1); // Simulate 5-25% CPU
  const memSim = Math.floor(Math.random() * 50 + 200); // Simulate 200-250MB Memory

  io.emit('system_update', {
    message: 'Routine system diagnostics',
    cpu: cpuSim,
    memory: memSim,
    timestamp: new Date().toISOString()
  });
}, 2000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
