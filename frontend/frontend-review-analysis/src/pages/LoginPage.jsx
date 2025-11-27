import { useState } from "react";
import '../styles/App.css';
import '../styles/LoginPage.css';

export default function LoginPage({ onLogin }) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !address.trim()) {
            setError("Заполните все поля");
            return;
        }

        setError("");
        setLoading(true);

        // Имитация сетевой задержки
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
        </div>
    );
}
