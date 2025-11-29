import React, { useState } from 'react';
import '../styles/ReportsPage.css';
import img1 from "../images/topics_negative.webp";
import img2 from "../images/topics_neutral.webp";
import img3 from "../images/topics_bar.webp";
import img4 from "../images/topics_positive.webp";

const ReportsPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            title: "Какие у Вас сильные стороны",
            description: "",
            image: img4,
            bgColor: "green",
            type: "title-image"
        },
        {
            id: 2,
            title: "",
            description: "Самая частая тема нейтральных отзывов",
            image: img2,
            bgColor: "beige",
            type: "image-description"
        },
        {
            id: 3,
            title: "Какие слова клиенты пишут чаще всего",
            description: "",
            image: img3,
            bgColor: "blue-main",
            type: "title-image"
        },
        {
            id: 4,
            title: "",
            description: "Почему ставят 1-2 звезды",
            image: img1,
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
