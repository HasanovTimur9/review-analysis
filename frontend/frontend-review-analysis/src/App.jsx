import React from 'react';
import LoginPage from './pages/LoginPage';
import './styles/LoginPage.css';
import HomePage from "./pages/HomePage.jsx";
import BenefitsPage from "./pages/BenefitsPage.jsx";

export default function App() {
    return (
        <>
            <HomePage />

            <BenefitsPage />

            <LoginPage />

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
