// server.js
import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer);

console.log('Server started on port 3001...\n');

io.on('connection', (socket) => {
  console.log(`✅ Client connected    → socket.id: ${socket.id}`);

  // Listen for a message from any client
  socket.on('message', (data) => {
    console.log(`📨 Received from ${socket.id}: "${data}"`);

    // Echo it back to everyone including sender
    io.emit('message', `Server says: you sent → "${data}"`);
  });

  // Listen for disconnect
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected → socket.id: ${socket.id}`);
  });
});

httpServer.listen(3001);