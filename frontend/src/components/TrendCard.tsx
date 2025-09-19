import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface TrendCardProps {
  trend: { id: number; title: string; summary: string; tags: string[]; likes: number; thumbnail?: string | null };
}

export default function TrendCard({ trend }: TrendCardProps) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(trend.likes);

  const requireAuth = (action: () => void) => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    action();
  };

  const handleLike = () => requireAuth(() => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    // TODO: chamar API de like
  });

  const handleComment = () => requireAuth(() => {
    // TODO: abrir modal/componente de comentário
  });

  const handleShare = () => requireAuth(() => {
    // TODO: lógica de compartilhamento
  });

  return (
    <div className="trend-card animate-fade-in">
      {trend.thumbnail && (
        <div className="trend-thumbnail">
          <img 
            src={trend.thumbnail} 
            alt={trend.title} 
            className="thumbnail-image"
          />
          <div className="thumbnail-overlay">
            <div className="play-button">
              <span className="play-icon">▶</span>
            </div>
          </div>
        </div>
      )}
      
      {trend.tags.length > 0 && (
        <div className="trend-tags">
          {trend.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="trend-content">
        <h3 className="trend-title">{trend.title}</h3>
        <p className="trend-summary">{trend.summary}</p>
        
        <div className="trend-stats">
          <div className="stat-item">
            <span className="stat-icon">❤️</span>
            <span className="stat-value">{likeCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">💬</span>
            <span className="stat-value">0</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">👁️</span>
            <span className="stat-value">1.2k</span>
          </div>
        </div>
      </div>

      <div className="trend-actions">
        <button 
          onClick={handleLike} 
          className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
        >
          <span className="action-icon">{isLiked ? '❤️' : '🤍'}</span>
          <span className="action-text">Curtir</span>
        </button>
        <button 
          onClick={handleComment} 
          className="action-btn comment-btn"
        >
          <span className="action-icon">💬</span>
          <span className="action-text">Comentar</span>
        </button>
        <button 
          onClick={handleShare} 
          className="action-btn share-btn"
        >
          <span className="action-icon">📤</span>
          <span className="action-text">Compartilhar</span>
        </button>
      </div>
    </div>
  );
}
