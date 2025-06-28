const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public')); // For admin panel

// Store connected users
let users = {};

io.on('connection', (socket) => {
  // Identify user or admin
  socket.on('register', (type, userId) => {
    if (type === 'user') {
      users[userId] = socket.id;
    }
    // Optionally handle admin registration
  });

  // Admin sends command to show modal
  socket.on('admin-show-modal', ({ userId, modalId }) => {
    const userSocketId = users[userId];
    if (userSocketId) {
      io.to(userSocketId).emit('show-modal', modalId);
    }
  });

  socket.on('disconnect', () => {
    // Remove user from users object
    for (const [id, sid] of Object.entries(users)) {
      if (sid === socket.id) delete users[id];
    }
  });
});

server.listen(3001, () => {
  console.log('Backend server running on port 3001');
});