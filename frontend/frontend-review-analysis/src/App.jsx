import React from 'react';
import LoginPage from './pages/LoginPage';
import FontShowcase from './pages/FontShowcase';
import './styles/LoginPage.css';
import HomePage from "./pages/HomePage.jsx";

export default function App() {
    return (
        <>
            <HomePage />

            <LoginPage />

            <FontShowcase />

            <section style={{ padding: '100px 40px', background: '#e9e8ce', color: '#4f453c' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 style={{ fontFamily: 'CoventryC', fontSize: '5rem', textAlign: 'center', color: '#253855' }}>
                        Это может быть твой манифест
                    </h2>
                    <p style={{ fontFamily: 'Panama', fontSize: '1.8rem', lineHeight: '2', marginTop: '4rem' }}>
                        Здесь ты рассказываешь, почему выбрал именно эти шрифты.<br />
                        Почему Panama Monospace — это будущее интерфейсов.<br />
                        Почему CoventryC на большом экране выглядит как подпись дьявола.<br />
                        И почему ты не используешь Inter, как все.
                    </p>
                </div>
            </section>

            <section style={{ padding: '120px 40px', background: '#EFEED4' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <pre style={{
              fontFamily: 'Panama Monospace',
              fontSize: '1.4rem',
              background: '#EFEED4',
              padding: '3rem',
              borderRadius: '16px',
              border: '1px solid #333',
              whiteSpace: 'pre-wrap'
          }}>
{`ФРОНТЕНД РЕВЬЮ АНАЛИЗ
2025–2026 сезон

Panama Regular      → основной текст
Panama Bold         → акценты
Panama Monospace    → код, терминал, интерфейсы
CoventryC           → заголовки, подписи, эмоция

Мы не делаем "красиво".
Мы делаем "чтобы запомнилось навсегда".`}
          </pre>
                </div>
            </section>
            <footer style={{
                padding: '100px 40px',
                textAlign: 'center',
                background: '#EFEED4',
                fontFamily: 'CoventryC',
                fontSize: '3rem',
                color: '#50463C'
            }}>
                Made with hate to default fonts
            </footer>
        </>
    );
}
