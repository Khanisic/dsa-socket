// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS enabled
const io = new Server(server, {
    cors: {
        origin: '*', // Allow any origin - adjust for production!
    },
    path: '/socket.io', // Default Socket.IO path; can be customized if needed
});

io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);
    console.log(`✅ Client connected: ${socket.id}`);

    // When a client joins a room
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room ${room}`);
    });

    // Listen for code updates from a client, expecting an object with room and code
    socket.on('code-update', (data) => {
        const { room, code } = data;
        // Emit only to the clients in the specified room, excluding the sender
        socket.to(room).emit('code-update', code);
    });

    socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});

// A simple route to verify the server is running
app.get('/', (req, res) => {
    res.send('Socket.IO server is running');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
