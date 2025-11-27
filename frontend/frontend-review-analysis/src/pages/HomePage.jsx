import React, { useState, useEffect } from 'react';
import '../styles/App.css';
import '../styles/HomePage.css';
import img1 from "../images/columnar_diagram.png";
import img2 from "../images/pie_chart.png";

const carouselImages = [img1, img2];

const HomePage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const scrollToLogin = () => {
        // Прокрутка к секции логина
        const loginSection = document.getElementById('login-section');
        if (loginSection) {
            loginSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="page-container">
            <div className="content-box">
                <div className="hero-grid">
                    <div className="hero-content">
                        <h1 className="main-title">
                            АНАЛИЗИРУЙ ТЫСЯЧИ ОТЗЫВОВ ЗА МИНУТЫ
                        </h1>
                        <p className="subtitle">
                            <strong>Узнайте что на самом деле думают ваши клиенты — за 3 минуты и без аналитиков</strong>
                        </p>
                        <button className="try-button" onClick={scrollToLogin}>
                            Попробовать
                            <span className="arrow">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path
                                        d="M2 10H16M16 10L11 5M16 10L11 15"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                        </button>
                    </div>

                    <div className="carousel-container">
                        <div
                            className="carousel-track"
                            style={{
                                transform: `translateX(-${currentIndex * 100}%)`,
                            }}
                        >
                            {carouselImages.map((src, index) => (
                                <div key={index} className="carousel-slide">
                                    <img
                                        src={src}
                                        alt={`Скриншот ${index + 1}`}
                                        className="carousel-image"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="carousel-dots">
                            {carouselImages.map((_, index) => (
                                <span
                                    key={index}
                                    className={`dot ${currentIndex === index ? 'active' : ''}`}
                                    onClick={() => setCurrentIndex(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
