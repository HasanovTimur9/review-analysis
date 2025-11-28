import React, { useState, useEffect } from 'react';
import '../styles/ResultsPage.css';

// ========== Иконки ==========
const Logo = () => (
    <svg
        width="40"
        height="40"
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="2"
        clipRule="evenodd"
        viewBox="0 0 32 32"
    >
        <path
            fill="#50463C"
            d="M14,5c-2.208,0 -4,1.792 -4,4c0,2.208 1.792,4 4,4c2.208,0 4,-1.792 4,-4c0,-2.208 -1.792,-4 -4,-4Zm0,2c1.104,0 2,0.896 2,2c0,1.104 -0.896,2 -2,2c-1.104,0 -2,-0.896 -2,-2c0,-1.104 0.896,-2 2,-2Z"
        />
        <path
            fill="#50463C"
            d="M22.456,23.871l6.837,6.836c0.39,0.39 1.024,0.39 1.414,0c0.39,-0.39 0.39,-1.024 0,-1.414l-6.836,-6.837c1.95,-2.273 3.129,-5.228 3.129,-8.456c-0,-7.175 -5.825,-13 -13,-13c-7.175,0 -13,5.825 -13,13c-0,7.175 5.825,13 13,13c3.228,0 6.183,-1.179 8.456,-3.129Zm-0.47,-2.31c-0.088,-1.172 -0.593,-2.279 -1.431,-3.116c-0.924,-0.925 -2.179,-1.445 -3.487,-1.445c-1.971,0 -4.165,0 -6.136,-0c-2.599,-0 -4.729,2.01 -4.918,4.561c2.005,2.117 4.842,3.439 7.986,3.439c3.144,0 5.981,-1.322 7.986,-3.439Zm1.56,-2.095c0.925,-1.611 1.454,-3.477 1.454,-5.466c-0,-6.071 -4.929,-11 -11,-11c-6.071,0 -11,4.929 -11,11c-0,1.988 0.528,3.853 1.452,5.463c0.995,-2.609 3.521,-4.463 6.48,-4.463c1.971,0 4.165,0 6.136,0c1.838,-0 3.602,0.73 4.902,2.03c0.698,0.698 1.232,1.53 1.576,2.436Z"
        />
    </svg>
);

const LogoutIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#50463C" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 17L21 12L16 7" stroke="#50463C" strokeWidth="2" strokeLinecap="round"/>
        <path d="M21 12H9" stroke="#50463C" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

// ========== Основной компонент ==========
const ResultsPage = ({ onLogout }) => {
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Имитация получения данных с бэкенда
    useEffect(() => {
        const fetchAnalysisData = async () => {
            try {
                // Имитация задержки сети
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Моковые данные
                const mockData = {
                    statistics: {
                        positive: 156,
                        neutral: 89,
                        negative: 45
                    },
                    positiveKeywords: [
                        { word: "отличный", count: 42 },
                        { word: "быстрый", count: 38 },
                        { word: "качественный", count: 35 },
                        { word: "удобный", count: 28 },
                        { word: "рекомендую", count: 25 },
                        { word: "прекрасный", count: 22 },
                        { word: "профессиональный", count: 18 }
                    ],
                    neutralKeywords: [
                        { word: "нормальный", count: 32 },
                        { word: "обычный", count: 28 },
                        { word: "стандартный", count: 25 },
                        { word: "приемлемый", count: 22 },
                        { word: "удовлетворительный", count: 19 },
                        { word: "средний", count: 16 }
                    ],
                    negativeKeywords: [
                        { word: "плохой", count: 28 },
                        { word: "медленный", count: 25 },
                        { word: "неудобный", count: 22 },
                        { word: "разочарован", count: 18 },
                        { word: "проблема", count: 15 },
                        { word: "ужасный", count: 12 }
                    ]
                };

                setAnalysisData(mockData);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysisData();
    }, []);

    if (loading) {
        return (
            <div className="results-page">
                <header className="results-header">
                    <div className="header-logo"><Logo /></div>
                    <button className="logout-button" onClick={onLogout} title="Выйти">
                        <LogoutIcon />
                    </button>
                </header>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Загружаем результаты анализа...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="results-page">
            <header className="results-header">
                <div className="header-logo"><Logo /></div>
                <button className="logout-button" onClick={onLogout} title="Выйти">
                    <LogoutIcon />
                </button>
            </header>

            <main className="results-container">
                <h1 className="results-title">Результаты анализа</h1>

                {/* Статистика и график */}
                <section className="stats-section">
                    <div className="stats-grid">
                        <div className="stats-column">
                            <h2 className="stats-title">Статистика отзывов</h2>
                            <div className="stats-cards">
                                <div className="stat-card stat-positive">
                                    <span className="stat-label">Положительных отзывов:</span>
                                    <span className="stat-value">{analysisData.statistics.positive}</span>
                                </div>
                                <div className="stat-card stat-neutral">
                                    <span className="stat-label">Нейтральных отзывов:</span>
                                    <span className="stat-value">{analysisData.statistics.neutral}</span>
                                </div>
                                <div className="stat-card stat-negative">
                                    <span className="stat-label">Негативных отзывов:</span>
                                    <span className="stat-value">{analysisData.statistics.negative}</span>
                                </div>
                            </div>
                        </div>

                        <div className="chart-column">
                            <h2 className="stats-title">Распределение отзывов</h2>
                            <div className="chart-placeholder">
                                <p>График будет отображен здесь</p>
                                <div className="chart-mock">
                                    <div className="chart-bar positive" style={{height: '70%'}}></div>
                                    <div className="chart-bar neutral" style={{height: '40%'}}></div>
                                    <div className="chart-bar negative" style={{height: '20%'}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Положительные ключевые слова */}
                <section className="keywords-section">
                    <h2 className="keywords-title">Ключевые слова положительных отзывов</h2>
                    <div className="keywords-container keywords-positive">
                        <ol className="keywords-list">
                            {analysisData.positiveKeywords.map((item, index) => (
                                <li key={index} className="keyword-item">
                                    <span className="keyword-word">{item.word}</span>
                                    <span className="keyword-count">- {item.count} раз</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <div className="chart-full-width">
                        <div className="chart-placeholder">
                            <p>График частоты положительных ключевых слов</p>
                            <div className="chart-mock-horizontal">
                                {analysisData.positiveKeywords.slice(0, 5).map((item, index) => (
                                    <div key={index} className="chart-bar-horizontal positive"
                                         style={{width: `${(item.count / 42) * 80}%`}}>
                                        <span>{item.word} ({item.count})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Нейтральные ключевые слова */}
                <section className="keywords-section">
                    <h2 className="keywords-title">Ключевые слова нейтральных отзывов</h2>
                    <div className="keywords-container keywords-neutral">
                        <ol className="keywords-list">
                            {analysisData.neutralKeywords.map((item, index) => (
                                <li key={index} className="keyword-item">
                                    <span className="keyword-word">{item.word}</span>
                                    <span className="keyword-count">- {item.count} раз</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <div className="chart-full-width">
                        <div className="chart-placeholder">
                            <p>График частоты нейтральных ключевых слов</p>
                            <div className="chart-mock-horizontal">
                                {analysisData.neutralKeywords.slice(0, 5).map((item, index) => (
                                    <div key={index} className="chart-bar-horizontal neutral"
                                         style={{width: `${(item.count / 32) * 80}%`}}>
                                        <span>{item.word} ({item.count})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Негативные ключевые слова */}
                <section className="keywords-section">
                    <h2 className="keywords-title">Ключевые слова негативных отзывов</h2>
                    <div className="keywords-container keywords-negative">
                        <ol className="keywords-list">
                            {analysisData.negativeKeywords.map((item, index) => (
                                <li key={index} className="keyword-item">
                                    <span className="keyword-word">{item.word}</span>
                                    <span className="keyword-count">- {item.count} раз</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <div className="chart-full-width">
                        <div className="chart-placeholder">
                            <p>График частоты негативных ключевых слов</p>
                            <div className="chart-mock-horizontal">
                                {analysisData.negativeKeywords.slice(0, 5).map((item, index) => (
                                    <div key={index} className="chart-bar-horizontal negative"
                                         style={{width: `${(item.count / 28) * 80}%`}}>
                                        <span>{item.word} ({item.count})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="results-footer">
                <div className="footer-copyright">© 2024 Review Analysis</div>
            </footer>
        </div>
    );
};

export default ResultsPage;
