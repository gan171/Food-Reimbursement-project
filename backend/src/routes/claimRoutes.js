import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { buildClaimId, stageOrder } from '../utils/claim.js';
import { sendStageNotification } from '../services/notificationService.js';
import { buildClaimSummaryPdf } from '../services/pdfService.js';
import { normalizeRole } from '../utils/roles.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = multer({ dest: path.join(__dirname, '../uploads') });

router.post('/', requireAuth, upload.single('bill'), async (req, res) => {
  const user = req.session.user;
  const { otDate, timeIn, timeOut, amountClaimed, purpose } = req.body;

  if (!otDate || !timeIn || !timeOut || !amountClaimed || !purpose) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  const [seqRows] = await pool.query('SELECT COUNT(*) AS count FROM claims');
  const claimId = buildClaimId(seqRows[0].count + 1);

  await pool.query(
    `INSERT INTO claims
      (claim_id, user_id, employee_id, employee_name, department, ot_date, time_in, time_out, amount_claimed, purpose, bill_path, current_stage, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ADMIN_HEAD', 'PENDING')`,
    [
      claimId,
      user.id,
      user.employeeId,
      user.name,
      user.department,
      otDate,
      timeIn,
      timeOut,
      amountClaimed,
      purpose,
      req.file?.filename || null
    ]
  );

  const [admins] = await pool.query("SELECT email FROM users WHERE role IN ('ADMIN_HEAD', 'ADMIN') LIMIT 1");
  await sendStageNotification({
    to: admins[0]?.email,
    claimantName: user.name,
    amount: amountClaimed,
    stage: 'Admin Head Approval'
  });

  res.status(201).json({ claimId, message: 'Claim submitted successfully.' });
});

router.get('/mine', requireAuth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM claims WHERE user_id = ? ORDER BY created_at DESC', [req.session.user.id]);
  res.json(rows);
});

router.get('/queue', requireAuth, requireRoles('ADMIN_HEAD', 'REPORTING_MANAGER', 'ACCOUNTS'), async (req, res) => {
  const role = normalizeRole(req.session.user.role);
  const [rows] = await pool.query(
    `SELECT c.*
     FROM claims c
     WHERE c.current_stage = ? AND c.status = 'PENDING'
     ORDER BY c.created_at ASC`,
    [role]
  );
  res.json(rows);
});

router.post('/:id/action', requireAuth, requireRoles('ADMIN_HEAD', 'REPORTING_MANAGER', 'ACCOUNTS'), async (req, res) => {
  const { action, comment, approvedAmount, utrReference } = req.body;
  const role = normalizeRole(req.session.user.role);

  const [rows] = await pool.query('SELECT * FROM claims WHERE id = ? LIMIT 1', [req.params.id]);
  const claim = rows[0];
  if (!claim) return res.status(404).json({ message: 'Claim not found' });
  if (normalizeRole(claim.current_stage) !== role) return res.status(400).json({ message: 'This claim is not in your queue.' });

  if ((action === 'REJECT' || action === 'ASK_CLARIFICATION') && !comment) {
    return res.status(400).json({ message: 'Comment is required for this action.' });
  }

  if (action === 'REJECT') {
    await pool.query(
      `UPDATE claims SET status = 'REJECTED', rejection_comment = ?, current_stage = NULL, updated_at = NOW() WHERE id = ?`,
      [comment, claim.id]
    );
    return res.json({ message: 'Claim rejected and employee will be notified.' });
  }

  if (action === 'ASK_CLARIFICATION') {
    await pool.query(
      `UPDATE claims SET approval_comment = ?, updated_at = NOW() WHERE id = ?`,
      [comment, claim.id]
    );
    return res.json({ message: 'Clarification request recorded.' });
  }

  const currentIndex = stageOrder.indexOf(role);
  const nextStage = stageOrder[currentIndex + 1] || null;
  const nextStatus = nextStage ? 'PENDING' : 'APPROVED';

  await pool.query(
    `UPDATE claims
      SET status = ?, current_stage = ?, approval_comment = ?, approved_amount = COALESCE(?, approved_amount), utr_reference = COALESCE(?, utr_reference), updated_at = NOW()
     WHERE id = ?`,
    [nextStatus, nextStage, comment || null, approvedAmount || null, utrReference || null, claim.id]
  );

  if (nextStage) {
    let nextApproverEmail;

    if (nextStage === 'REPORTING_MANAGER') {
      const [managerRows] = await pool.query(
        `SELECT rm.email
         FROM users u
         JOIN users rm ON rm.id = u.reporting_manager_id
         WHERE u.id = ? LIMIT 1`,
        [claim.user_id]
      );
      nextApproverEmail = managerRows[0]?.email;
    } else {
      const [nextApprover] = await pool.query(
        "SELECT email FROM users WHERE role IN ('ACCOUNTS', 'ACCOUNTS_TEAM', 'ACCOUNTANT') LIMIT 1"
      );
      nextApproverEmail = nextApprover[0]?.email;
    }

    await sendStageNotification({
      to: nextApproverEmail,
      claimantName: claim.employee_name,
      amount: claim.amount_claimed,
      stage: nextStage
    });
  }

  res.json({ message: nextStage ? `Claim moved to ${nextStage}.` : 'Final approval completed.' });
});

router.get('/:id/summary.pdf', requireAuth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM claims WHERE id = ? LIMIT 1', [req.params.id]);
  const claim = rows[0];
  if (!claim) return res.status(404).json({ message: 'Claim not found' });

  const pdf = buildClaimSummaryPdf(claim);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${claim.claim_id}.pdf"`);
  res.send(Buffer.from(pdf));
});

export default router;
