import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (data) => {
    console.log('Received message:', data);
    // You can broadcast this message to other clients if needed
    // io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = 7000;

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Socket server is running on port ${PORT}`);
});

export { io };