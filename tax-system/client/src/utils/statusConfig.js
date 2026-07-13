export const DECLARATION_STATUS_MAP = {
  draft:     { label: 'Nháp',       className: 'draft',     icon: '📝' },
  pending:   { label: 'Chờ nộp',    className: 'draft',     icon: '⏳' },
  submitted: { label: 'Đã gửi',     className: 'submitted', icon: '📩' },
  paid:      { label: 'Đã nộp thuế', className: 'paid',     icon: '✅' },
  overdue:   { label: 'Quá hạn',    className: 'overdue',   icon: '🚨' },
  rejected:  { label: 'Bị từ chối', className: 'rejected',  icon: '❌' },
};

export const getStatusConfig = (status) =>
  DECLARATION_STATUS_MAP[status] || { label: status, className: '', icon: '' };
