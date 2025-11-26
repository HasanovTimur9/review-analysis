import React from 'react';
import LoginPage from './pages/LoginPage';
import './styles/LoginPage.css';
import HomePage from "./pages/HomePage.jsx";
import BenefitsPage from "./pages/BenefitsPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import AudiencePage from "./pages/AudiencePage.jsx";

const Logo = () => (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="25" stroke="#EFEED4" strokeWidth="2" fill="none"/>
        <path d="M20 25L30 35L40 25" stroke="#EFEED4" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 35L30 45L40 35" stroke="#EFEED4" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

export default function App() {
    return (
        <>
            <HomePage />
            <BenefitsPage />
            <ReportsPage />
            <AudiencePage />

            <div id="login-section">
                <LoginPage />
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
    );
}
