import { useCallback } from 'react';

export const useFormChange = (setFormData, errors, setErrors, serverError, setServerError) => {
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError && setServerError) setServerError('');
  }, [setFormData, errors, setErrors, serverError, setServerError]);

  return handleChange;
};
