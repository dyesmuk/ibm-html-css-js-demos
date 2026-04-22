// client.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('connect', () => {
    console.log(`✅ Connected to server → my socket.id: ${socket.id}`);

    // Send a message to the server immediately on connect
    socket.emit('message', 'Hello from client!');

    // Send another message after 2 seconds
    setTimeout(() => {
        socket.emit('message', 'Still here after 2 seconds!');
    }, 2000);

    // Disconnect after 4 seconds
    setTimeout(() => {
        console.log('Disconnecting...');
        socket.disconnect();
    }, 4000);
});

// Listen for messages from the server
socket.on('message', (data) => {
    console.log(`📨 Received from server: "${data}"`);
});

socket.on('disconnect', () => {
    console.log('❌ Disconnected from server');
});