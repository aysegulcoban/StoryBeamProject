import React from 'react'
import ReactDOM from 'react-dom/client'

// React router'dan 3 şey alıyoruz:
// 1. BrowseRouter: URL'leri yöneten ana conteiner
// 2. Routes: yolların (route) listesini tutan konteyner
// 3. Route: Her bir path tanımlaması
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import App from './App.jsx'

// Yen iyazı ekle butonuna tıklanılınca açılacak olan sayfa
import AddStoryBeamPost from './AddStoryBeamPost.jsx'
import './index.css'

// React uygulamasını başlatıyoruz
// HTML'deki 'root' id'li div'e React'i yerleştiriyoruz
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode: Hataları daha iyi görmek için React'in geliştirme modu
  <React.StrictMode>
    
    {/* BrowserRouter: URL değişikliklerini takip eden ana konteyner */}
    <BrowserRouter>
      
      {/* Routes: Tüm yolları (route) içinde barındıran konteyner */}
      <Routes>
        
        {/* İlk Route: Ana sayfa */}
        {/* path="/": Kullanıcı http://localhost:5173/ adresine gittiğinde */}
        {/* element={<App />}: App component'ini göster */}
        <Route path="/" element={<App />} />
        
        {/* İkinci Route: Yeni yazı sayfası */}
        {/* path="/yeni-sayfa": Kullanıcı http://localhost:5173/yeni-sayfa adresine gittiğinde */}
        {/* element={<AddStoryBeamPost />}: AddStoryBeamPost component'ini göster */}
        <Route path="/addContent" element={<AddStoryBeamPost />} />
        
      </Routes>
      
    </BrowserRouter>
    
  </React.StrictMode>,
)