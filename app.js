const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

const app = express();

// Middleware
app.use(bodyParser.json());

const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3001';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(
  session({
    secret: 'nevernoteSecret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/notes', noteRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
