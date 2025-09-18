import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log do erro para o console (opcional)
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
  }

  handleDismiss = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#1f2937',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '16px',
          maxWidth: '400px',
          zIndex: 9999,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          color: '#f3f4f6',
          fontFamily: 'Menlo, Consolas, monospace',
          fontSize: '12px',
          lineHeight: '1.4'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                background: '#ef4444',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                ERRO
              </span>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>
                Algo deu errado
              </span>
            </div>
            <button
              onClick={this.handleDismiss}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '0',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#374151';
                e.currentTarget.style.color = '#f3f4f6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#9ca3af';
              }}
            >
              ×
            </button>
          </div>

          <div style={{
            background: '#111827',
            padding: '12px',
            borderRadius: '4px',
            border: '1px solid #374151',
            marginBottom: '12px',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            <div style={{ color: '#ef4444', marginBottom: '8px', fontWeight: '600' }}>
              {this.state.error?.message || 'Erro desconhecido'}
            </div>
            {this.state.error?.stack && (
              <div style={{ color: '#9ca3af', fontSize: '10px' }}>
                {this.state.error.stack.split('\n').slice(0, 3).map((line, index) => (
                  <div key={index} style={{ marginBottom: '2px' }}>
                    {line}
                  </div>
                ))}
                {this.state.error.stack.split('\n').length > 3 && (
                  <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
                    ... e mais {this.state.error.stack.split('\n').length - 3} linhas
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={this.handleDismiss}
              style={{
                background: '#374151',
                color: '#f3f4f6',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#4b5563';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#374151';
              }}
            >
              Fechar
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#2563eb';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#3b82f6';
              }}
            >
              Recarregar
            </button>
          </div>

          {/* Auto-dismiss timer */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '3px',
            background: '#374151',
            borderRadius: '0 0 8px 8px',
            overflow: 'hidden'
          }}>
            <div
              style={{
                height: '100%',
                background: '#ef4444',
                animation: 'errorTimer 10s linear forwards'
              }}
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
