export const buildClaimId = (sequence) => {
  const year = new Date().getFullYear();
  return `FOOD-${year}-${String(sequence).padStart(4, '0')}`;
};

export const stageOrder = ['ADMIN_HEAD', 'REPORTING_MANAGER', 'ACCOUNTS'];
