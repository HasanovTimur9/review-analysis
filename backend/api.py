from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List
from database import DBManager
from review_analyzer import ReviewAnalyzer
from chart_utils import base64_to_image
import os
import json
import pandas as pd

app = FastAPI(title="Review Analysis API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db_manager = DBManager()
analyzer = ReviewAnalyzer(verbose=False)


def extract_reviews_from_json(json_data) -> List[str]:
    reviews = []
    
    if isinstance(json_data, list):
        for item in json_data:
            if isinstance(item, str):
                reviews.append(item)
            elif isinstance(item, dict):
                review_text = item.get('review') or item.get('text') or item.get('comment') or item.get('content')
                if review_text and isinstance(review_text, str):
                    reviews.append(review_text)
    elif isinstance(json_data, dict):
        reviews_list = json_data.get('reviews') or json_data.get('data') or json_data.get('items')
        if reviews_list and isinstance(reviews_list, list):
            reviews = extract_reviews_from_json(reviews_list)
        else:
            review_text = json_data.get('review') or json_data.get('text') or json_data.get('comment')
            if review_text and isinstance(review_text, str):
                reviews.append(review_text)
    
    return reviews


class LoginRequest(BaseModel):
    name: str
    address: str


class AnalyseRequest(BaseModel):
    user_id: int
    reviews: Optional[List[str]] = None


class NewUserResponse(BaseModel):
    status: str = "new user"
    user_id: int


class StatisticsResponse(BaseModel):
    status: str = "existing user"
    user_id: int
    sentiment_counts: Dict[str, int]
    topics_overall: Dict[str, int]
    topics_by_sentiment: Dict[str, Dict[str, int]]
    charts: Dict[str, Optional[str]]


@app.post("/login", response_model=Dict)
async def login(request: LoginRequest):
    try:
        user = db_manager.find_user_by_name_and_address(
            name=request.name,
            address=request.address
        )
        
        if not user:
            user = db_manager.create_user(
                name=request.name,
                address=request.address
            )
            return {
                "status": "new user",
                "user_id": user.id
            }
        
        has_analysis = db_manager.has_user_analysis(user.id)
        
        if not has_analysis:
            return {
                "status": "new user",
                "user_id": user.id
            }
        
        statistics = db_manager.get_user_statistics(user.id)
        
        if not statistics:
            return {
                "status": "new user",
                "user_id": user.id
            }
        
        return {
            "status": "existing user",
            "user_id": user.id,
            "sentiment_counts": statistics["sentiment_counts"],
            "topics_overall": statistics["topics_overall"],
            "topics_by_sentiment": statistics["topics_by_sentiment"],
            "charts": statistics["charts"]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при обработке запроса: {str(e)}")


@app.post("/analyse", response_model=Dict)
async def analyse_reviews(
    user_id: int = Form(...),
    files: Optional[List[UploadFile]] = File(None),
    reviews: Optional[str] = Form(None)
):
    try:
        user = db_manager.get_user(user_id)
        if not user:
            raise HTTPException(status_code=404, detail=f"Пользователь с ID {user_id} не найден")
        
        all_new_reviews = []
        
        if files:
            for file in files:
                if not file.filename.endswith('.json'):
                    raise HTTPException(status_code=400, detail=f"Файл {file.filename} должен быть JSON")
                
                content = await file.read()
                try:
                    json_data = json.loads(content.decode('utf-8'))
                    file_reviews = extract_reviews_from_json(json_data)
                    all_new_reviews.extend(file_reviews)
                except json.JSONDecodeError as e:
                    raise HTTPException(status_code=400, detail=f"Ошибка парсинга JSON в файле {file.filename}: {str(e)}")
        
        if reviews:
            try:
                reviews_data = json.loads(reviews) if isinstance(reviews, str) else reviews
                if isinstance(reviews_data, list):
                    parsed_reviews = extract_reviews_from_json(reviews_data)
                    all_new_reviews.extend(parsed_reviews)
                else:
                    parsed_reviews = extract_reviews_from_json(reviews_data)
                    all_new_reviews.extend(parsed_reviews)
            except json.JSONDecodeError:
                if isinstance(reviews, str):
                    all_new_reviews.append(reviews)
        
        if not all_new_reviews:
            raise HTTPException(status_code=400, detail="Не указаны отзывы для анализа. Передайте JSON файлы или список отзывов")
        
        existing_reviews = db_manager.get_reviews_by_user(user_id)
        existing_reviews_texts = [review.text for review in existing_reviews]
        
        all_reviews = existing_reviews_texts + all_new_reviews
        
        results_df = analyzer.analyse_reviews(
            all_reviews,
            output_file=None,
            show_progress=False
        )
        
        charts_base64 = analyzer.create_visualizations_base64(results_df, show=False)
        
        chart_files = {
            'sentiment_pie': 'sentiment_pie.png',
            'topics_bar': 'topics_bar.png',
            'topics_positive': 'topics_positive.png',
            'topics_negative': 'topics_negative.png',
            'topics_neutral': 'topics_neutral.png'
        }
        project_root = os.path.dirname(os.path.abspath(__file__))
        for chart_key, filename in chart_files.items():
            if chart_key in charts_base64 and charts_base64[chart_key]:
                file_path = os.path.join(project_root, filename)
                base64_to_image(charts_base64[chart_key], file_path)
        
        db_manager.delete_all_reviews_for_user(user_id)
        
        reviews_data = []
        for idx, row in results_df.iterrows():
            reviews_data.append({
                'text': row['review'],
                'sentiment': row['sentiment'],
                'topics': row['topic']
            })
        
        db_manager.create_reviews_batch(user_id, reviews_data)
        
        db_manager.save_user_charts_from_dict(user_id, charts_base64)
        
        statistics = db_manager.get_user_statistics(user_id)
        
        if not statistics:
            raise HTTPException(status_code=500, detail="Ошибка при получении статистики")
        
        return {
            "status": "analysis_complete",
            "user_id": user_id,
            "reviews_analyzed": len(all_new_reviews),
            "sentiment_counts": statistics["sentiment_counts"],
            "topics_overall": statistics["topics_overall"],
            "topics_by_sentiment": statistics["topics_by_sentiment"],
            "charts": statistics["charts"]
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при анализе отзывов: {str(e)}")


@app.post("/analyse/json", response_model=Dict)
async def analyse_reviews_json(request: AnalyseRequest):
    try:
        user = db_manager.get_user(request.user_id)
        if not user:
            raise HTTPException(status_code=404, detail=f"Пользователь с ID {request.user_id} не найден")
        
        if not request.reviews:
            raise HTTPException(status_code=400, detail="Список отзывов не может быть пустым")
        
        existing_reviews = db_manager.get_reviews_by_user(request.user_id)
        existing_reviews_texts = [review.text for review in existing_reviews]
        
        all_reviews = existing_reviews_texts + request.reviews
        
        results_df = analyzer.analyse_reviews(
            all_reviews,
            output_file=None,
            show_progress=False
        )
        
        charts_base64 = analyzer.create_visualizations_base64(results_df, show=False)
        
        chart_files = {
            'sentiment_pie': 'sentiment_pie.png',
            'topics_bar': 'topics_bar.png',
            'topics_positive': 'topics_positive.png',
            'topics_negative': 'topics_negative.png',
            'topics_neutral': 'topics_neutral.png'
        }
        project_root = os.path.dirname(os.path.abspath(__file__))
        for chart_key, filename in chart_files.items():
            if chart_key in charts_base64 and charts_base64[chart_key]:
                file_path = os.path.join(project_root, filename)
                base64_to_image(charts_base64[chart_key], file_path)
        
        db_manager.delete_all_reviews_for_user(request.user_id)
        
        reviews_data = []
        for idx, row in results_df.iterrows():
            reviews_data.append({
                'text': row['review'],
                'sentiment': row['sentiment'],
                'topics': row['topic']
            })
        
        db_manager.create_reviews_batch(request.user_id, reviews_data)
        
        db_manager.save_user_charts_from_dict(request.user_id, charts_base64)
        
        statistics = db_manager.get_user_statistics(request.user_id)
        
        if not statistics:
            raise HTTPException(status_code=500, detail="Ошибка при получении статистики")
        
        return {
            "status": "analysis_complete",
            "user_id": request.user_id,
            "reviews_analyzed": len(request.reviews),
            "sentiment_counts": statistics["sentiment_counts"],
            "topics_overall": statistics["topics_overall"],
            "topics_by_sentiment": statistics["topics_by_sentiment"],
            "charts": statistics["charts"]
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при анализе отзывов: {str(e)}")


@app.get("/")
async def root():
    return {
        "message": "Review Analysis API",
        "version": "1.0.0",
        "endpoints": {
            "POST /login": "Авторизация/регистрация пользователя",
            "POST /analyse": "Анализ отзывов (поддерживает JSON файлы и список отзывов, добавляет к существующим)",
            "POST /analyse/json": "Анализ отзывов (старый формат JSON, обратная совместимость)"
        }
    }


@app.get("/health")
async def health_check():
    try:
        session = db_manager.get_session()
        session.close()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

