import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import HomePage from "./pages/HomePage.jsx";
import BenefitsPage from "./pages/BenefitsPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import AudiencePage from "./pages/AudiencePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

import './styles/LoginPage.css';
import './styles/App.css';

const Logo = () => (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="25" stroke="#EFEED4" strokeWidth="2" fill="none"/>
        <path d="M20 25L30 35L40 25" stroke="#EFEED4" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 35L30 45L40 35" stroke="#EFEED4" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentPage, setCurrentPage] = useState('home'); // 'home' или 'dashboard'

    // УБРАНО: состояние savedFiles — DashboardPage сам управляет файлами!
    // const [savedFiles, setSavedFiles] = useState([]);

    // Проверяем авторизацию при загрузке
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setIsAuthenticated(true);
        }
        // Убрано: загрузка файлов отсюда — DashboardPage сам восстановит из localStorage
    }, []);

    const handleLogin = () => {
        localStorage.setItem('user', 'authenticated');
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
    };

    const handleGoToDashboard = () => {
        setCurrentPage('dashboard');
    };

    const handleGoHome = () => {
        setCurrentPage('home');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentPage('home');
        localStorage.removeItem('user');
        // Файлы остаются в localStorage — пользователь может вернуться
    };

    return (
        <>
            {isAuthenticated && currentPage === 'dashboard' ? (
                <DashboardPage
                    onGoHome={handleGoHome}
                    onLogout={handleLogout}
                    // Убраны: savedFiles и onFilesUpdate
                    // DashboardPage теперь полностью автономен
                />
            ) : (
                <>
                    <HomePage />
                    <BenefitsPage />
                    <ReportsPage />
                    <AudiencePage />

                    {/* Кнопка возврата в дашборд для авторизованных пользователей */}
                    {isAuthenticated && (
                        <div className="return-to-dashboard">
                            <button
                                onClick={handleGoToDashboard}
                                className="return-button"
                            >
                                Вернуться к анализу
                            </button>
                        </div>
                    )}

                    <div id="login-section">
                        <LoginPage onLogin={handleLogin} />
                    </div>

                    <footer className="app-footer">
                        <div className="footer-logo">
                            <Logo />
                        </div>
                        <div className="footer-copyright">
                            © 2025 ReviewAnalyzer
                        </div>
                    </footer>
                </>
            )}
        </>
    );
}
