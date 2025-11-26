import React, { useState } from 'react';
import '../styles/ReportsPage.css';

const ReportsPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            title: "Почему ставят 1-2 звезды",
            description: "",
            image: "/images/report-1.png",
            bgColor: "green",
            type: "title-image"
        },
        {
            id: 2,
            title: "",
            description: "Какая тема встречается в большинстве негативных отзывов",
            image: "/images/report-2.png",
            bgColor: "beige",
            type: "image-description"
        },
        {
            id: 3,
            title: "Какие слова клиенты пишут чаще всего",
            description: "",
            image: "/images/report-3.png",
            bgColor: "blue-main",
            type: "title-image"
        },
        {
            id: 4,
            title: "",
            description: "Сколько жалоб на доставку, а сколько на качество товара",
            image: "/images/report-4.png",
            bgColor: "blue-deep",
            type: "image-description"
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const current = slides[currentSlide];

    return (
        <div className="reports-page">
            <div className="container">
                <h2 className="section-report-title">Что именно вы увидите в отчете?</h2>
                <p className="section-subtitle">Одна загрузка - и вы точно знаете:</p>

                <div className="reports-carousel">
                    <div className={`report-box report-box--${current.bgColor}`}>
                        {current.type === "title-image" && (
                            <div className="report-content title-image">
                                <h3 className="report-title">{current.title}</h3>
                                <div className="report-image-container">
                                    <img
                                        src={current.image}
                                        alt={current.title}
                                        className="report-image"
                                    />
                                </div>
                            </div>
                        )}

                        {current.type === "image-description" && (
                            <div className="report-content image-description">
                                <div className="report-image-center">
                                    <img
                                        src={current.image}
                                        alt={current.description}
                                        className="report-image"
                                    />
                                </div>
                                <p className="report-description">{current.description}</p>
                            </div>
                        )}
                    </div>

                    <div className="carousel-controls">
                        <button className="carousel-arrow carousel-arrow--left" onClick={prevSlide}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button className="carousel-arrow carousel-arrow--right" onClick={nextSlide}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
