import api from './api';

export const userService = {
  updateProfile:  (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  getAllUsers:    ()     => api.get('/users'),
  toggleUserStatus:(id)  => api.put(`/users/${id}/toggle-status`),
};
