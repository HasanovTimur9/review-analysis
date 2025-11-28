import { useState, useEffect, useRef } from "react";
import '../styles/App.css';
import '../styles/LoginPage.css';

export default function LoginPage({ onLogin }) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOnBrownBg, setIsOnBrownBg] = useState(false);
    const buttonRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !address.trim()) {
            setError("Заполните все поля");
            return;
        }

        setError("");
        setLoading(true);

        await new Promise(resolve => setTimeout(resolve, 800));

        console.log("Auth success (mocked)", { name, address });

        localStorage.setItem('user', JSON.stringify({
            name: name.trim(),
            address: address.trim(),
            timestamp: Date.now()
        }));

        onLogin?.();
        setLoading(false);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Простая проверка для футера
    const checkFooterOverlap = () => {
        if (!buttonRef.current) return;

        const buttonRect = buttonRef.current.getBoundingClientRect();
        const footer = document.querySelector('footer, .footer, .footer-section');

        if (!footer) return;

        const footerRect = footer.getBoundingClientRect();

        // Проверяем, перекрывается ли кнопка футером
        const isOverlapping = !(buttonRect.bottom < footerRect.top ||
            buttonRect.top > footerRect.bottom ||
            buttonRect.right < footerRect.left ||
            buttonRect.left > footerRect.right);

        setIsOnBrownBg(isOverlapping);
    };

    useEffect(() => {
        checkFooterOverlap();

        const handleScroll = () => {
            checkFooterOverlap();
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', checkFooterOverlap);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', checkFooterOverlap);
        };
    }, []);

    return (
        <div className="login-container">
            <div className="login-content">
                <h1 className="login-container-title">Готовы узнать, что на самом деле беспокоит ваших клиентов?</h1>
                <div className="login-box">
                    <h1 className="login-title">Авторизация</h1>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div>
                            <label className="login-label">Название</label>
                            <input
                                type="text"
                                className="login-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="login-label">Адрес</label>
                            <input
                                type="text"
                                className="login-input"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        {error && <p className="login-error">{error}</p>}
                        <button type="submit" disabled={loading} className="login-button">
                            {loading ? "Вход..." : "Войти"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Кнопка прокрутки наверх */}
            <button
                ref={buttonRef}
                className={`scroll-to-top-btn ${isOnBrownBg ? 'on-brown-bg' : ''}`}
                onClick={scrollToTop}
                aria-label="Прокрутить наверх"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 20L12 4M12 4L5 11M12 4L19 11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </div>
    );
}
