import React, { useState } from 'react';
import '../styles/AudiencePage.css';

const AudiencePage = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const accordionItems = [
        {
            id: 1,
            title: "Малый и средний бизнес",
            description: "Кофейни, магазины, салоны. Система показывает основные причины недовольства: сервис, качество, цены или скорость обслуживания.",
            image: "/images/business-1.png",
            color: "blue-deep"
        },
        {
            id: 2,
            title: "Интернет магазины и маркетплейсы",
            description: "Автоматический анализ жалоб на доставку, упаковку, навигацию и качество товаров.",
            image: "/images/business-2.png",
            color: "blue-main"
        },
        {
            id: 3,
            title: "Рестораны, кафе и службы доставки",
            description: "Выявление проблем с доставкой, температурой блюд, ошибками в заказах и работой персонала.",
            image: "/images/business-3.png",
            color: "blue-deep"
        },
        {
            id: 4,
            title: "Сервисные компании",
            description: "СТО, клининг, ремонт. Быстрый обзор повторяющихся жалоб и точек, требующих внимания.",
            image: "/images/business-4.png",
            color: "blue-main"
        },
        {
            id: 5,
            title: "Руководители",
            description: "Чёткая картина того, что именно пишут клиенты: ключевые темы, слова и причины низких оценок.",
            image: "/images/business-5.png",
            color: "blue-deep"
        },
        {
            id: 6,
            title: "Филиалы и сети компаний",
            description: "Мониторинг отзывов по всем точкам сети, выявление проблемных локаций и общих тенденций для всей компании.",
            image: "/images/business-6.png",
            color: "blue-main"
        }
    ];

    return (
        <div className="audience-page">
            <div className="container">
                <h2 className="section-title">Кому может помочь наша система?</h2>
                <p className="section-subtitle">
                    Наша платформа подходит бизнесам, которые получают много отзывов и хотят быстро понимать своих клиентов.
                </p>

                <div className="horizontal-accordion">
                    {accordionItems.map((item, index) => (
                        <div
                            key={item.id}
                            className={`accordion-item ${activeIndex === index ? 'active' : ''} accordion-item--${item.color}`}
                            onClick={() => setActiveIndex(index)}
                        >
                            <div className="accordion-content">
                                <h3 className="accordion-title">{item.title}</h3>

                                <div className={`accordion-expanded ${activeIndex === index ? 'active' : ''}`}>
                                    <div className="accordion-image-container">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="accordion-image"
                                        />
                                    </div>
                                    <p className="accordion-description">{item.description}</p>
                                </div>
                            </div>

                            {/* Номер блока в кружочке */}
                            <div className="accordion-number">
                                {item.id}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AudiencePage;
