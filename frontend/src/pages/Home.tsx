// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { user } = useUser();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; speed: number }>>([]);

  useEffect(() => {
    // Criar partículas animadas
    const createParticles = () => {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        color: ['#8B5CF6', '#F43F5E', '#06B6D4', '#F59E0B'][Math.floor(Math.random() * 4)],
        speed: Math.random() * 2 + 0.5
      }));
      setParticles(newParticles);
    };

    createParticles();
  }, []);

  // Sempre mostrar a landing page principal

  // Landing Page para usuários não logados
  return (
        <div style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #8B5CF6 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 0"
        }}>
      {/* Partículas animadas de fundo */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1
      }}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            style={{
              position: "absolute",
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: particle.color,
              borderRadius: "50%",
              opacity: 0.6,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Conteúdo principal */}
        <div style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          color: "white",
          maxWidth: "800px",
          padding: "0 20px",
          maxHeight: "90vh",
          overflowY: "auto"
        }}>
        {/* Logo */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{
            fontSize: "4rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, #8B5CF6 0%, #F43F5E 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: 0,
            textShadow: "0 0 30px rgba(139, 92, 246, 0.5)",
            animation: "glow 2s ease-in-out infinite alternate"
          }}>
            Trendly
          </h1>
        </div>

        {/* Lema principal */}
        <h2 style={{
          fontSize: "2.2rem",
          fontWeight: "700",
          margin: "0 0 15px 0",
          lineHeight: "1.2",
          textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)"
        }}>
          Atualize-se. Rápido. Fácil. Trendly.
        </h2>

        {/* Explicação complementar */}
        <p style={{
          fontSize: "1.2rem",
          color: "#CBD5E1",
          margin: "0 0 40px 0",
          lineHeight: "1.6",
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto"
        }}>
          As trends do Brasil em um único lugar. Curta, comente e compartilhe as novidades de hoje.
        </p>

        {/* Botões CTA */}
        <div style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "40px"
        }}>
          <Link
            to={user ? "/google/mais-clicados" : "/login"}
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #F43F5E 100%)",
              color: "white",
              padding: "18px 40px",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "18px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 8px 30px rgba(139, 92, 246, 0.4)",
              border: "none",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(139, 92, 246, 0.6)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(139, 92, 246, 0.4)";
            }}
          >
            {user ? "🚀 Explorar Trends" : "🚀 Comece Agora"}
          </Link>
          
          <Link
            to="/youtube/noticias"
            style={{
              background: "transparent",
              color: "white",
              padding: "18px 40px",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "18px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              cursor: "pointer",
              backdropFilter: "blur(10px)"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.6)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            📺 YouTube Trends
          </Link>
        </div>

        {/* Features em destaque */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "40px"
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            padding: "20px 15px",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease"
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>📈</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "600", margin: "0 0 10px 0" }}>Trends em Tempo Real</h3>
            <p style={{ fontSize: "0.9rem", color: "#CBD5E1", margin: 0 }}>Acompanhe o que está bombando agora</p>
          </div>
          
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            padding: "20px 15px",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease"
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>🇧🇷</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "600", margin: "0 0 10px 0" }}>100% Brasileiro</h3>
            <p style={{ fontSize: "0.9rem", color: "#CBD5E1", margin: 0 }}>Conteúdo feito para o Brasil</p>
          </div>
          
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            padding: "20px 15px",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease"
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>⚡</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "600", margin: "0 0 10px 0" }}>Super Rápido</h3>
            <p style={{ fontSize: "0.9rem", color: "#CBD5E1", margin: 0 }}>Interface otimizada para Gen Z</p>
          </div>
        </div>
      </div>

      {/* CSS para animações */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }
        
        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
          }
          50% {
            text-shadow: 0 0 50px rgba(139, 92, 246, 0.8), 0 0 70px rgba(244, 63, 94, 0.3);
          }
        }
      `}</style>
    </div>
  );
}
