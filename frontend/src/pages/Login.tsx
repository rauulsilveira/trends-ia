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
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #232946 0%, #3e497a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white"
      }}>
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          padding: "48px",
          borderRadius: "16px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          textAlign: "center",
          maxWidth: "400px",
          width: "90%"
        }}>
          <h1 style={{ 
            margin: "0 0 8px 0", 
            fontSize: "32px", 
            fontWeight: "700",
            background: "linear-gradient(45deg, #3e8cff, #00d4ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Trendly
          </h1>
          
          <p style={{ 
            margin: "0 0 32px 0", 
            color: "#b8c1ec", 
            fontSize: "16px" 
          }}>
            Faça login para acessar as tendências
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <button
              onClick={handleFacebookLogin}
              disabled={loading || !fbReady}
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                background: fbReady ? "#1877f2" : "#6b7280",
                color: "white",
                border: "none",
                cursor: (loading || !fbReady) ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                opacity: (loading || !fbReady) ? 0.7 : 1,
                transition: "all 0.2s"
              }}
            >
              {loading ? (
                "Entrando..."
              ) : !fbReady ? (
                "Carregando Facebook..."
              ) : (
                <>
                  <span style={{ fontSize: "20px" }}>📘</span>
                  Entrar com Facebook
                </>
              )}
            </button>

            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              margin: "16px 0",
              color: "#b8c1ec"
            }}>
              <div style={{ flex: 1, height: "1px", background: "#b8c1ec" }} />
              <span style={{ margin: "0 16px", fontSize: "14px" }}>ou</span>
              <div style={{ flex: 1, height: "1px", background: "#b8c1ec" }} />
            </div>

            <button
              onClick={handleMockLogin}
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                background: "transparent",
                color: "#3e8cff",
                border: "2px solid #3e8cff",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#3e8cff";
                e.currentTarget.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#3e8cff";
              }}
            >
              🚀 Login de Desenvolvimento
            </button>
          </div>

          <p style={{ 
            margin: "24px 0 0 0", 
            color: "#8b9dc3", 
            fontSize: "12px" 
          }}>
            Ao fazer login, você concorda com nossos termos de uso
          </p>
        </div>
      </div>
      
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="dark" />
    </>
  );
}
