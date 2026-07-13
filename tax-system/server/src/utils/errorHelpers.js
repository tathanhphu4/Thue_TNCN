const mongoose = require('mongoose');

/**
 * Sends a structured error response, logging the original error
 * and returning a safe message to the client.
 *
 * Handles common Mongoose errors (CastError, ValidationError)
 * with appropriate status codes instead of a blanket 500.
 */
const handleControllerError = (res, err, fallbackMessage = 'Lỗi server. Vui lòng thử lại.') => {
  console.error(`[Controller Error] ${fallbackMessage}:`, err.message || err);

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: 'ID không hợp lệ hoặc không đúng định dạng.',
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: messages[0] || 'Dữ liệu không hợp lệ.',
      errors: messages,
    });
  }

  return res.status(500).json({ success: false, message: fallbackMessage });
};

module.exports = { handleControllerError };
