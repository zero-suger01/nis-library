const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const booksRouter        = require('./routes/books');
const transactionsRouter = require('./routes/transactions');
const contributorsRouter = require('./routes/contributors');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PATCH', 'DELETE'] },
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use((req, _res, next) => { req.io = io; next(); });

app.use('/api/books',        booksRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/contributors', contributorsRouter);

io.on('connection', socket => {
  console.log(`[socket] connected:    ${socket.id}`);
  socket.on('disconnect', () => console.log(`[socket] disconnected: ${socket.id}`));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
