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
                background: '#50463C',
                fontFamily: 'CoventryC',
                fontSize: '3rem',
                color: '#EFEED4'
            }}>
                Made with hate to default fonts
            </footer>
        </>
    );
}
