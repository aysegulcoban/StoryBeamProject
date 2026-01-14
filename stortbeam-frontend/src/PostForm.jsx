import React, { useState, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; 
import remarkGfm from 'remark-gfm';    
import rehypeRaw from 'rehype-raw';     
import './css/AddStoryBeamPost.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeContext';

function PostForm() {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Düzenleme modunda gelen post verisi
  const postToEdit = location.state?.post;
  const isEditMode = !!postToEdit; // post varsa edit mode
  
  // Form State'leri
  const [title, setTitle] = useState(postToEdit?.title || "");
  const [content, setContent] = useState(postToEdit?.content || "");
  const [author, setAuthor] = useState(postToEdit?.author || "");
  const [activeTab, setActiveTab] = useState("write");

  const textareaRef = useRef(null);
  
  // Kategori Mantığı
  const [categories, setCategories] = useState(['Teknoloji', 'React', 'Tasarım', 'Hayat']);
  const [selectedCategories, setSelectedCategories] = useState(
    postToEdit?.category ? postToEdit.category.split(',') : []
  );
  const [newCategory, setNewCategory] = useState("");
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

  // Yayınla / Taslak
  const [isPublished, setIsPublished] = useState(postToEdit?.isPublished || false);

  // Tema Renkleri
  const theme = {
    bg: isDarkMode ? '#0B1120' : '#ffffff',
    text: isDarkMode ? '#f8fafc' : '#0f172a',
    muted: isDarkMode ? '#94a3b8' : '#64748b',
    border: isDarkMode ? '#1e293b' : '#e2e8f0',
    accent: '#0ea5e9',
    toolbarBg: isDarkMode ? '#1e293b' : '#f8fafc',
    inputBg: isDarkMode ? '#0B1120' : '#ffffff',
    previewBg: isDarkMode ? '#111827' : '#ffffff',
    sidebarBg: isDarkMode ? '#111827' : '#f8fafc',
    codeBg: isDarkMode ? '#1e293b' : '#f1f5f9',
  };

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const insertMarkdown = (prefix, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = before + prefix + selection + suffix + after;
    
    setContent(newText);
    
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleSave = async(e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !author.trim()) {
        alert("Başlık, İçerik ve Yazar alanları boş olamaz.");
        return;
    }

    const categoriesForDB = selectedCategories.join(",");
    
    try {
        if (isEditMode) {
            // DÜZENLEME - PUT isteği
            await axios.put(`http://localhost:5216/api/StoryBeam/${postToEdit.id}`, {
                id: postToEdit.id,
                title: title,
                content: content,
                author: author,
                isPublished: isPublished,
                category: categoriesForDB,
                createdAt: postToEdit.createdAt
            });
            alert("İçerik başarıyla güncellendi");
        } else {
            // YENİ EKLEME - POST isteği
            await axios.post('http://localhost:5216/api/StoryBeam', {
                title: title,
                content: content,
                author: author,
                isPublished: isPublished,
                category: categoriesForDB
            });
            alert("İçerik başarıyla eklendi");
        }
        navigate('/');
    } catch (error) {
        console.error("Hata:", error);
        alert("Bir hata oluştu.");
    }
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', fontFamily: '"Inter", sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header style={{ padding: '24px 0', borderBottom: `1px solid ${theme.border}` }}>
        <div className="container-fluid" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
            StoryBeam <span style={{ color: theme.accent }}>✨</span>
            <span style={{ fontSize: '14px', color: theme.muted, marginLeft: '15px' }}>
              {isEditMode ? '/ Düzenle' : '/ Yeni Yazı'}
            </span>
          </h1>
          
          <button 
            type="button"
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
        </div>
      </header>

      {/* Ana Form */}
      <form onSubmit={handleSave}>
        <div className="container-fluid main-layout">
          
          {/* SOL KOLON: EDİTÖR */}
          <section>
            <input 
              type="text"
              className="minimal-input title-input"
              placeholder="Başlık..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ color: theme.text }}
            />

            <input 
              type="text"
              className="minimal-input meta-input"
              placeholder="Yazar adı"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{ color: theme.muted, borderBottomColor: theme.border }}
            />

            {/* TAB MENU */}
            <div style={{ display: 'flex', gap: '1px', marginTop: '20px', borderBottom: `1px solid ${theme.border}` }}>
                <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: activeTab === 'write' ? theme.bg : 'transparent',
                        color: activeTab === 'write' ? theme.accent : theme.muted,
                        border: `1px solid ${theme.border}`,
                        borderBottom: activeTab === 'write' ? '1px solid transparent' : `1px solid ${theme.border}`,
                        marginBottom: '-1px',
                        borderTopLeftRadius: '6px',
                        borderTopRightRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}
                >
                    Düzenle (Write)
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: activeTab === 'preview' ? theme.bg : 'transparent',
                        color: activeTab === 'preview' ? theme.accent : theme.muted,
                        border: `1px solid ${theme.border}`,
                        borderBottom: activeTab === 'preview' ? '1px solid transparent' : `1px solid ${theme.border}`,
                        marginBottom: '-1px',
                        borderTopLeftRadius: '6px',
                        borderTopRightRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}
                >
                    Önizleme (Preview)
                </button>
            </div>

            {/* EDITOR ALANI */}
            <div style={{ 
                border: `1px solid ${theme.border}`, 
                borderTop: 'none',
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px',
                backgroundColor: theme.bg,
                minHeight: '400px'
            }}>
                
                {/* TOOLBAR */}
                {activeTab === 'write' && (
                    <div className="format-toolbar" style={{ backgroundColor: theme.toolbarBg, borderColor: theme.border, padding: '8px', borderBottom: `1px solid ${theme.border}` }}>
                        <button type="button" className="format-btn" onClick={() => insertMarkdown('**', '**')} title="Kalın"><b>B</b></button>
                        <button type="button" className="format-btn" onClick={() => insertMarkdown('*', '*')} title="İtalik"><em>I</em></button>
                        <div className="toolbar-divider" style={{ backgroundColor: theme.border }}></div>
                        <button type="button" className="format-btn" onClick={() => insertMarkdown('### ', '')} title="Başlık">H3</button>
                        <button type="button" className="format-btn" onClick={() => insertMarkdown('> ', '')} title="Alıntı">❝</button>
                        <div className="toolbar-divider" style={{ backgroundColor: theme.border }}></div>
                        <button type="button" className="format-btn" onClick={() => insertMarkdown('[', '](url)')} title="Link">🔗</button>
                        <button type="button" className="format-btn" onClick={() => insertMarkdown('![Resim Açıklaması](', ')')} title="Resim">🖼️</button>
                        <div className="toolbar-divider" style={{ backgroundColor: theme.border }}></div>
                        <button type="button" className="format-btn" onClick={() => insertMarkdown('- ', '')} title="Liste">☰</button>
                        <button type="button" className="format-btn" onClick={() => insertMarkdown('1. ', '')} title="Numaralı Liste">🔢</button>
                        <button type="button" className="format-btn" onClick={() => insertMarkdown('```\n', '\n```')} title="Kod Bloğu">{'< >'}</button>
                        <div className="toolbar-divider" style={{ backgroundColor: theme.border }}></div>
                        <button type="button" className="format-btn" onClick={() => insertMarkdown('<div style="text-align: left">\n\n', '\n\n</div>')} title="Sola Yasla">⬅️</button>
                        <button type="button" className="format-btn" onClick={() => insertMarkdown('<div style="text-align: center">\n\n', '\n\n</div>')} title="Ortala">⬛</button>
                        <button type="button" className="format-btn" onClick={() => insertMarkdown('<div style="text-align: right">\n\n', '\n\n</div>')} title="Sağa Yasla">➡️</button>
                        <button type="button" className="format-btn" onClick={() => insertMarkdown('<div style="text-align: justify">\n\n', '\n\n</div>')} title="İki Yana Yasla">⬜</button>
                    </div>
                )}

                {/* WRITE MODE: TEXTAREA */}
                {activeTab === 'write' ? (
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Hikayeni Markdown formatında yaz..."
                        style={{
                            width: '100%',
                            minHeight: '400px',
                            padding: '20px',
                            backgroundColor: theme.inputBg,
                            color: theme.text,
                            border: 'none',
                            outline: 'none',
                            resize: 'vertical',
                            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                            fontSize: '15px',
                            lineHeight: '1.6'
                        }}
                    />
                ) : (
                    /* PREVIEW MODE */
                    <div className="markdown-preview" style={{ padding: '20px', backgroundColor: theme.previewBg, color: theme.text, minHeight: '400px' }}>
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={{
                                img: ({node, ...props}) => <img style={{maxWidth: '100%', borderRadius: '8px'}} {...props} />,
                                code: ({node, inline, className, children, ...props}) => {
                                    return (
                                        <code style={{ backgroundColor: theme.codeBg, padding: '2px 5px', borderRadius: '4px' }} {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >
                            {content || '*Önizleme yapılacak içerik yok...*'}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '10px', fontSize: '12px', color: theme.muted }}>
              💡 Markdown desteklenir. Resim eklemek için: <code>![Açıklama](resim-linki.jpg)</code>
            </div>
          </section>

          {/* SAĞ KOLON: SIDEBAR */}
          <aside>
            <div style={{ position: 'sticky', top: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              <button 
                type="submit"
                style={{ 
                  backgroundColor: theme.text, 
                  color: theme.bg, 
                  border: 'none', padding: '14px 24px', borderRadius: '8px', 
                  fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                {isEditMode ? 'GÜNCELLE' : (isPublished ? 'YAYINLA' : 'TASLAĞI KAYDET')}
              </button>

              <div style={{ padding: '20px', border: `1px solid ${theme.border}`, borderRadius: '12px', backgroundColor: theme.sidebarBg }}>
                 <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: theme.muted, textTransform: 'uppercase', marginBottom: '15px' }}>
                   Yayın Durumu
                 </h4>
                 <label className="toggle-label">
                    <input type="checkbox" style={{ display: 'none' }} checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
                    <div className="toggle-switch"></div>
                    <span style={{ color: isPublished ? theme.accent : theme.muted }}>
                      {isPublished ? 'Yayında' : 'Taslak Modu'}
                    </span>
                 </label>
              </div>

              {/* Kategori Bölümü */}
              <div style={{ padding: '20px', border: `1px solid ${theme.border}`, borderRadius: '12px', backgroundColor: theme.sidebarBg }}>
                 <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: theme.muted, textTransform: 'uppercase', marginBottom: '15px' }}>
                   Kategoriler ({selectedCategories.length} seçili)
                 </h4>
                 {selectedCategories.length > 0 && (
                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                     {selectedCategories.map(cat => (
                       <div key={cat} className="category-pill selected" style={{ backgroundColor: theme.categoryBg, color: theme.text, borderColor: theme.border }}>
                         {cat} <span className="remove-btn" onClick={() => toggleCategory(cat)}>×</span>
                       </div>
                     ))}
                   </div>
                 )}
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                   {categories.filter(cat => !selectedCategories.includes(cat)).map(cat => (
                     <div key={cat} className="category-pill" onClick={() => toggleCategory(cat)} style={{ backgroundColor: theme.categoryBg, color: theme.text, borderColor: theme.border }}>
                       {cat}
                     </div>
                   ))}
                 </div>
                 
                 {!isAddingNewCategory ? (
                   <button type="button" onClick={() => setIsAddingNewCategory(true)} style={{ width: '100%', padding: '10px', border: `1px dashed ${theme.border}`, background: 'transparent', color: theme.accent, borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>+ Yeni Kategori Ekle</button>
                 ) : (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <input type="text" className="custom-select" placeholder="Yeni kategori..." value={newCategory} onChange={(e) => setNewCategory(e.target.value)} autoFocus style={{ color: theme.text, borderColor: theme.border }} />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="button" onClick={() => { setIsAddingNewCategory(false); setNewCategory(""); }} style={{ flex: 1, padding: '8px', border: `1px solid ${theme.border}`, background: 'transparent', color: theme.muted, borderRadius: '6px', cursor: 'pointer', fontSize:'13px' }}>İptal</button>
                        <button type="button" onClick={() => { if(newCategory.trim()) { setCategories([...categories, newCategory.trim()]); setSelectedCategories([...selectedCategories, newCategory.trim()]); setNewCategory(""); setIsAddingNewCategory(false); }}} style={{ flex: 1, padding: '8px', border: 'none', background: theme.accent, color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize:'13px' }}>Ekle</button>
                      </div>
                   </div>
                 )}
              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}

export default PostForm;