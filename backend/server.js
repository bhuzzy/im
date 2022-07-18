const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 8000;

// connect to db
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.status(201).json({ message: 'welcome to support' });
});

//routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/message', require('./routes/messageRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));

app.use(errorHandler);

const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
    // credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('Connected to socket.io');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('user joined room: ' + room);
  });
});
