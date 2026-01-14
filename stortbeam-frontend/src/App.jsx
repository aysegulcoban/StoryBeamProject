import { useState,useEffect } from "react"   //useState: herhangi bir değeri saklamaya veya değiştirmeye yarar, useEffect: sayfa yüklendiğinde otomatik çalışan koddur
import axios from 'axios'           // Backend ile frontend haberleşmesi için kullanılan kütüphanedir.
import './App.css'
import LoadingSpinner from "./components/LoadingSpinner"
import WeatherCard from "./components/WeatherCard"
import ErrorMessage from "./components/ErrorMessage"
import AddStoryBeamPost from "./AddStoryBeamPost"
import {useNavigate} from "react-router-dom"    // Yönlendirme için 
import { useTheme } from "./ThemeContext"

function App(){
  const [weatherData, setWeatherData] = useState([])
  const [loading,setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Tema modu için (dark/light) state ekledim:
  const { isDarkMode, toggleTheme } = useTheme()
  console.log('App.jsx - isDarkMode:', isDarkMode)

  // Yönlendirme için. Main.jsx dosyasına baktığımız zaman yönlendirmenin nasıl yapıldığını görebiliriz.
  const navigate = useNavigate();

  /*
  Aşağıdaki kısımda arrow fonksiyon tanımlıyoruz. Fonkdiiyon tanımlamanın modern şeklidir. Aşağıdaki fonksiyon şunu yapar:
  useEffect() : Sayfa yüklenir yüklenmez yani render olunca direkt çalış demek
  () => {fetchWeatherData()} : Çalışacak kod
  [] : Sadece ilk açılışta çalış demek (dependency array)

  Dependency Array:
  [] → useEffect'in ikinci parametresi, "ne zaman çalışsın?" sorusunun cevabıdır aslında 3 farklı kullanımı var:
  1-) Boş dizi: Sadece ilk açılışta çalışsın demek örneğin API'den veri çekmek, başlangıç ayarları, bir kez yapılacak işlemlerde kullanılır
  2-) İçinde değişken var ör:[city] : Sayfa ilk yüklendiğinde ve O değişken değişince çalışsın demek örneğin arama kutusu(her harf değişince ara gibi), filte değişince veri çek gibi yada, sayfa numarası değişince yeni sayfa yükle gibi yerlerde kullanılabilir
  3-) Hiç yazmazsak: Sayfa ilk yüklendiğinde, HER state değişiminde ve HER render'da çalışır. Tehlikelidir. Sonsuz döngü tehlikesi vardır.

  eski yöntemde ise fonksiyon:
  useEffect(function() {
    fetchWeatherData()
  }, [])

  şeklinde tanımlanırdı. Aslında ikiside aynı işi yapıyor ama arrow metod daha yaygın kullanılır.

  */
 useEffect(() => {
      fetchWeatherData()
    }, [])


  /**
   * Şimdi de arrow fonksiyon içerisinde çalıştır dediğimiz fetcWeatherData fonksiyonunu yazacağız
   * 
   * 
   */
  const fetchWeatherData = async() => {
    try{
      console.log("Backend'e istek atılıyor.....")
      const response = await axios.get('http://localhost:5216/api/StoryBeam')
      console.log('Gelen veri: ',response.data)

      // Gelen veriyi setlerde saklıyoruz:
      setWeatherData(response.data)
      setError(null)
    }catch(err){
      // Hata varsa yakalayacağız:
      console.log('Hata: ',err)
      setError('Backend bağlantı hatası: '+ err.message)
    }finally{
      setLoading(false)
    }
  }

  const onEdit = (item) =>
  {
    navigate(`/edit/${item.id}`, { state: { post: item } });
  }

  const onDelete = async(id) =>
  {
    console.log("Delete butonuna tıklandı: ", id)
    if (window.confirm("Bu yazıyı silmek istediğinizden emin misiniz?"))
    {
      try{
        await axios.delete(`http://localhost:5216/api/StoryBeam/${id}`);
        fetchWeatherData();
      }catch(err){
        console.log('Hata: ',err)
        alert('Silme işlemi başarısız.');
      }
    }
  }
  const addContext = async(value) =>
  {
    console.log("Yeni yazı ekle butonuna tıklandı",value)
    navigate('/addContent');  // istedğimiz sayfaya yönlendiriyoruz
  }

  const selectCategory = async(value) =>
  {
    console.log('Selected Category: ', value)
  }


  const theme = {
    bg: isDarkMode ? '#0f172a' : 'linear-gradient(135deg, #cdd3f0ff 0%, #beadcfff 100%)',
    title: '#ffffff', // Başlıklar her iki modda da beyaz kalsın dersen böyle kalabilir
    subtitle: 'rgba(255, 255, 255, 0.9)'
  }

  if (loading) return <LoadingSpinner/>
  if (error) return <ErrorMessage message={error}/>

  //Ana Sayfa
return (
    <div className="App" style={{
    minHeight: '100vh',
    background: theme.bg,
    transition: 'all 0.4s ease',
    padding: '0',
    margin: '0',
    fontFamily: '"Inter", sans-serif'
}}>
    {/* Üst Kısım (Header etiketi olmadan, yüksek ve ortalanmış) */}
    <div style={{
        height: '100px', // Yüksekliği buradan dilediğin gibi artırabilirsin
        display: 'flex',
        alignItems: 'center', // Dikeyde tam ortalar
        background: isDarkMode ? 'rgba(11, 17, 32, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        position: 'sticky',
        top: 0,
        zIndex: 100
    }}>
        <div style={{
            width: '92%',
            maxWidth: '1800px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            {/* SOL: LOGO */}
            <div style={{ 
                borderRight: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`, 
                paddingRight: '24px' 
            }}>
                <h1 style={{ 
                    color: isDarkMode ? '#f8fafc' : '#0f172a', 
                    fontSize: '26px', // Daha yüksek yapıya uygun biraz daha büyük logo
                    fontWeight: '900', 
                    margin: 0, 
                    letterSpacing: '-1px' 
                }}>
                    StoryBeam <span style={{ color: theme.accent }}>✨</span>
                </h1>
            </div>

            {/* SAĞ: AKSİYONLAR */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <button 
                    onClick={toggleTheme}
                    style={{
                        padding: '12px 20px', // Butonları da biraz etli yaptık
                        borderRadius: '10px',
                        border: 'none',
                        background: isDarkMode ? '#334155' : '#f1f5f9',
                        color: isDarkMode ? '#f8fafc' : '#0f172a',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                    {isDarkMode ? '☀️' : '🌙'}
                </button>

                <button 
                    onClick={fetchWeatherData}
                    style={{
                        padding: '12px 20px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#0ea5e9',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                    }}>
                    🔄 Yenile
                </button>
            </div>
        </div>
    </div>

    {/* Ana İçerik */}
    <div style={{ padding: '0px 0' }}> 
        <WeatherCard
            weatherData={weatherData}
            isDarkMode={isDarkMode}
            onEdit={onEdit}
            onDelete={onDelete}
            addContext={addContext}
            selectCategory={selectCategory}

        />
    </div>
</div>
  )
}

export default App



