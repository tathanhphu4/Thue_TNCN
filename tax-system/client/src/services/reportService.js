import api from './api';

export const reportService = {
  getUserReport:   (year) => api.get('/reports/user', { params: { year } }),
  getSystemSummary: ()    => api.get('/reports/summary'),
};
