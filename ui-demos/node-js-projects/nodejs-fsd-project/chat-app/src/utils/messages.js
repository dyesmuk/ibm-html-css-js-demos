// ============================================================
// MODULE 16 — Real-Time Apps with Socket.io
// src/utils/messages.js
//
// Factory functions that produce standardised message objects.
// Using factories ensures every message has a consistent shape
// with a timestamp the client can format (e.g. with moment.js).
// ============================================================

/**
 * Creates a standard chat message object.
 * @param {string} username - Display name of the sender
 * @param {string} text     - Message content
 * @returns {{ username, text, createdAt }}
 */
export const generateMessage = (username, text) => ({
  username,
  text,
  createdAt: new Date().getTime(),
});

/**
 * Creates a location message with a Google Maps link.
 * @param {string} username
 * @param {number} latitude
 * @param {number} longitude
 * @returns {{ username, url, createdAt }}
 */
export const generateLocationMessage = (username, latitude, longitude) => ({
  username,
  url: `https://google.com/maps?q=${latitude},${longitude}`,
  createdAt: new Date().getTime(),
});
