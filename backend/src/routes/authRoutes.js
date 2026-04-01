import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  req.session.user = {
    id: user.id,
    employeeId: user.employee_id,
    name: user.name,
    email: user.email,
    department: user.department,
    role: user.role,
    reportingManagerId: user.reporting_manager_id
  };

  return res.json({ user: req.session.user });
});

router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy(() => res.json({ message: 'Logged out' }));
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.session.user });
});

export default router;
