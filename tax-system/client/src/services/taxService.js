import api from './api';

export const taxService = {
  calculate:       (data)  => api.post('/tax/calculate', data),
  declare:         (data)  => api.post('/tax/declare',   data),
  getDeclarations:    ()      => api.get('/tax/declarations'),
  getAllDeclarations: ()      => api.get('/tax/admin/declarations'),
  getDeclaration:     (id)    => api.get(`/tax/declarations/${id}`),
  getTaxRules:     ()      => api.get('/config/tax-rules'),
  updateTaxRules:  (data)  => api.put('/config/tax-rules', data),
};
