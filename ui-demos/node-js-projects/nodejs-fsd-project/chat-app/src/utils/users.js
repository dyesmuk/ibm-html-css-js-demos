// ============================================================
// MODULE 16 — Real-Time Apps with Socket.io
// src/utils/users.js
//
// In-memory user store for the chat server.
// Maps socket IDs → { id, username, room }.
//
// Key design decisions:
//  - Usernames are case-insensitively unique within a room
//  - Socket ID is the primary key (auto-assigned by Socket.io)
//  - All queries are O(n) — fine for a learning project;
//    use a Map or Redis for production scale
// ============================================================

const users = [];

/**
 * Adds a user to the store.
 * Returns { error } if the username is already taken in the room,
 * or { user } on success.
 */
export const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return { error: 'Username and room are required' };
  }

  const existingUser = users.find(
    (u) => u.room === room && u.username === username
  );

  if (existingUser) {
    return { error: 'Username is already taken in this room' };
  }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

/**
 * Removes a user by socket ID.
 * Returns the removed user object, or undefined if not found.
 */
export const removeUser = (id) => {
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

/**
 * Returns the user object for the given socket ID.
 */
export const getUser = (id) => users.find((u) => u.id === id);

/**
 * Returns all users currently in a specific room.
 */
export const getUsersInRoom = (room) =>
  users.filter((u) => u.room === room.trim().toLowerCase());
