// components/WeatherCard.jsx

/**
 * Props Açıklaması:
 * weatherData: Backend'den gelen hava durumu dizisi
 * onRefresh: Butona tıklandığında çalışacak fonksiyon
 * 
 * Props'ları parent component (App.jsx) gönderir
 */

function WeatherCard({ weatherData, onRefresh }) {
  console.log('WeatherCard içinde weatherData:', weatherData)
  console.log('weatherData.length:', weatherData.length)
  
  // Hava durumu ikonları
  const getWeatherIcon = (summary) => {
    const icons = {
      'Freezing': '❄️',
      'Bracing': '🌬️',
      'Chilly': '🌤️',
      'Cool': '⛅',
      'Mild': '🌥️',
      'Warm': '☀️',
      'Balmy': '🌞',
      'Hot': '🔥',
      'Sweltering': '🌡️',
      'Scorching': '🔥'
    }
    return icons[summary] || '🌈'
  }

  // Sıcaklık rengi
  const getTempColor = (temp) => {
    if (temp < 0) return '#2DD4BF'
    if (temp < 10) return '#3B82F6'
    if (temp < 20) return '#F59E0B'
    if (temp < 30) return '#F97316'
    return '#EF4444'
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '24px',
      margin: '0',
      boxSizing: 'border-box'
    }}>
      {/* Başlık ve Yenile Butonu */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <h2 style={{
          color: 'white',
          fontSize: '36px',
          fontWeight: '700',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '40px' }}>🌤️</span>
          Hava Durumu Tahmini
        </h2>
        
        <button 
          onClick={onRefresh}
          style={{
            padding: '14px 28px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '17px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)'
            e.target.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)'
            e.target.style.transform = 'scale(1)'
          }}
        >
          <span style={{ fontSize: '18px' }}>🔄</span>
          Yenile
        </button>
      </div>

      {/* Hava Durumu Kartları */}
      {weatherData.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          width: '100%'
        }}>
          {weatherData.map((item, index) => (
            <div 
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.98)',
                padding: '28px',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '360px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 16px 50px rgba(0, 0, 0, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.2)'
              }}
            >
              {/* Tarih */}
              <div style={{
                fontSize: '15px',
                color: '#666',
                fontWeight: '600',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingBottom: '14px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                <span style={{ fontSize: '18px' }}>📅</span>
                <span>{new Date(item.date).toLocaleDateString('tr-TR', { 
                  weekday: 'long', 
                  day: 'numeric',
                  month: 'long'
                })}</span>
              </div>

              {/* Sıcaklık ve İkon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '28px 0',
                gap: '16px'
              }}>
                <span style={{ 
                  fontSize: '90px',
                  lineHeight: '1'
                }}>
                  {getWeatherIcon(item.summary)}
                </span>
                <div style={{
                  fontSize: '68px',
                  fontWeight: '800',
                  color: getTempColor(item.temperatureC),
                  lineHeight: '1',
                  display: 'flex',
                  alignItems: 'flex-start'
                }}>
                  {item.temperatureC}
                  <span style={{ fontSize: '38px', marginTop: '4px' }}>°C</span>
                </div>
              </div>

              {/* Durum */}
              <div style={{
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937',
                padding: '18px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                borderRadius: '14px',
                marginTop: '18px'
              }}>
                {item.summary}
              </div>

              {/* Fahrenheit */}
              <div style={{
                textAlign: 'center',
                fontSize: '15px',
                color: '#9ca3af',
                marginTop: '14px',
                fontWeight: '600'
              }}>
                {item.temperatureF}°F
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          padding: '80px 40px',
          borderRadius: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '90px', marginBottom: '20px' }}>🌈</div>
          <p style={{ 
            color: '#666', 
            fontSize: '26px',
            margin: 0,
            fontWeight: '600'
          }}>
            Henüz hava durumu verisi yok
          </p>
          <p style={{ 
            color: '#999', 
            fontSize: '17px',
            marginTop: '14px'
          }}>
            Verileri görüntülemek için "Yenile" butonuna tıklayın
          </p>
        </div>
      )}
    </div>
  )
}

export default WeatherCard