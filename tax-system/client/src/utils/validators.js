const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(0[3|5|7|8|9])[0-9]{8}$/;
const CCCD_REGEX  = /^\d{9}$|^\d{12}$/;
const TAX_CODE_REGEX = /^\d{10}$|^\d{13}$/;

export const validateEmail = (email) => {
  if (!email.trim()) return 'Vui lòng nhập địa chỉ email';
  if (!EMAIL_REGEX.test(email)) return 'Địa chỉ email không đúng định dạng';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Vui lòng nhập mật khẩu';
  if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
  return '';
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) return '';
  if (!PHONE_REGEX.test(phone.trim())) return 'Số điện thoại không hợp lệ (VD: 0912345678)';
  return '';
};

export const validatePhoneRequired = (phone) => {
  if (!phone.trim()) return 'Vui lòng nhập số điện thoại';
  if (!PHONE_REGEX.test(phone.trim())) return 'Số điện thoại không hợp lệ (VD: 0912345678)';
  return '';
};

export const validateCCCD = (idCard) => {
  if (!idCard.trim()) return 'Vui lòng nhập số CCCD (bắt buộc)';
  if (!CCCD_REGEX.test(idCard.trim())) return 'CCCD phải có 9 hoặc 12 chữ số';
  return '';
};

export const validateTaxCode = (taxCode) => {
  if (!taxCode) return '';
  if (!TAX_CODE_REGEX.test(taxCode.trim())) return 'Mã số thuế phải có 10 hoặc 13 chữ số';
  return '';
};

export const validateFullName = (name) => {
  if (!name.trim()) return 'Vui lòng nhập họ và tên';
  if (name.trim().length < 2) return 'Họ tên phải có ít nhất 2 ký tự';
  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Vui lòng xác nhận mật khẩu';
  if (password !== confirmPassword) return 'Mật khẩu xác nhận không khớp';
  return '';
};
