import { useState, useEffect } from 'react';

export const useAlert = (autoDismissMs = 5000) => {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [alert, autoDismissMs]);

  return [alert, setAlert];
};
