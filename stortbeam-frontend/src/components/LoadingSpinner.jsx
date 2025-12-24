function LoadingSpinner() {
    return(
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            minHeight: '400px'
        }}>
            <div style={{
                fontSize: '64px',
                marginBottom: '24px',
                animation: 'spin 2s linear infinite'
            }}>
                🔄
            </div>
            <p style={{
                fontSize: '22px',
                color: 'white',
                fontWeight: '600',
                margin: 0,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}>
                Backend'den veri çekiliyor
            </p>
            <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '16px'
            }}>
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`
                        }}
                    />
                ))}
            </div>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
            `}</style>
        </div>
    )
}

export default LoadingSpinner