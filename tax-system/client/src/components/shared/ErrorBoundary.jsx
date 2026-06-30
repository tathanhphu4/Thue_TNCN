import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f4f6f9',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '3rem 2.5rem',
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
            maxWidth: '480px',
            width: '100%',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{ color: '#1a3c5e', fontSize: '1.4rem', marginBottom: '0.75rem' }}>
              Đã xảy ra lỗi không mong muốn
            </h1>
            <p style={{ color: '#7f8c8d', marginBottom: '2rem', lineHeight: 1.6 }}>
              Trang này gặp sự cố kỹ thuật. Vui lòng tải lại hoặc quay về trang chủ.
            </p>
            {this.state.error && (
              <details style={{
                textAlign: 'left',
                background: '#fff5f5',
                border: '1px solid #fca5a5',
                borderRadius: '6px',
                padding: '0.75rem',
                marginBottom: '1.5rem',
                fontSize: '0.8rem',
                color: '#991b1b',
                overflowX: 'auto',
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Chi tiết lỗi (dành cho lập trình viên)</summary>
                <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  background: '#2980b9',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                }}
              >
                🔄 Tải lại trang
              </button>
              <a
                href="/"
                style={{
                  background: '#f0f4f8',
                  color: '#1a3c5e',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                }}
              >
                🏠 Về trang chủ
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
