import React from 'react';
import '../styles/BenefitsPage.css';

// SVG иконки
const AuthIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9.414 15.415L6.71 18.142C6.321 18.534 5.688 18.537 5.296 18.148C4.903 17.759 4.901 17.126
        5.29 16.734L7.008 15.001H1C0.447 15 0 14.552 0 14S0.447 13 1 13H7.005L5.29 11.267C4.901 10.875 4.903
        10.242 5.296 9.853C5.688 9.464 6.321 9.462 6.71 9.854L9.417 12.584C9.792 12.958 10 13.46 10 13.995S9.792
        15.032 9.414 15.415ZM24 5.621V21C24 22.654 22.654 24 21 24H11C9.346 24 8 22.654 8 21V20C8 19.448 8.447
        19 9 19S10 19.448 10 20V21C10 21.551 10.448 22 11 22H12V4.001C10.897 4 10 4.897 10 6V8C10 8.552 9.553 9 9
        9S8 8.552 8 8V6C8 3.794 9.794 2 12 2H12.561C12.798 1.593 13.089 1.215 13.464 0.908C14.395 0.146 15.602
        -0.16 16.784 0.079L19.98 0.719C22.309 1.184 24 3.246 24 5.621ZM18 12.5C18 11.672 17.328 11 16.5 11S15 11.672
        15 12.5 15.672 14 16.5 14 18 13.328 18 12.5Z"
              fill="#50463C"/>
    </svg>
);

const UploadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15.5 6a1.5 1.5 0 0 1 0 3h-7a1.5 1.5 0 0 1 0-3h7zm8.061 17.561a1.5 1.5 0 0 1-2.122 0l-2.011-2.012a4.444 4.444
        0 0 1-1.928.451 4.5 4.5 0 1 1 4.5-4.5 4.444 4.444 0 0 1-.451 1.928l2.012 2.011a1.5 1.5 0 0 1 0 2.122zm-6.061-4.561a1.5
        1.5 0 1 0-1.5-1.5 1.5 1.5 0 0 0 1.5 1.5zm-6 2h-4a2.5 2.5 0 0 1-2.5-2.5v-13a2.5 2.5 0 0 1 2.5-2.5h11a.5.5 0 0 1 .5.5v7a1.5
        1.5 0 0 0 3 0v-7a3.5 3.5 0 0 0-3.5-3.5h-11a5.506 5.506 0 0 0-5.5 5.5v13a5.506 5.506 0 0 0 5.5 5.5h4a1.5 1.5 0 0 0 0-3z"
              fill="#50463C"/>
    </svg>
);

const ResultIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="m21.414 5h-4.414v-4.414zm.586 2v17h-20v-21a3 3 0 0 1 3-3h10v7zm-15 9h7v-2h-7zm10 2h-10v2h10zm0-8h-10v2h10z"
              fill="#EAF3B2"/>
    </svg>
);

const BenefitsPage = () => {
    const benefits = [
        {
            number: 1,
            title: "Минус 90% времени на чтение отзывов",
            description: "Наша AI-система читает и структурирует все отзывы вместо вас. Больше не нужно тратить часы вручную."
        },
        {
            number: 2,
            title: "Причина негатива в один клик",
            description: "Мгновенно узнайте, почему клиенты ставят низкие оценки. Система сама выделяет коренные проблемы."
        },
        {
            number: 3,
            title: "Список «горящих» тем для исправления",
            description: "Получайте автоматически сгенерированный список тем, которые нужно исправить прямо сейчас, чтобы остановить отток клиентов."
        }
    ];

    const steps = [
        {
            title: "Авторизация",
            description: "Войдите в систему, чтобы получить доступ к личному кабинету и сохранённым отчетам.",
            icon: <AuthIcon />, // временная иконка
            color: "beige"
        },
        {
            title: "Загрузка анализа",
            description: "Загрузите файл с отзывами и запустите анализ. Система обработает данные за считанные минуты.",
            icon: <UploadIcon />, // временная иконка
            color: "green"
        },
        {
            title: "Готовый результат",
            description: "Отчёт с диаграммами, ключевыми темами и основными проблемами, которые упоминают клиенты.",
            icon: <ResultIcon />,
            color: "blue-deep"
        }
    ];

    return (
        <div className="benefits-page">
            {/* Секция преимуществ */}
            <section className="benefits-section">
                <div className="container">
                    <h2 className="section-title">Ключевые преимущества</h2>

                    <div className="benefits-circles">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="circle-container">
                                <div className="circle">
                                    {benefit.number}
                                </div>
                                <div className="benefit-content">
                                    <h3 className="benefit-title">{benefit.title}</h3>
                                    <p className="benefit-description">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Секция "Как это работает" */}
            <section className="how-it-works-section">
                <div className="container">
                    <h2 className="section-title">Как это работает</h2>

                    <div className="steps-grid">
                        {steps.map((step, index) => (
                            <div key={index} className={`step-card step-card--${step.color}`}>
                                <div className="step-icon">
                                    {step.icon}
                                </div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BenefitsPage;
