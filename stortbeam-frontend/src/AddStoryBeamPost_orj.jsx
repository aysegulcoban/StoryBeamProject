import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios' 
import './css/AddStoryBeamPost.css'
import { useNavigate } from 'react-router-dom';
function AddStoryBeamPost({ isDarkMode, onSave }) {
  // Form State'leri
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const contentRef = useRef(null);
  
  // Kategori Mantığı - ÇOK SEÇİMLİ
  const [categories, setCategories] = useState(['Teknoloji', 'React', 'Tasarım', 'Hayat']);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

  // Yayınla / Taslak Mantığı
  const [isPublished, setIsPublished] = useState(false);

  // Tema Renkleri
  const theme = {
    bg: isDarkMode ? '#0B1120' : '#ffffff',
    text: isDarkMode ? '#f8fafc' : '#0f172a',
    muted: isDarkMode ? '#94a3b8' : '#64748b',
    border: isDarkMode ? '#1e293b' : '#e2e8f0',
    accent: '#0ea5e9',
    inputBg: 'transparent',
    toolbarBg: isDarkMode ? '#1e293b' : '#ffffff',
    codeBg: isDarkMode ? '#1e293b' : '#f1f5f9',
    hoverBg: isDarkMode ? '#334155' : '#f1f5f9',
    categoryBg: isDarkMode ? '#1e293b' : '#f8fafc',
    sidebarBg: isDarkMode ? '#111827' : '#f8fafc',
  };

  const navigate = useNavigate();

  // Kategori Ekleme/Çıkarma
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Rich Text Formatting Functions - DÜZELTİLDİ
  const formatText = (command, value = null) => {
    // contentEditable div'e odaklan
    contentRef.current?.focus();
    
    // execCommand'ı çalıştır
    document.execCommand(command, false, value);
    
    // Değişiklikleri kaydet
    setContent(contentRef.current?.innerHTML || '');
  };

  // Content değiştiğinde state'i güncelle
  const handleContentChange = () => {
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }
  };

  const handleSave = async(e) => {
    e.preventDefault();
    
    const newPost = {
      title,
      content: contentRef.current?.innerHTML || content,
      author,
      categories: selectedCategories,
      isPublished,
      createdAt: new Date().toISOString()
    };

    const emptyFields = Object.entries(newPost)
        .filter(([_, value]) => typeof value === "string" && value.trim() === "")
        .map(([key]) => key);
    if (emptyFields.length > 0) {
        console.log("Boş alanlar:", emptyFields);
        alert(`${emptyFields.join(", ")} alanları boş olamaz`);
        return; // 
    }

    let categoriesForDB = "";
    let flag = 0;
    console.log("category: ",selectedCategories);
    for (const cat in selectedCategories){
        const category = selectedCategories[cat];
        console.log("fpr category: ",category);
        if (categoriesForDB==""){
            categoriesForDB += category; 
        }
        else{
            categoriesForDB += ","+category; 
        }
    }
    console.log("categoriesForDB: ",categoriesForDB);
    
    //console.log("Kaydedilen Veri:", newPost.author,newPost.categories,newPost);
    const response = await axios.post('http://localhost:5216/api/StoryBeam', {
        title:newPost.title,
        content:newPost.content,
        author:newPost.author,
        isPublished:newPost.isPublished,
        category:categoriesForDB
    })
    console.log("response: ",response)
    alert("İçerik başarıyla eklendi")
    navigate('/');

  };

  return (
    <div style={{ 
      backgroundColor: theme.bg, 
      color: theme.text,
      minHeight: '100vh',
      fontFamily: '"Inter", -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      
      {/* Header */}
      <header style={{ 
        padding: '24px 0', 
        borderBottom: `1px solid ${theme.border}`,
      }}>
        <div className="container-fluid" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            margin: 0 
          }}>
            StoryBeam <span style={{ color: theme.accent }}>✨</span>
          </h1>
        </div>
      </header>

      {/* Ana Form */}
      <form onSubmit={handleSave}>
        <div className="container-fluid main-layout">
          
          {/* SOL KOLON: İÇERİK EDİTÖRÜ */}
          <section>
            {/* Başlık */}
            <input 
              type="text"
              className="minimal-input title-input"
              placeholder="Başlık..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ color: theme.text }}
            />

            {/* Yazar */}
            <input 
              type="text"
              className="minimal-input meta-input"
              placeholder="Yazar adı"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{ 
                color: theme.muted,
                borderBottomColor: theme.border
              }}
            />

            {/* Formatlama Toolbar */}
            <div className="format-toolbar" style={{
              backgroundColor: theme.toolbarBg,
              borderColor: theme.border
            }}>

              <button 
                className="format-btn" 
                type="button" 
                onClick={() => formatText('italic')} 
                title="İtalik (Ctrl+I)"
                style={{ color: theme.text }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.hoverBg}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <em>I</em>
              </button>
              
              <button 
                className="format-btn" 
                type="button" 
                onClick={() => formatText('underline')} 
                title="Altı Çizili (Ctrl+U)"
                style={{ color: theme.text }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.hoverBg}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <u>U</u>
              </button>
              
              <div className="toolbar-divider" style={{ backgroundColor: theme.border }}></div>
              
              <button 
                className="format-btn" 
                type="button" 
                onClick={() => formatText('formatBlock', '<h2>')} 
                title="Başlık 2"
                style={{ color: theme.text }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.hoverBg}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                H2
              </button>
              
              <button 
                className="format-btn" 
                type="button" 
                onClick={() => formatText('formatBlock', '<h3>')} 
                title="Başlık 3"
                style={{ color: theme.text }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.hoverBg}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                H3
              </button>
              
              <div className="toolbar-divider" style={{ backgroundColor: theme.border }}></div>
              
              <button 
                className="format-btn" 
                type="button" 
                onClick={() => formatText('justifyLeft')} 
                title="Sola Yasla"
                style={{ color: theme.text }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.hoverBg}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ⬅
              </button>
              
              <button 
                className="format-btn" 
                type="button" 
                onClick={() => formatText('justifyCenter')} 
                title="Ortala"
                style={{ color: theme.text }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.hoverBg}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ↔
              </button>
              
              <button 
                className="format-btn" 
                type="button" 
                onClick={() => formatText('justifyRight')} 
                title="Sağa Yasla"
                style={{ color: theme.text }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.hoverBg}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ➡
              </button>
              
              <button 
                className="format-btn" 
                type="button" 
                onClick={() => formatText('justifyFull')} 
                title="İki Yana Yasla"
                style={{ color: theme.text }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.hoverBg}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ⬌
              </button>
              
              <div className="toolbar-divider" style={{ backgroundColor: theme.border }}></div>
              
              <button 
                className="format-btn" 
                type="button" 
                onClick={() => formatText('insertUnorderedList')} 
                title="Madde İşaretli Liste"
                style={{ color: theme.text }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.hoverBg}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ☰
              </button>
              
              <button 
                className="format-btn" 
                type="button" 
                onClick={() => formatText('insertOrderedList')} 
                title="Numaralı Liste"
                style={{ color: theme.text }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.hoverBg}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ≡
              </button>
        

            </div>

            {/* Rich Text İçerik Alanı */}
            <div>
              <div
                ref={contentRef}
                className="content-area"
                contentEditable={true}
                data-placeholder="Hikayeni buraya yazmaya başla..."
                suppressContentEditableWarning={true}
                onInput={handleContentChange}
                style={{ 
                  color: theme.text,
                  caretColor: theme.text
                }}
              ></div>
            </div>

            {/* Formatting Hint */}
            <div style={{ 
              marginTop: '20px', 
              padding: '12px 16px', 
              background: theme.sidebarBg,
              borderRadius: '8px',
              fontSize: '13px',
              color: theme.muted
            }}>
              💡 <strong>İpucu:</strong> Üstteki araç çubuğunu kullanarak metninizi formatlayın. Klavye kısayolları da çalışır (Ctrl+B, Ctrl+I).
            </div>
          </section>


          {/* SAĞ KOLON: SIDEBAR / AYARLAR */}
          <aside>
            <div style={{ 
              position: 'sticky', top: '40px', 
              display: 'flex', flexDirection: 'column', gap: '30px' 
            }}>
              
              {/* KAYDET BUTONU */}
              <button 
                type="submit"
                onClick={() =>
                    console.log("tıklandı")
                }
                style={{ 
                  backgroundColor: theme.text, 
                  color: theme.bg, 
                  border: 'none', padding: '14px 24px', borderRadius: '8px', 
                  fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                {isPublished ? 'YAYINLA' : 'TASLAĞI KAYDET'}
              </button>

              {/* YAYIN DURUMU */}
              <div style={{ 
                padding: '20px', 
                border: `1px solid ${theme.border}`, 
                borderRadius: '12px',
                backgroundColor: theme.sidebarBg
              }}>
                 <h4 style={{ 
                   fontSize: '12px', 
                   fontWeight: 'bold', 
                   color: theme.muted, 
                   textTransform: 'uppercase', 
                   marginBottom: '15px' 
                 }}>
                   Yayın Durumu
                 </h4>
                 
                 <label className="toggle-label">
                    <input 
                      type="checkbox" 
                      style={{ display: 'none' }} 
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                    />
                    <div className="toggle-switch"></div>
                    <span style={{ color: isPublished ? theme.accent : theme.muted }}>
                      {isPublished ? 'Yayında' : 'Taslak Modu'}
                    </span>
                 </label>
              </div>

              {/* KATEGORİLER - ÇOK SEÇİMLİ */}
              <div style={{ 
                padding: '20px', 
                border: `1px solid ${theme.border}`, 
                borderRadius: '12px',
                backgroundColor: theme.sidebarBg
              }}>
                 <h4 style={{ 
                   fontSize: '12px', 
                   fontWeight: 'bold', 
                   color: theme.muted, 
                   textTransform: 'uppercase', 
                   marginBottom: '15px' 
                 }}>
                   Kategoriler ({selectedCategories.length} seçili)
                 </h4>

                 {/* Seçili Kategoriler */}
                 {selectedCategories.length > 0 && (
                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                     {selectedCategories.map(cat => (
                       <div 
                         key={cat} 
                         className="category-pill selected"
                         style={{ 
                           backgroundColor: theme.categoryBg,
                           color: theme.text,
                           borderColor: theme.border
                         }}
                       >
                         {cat}
                         <span 
                           className="remove-btn" 
                           onClick={() => toggleCategory(cat)}
                         >
                           ×
                         </span>
                       </div>
                     ))}
                   </div>
                 )}

                 {/* Tüm Kategoriler */}
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                   {categories.filter(cat => !selectedCategories.includes(cat)).map(cat => (
                     <div 
                       key={cat} 
                       className="category-pill"
                       onClick={() => toggleCategory(cat)}
                       style={{ 
                         backgroundColor: theme.categoryBg,
                         color: theme.text,
                         borderColor: theme.border
                       }}
                     >
                       {cat}
                     </div>
                   ))}
                 </div>

                 {/* Yeni Kategori Ekleme */}
                 {!isAddingNewCategory ? (
                   <button 
                     type="button"
                     onClick={() => setIsAddingNewCategory(true)}
                     style={{ 
                       width: '100%', padding: '10px', 
                       border: `1px dashed ${theme.border}`, 
                       background: 'transparent', 
                       color: theme.accent, 
                       borderRadius: '8px', 
                       cursor: 'pointer',
                       fontWeight: '600',
                       fontSize: '13px'
                     }}
                   >
                     + Yeni Kategori Ekle
                   </button>
                 ) : (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <input 
                        type="text"
                        className="custom-select"
                        placeholder="Yeni kategori adı..."
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        autoFocus
                        style={{ 
                          color: theme.text,
                          borderColor: theme.border
                        }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          type="button"
                          onClick={() => {
                            setIsAddingNewCategory(false);
                            setNewCategory("");
                          }}
                          style={{ 
                            flex: 1, padding: '8px', 
                            border: `1px solid ${theme.border}`, 
                            background: 'transparent', 
                            color: theme.muted, 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontSize:'13px',
                            fontWeight: '500'
                          }}
                        >
                          İptal
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                             if(newCategory.trim()) {
                               setCategories([...categories, newCategory.trim()]);
                               setSelectedCategories([...selectedCategories, newCategory.trim()]);
                               setNewCategory("");
                               setIsAddingNewCategory(false);
                             }
                          }}
                          style={{ 
                            flex: 1, padding: '8px', 
                            border: 'none', 
                            background: theme.accent, 
                            color: '#fff', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontSize:'13px',
                            fontWeight: '600'
                          }}
                        >
                          Ekle
                        </button>
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

export default AddStoryBeamPost;