import { useState,useEffect } from "react"   //useState: herhangi bir değeri saklamaya veya değiştirmeye yarar, useEffect: sayfa yüklendiğinde otomatik çalışan koddur
import axios from 'axios'           // Backend ile frontend haberleşmesi için kullanılan kütüphanedir.
import './App.css'
import LoadingSpinner from "./components/LoadingSpinner"
import WeatherCard from "./components/WeatherCard"
import ErrorMessage from "./components/ErrorMessage"

function App(){
  const [weatherData, setWeatherData] = useState([])
  const [loading,setLoading] = useState(true)
  const [error, setError] = useState(null)

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
      const response = await axios.get('http://localhost:5216/WeatherForecast')
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

  if (loading) return <LoadingSpinner/>
  if (error) return <ErrorMessage message={error}/>

  //Ana Sayfa
  return (
      <div className="App" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '0',
      margin: '0'
      }}>
      {/* Başlık Bölümü */}
      <div style={{
          padding: '40px 24px 24px 24px',
          textAlign: 'center'
          }}>
          <h1 style={{
              color: 'white',
              fontSize: '48px',
              fontWeight: '800',
              margin: '0 0 12px 0',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              letterSpacing: '-1px'
              }}>
              StoryBeam Platform
          </h1>
          <h2 style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '24px',
              fontWeight: '500',
              margin: 0,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
              }}>
              Backend-Frontend Integration Test
          </h2>
      </div>

      {/* WeatherCard Component */}
      <WeatherCard
          weatherData={weatherData}
          onRefresh={fetchWeatherData}
      />
  </div>
  )
}


export default App