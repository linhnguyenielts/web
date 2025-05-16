const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration to allow your frontend domain with credentials
app.use(cors({
  origin: 'https://linhnguyenielts.github.io', // your frontend URL
  credentials: true
}));

app.use(bodyParser.json());

// Session configuration with cookie settings for cross-origin
app.use(session({
  secret: 'your-secret-key',      // change this to a strong secret in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,                 // must be true for HTTPS (Render uses HTTPS)
    sameSite: 'none',             // allow cross-site cookies
    httpOnly: true
  }
}));

// Dummy user data for demo purposes
const users = [
  { username: 'john', password: 'hihi' }
];

// Login route
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

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.json({ success: false, message: 'Logout failed' });
    res.clearCookie('connect.sid', { path: '/' }); // clear cookie
    res.json({ success: true, message: 'Logged out' });
  });
});

// Check if logged in route
app.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
