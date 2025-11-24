import React from 'react';
import '../styles/App.css';
import '../styles/LoginPage.css';

export default function FontShowcase() {
    const cyrillicText = "ФРОНТЕНД ревью анал 0123456789";

    return (
        <div style={{ padding: '40px', background: '#edecd2', color: '#4f453c', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '3rem' }}>
                Ебаные шрифты
            </h1>

            {/* Panama обычный */}
            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontFamily: 'Panama', fontWeight: 700, fontSize: '2rem', color: '#9fb8f0' }}>
                    Panama (пропорциональный)
                </h2>
                <p style={{ fontFamily: 'Panama', fontWeight: 400, fontSize: '1.4rem' }}>
                    {cyrillicText}
                </p>
                <p style={{ fontFamily: 'Panama', fontWeight: 700, fontSize: '1.4rem' }}>
                    Bold → {cyrillicText}
                </p>
                <p style={{ fontFamily: 'Panama', fontStyle: 'italic', fontSize: '1.4rem' }}>
                    Italic → {cyrillicText}
                </p>
            </section>

            {/* Panama Monospace */}
            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontFamily: 'Panama Monospace', fontWeight: 700, fontSize: '2rem', color: '#3d558e' }}>
                    Panama Monospace (моноширинный)
                </h2>
                <pre style={{ fontFamily: 'Panama Monospace', fontSize: '1.3rem', background: '#e8f1b1', padding: '1rem', borderRadius: '8px' }}>
                    Regular → {cyrillicText}
                    {"\n"}Bold    → <strong style={{ fontWeight: 700 }}>{cyrillicText}</strong>
                    {"\n"}Italic  → <em style={{ fontStyle: 'italic' }}>{cyrillicText}</em>
                </pre>
            </section>

            {/* CoventryC */}
            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontFamily: 'CoventryC', fontSize: '4rem', color: '#a5b6c9', textAlign: 'center' }}>
                    Я хуй знает симпатично или нет
                </h2>
                <p style={{ fontFamily: 'CoventryC', fontSize: '3rem', textAlign: 'center' }}>
                    На скрине так вау было, а тут в тестах как-то не очень будто
                </p>
            </section>
        </div>
    );
}
