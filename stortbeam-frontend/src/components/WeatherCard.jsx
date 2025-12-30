import React, { useState, useEffect } from 'react';

function WeatherCard({ weatherData, isDarkMode, onEdit, onDelete,addContext,selectCategory }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  // Tema Renkleri
  const theme = {
    bg: isDarkMode ? '#0B1120' : '#ffffff', // Çok koyu lacivert
    text: isDarkMode ? '#f8fafc' : '#0f172a', // Neredeyse beyaz / Koyu Lacivert
    muted: isDarkMode ? '#94a3b8' : '#64748b', // Gri metinler
    border: isDarkMode ? '#1e293b' : '#e2e8f0', // Çizgiler
    accent: '#0ea5e9', // Ana Renk (Mavi)
    danger: '#ef4444',
    cardHover: isDarkMode ? '#1e293b' : '#f8fafc' // Kartın üzerine gelinceki renk
  };

  useEffect(() => {
    document.body.style.overflow = selectedItem ? 'hidden' : 'unset';
  }, [selectedItem]);

  return (
    <div style={{ 
      backgroundColor: theme.bg, 
      color: theme.text,
      minHeight: '100vh',
      fontFamily: '"Inter", -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* GLOBAL CSS STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&family=Merriweather:ital,wght@0,300;0,400;1,300&display=swap');
        
        /* Ekranın %92'sini kaplayan geniş konteyner */
        .container-fluid {
          width: 92%;
          max-width: 1800px;
          margin: 0 auto;
        }

        /* Grid Yapısı: Sol taraf geniş, Sağ taraf dar */
        .main-layout {
          display: grid;
          grid-template-columns: 4fr 1fr; /* 3 birim yazı, 1 birim sidebar */
          gap: 60px;
          padding-top: 40px;
        }

        /* Yazı Kartı */
        .article-card {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 40px;
          padding: 30px 0;
          border-bottom: 1px solid ${theme.border};
          transition: all 0.2s ease;
        }

        .article-card:hover .article-title {
          color: ${theme.accent};
        }

        .article-title {
          font-family: 'Inter', sans-serif;
          font-size: 28px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 12px;
          color: ${theme.text};
          cursor: pointer;
          transition: color 0.2s;
          text-align:left;
        }

        /* Butonlar */
        .action-btn {
          background: none; border: none; padding: 0;
          font-size: 13px; font-weight: 600; cursor: pointer;
          margin-right: 20px; opacity: 0.8;
        }
        .action-btn:hover { opacity: 1; text-decoration: underline; }
      `}</style>

      

      {/* ANA İÇERİK */}
      <div className="container-fluid main-layout">
        
        {/* SOL KOLON: YAZILAR (Geniş Alan) */}
        <section>
          <div style={{ marginBottom: '40px', position: 'relative' }}>
            <input 

              type="text" 
              placeholder="Neyi aramıştınız?" 
              value={searchTerm} // State'e bağladık
              onChange={(e) => setSearchTerm(e.target.value)} 
              style={{
                width: '100%',
                padding: '12px 0px', // Yanlardaki boşluğu sıfırlayıp alt çizgiye odaklandık
                fontSize: '15px',
                paddingLeft:'2px',
                fontWeight: '400',
                color: isDarkMode ? '#ffffffff': '#000000',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: '1px solid #e0e0e0', // Sadece alt çizgi
                outline: 'none',
                transition: 'all 0.3s ease',
                letterSpacing: '0.5px'
              }}
              // Focus olduğunda alt çizginin rengini değiştirmek için basit bir efekt
              onFocus={(e) => e.target.style.borderBottom = '1px solid #000'}
              onBlur={(e) => e.target.style.borderBottom = '1px solid #e0e0e0'}
            />
            {/* İsteğe bağlı: Sağ köşeye çok küçük, şık bir büyüteç ikonu veya yazı eklenebilir */}
            <span style={{ 
              position: 'absolute', 
              right: '0', 
              top: '12px', 
              fontSize: '12px', 
              color: '#aaa',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Ara
            </span>
          </div>
          
          {weatherData && weatherData
          .filter((item) => {
            const searchLower = searchTerm.toLowerCase();
            // Eğer arama kutusu boşsa herşeyi göster:
            if (searchTerm === "") return item;
            if (selectedCategory) {
              return item.category?.toLowerCase().includes(searchLower);
            }
            return item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase());
          })
          .map((item) => (
            <div key={item.id} className="article-card">
              
              {/* Metin Alanı (Sola Yaslı ve Geniş) */}
              <div style={{ flex: 1 }}>
                
                {/* Meta Bilgiler (Üst) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                   {/* Hap Tasarımı (Badge) */}
                   <span style={{ 
                      fontSize: '11px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px',
                      backgroundColor: item.isPublished ? (isDarkMode ? 'rgba(14, 165, 233, 0.2)' : '#e0f2fe') : (isDarkMode ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7'),
                      color: item.isPublished ? (isDarkMode ? '#38bdf8' : '#0284c7') : (isDarkMode ? '#fbbf24' : '#d97706'),
                      border: `1px solid ${item.isPublished ? (isDarkMode ? 'rgba(56, 189, 248, 0.3)' : '#bae6fd') : (isDarkMode ? 'rgba(251, 191, 36, 0.3)' : '#fde68a')}`
                   }}>
                      {item.isPublished ? 'YAYINDA' : 'TASLAK'}
                   </span>
                   <span style={{ fontSize: '13px', color: theme.muted }}>{new Date(item.createdAt).toLocaleDateString('tr-TR')}</span>
                   <span style={{ fontSize: '13px', color: theme.muted }}>· {item.author}</span>
                   <span style={{ fontSize: '13px', color: theme.muted }}>· {item.category}</span>
                </div>

                {/* Başlık */}
                <h3 className="article-title" onClick={() => setSelectedItem(item)}>
                  {item.title}
                </h3>
                
                {/* Özet Metni */}
                <div 
                  style={{ 
                    fontFamily: 'Merriweather, serif', 
                    fontSize: '16px', 
                    color: theme.muted, 
                    lineHeight: '1.6', 
                    marginBottom: '20px', 
                    maxWidth: '90%',
                    textAlign:'left',
                    marginLeft:'20px' 
                  }}
                  dangerouslySetInnerHTML={{
                    __html: item.content.length > 220 
                      ? item.content.substring(0, 420) + '...' 
                      : item.content
                  }}
                />

                {/* Aksiyon Butonları */}
                <div style={{ display: 'flex' }}>
                  <button className="action-btn" style={{ color: theme.text }} onClick={() => onEdit(item)}>Düzenle</button>
                  <button className="action-btn" style={{ color: theme.danger }} onClick={() => onDelete(item.id)}>Sil</button>
                </div>
              </div>

              {/* Görsel Alanı (Sağda Sabit) */}
              <div onClick={() => setSelectedItem(item)} style={{ 
                width: '260px', height: '170px', 
                backgroundColor: theme.border, 
                borderRadius: '8px', flexShrink: 0, cursor: 'pointer',
                backgroundImage: `url(https://picsum.photos/seed/${item.id}/300/200)`, // Rastgele görsel
                backgroundSize: 'cover', backgroundPosition: 'center',
                border: `1px solid ${theme.border}`
              }}></div>
            </div>
          ))}
        </section>

        {/* SAĞ KOLON: SIDEBAR */}
{/* SAĞ KOLON: SIDEBAR */}
<aside>
  <div style={{ 
    position: 'sticky', 
    top: '40px', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '40px' 
  }}>
    
    {/* Kullanıcı İsmi - Sağa Yaslı ve Çok Sade */}
    <div style={{ 
      textAlign: 'right',
      paddingRight: '4px', 
      marginTop:"20px",
      gap: '40px'
    }}>
      <span style={{ 
        fontSize: '14px', 
        fontWeight: '500', 
        letterSpacing: '0.5px',
        color: theme.muted, // Daha soft bir görünüm için muted renk
        fontFamily: '"Inter", sans-serif'
      }}>
        Ayşegül Çoban
      </span>
    </div>

    {/* Yeni Yazı Butonu */}
    <button style={{ 
      backgroundColor: theme.text, 
      color: theme.bg, 
      border: 'none', 
      padding: '12px 24px', 
      borderRadius: '6px', 
      fontWeight: '600', 
      fontSize: '14px', 
      cursor: 'pointer',
      width: '100%' // Sütunu tam doldurması için
    }}onClick={() => addContext("deneme")}>
      + YENİ YAZI
    </button>

    {/* İstatistik Kartı */}
    <div style={{ 
      padding: '24px', 
      border: `1px solid ${theme.border}`, 
      borderRadius: '12px', 
      backgroundColor: isDarkMode ? '#111827' : '#f8fafc' 
    }}>
       <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: theme.muted, textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '0.5px' }}>
         Genel Durum
       </h4>
       <div style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1' }}>
         {weatherData ? weatherData.length : 0}
       </div>
       <div style={{ fontSize: '14px', color: theme.muted, marginTop: '5px' }}>
         Toplam Yazı
       </div>
    </div>

    {/* Kategoriler */}
    <div>
      <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: theme.muted, textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '0.5px' }}>
        Hızlı Filtrele
      </h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {['React', 'Javascript', 'Tasarım', 'Kariyer'].map(cat => (
          <span key={cat} 
          onClick={() => {
            const nextCat = selectedCategory === cat ? null : cat;
            setSelectedCategory(nextCat);
            setSearchTerm(nextCat ? cat : ""); // Kategori seçilince arama kutusuna yazar
            selectCategory(cat);
          }}

          
          style={{ 
            fontSize: '13px', padding: '6px 14px', borderRadius: '20px', 
            cursor:'pointer',
            border:
            selectedCategory === cat
              ? `1px solid ${theme.accent}`   // aktif border
              : `1px solid ${theme.border}`, // normal border

          // (isteğe bağlı) seçiliyken renk de değişsin
          color:
            selectedCategory === cat
              ? theme.accent
              : theme.text,

          transition: 'all 0.2s ease'
          }}>
            {cat}
          </span>
        ))}
      </div>
    </div>

  </div>
</aside>

      </div>

      {/* OKUMA MODAL (Full Screen) */}
      {selectedItem && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: isDarkMode ? 'rgba(11, 17, 32, 0.95)' : 'rgba(255, 255, 255, 0.98)',
          zIndex: 1000, overflowY: 'auto', display: 'flex', justifyContent: 'center'
        }}>
          <div style={{ width: '100%', maxWidth: '1500px', padding: '80px 20px', position: 'relative' }}>
             <button 
                onClick={() => setSelectedItem(null)} 
                style={{ 
                  position: 'fixed', top: '30px', right: '30px', 
                  width: '40px', height: '40px', borderRadius: '50%', border: `1px solid ${theme.border}`,
                  background: theme.bg, color: theme.text, fontSize: '20px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                ✕
             </button>
             
             <div style={{ color: theme.accent, fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px' }}>
                {selectedItem.isPublished ? 'Yayında' : 'Taslak'}
             </div>
             <h1 style={{ fontSize: '48px', fontWeight: '900', lineHeight: '1.1', marginBottom: '30px' }}>{selectedItem.title}</h1>
             <div 
              style={{ 
                fontSize: '20px', 
                lineHeight: '1.8', 
                fontFamily: 'Merriweather, serif', 
                color: theme.text,
                //backgroundImage: `url(https://picsum.photos/seed/${selectedItem.id}/300/200)`
              }}
              dangerouslySetInnerHTML={{ __html: selectedItem.content }}
              
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherCard;