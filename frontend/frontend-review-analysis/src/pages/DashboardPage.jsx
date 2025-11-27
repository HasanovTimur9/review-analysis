import React, { useState, useRef, useEffect } from 'react';
import '../styles/DashboardPage.css';

// ========== Иконки ==========
const Logo = () => (
    <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="25" stroke="#50463C" strokeWidth="2" fill="none"/>
        <path d="M20 25L30 35L40 25" stroke="#50463C" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 35L30 45L40 35" stroke="#50463C" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

const HomeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#50463C" strokeWidth="2"/>
        <path d="M9 22V12H15V22" stroke="#50463C" strokeWidth="2"/>
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
const DashboardPage = ({ onGoHome, onLogout, savedFiles = [], onFilesUpdate }) => {
    const [files, setFiles] = useState([]);           // ← только здесь хранятся настоящие File-объекты
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // 1. Восстановление файлов из props (если они пришли извне, например после логина)
    useEffect(() => {
        if (savedFiles && savedFiles.length > 0) {
            setFiles(savedFiles);
        }
    }, [savedFiles]);

    // 2. Сохранение метаданных в localStorage + уведомление родителя
    useEffect(() => {
        if (files.length > 0) {
            const filesInfo = files.map(f => ({
                name: f.name,
                size: f.size,
                lastModified: f.lastModified,
                type: f.type
            }));

            localStorage.setItem('dashboardFilesInfo', JSON.stringify(filesInfo));
            onFilesUpdate?.(filesInfo);           // ← передаём только данные, не File-объекты!
        } else {
            localStorage.removeItem('dashboardFilesInfo');
            onFilesUpdate?.([]);
        }
    }, [files]);

    // 3. Попытка восстановить из localStorage при первом заходе (если props пустые)
    useEffect(() => {
        if (savedFiles.length === 0) {
            const saved = localStorage.getItem('dashboardFilesInfo');
            if (saved) {
                const parsed = JSON.parse(saved);
                console.log('Восстановлены метаданные файлов из localStorage:', parsed);
                // File-объекты восстановить нельзя — просто показываем, что были файлы (по желанию)
            }
        }
    }, []);

    // ========== Обработчики файлов ==========
    const handleFileSelect = (e) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length > 0) {
            setFiles(prev => [...prev, ...newFiles]);
            e.target.value = ''; // сбрасываем input
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const dropped = Array.from(e.dataTransfer.files).filter(
            f => f.type === 'application/json' || f.name.endsWith('.json')
        );

        if (dropped.length > 0) {
            setFiles(prev => [...prev, ...dropped]);
        }
    };

    const handleAddMore = () => fileInputRef.current?.click();

    const handleDelete = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleAnalyze = () => {
        console.log('Запуск анализа с файлами:', files);
        // Здесь будет отправка на бэкенд
    };

    // ========== Рендер ==========
    return (
        <div className="dashboard-page">
            {/* Хедер */}
            <header className="dashboard-header">
                <div className="header-logo">
                    <Logo />
                </div>
                <div className="header-actions">
                    <button className="home-button" onClick={onGoHome} title="На главную">
                        <HomeIcon />
                    </button>
                    <button className="logout-button" onClick={onLogout} title="Выйти">
                        <LogoutIcon />
                    </button>
                </div>
            </header>

            {/* Основной контент */}
            <div className="dashboard-container">
                <h1 className="dashboard-title">
                    Загрузите файл с отзывами, чтобы получить детальный анализ в удобном формате
                </h1>
                <p className="dashboard-subtitle">
                    Система обработает данные, выделит ключевые темы, частые жалобы и основные причины недовольства.
                </p>

                {/* Загрузка файлов */}
                <div className="upload-section">
                    {files.length === 0 ? (
                        <div className="upload-initial">
                            <button
                                className="select-files-btn"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Выбрать JSON файлы
                            </button>
                            <p className="upload-hint">или перетащите файлы сюда</p>
                        </div>
                    ) : (
                        <div
                            className={`upload-area ${isDragging ? 'dragging' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="upload-area-inner">
                                <div className="uploaded-files">
                                    {files.map((file, i) => (
                                        <div key={i} className="file-item">
                                            <div className="file-info">
                                                <span className="file-name">{file.name}</span>
                                                <span className="file-size">
                          {(file.size / 1024).toFixed(1)} КБ
                        </span>
                                            </div>
                                            <button
                                                className="delete-file-btn"
                                                onClick={() => handleDelete(i)}
                                                title="Удалить файл"
                                            >
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
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".json,application/json"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                </div>

                {/* Кнопка анализа */}
                {files.length > 0 && (
                    <button className="analyze-btn" onClick={handleAnalyze}>
                        Запустить анализ
                    </button>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
