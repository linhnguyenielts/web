const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS config
app.use(cors({
  origin: 'https://linhnguyenielts.github.io',
  credentials: true
}));

app.use(bodyParser.json());

// ✅ Tell Express to trust Render’s proxy (needed for secure cookies)
app.set('trust proxy', 1);

// Session config
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // only send cookie over HTTPS
    sameSite: 'none',  // required for cross-origin
    httpOnly: true
  }
}));

// Dummy user
const users = [
  { username: 'john', password: 'hihi' }
];

// Login
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

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.json({ success: false, message: 'Logout failed' });
    res.clearCookie('connect.sid', { path: '/' });
    res.json({ success: true, message: 'Logged out' });
  });
});

// Who am I?
app.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
