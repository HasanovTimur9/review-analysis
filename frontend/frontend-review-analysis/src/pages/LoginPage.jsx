import { useState } from "react";
import './LoginPage.css';

export default function LoginPage() {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, address }),
            });

            if (!response.ok) {
                throw new Error("Неверные данные или пользователь не найден");
            }

            const data = await response.json();
            console.log("Auth success", data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
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
                        />
                    </div>
                    {error && <p className="login-error">{error}</p>}
                    <button type="submit" disabled={loading} className="login-button">
                        {loading ? "Проверка..." : "Войти"}
                    </button>
                </form>
            </div>
        </div>
    );
}
