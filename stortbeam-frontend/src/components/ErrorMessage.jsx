function ErrorMessage({message}) {
    return(
        <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            padding: '32px',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            maxWidth: '600px',
            margin: '40px auto',
            border: '3px solid #EF4444',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(90deg, #EF4444, #DC2626, #EF4444)',
                animation: 'shimmer 2s infinite'
            }} />
            
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px'
            }}>
                <span style={{
                    fontSize: '48px',
                    animation: 'shake 0.5s ease-in-out infinite'
                }}>
                    ⚠️
                </span>
                <h3 style={{
                    color: '#DC2626',
                    fontSize: '24px',
                    fontWeight: '700',
                    margin: 0
                }}>
                    Hata Oluştu
                </h3>
            </div>
            
            <p style={{
                color: '#991B1B',
                fontSize: '17px',
                fontWeight: '500',
                margin: 0,
                lineHeight: '1.6',
                backgroundColor: '#FEE2E2',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #FECACA'
            }}>
                {message}
            </p>
            
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-10deg); }
                    75% { transform: rotate(10deg); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </div>
    )
}

export default ErrorMessage