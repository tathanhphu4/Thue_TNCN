import { getStatusConfig } from './statusConfig';

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const formatDate = (date) =>
  new Intl.DateTimeFormat('vi-VN').format(new Date(date));

export const getStatusLabel = (status) => getStatusConfig(status).label;
