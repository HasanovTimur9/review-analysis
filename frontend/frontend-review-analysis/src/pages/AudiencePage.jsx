import React, { useState } from 'react';
import '../styles/AudiencePage.css';
import img1 from "../images/small_business.jpg";
import img2 from "../images/marketplace.jpg";
import img3 from "../images/restaurant.jpg";
import img4 from "../images/service.jpg";
import img5 from "../images/director.jpg";
import img6 from "../images/branches.jpg";


const AudiencePage = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const accordionItems = [
        {
            id: 1,
            title: "Малый и средний бизнес",
            description: "Кофейни, магазины, салоны. Система показывает основные причины недовольства: сервис, качество, цены или скорость обслуживания.",
            image: img1,
            color: "blue-deep"
        },
        {
            id: 2,
            title: "Интернет магазины и маркетплейсы",
            description: "Автоматический анализ жалоб на доставку, упаковку, навигацию и качество товаров.",
            image: img2,
            color: "blue-main"
        },
        {
            id: 3,
            title: "Рестораны, кафе и службы доставки",
            description: "Выявление проблем с доставкой, температурой блюд, ошибками в заказах и работой персонала.",
            image: img3,
            color: "blue-deep"
        },
        {
            id: 4,
            title: "Сервисные компании",
            description: "СТО, клининг, ремонт. Быстрый обзор повторяющихся жалоб и точек, требующих внимания.",
            image: img4,
            color: "blue-main"
        },
        {
            id: 5,
            title: "Руководители",
            description: "Чёткая картина того, что именно пишут клиенты: ключевые темы, слова и причины низких оценок.",
            image: img5,
            color: "blue-deep"
        },
        {
            id: 6,
            title: "Филиалы и сети компаний",
            description: "Мониторинг отзывов по всем точкам сети, выявление проблемных локаций и общих тенденций для всей компании.",
            image: img6,
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
