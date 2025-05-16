const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware first
app.use(cors({
  origin: 'https://linhnguyenielts.github.io',
  credentials: true
}));

app.use(bodyParser.json());

app.set('trust proxy', 1);

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: 'none',
    httpOnly: true
  }
}));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// API routes here
const users = [
  { username: 'john', password: 'hihi' }
];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = { username: user.username };
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.json({ success: false, message: 'Logout failed' });
    res.clearCookie('connect.sid', { path: '/' });
    res.json({ success: true, message: 'Logged out' });
  });
});

app.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});

// Catch-all route for SPA — must come last, after API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
