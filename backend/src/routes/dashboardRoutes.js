import express from 'express';
import { pool } from '../config/db.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', requireAuth, requireRoles('IT_ADMIN', 'ACCOUNTS'), async (_req, res) => {
  const [[totals]] = await pool.query(
    `SELECT COUNT(*) AS totalClaims, COALESCE(SUM(approved_amount), 0) AS totalDisbursed
     FROM claims
     WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())`
  );

  const [slaRows] = await pool.query(
    `SELECT claim_id, employee_name, current_stage, TIMESTAMPDIFF(DAY, created_at, NOW()) AS pendingDays
     FROM claims
     WHERE status = 'PENDING' AND TIMESTAMPDIFF(DAY, created_at, NOW()) > 3`
  );

  res.json({ ...totals, slaBreaches: slaRows });
});

export default router;
