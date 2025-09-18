import React, { useEffect } from 'react';

interface GlobalErrorHandlerProps {
  children: React.ReactNode;
}

const GlobalErrorHandler: React.FC<GlobalErrorHandlerProps> = ({ children }) => {
  useEffect(() => {
    // Interceptar erros globais do JavaScript
    const handleError = (event: ErrorEvent) => {
      console.error('Erro global capturado:', event.error);
      
      // Criar um toast de erro mais elegante
      const errorToast = document.createElement('div');
      errorToast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1f2937;
        border: 1px solid #ef4444;
        border-radius: 8px;
        padding: 16px;
        max-width: 400px;
        z-index: 9999;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        color: #f3f4f6;
        font-family: Menlo, Consolas, monospace;
        font-size: 12px;
        line-height: 1.4;
        animation: slideIn 0.3s ease-out;
      `;

      // Adicionar animação CSS
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);

      errorToast.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">
              ERRO
            </span>
            <span style="font-size: 14px; font-weight: 600;">
              Algo deu errado
            </span>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" style="
            background: transparent; border: none; color: #9ca3af; cursor: pointer; 
            font-size: 18px; padding: 0; width: 24px; height: 24px; 
            display: flex; align-items: center; justify-content: center; border-radius: 4px;
          " onmouseover="this.style.background='#374151'; this.style.color='#f3f4f6';" 
             onmouseout="this.style.background='transparent'; this.style.color='#9ca3af';">
            ×
          </button>
        </div>
        <div style="background: #111827; padding: 12px; border-radius: 4px; border: 1px solid #374151; margin-bottom: 12px;">
          <div style="color: #ef4444; margin-bottom: 8px; font-weight: 600;">
            ${event.message || 'Erro desconhecido'}
          </div>
          <div style="color: #9ca3af; font-size: 10px;">
            ${event.filename ? `Arquivo: ${event.filename}` : ''}
            ${event.lineno ? ` | Linha: ${event.lineno}` : ''}
            ${event.colno ? ` | Coluna: ${event.colno}` : ''}
          </div>
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button onclick="this.parentElement.parentElement.remove()" style="
            background: #374151; color: #f3f4f6; border: none; padding: 6px 12px; 
            border-radius: 4px; cursor: pointer; font-size: 12px;
          " onmouseover="this.style.background='#4b5563';" onmouseout="this.style.background='#374151';">
            Fechar
          </button>
          <button onclick="window.location.reload()" style="
            background: #3b82f6; color: white; border: none; padding: 6px 12px; 
            border-radius: 4px; cursor: pointer; font-size: 12px;
          " onmouseover="this.style.background='#2563eb';" onmouseout="this.style.background='#3b82f6';">
            Recarregar
          </button>
        </div>
        <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: #374151; border-radius: 0 0 8px 8px; overflow: hidden;">
          <div style="height: 100%; background: #ef4444; animation: errorTimer 8s linear forwards;"></div>
        </div>
      `;

      document.body.appendChild(errorToast);

      // Auto-remover após 8 segundos
      setTimeout(() => {
        if (errorToast.parentElement) {
          errorToast.style.animation = 'slideOut 0.3s ease-in forwards';
          setTimeout(() => {
            if (errorToast.parentElement) {
              errorToast.remove();
            }
          }, 300);
        }
      }, 8000);
    };

    // Interceptar promises rejeitadas
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Promise rejeitada:', event.reason);
      
      // Criar toast similar para promises
      const errorToast = document.createElement('div');
      errorToast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1f2937;
        border: 1px solid #f59e0b;
        border-radius: 8px;
        padding: 16px;
        max-width: 400px;
        z-index: 9999;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        color: #f3f4f6;
        font-family: Menlo, Consolas, monospace;
        font-size: 12px;
        line-height: 1.4;
        animation: slideIn 0.3s ease-out;
      `;

      errorToast.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="background: #f59e0b; color: #1f2937; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">
              PROMISE
            </span>
            <span style="font-size: 14px; font-weight: 600;">
              Erro de Promise
            </span>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" style="
            background: transparent; border: none; color: #9ca3af; cursor: pointer; 
            font-size: 18px; padding: 0; width: 24px; height: 24px; 
            display: flex; align-items: center; justify-content: center; border-radius: 4px;
          " onmouseover="this.style.background='#374151'; this.style.color='#f3f4f6';" 
             onmouseout="this.style.background='transparent'; this.style.color='#9ca3af';">
            ×
          </button>
        </div>
        <div style="background: #111827; padding: 12px; border-radius: 4px; border: 1px solid #374151; margin-bottom: 12px;">
          <div style="color: #f59e0b; margin-bottom: 8px; font-weight: 600;">
            ${event.reason?.message || 'Promise rejeitada'}
          </div>
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button onclick="this.parentElement.parentElement.remove()" style="
            background: #374151; color: #f3f4f6; border: none; padding: 6px 12px; 
            border-radius: 4px; cursor: pointer; font-size: 12px;
          " onmouseover="this.style.background='#4b5563';" onmouseout="this.style.background='#374151';">
            Fechar
          </button>
        </div>
        <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: #374151; border-radius: 0 0 8px 8px; overflow: hidden;">
          <div style="height: 100%; background: #f59e0b; animation: errorTimer 6s linear forwards;"></div>
        </div>
      `;

      document.body.appendChild(errorToast);

      // Auto-remover após 6 segundos
      setTimeout(() => {
        if (errorToast.parentElement) {
          errorToast.style.animation = 'slideOut 0.3s ease-in forwards';
          setTimeout(() => {
            if (errorToast.parentElement) {
              errorToast.remove();
            }
          }, 300);
        }
      }, 6000);
    };

    // Adicionar listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
};

export default GlobalErrorHandler;
