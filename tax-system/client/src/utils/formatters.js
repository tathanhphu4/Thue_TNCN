export const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const formatDate = (date) =>
  new Intl.DateTimeFormat('vi-VN').format(new Date(date));

export const getStatusLabel = (status) => {
  const map = {
    draft: 'Ban nhap',
    submitted: 'Da khai bao',
    paid: 'Da nop thue',
    overdue: 'Qua han',
    cancelled: 'Da huy',
  };
  return map[status] || status;
};
