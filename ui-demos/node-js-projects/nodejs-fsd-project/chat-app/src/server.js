// ============================================================
// MODULE 16 — Real-Time Apps with Socket.io
// src/server.js
//
// Architecture:
//  Express → http.createServer() → Socket.io Server
//
// Socket events (server-side):
//  join          — user joins a named room
//  sendMessage   — broadcast a text message to the room
//  sendLocation  — broadcast a Google Maps location link
//  disconnect    — notify room when a user leaves
//
// Emission patterns demonstrated:
//  socket.emit()          — send to THIS socket only
//  socket.to(room).emit() — send to everyone EXCEPT sender
//  io.to(room).emit()     — send to EVERYONE in room (including sender)
// ============================================================

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import { generateMessage, generateLocationMessage } from './utils/messages.js';
import { addUser, removeUser, getUser, getUsersInRoom } from './utils/users.js';

// ESM equivalent of __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

// Serve static frontend files from /public
app.use(express.static(path.join(__dirname, '../public')));

// ── Socket.io Connection Handler ───────────────────────────
io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);

  // ── join ───────────────────────────────────────────────
  // Client sends: { username, room }
  // callback(errorMessage) or callback() on success
  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) return callback(error);

    socket.join(user.room);

    // Welcome only the joining user
    socket.emit(
      'message',
      generateMessage('System', `Welcome to ${user.room}, ${user.username}!`)
    );

    // Notify everyone else in the room
    socket.to(user.room).emit(
      'message',
      generateMessage('System', `${user.username} has joined the room`)
    );

    // Push updated member list to everyone in room
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback(); // acknowledge success to client
  });

  // ── sendMessage ────────────────────────────────────────
  socket.on('sendMessage', (text, callback) => {
    const user = getUser(socket.id);
    if (!user) return callback('You are not in a room');

    // Broadcast to everyone in the room including sender
    io.to(user.room).emit('message', generateMessage(user.username, text));
    callback(); // acknowledge delivery
  });

  // ── sendLocation ───────────────────────────────────────
  socket.on('sendLocation', ({ lat, lon }, callback) => {
    const user = getUser(socket.id);
    if (!user) return callback('You are not in a room');

    io.to(user.room).emit(
      'locationMessage',
      generateLocationMessage(user.username, lat, lon)
    );
    callback();
  });

  // ── disconnect ─────────────────────────────────────────
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        'message',
        generateMessage('System', `${user.username} has left the room`)
      );
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
    console.log(`Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Chat App running on http://localhost:${PORT}`);
});

