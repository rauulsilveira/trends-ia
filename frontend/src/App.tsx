import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import ErrorBoundary from "./components/ErrorBoundary";
import GlobalErrorHandler from "./components/GlobalErrorHandler";
import AppLayout from "./layouts/AppLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UsersPage from "./pages/admin/UsersPage";
import TrendsPage from "./pages/admin/TrendsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import YoutubeNewsPage from "./pages/YoutubeNewsPage";
import YoutubeMusicPage from "./pages/YoutubeMusicPage";
import YoutubeViralPage from "./pages/YoutubeViralPage";
import GoogleTopClicksPage from "./pages/GoogleTopClicksPage";
import GoogleTopTrendsPage from "./pages/GoogleTopTrendsPage";

export default function App() {
  return (
    <GlobalErrorHandler>
      <ErrorBoundary>
        <UserProvider>
          <Router>
            <Routes>
              {/* Login */}
              <Route path="/login" element={<Login />} />
              
              {/* Página pública */}
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Home />} />
                <Route path="trends" element={<TrendsPage />} />
                <Route path="youtube/noticias" element={<YoutubeNewsPage />} />
                <Route path="youtube/musicas" element={<YoutubeMusicPage />} />
                <Route path="youtube/virais" element={<YoutubeViralPage />} />
                <Route path="google/mais-clicados" element={<GoogleTopClicksPage />} />
                <Route path="google/maiores-tendencias" element={<GoogleTopTrendsPage />} />
              </Route>
              
              {/* Admin protegido */}
              <Route path="/admin/*" element={<AdminLayoutWrapper />}>
                <Route path="trends" element={<TrendsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              
              {/* Fallback 404 */}
              <Route path="*" element={<div>404 - Página não encontrada</div>} />
            </Routes>
          </Router>
        </UserProvider>
      </ErrorBoundary>
    </GlobalErrorHandler>
  );
}

function AdminLayoutWrapper() {
  // Wrapper para proteger rotas admin com base no contexto de usuário
  const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const isAuthenticated = Boolean(stored);
  return isAuthenticated ? <AdminLayout /> : <Navigate to="/login" />;
}
