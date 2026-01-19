const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const { initDb, get, run } = require('./db'); // <-- add

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// If you're serving pages from Express (recommended), keep this:
// put your html/css/js inside /public
app.use(express.static('public'));

app.use(session({
  secret: 'tricycle-secret-key-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, sameSite: 'lax' }
}));

// Initialize DB once at startup
initDb()
  .then(() => console.log('Database ready'))
  .catch(err => {
    console.error('DB init failed:', err);
    process.exit(1);
  });

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.json({ success: false, message: 'Missing required fields' });
    }

    // Check username or email already exists
    const existing = await get(
      `SELECT id FROM users WHERE username = ? OR email = ?`,
      [username, email]
    );
    if (existing) {
      return res.json({ success: false, message: 'Username or email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    await run(
      `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`,
      [username, email, password_hash]
    );

    res.json({ success: true, message: 'Registration successful!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await get(
      `SELECT id, username, password_hash FROM users WHERE username = ?`,
      [username]
    );

    if (!user) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    req.session.user = { id: user.id, username: user.username };
    res.json({ success: true, message: 'Login successful!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.get('/api/user', async (req, res) => {
  try {
    if (!req.session.user) return res.json({ loggedIn: false });

    const user = await get(
      `SELECT username, email, created_at FROM users WHERE id = ?`,
      [req.session.user.id]
    );

    if (!user) return res.json({ loggedIn: false });

    res.json({
      loggedIn: true,
      username: user.username,
      email: user.email,
      created_at: user.created_at
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ loggedIn: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.post('/api/change-password', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: 'Not logged in' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.json({ success: false, message: 'Missing required fields' });
    }

    if (newPassword.length < 8) {
      return res.json({ success: false, message: 'New password must be at least 8 characters' });
    }

    const row = await get(
      `SELECT password_hash FROM users WHERE id = ?`,
      [req.session.user.id]
    );

    if (!row) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const ok = await bcrypt.compare(currentPassword, row.password_hash);
    if (!ok) {
      return res.json({ success: false, message: 'Current password is incorrect' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await run(
      `UPDATE users SET password_hash = ? WHERE id = ?`,
      [newHash, req.session.user.id]
    );

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

