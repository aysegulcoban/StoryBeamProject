import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useTheme } from './ThemeContext';

function PostDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const post = location.state?.post; // Ana sayfadan gelen veri

  // Tema renkleri
  const theme = {
    bg: isDarkMode ? '#0B1120' : '#ffffff',
    text: isDarkMode ? '#f8fafc' : '#0f172a',
    muted: isDarkMode ? '#94a3b8' : '#64748b',
    border: isDarkMode ? '#1e293b' : '#e2e8f0',
    accent: '#0ea5e9'
  };

  if (!post) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        backgroundColor: theme.bg,
        color: theme.text,
        minHeight: '100vh'
      }}>
        <p>Yazı bulunamadı. Ana sayfaya dönün.</p>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: theme.accent,
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Ana Sayfa
        </button>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: theme.bg,
      color: theme.text,
      minHeight: '100vh',
      fontFamily: '"Inter", sans-serif'
    }}>
      
      {/* Header */}
      <header style={{ 
        padding: '24px 0', 
        borderBottom: `1px solid ${theme.border}`,
        position: 'sticky',
        top: 0,
        backgroundColor: theme.bg,
        zIndex: 100
      }}>
        <div style={{ width: '92%', maxWidth: '1800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h1 style={{ fontSize: '26px', fontWeight: '900', margin: 0, cursor: 'pointer' }} onClick={() => navigate('/')}>
        StoryBeam <span style={{ color: theme.accent }}>✨</span>
    </h1>
  
    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <button 
        onClick={toggleTheme}
        style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: isDarkMode ? '#334155' : '#f1f5f9',
            color: isDarkMode ? '#f8fafc' : '#0f172a',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer'
        }}>
        {isDarkMode ? '☀️' : '🌙'}
        </button>

        <button 
        onClick={() => navigate('/')}
        style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
            background: 'transparent',
            color: theme.text,
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer'
        }}>
        ← Geri Dön
        </button>
    </div>
    </div>
      </header>

      {/* İçerik */}
      <div style={{ width: '92%', maxWidth: '1700px', margin: '0 auto' }}>
        
        {/* Durum Badge */}
        <div style={{ 
          color: theme.accent, 
          fontWeight: '700', 
          marginBottom: '10px', 
          textTransform: 'uppercase', 
          letterSpacing: '1px', 
          fontSize: '14px' 
        }}>
          {post.isPublished ? 'Yayında' : 'Taslak'}
        </div>

        {/* Başlık */}
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: '900', 
          lineHeight: '1.1', 
          marginBottom: '20px' 
        }}>
          {post.title}
        </h1>

        {/* Meta Bilgiler */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          color: theme.muted, 
          fontSize: '14px',
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: `1px solid ${theme.border}`
        }}>
          <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
          <span>·</span>
          <span>{post.author}</span>
          <span>·</span>
          <span>{post.category}</span>
        </div>

        {/* Markdown İçerik */}
        <div style={{ 
          fontSize: '20px', 
          lineHeight: '1.8', 
          fontFamily: 'Merriweather, serif', 
          color: theme.text 
        }}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              img: ({node, ...props}) => (
                <img style={{maxWidth: '100%', borderRadius: '8px', margin: '20px 0'}} {...props} />
              ),
              
              code: ({node, inline, ...props}) => (
                <code style={{
                  backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
                  padding: inline ? '2px 6px' : '16px',
                  borderRadius: inline ? '4px' : '8px',
                  fontSize: inline ? '18px' : '16px',
                  display: inline ? 'inline' : 'block',
                  margin: inline ? '0' : '20px 0'
                }} {...props} />
              ),
              
              h1: ({node, ...props}) => <h1 style={{fontSize: '42px', margin: '32px 0 16px', fontWeight: '800'}} {...props} />,
              h2: ({node, ...props}) => <h2 style={{fontSize: '36px', margin: '28px 0 14px', fontWeight: '700'}} {...props} />,
              h3: ({node, ...props}) => <h3 style={{fontSize: '28px', margin: '24px 0 12px', fontWeight: '600'}} {...props} />,
              
              p: ({node, ...props}) => <p style={{marginBottom: '16px'}} {...props} />,
              
              blockquote: ({node, ...props}) => (
                <blockquote style={{
                  borderLeft: `4px solid ${theme.accent}`,
                  paddingLeft: '20px',
                  marginLeft: '0',
                  marginBottom: '16px',
                  fontStyle: 'italic',
                  color: theme.muted
                }} {...props} />
              )
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;