const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://nevernote-react.vercel.app'],
    credentials: true,
  })
);
app.use(
  session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Change to true for HTTPS
      sameSite: 'lax',
    },
  })
);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

app.use(authRoutes);
app.use(noteRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
