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
    <svg
        fillRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="2"
        clipRule="evenodd"
        viewBox="0 0 32 32"
    >
        <path
            fill="#EFEED4"
            d="M14,5c-2.208,0 -4,1.792 -4,4c0,2.208 1.792,4 4,4c2.208,0 4,-1.792 4,-4c0,-2.208 -1.792,-4 -4,-4Zm0,2c1.104,0 2,0.896 2,2c0,1.104 -0.896,2 -2,2c-1.104,0 -2,-0.896 -2,-2c0,-1.104 0.896,-2 2,-2Z"
        />
        <path
            fill="#EFEED4"
            d="M22.456,23.871l6.837,6.836c0.39,0.39 1.024,0.39 1.414,0c0.39,-0.39 0.39,-1.024 0,-1.414l-6.836,-6.837c1.95,-2.273 3.129,-5.228 3.129,-8.456c-0,-7.175 -5.825,-13 -13,-13c-7.175,0 -13,5.825 -13,13c-0,7.175 5.825,13 13,13c3.228,0 6.183,-1.179 8.456,-3.129Zm-0.47,-2.31c-0.088,-1.172 -0.593,-2.279 -1.431,-3.116c-0.924,-0.925 -2.179,-1.445 -3.487,-1.445c-1.971,0 -4.165,0 -6.136,-0c-2.599,-0 -4.729,2.01 -4.918,4.561c2.005,2.117 4.842,3.439 7.986,3.439c3.144,0 5.981,-1.322 7.986,-3.439Zm1.56,-2.095c0.925,-1.611 1.454,-3.477 1.454,-5.466c-0,-6.071 -4.929,-11 -11,-11c-6.071,0 -11,4.929 -11,11c-0,1.988 0.528,3.853 1.452,5.463c0.995,-2.609 3.521,-4.463 6.48,-4.463c1.971,0 4.165,0 6.136,0c1.838,-0 3.602,0.73 4.902,2.03c0.698,0.698 1.232,1.53 1.576,2.436Z"
        />
    </svg>
);

export default function App() {
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        let parsed = null;
        try {
            parsed = stored && JSON.parse(stored);
        } catch {}
        if (parsed && parsed.user_id) {
            setUserId(parsed.user_id);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = (user_id) => {
        setUserId(user_id);
    };
    
    const handleLogout = () => {
        setUserId(null);
        localStorage.removeItem('user');
    };

    // Пока идёт проверка localStorage — ничего не рендерим
    if (isLoading) {
        return null;
    }

    if (userId) {
        return <DashboardPage onLogout={handleLogout} userId={userId} />;
    }

    return (
        <>
            <HomePage />
            <BenefitsPage />
            <ReportsPage />
            <AudiencePage />
            <div id="login-section">
                <LoginPage onLogin={handleLogin} />
            </div>
            <footer className="app-footer">
                <div className="footer-logo"><Logo /></div>
                <div className="footer-copyright">
                    © 2025 ReviewAnalyzer
                </div>
            </footer>
        </>
    );
}
