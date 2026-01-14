import React from 'react'
import ReactDOM from 'react-dom/client'

// React router'dan 3 şey alıyoruz:
// 1. BrowseRouter: URL'leri yöneten ana conteiner
// 2. Routes: yolların (route) listesini tutan konteyner
// 3. Route: Her bir path tanımlaması
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import App from './App.jsx'
import PostDetail from './PostDetail.jsx'
import PostForm from './PostForm.jsx'
import './index.css'
import { ThemeProvider } from './ThemeContext.jsx'

// React uygulamasını başlatıyoruz
// HTML'deki 'root' id'li div'e React'i yerleştiriyoruz
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode: Hataları daha iyi görmek için React'in geliştirme modu
  <React.StrictMode>
    <ThemeProvider>
    
    {/* BrowserRouter: URL değişikliklerini takip eden ana konteyner */}
    <BrowserRouter>
      
      {/* Routes: Tüm yolları (route) içinde barındıran konteyner */}
      <Routes>
        
        {/* Ana sayfa */}
        <Route path="/" element={<App />} />
        
        {/* Yeni yazı ekleme sayfası */}
        <Route path="/addContent" element={<PostForm />} />
        
        {/* Yazı düzenleme sayfası */}
        <Route path="/edit/:id" element={<PostForm />} />
        
        {/* Yazı okuma sayfası */}
        <Route path="/post/:id" element={<PostDetail />} />
        
      </Routes>
      
    </BrowserRouter>
    </ThemeProvider>
    
  </React.StrictMode>,
)