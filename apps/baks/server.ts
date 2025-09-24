import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

// Your server configuration...

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});