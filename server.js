// server.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from frontend (adjust origin if deployed)
app.use(cors({ origin: true, credentials: true }));

app.use(bodyParser.json());

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true in production with HTTPS
}));

// Dummy user data
const users = [
  { username: 'john', password: '1234' },
];

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = user;
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

// Check if logged in
app.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});
// Login route
app.post('/login', (req, res) => {
  // You can later validate username/password from req.body
  req.session.user = { name: 'John Doe' };
  res.json({ success: true });
});

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});

// Check session route
app.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
