import { useState } from 'react';
import { taxService } from '../services/taxService';

export const useTaxCalculator = () => {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const calculate = async (data) => {
    setLoading(true); setError('');
    try {
      const res = await taxService.calculate(data);
      setResult(res.data);
    } catch (err) {
      setError(err.message || 'Loi tinh thue');
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, calculate };
};
