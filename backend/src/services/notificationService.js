import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    : undefined
});

export const sendStageNotification = async ({ to, claimantName, amount, stage }) => {
  if (!to) return;
  const subject = `Pending Food Claim (${stage})`;
  const text = `You have a pending food reimbursement claim from ${claimantName} for ₹${amount}.`;

  if (!process.env.SMTP_HOST) {
    console.log('SMTP not configured. Notification skipped.', { to, subject, text });
    return;
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || 'noreply@food-reimbursement.local',
    to,
    subject,
    text
  });
};
