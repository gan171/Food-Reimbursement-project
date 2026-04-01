import { jsPDF } from 'jspdf';

export const buildClaimSummaryPdf = (claim) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Overtime Food Reimbursement Summary', 14, 18);
  doc.setFontSize(12);
  const lines = [
    `Claim ID: ${claim.claim_id}`,
    `Employee: ${claim.employee_name} (${claim.employee_id})`,
    `Department: ${claim.department}`,
    `Overtime: ${claim.ot_date} ${claim.time_in}-${claim.time_out}`,
    `Claimed Amount: ₹${claim.amount_claimed}`,
    `Approved Amount: ₹${claim.approved_amount || 0}`,
    `Status: ${claim.status}`,
    `UTR Ref: ${claim.utr_reference || 'N/A'}`
  ];

  lines.forEach((line, index) => doc.text(line, 14, 30 + index * 10));
  return doc.output('arraybuffer');
};
