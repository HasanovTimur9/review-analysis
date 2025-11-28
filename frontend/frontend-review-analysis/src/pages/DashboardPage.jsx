import React, { useState, useRef, useEffect } from 'react';
import ResultsPage from './ResultsPage'; // Импортируем страницу результатов
import '../styles/DashboardPage.css';

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

const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M5 12H19" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    </svg>
);

const DeleteIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

// ========== Основной компонент ==========
const DashboardPage = ({ onLogout }) => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef(null);
    const dragCounter = useRef(0);

    // Глобальный drag-and-drop по всему окну
    useEffect(() => {
        const enter = (e) => {
            e.preventDefault();
            dragCounter.current++;
            if (e.dataTransfer?.items?.length > 0) setIsDragging(true);
        };
        const leave = (e) => {
            e.preventDefault();
            dragCounter.current--;
            if (dragCounter.current === 0) setIsDragging(false);
        };
        const over = (e) => e.preventDefault();
        const drop = (e) => {
            e.preventDefault();
            setIsDragging(false);
            dragCounter.current = 0;

            const dropped = Array.from(e.dataTransfer.files).filter(
                f => f.type === 'application/json' || f.name.endsWith('.json')
            );
            if (dropped.length > 0) {
                setFiles(prev => [...prev, ...dropped]);
            }
        };

        document.addEventListener('dragenter', enter);
        document.addEventListener('dragleave', leave);
        document.addEventListener('dragover', over);
        document.addEventListener('drop', drop);

        return () => {
            document.removeEventListener('dragenter', enter);
            document.removeEventListener('dragleave', leave);
            document.removeEventListener('dragover', over);
            document.removeEventListener('drop', drop);
        };
    }, []);

    // Кнопка в начальном состоянии — ОТКРЫВАЕТ ПРОВОДНИК СРАЗУ
    const handleSelectFiles = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files).filter(
            f => f.type === 'application/json' || f.name.endsWith('.json')
        );
        if (selected.length > 0) {
            setFiles(prev => [...prev, ...selected]);
        }
        e.target.value = '';
    };

    const handleAddMore = () => fileInputRef.current?.click();

    const handleDelete = (i) => {
        setFiles(prev => prev.filter((_, index) => index !== i));
    };

    const handleAnalyze = async () => {
        if (files.length === 0) return;

        setIsAnalyzing(true);

        // Имитация процесса анализа
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsAnalyzing(false);
        setShowResults(true);
    };

    // Если показываем результаты, рендерим ResultsPage
    if (showResults) {
        return <ResultsPage onLogout={onLogout} />;
    }

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <div className="header-logo"><Logo /></div>
                <button className="logout-button" onClick={onLogout} title="Выйти">
                    <LogoutIcon />
                </button>
            </header>

            <div className="dashboard-container">
                <h1 className="dashboard-title">
                    Загрузите файл с отзывами, чтобы получить детальный анализ в удобном формате
                </h1>
                <p className="dashboard-subtitle">
                    Система обработает данные, выделит ключевые темы, частые жалобы и основные причины недовольства.
                </p>

                {/* Скрытый input — всегда в DOM, поэтому кнопка работает сразу */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".json,application/json"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                {/* Начальное состояние — только кнопка */}
                {files.length === 0 && !isDragging && (
                    <div className="upload-initial">
                        <button className="select-files-btn" onClick={handleSelectFiles}>
                            Выбрать JSON файлы
                        </button>
                        <p className="upload-hint">
                            или перетащите файлы JSON сюда
                        </p>
                    </div>
                )}

                {/* Зона загрузки — появляется при drag или после загрузки */}
                {(files.length > 0 || isDragging) && (
                    <div className={`upload-section ${isDragging ? 'dragging' : ''}`}>
                        <div className="upload-area">
                            <div className="upload-area-inner">
                                <div className="uploaded-files">
                                    {files.map((file, i) => (
                                        <div key={i} className="file-item">
                                            <div className="file-info">
                                                <span className="file-name">{file.name}</span>
                                                <span className="file-size">{(file.size / 1024).toFixed(1)} КБ</span>
                                            </div>
                                            <button className="delete-file-btn" onClick={() => handleDelete(i)}>
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className="add-more-btn" onClick={handleAddMore}>
                                <PlusIcon />
                            </button>
                        </div>
                    </div>
                )}

                {/* Кнопка анализа */}
                {files.length > 0 && (
                    <button
                        className={`analyze-btn ${isAnalyzing ? 'analyzing' : ''}`}
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="analyze-spinner"></div>
                                Анализируем...
                            </>
                        ) : (
                            'Запустить анализ'
                        )}
                    </button>
                )}
            </div>

            <footer className="dashboard-footer">
                <div className="footer-copyright">© 2024 Review Analysis</div>
            </footer>
        </div>
    );
};

export default DashboardPage;
