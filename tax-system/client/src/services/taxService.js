import api from './api';

export const taxService = {
  calculate:       (data)  => api.post('/tax/calculate', data),
  declare:         (data)  => api.post('/tax/declare',   data),
  getDeclarations: ()      => api.get('/tax/declarations'),
  getDeclaration:  (id)    => api.get(`/tax/declarations/${id}`),
  getTaxRules:     ()      => api.get('/config/tax-rules'),
};
