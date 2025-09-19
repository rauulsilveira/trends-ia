import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, User } from "../contexts/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Declaração global do Facebook SDK
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export default function Login() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fbReady, setFbReady] = useState(false);

  useEffect(() => {
    // Reset estados imediatamente
    setLoading(false);
    setFbReady(false);

    // Limpar script existente se houver
    const existingScript = document.getElementById("facebook-sdk");
    if (existingScript) {
      document.body.removeChild(existingScript);
    }

    // Limpar window.FB se existir
    if (window.FB) {
      delete window.FB;
    }

    // Carregar Facebook SDK
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/pt_BR/sdk.js";
    script.async = true;
    script.defer = true;
    script.id = "facebook-sdk";
    
    document.body.appendChild(script);

    window.fbAsyncInit = () => {
      if (window.FB) {
        window.FB.init({
          appId: "1458998312076946", // Seu App ID real do Facebook
          cookie: true,
          xfbml: true,
          version: "v18.0"
        });
        console.log("Facebook SDK inicializado");
        setFbReady(true);
      }
    };

    return () => {
      const scriptToRemove = document.getElementById("facebook-sdk");
      if (scriptToRemove) {
        document.body.removeChild(scriptToRemove);
      }
      // Reset estados no cleanup
      setLoading(false);
      setFbReady(false);
    };
  }, []);

  const handleFacebookLogin = () => {
    if (!window.FB) {
      toast.error("Facebook SDK não carregado. Aguarde um momento e tente novamente.");
      return;
    }

    setLoading(true);
    
    // Verificar se o usuário já está logado
    window.FB.getLoginStatus((response: any) => {
      if (response.status === 'connected') {
        // Já está logado, usar o token existente
        handleFacebookResponse(response.authResponse.accessToken);
      } else {
        // Fazer login
        window.FB.login((loginResponse: any) => {
          if (loginResponse.authResponse) {
            handleFacebookResponse(loginResponse.authResponse.accessToken);
          } else {
            setLoading(false);
            toast.error("Login cancelado pelo usuário");
          }
        }, { 
          scope: "email,public_profile",
          return_scopes: true
        });
      }
    });
  };

  const handleFacebookResponse = async (accessToken: string) => {
    try {
      const response = await fetch("http://localhost:4000/auth/facebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro no login");
      }

      const { token, user } = await response.json();
      
      // Salvar token e usuário
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      
      toast.success(`Bem-vindo, ${user.name}!`);
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error("Erro no login:", error);
      toast.error(error.message || "Erro no login");
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = async () => {
    try {
      // Fazer login mock no backend para obter token real
      const response = await fetch("http://localhost:4000/auth/facebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken: "mock_token_raul" }),
      });

      if (!response.ok) {
        throw new Error("Erro no login mock");
      }

      const { token, user } = await response.json();
      
      // Salvar token e usuário
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      
      toast.success(`Bem-vindo, ${user.name}!`);
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error("Erro no login mock:", error);
      toast.error("Erro no login de desenvolvimento");
    }
  };

  return (
    <>
      <div className="login-container">
        {/* Background animado com partículas */}
        <div className="login-background">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        <div className="login-card animate-fade-in">
          <div className="logo-container">
            <h1 className="logo-text">Trendly</h1>
            <div className="logo-glow"></div>
          </div>
          
          <p className="login-subtitle">
            Conteúdo rápido, direto e que conecta você ao agora.
          </p>

          <div className="login-buttons">
            <button
              onClick={handleFacebookLogin}
              disabled={loading || !fbReady}
              className={`btn-primary ${(loading || !fbReady) ? 'disabled' : ''}`}
            >
              {loading ? (
                <span className="loading-text">Entrando...</span>
              ) : !fbReady ? (
                <span className="loading-text">Carregando Facebook...</span>
              ) : (
                <>
                  <span className="btn-icon">📘</span>
                  Entrar com Facebook
                </>
              )}
            </button>

            <div className="divider">
              <div className="divider-line"></div>
              <span className="divider-text">ou</span>
              <div className="divider-line"></div>
            </div>

            <button
              onClick={handleMockLogin}
              className="btn-secondary"
            >
              <span className="btn-icon">🚀</span>
              Login de Desenvolvimento
            </button>
          </div>

          <p className="login-terms">
            Ao fazer login, você concorda com nossos termos de uso
          </p>
        </div>
      </div>
      
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="dark" />
    </>
  );
}
