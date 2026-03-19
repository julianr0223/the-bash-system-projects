import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { getUserCount, findUserByEmail, createUser, findUserById } from '../db.js';
import { signToken, authMiddleware, getUserId } from '../middleware/auth.js';

export const authRouter = Router();

// POST /api/auth/setup — Create first user (only if no users exist)
authRouter.post('/setup', async (req, res) => {
  if (getUserCount() > 0) {
    res.status(403).json({ error: 'Setup already completed' });
    return;
  }
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required' });
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  const user = createUser(email, hash);
  const token = signToken(user.id);
  res.json({ token, user: { id: user.id, email: user.email } });
});

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required' });
    return;
  }
  const user = findUserByEmail(email);
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const token = signToken(user.id);
  res.json({ token, user: { id: user.id, email: user.email } });
});

// GET /api/auth/me — verify token + return user info + setup status
authRouter.get('/me', authMiddleware, (req, res) => {
  const user = findUserById(getUserId(req));
  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }
  res.json({ user: { id: user.id, email: user.email }, needsSetup: false });
});

// GET /api/auth/status — public: check if setup is needed
authRouter.get('/status', (_req, res) => {
  res.json({ needsSetup: getUserCount() === 0 });
});
