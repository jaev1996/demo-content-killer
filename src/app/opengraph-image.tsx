import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'PrivaClean - Protección de Contenido Digital'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function OgImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    backgroundImage: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 20,
                    }}
                >
                    <div
                        style={{
                            fontSize: 120,
                            fontWeight: 'bold',
                            color: 'white',
                            textAlign: 'center',
                            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        }}
                    >
                        PrivaClean
                    </div>
                    <div
                        style={{
                            fontSize: 40,
                            color: 'rgba(255,255,255,0.9)',
                            textAlign: 'center',
                            maxWidth: 900,
                            lineHeight: 1.3,
                        }}
                    >
                        Protección de Contenido Digital
                    </div>
                    <div
                        style={{
                            fontSize: 28,
                            color: 'rgba(255,255,255,0.8)',
                            textAlign: 'center',
                            marginTop: 20,
                        }}
                    >
                        Eliminación rápida y efectiva mediante DMCA
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
