from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
from datetime import datetime
from typing import List, Optional, Dict
from collections import Counter
import os

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    address = Column(String(500), nullable=True)
    
    chart_sentiment_pie = Column(Text, nullable=True)
    chart_topics_bar = Column(Text, nullable=True)
    chart_topics_positive = Column(Text, nullable=True)
    chart_topics_negative = Column(Text, nullable=True)
    chart_topics_neutral = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    
    def to_dict(self) -> Dict:
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'chart_sentiment_pie': self.chart_sentiment_pie,
            'chart_topics_bar': self.chart_topics_bar,
            'chart_topics_positive': self.chart_topics_positive,
            'chart_topics_negative': self.chart_topics_negative,
            'chart_topics_neutral': self.chart_topics_neutral,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Review(Base):
    __tablename__ = 'reviews'
    
    review_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    text = Column(Text, nullable=False)
    sentiment = Column(String(50), nullable=False)
    topics = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="reviews")
    
    def to_dict(self) -> Dict:
        return {
            'review_id': self.review_id,
            'user_id': self.user_id,
            'text': self.text,
            'sentiment': self.sentiment,
            'topics': self.topics,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class DBManager:
    
    def __init__(self, database_url: Optional[str] = None):
        if database_url is None:
            database_url = "postgresql://postgres:postgres@localhost:5432/postgres"
        
        self.engine = create_engine(database_url, echo=False)
        self.SessionLocal = sessionmaker(bind=self.engine)
        
        print(f"Подключение к БД: {database_url.split('@')[1] if '@' in database_url else database_url}")
    
    def create_tables(self):
        Base.metadata.create_all(self.engine)
        print("Таблицы созданы успешно")
    
    def drop_tables(self):
        Base.metadata.drop_all(self.engine)
        print("Таблицы удалены")
    
    def get_session(self) -> Session:
        return self.SessionLocal()
    
    def create_user(self, name: str, address: Optional[str] = None,
                   chart_sentiment_pie: Optional[str] = None,
                   chart_topics_bar: Optional[str] = None,
                   chart_topics_positive: Optional[str] = None,
                   chart_topics_negative: Optional[str] = None,
                   chart_topics_neutral: Optional[str] = None) -> User:
        session = self.get_session()
        try:
            user = User(
                name=name,
                address=address,
                chart_sentiment_pie=chart_sentiment_pie,
                chart_topics_bar=chart_topics_bar,
                chart_topics_positive=chart_topics_positive,
                chart_topics_negative=chart_topics_negative,
                chart_topics_neutral=chart_topics_neutral
            )
            session.add(user)
            session.commit()
            session.refresh(user)
            return user
        finally:
            session.close()
    
    def get_user(self, user_id: int) -> Optional[User]:
        session = self.get_session()
        try:
            return session.query(User).filter(User.id == user_id).first()
        finally:
            session.close()
    
    def get_all_users(self) -> List[User]:
        session = self.get_session()
        try:
            return session.query(User).all()
        finally:
            session.close()
    
    def update_user(self, user_id: int, **kwargs) -> Optional[User]:
        session = self.get_session()
        try:
            user = session.query(User).filter(User.id == user_id).first()
            if not user:
                return None
            
            for key, value in kwargs.items():
                if hasattr(user, key):
                    setattr(user, key, value)
            
            user.updated_at = datetime.utcnow()
            session.commit()
            session.refresh(user)
            return user
        finally:
            session.close()
    
    def delete_user(self, user_id: int) -> bool:
        session = self.get_session()
        try:
            user = session.query(User).filter(User.id == user_id).first()
            if not user:
                return False
            
            session.delete(user)
            session.commit()
            return True
        finally:
            session.close()
    
    def update_user_charts(self, user_id: int, 
                          sentiment_pie: Optional[str] = None,
                          topics_bar: Optional[str] = None,
                          topics_positive: Optional[str] = None,
                          topics_negative: Optional[str] = None,
                          topics_neutral: Optional[str] = None) -> Optional[User]:
        updates = {}
        if sentiment_pie is not None:
            updates['chart_sentiment_pie'] = sentiment_pie
        if topics_bar is not None:
            updates['chart_topics_bar'] = topics_bar
        if topics_positive is not None:
            updates['chart_topics_positive'] = topics_positive
        if topics_negative is not None:
            updates['chart_topics_negative'] = topics_negative
        if topics_neutral is not None:
            updates['chart_topics_neutral'] = topics_neutral
        
        return self.update_user(user_id, **updates)
    
    def create_review(self, user_id: int, text: str, sentiment: str, topics: Optional[str] = None) -> Review:
        session = self.get_session()
        try:
            user = session.query(User).filter(User.id == user_id).first()
            if not user:
                raise ValueError(f"Пользователь с ID {user_id} не найден")
            
            review = Review(
                user_id=user_id,
                text=text,
                sentiment=sentiment,
                topics=topics
            )
            session.add(review)
            session.commit()
            session.refresh(review)
            return review
        finally:
            session.close()
    
    def create_reviews_batch(self, user_id: int, reviews_data: List[Dict]) -> List[Review]:
        session = self.get_session()
        try:
            user = session.query(User).filter(User.id == user_id).first()
            if not user:
                raise ValueError(f"Пользователь с ID {user_id} не найден")
            
            reviews = []
            for review_data in reviews_data:
                review = Review(
                    user_id=user_id,
                    text=review_data.get('text'),
                    sentiment=review_data.get('sentiment'),
                    topics=review_data.get('topics')
                )
                session.add(review)
                reviews.append(review)
            
            session.commit()
            for review in reviews:
                session.refresh(review)
            return reviews
        finally:
            session.close()
    
    def get_review(self, review_id: int) -> Optional[Review]:
        session = self.get_session()
        try:
            return session.query(Review).filter(Review.review_id == review_id).first()
        finally:
            session.close()
    
    def get_reviews_by_user(self, user_id: int) -> List[Review]:
        session = self.get_session()
        try:
            return session.query(Review).filter(Review.user_id == user_id).all()
        finally:
            session.close()
    
    def get_all_reviews(self, limit: Optional[int] = None) -> List[Review]:
        session = self.get_session()
        try:
            query = session.query(Review).order_by(Review.created_at.desc())
            if limit:
                query = query.limit(limit)
            return query.all()
        finally:
            session.close()
    
    def update_review(self, review_id: int, text: Optional[str] = None,
                     sentiment: Optional[str] = None, topics: Optional[str] = None) -> Optional[Review]:
        session = self.get_session()
        try:
            review = session.query(Review).filter(Review.review_id == review_id).first()
            if not review:
                return None
            
            if text is not None:
                review.text = text
            if sentiment is not None:
                review.sentiment = sentiment
            if topics is not None:
                review.topics = topics
            
            session.commit()
            session.refresh(review)
            return review
        finally:
            session.close()
    
    def delete_review(self, review_id: int) -> bool:
        session = self.get_session()
        try:
            review = session.query(Review).filter(Review.review_id == review_id).first()
            if not review:
                return False
            
            session.delete(review)
            session.commit()
            return True
        finally:
            session.close()
    
    def delete_all_reviews_for_user(self, user_id: int) -> int:
        session = self.get_session()
        try:
            user = session.query(User).filter(User.id == user_id).first()
            if not user:
                raise ValueError(f"Пользователь с ID {user_id} не найден")
            
            reviews = session.query(Review).filter(Review.user_id == user_id).all()
            count = len(reviews)
            
            for review in reviews:
                session.delete(review)
            
            session.commit()
            return count
        finally:
            session.close()
    
    def save_user_charts_from_dict(self, user_id: int, charts_dict: Dict) -> Optional[User]:
        key_mapping = {
            'sentiment_pie': 'chart_sentiment_pie',
            'topics_bar': 'chart_topics_bar',
            'topics_positive': 'chart_topics_positive',
            'topics_negative': 'chart_topics_negative',
            'topics_neutral': 'chart_topics_neutral',
        }
        
        updates = {}
        for key, value in charts_dict.items():
            db_key = key_mapping.get(key, key)
            if db_key.startswith('chart_') and value:
                updates[db_key] = value
        
        if updates:
            return self.update_user(user_id, **updates)
        return self.get_user(user_id)
    
    def get_user_with_reviews(self, user_id: int) -> Optional[Dict]:
        user = self.get_user(user_id)
        if not user:
            return None
        
        reviews = self.get_reviews_by_user(user_id)
        
        return {
            **user.to_dict(),
            'reviews': [review.to_dict() for review in reviews],
            'reviews_count': len(reviews)
        }
    
    def find_user_by_name_and_address(self, name: str, address: str) -> Optional[User]:
        session = self.get_session()
        try:
            return session.query(User).filter(
                User.name == name,
                User.address == address
            ).first()
        finally:
            session.close()
    
    def has_user_analysis(self, user_id: int) -> bool:
        user = self.get_user(user_id)
        if not user:
            return False
        
        reviews = self.get_reviews_by_user(user_id)
        has_reviews = len(reviews) > 0
        
        has_charts = any([
            user.chart_sentiment_pie,
            user.chart_topics_bar,
            user.chart_topics_positive,
            user.chart_topics_negative,
            user.chart_topics_neutral
        ])
        
        return has_reviews and has_charts
    
    def get_user_statistics(self, user_id: int) -> Optional[Dict]:
        user = self.get_user(user_id)
        if not user:
            return None
        
        reviews = self.get_reviews_by_user(user_id)
        if not reviews:
            return None
        
        sentiment_counts = Counter([r.sentiment for r in reviews])
        
        topics_overall = Counter()
        topics_by_sentiment = {
            'positive': Counter(),
            'negative': Counter(),
            'neutral': Counter()
        }
        
        for review in reviews:
            if review.topics:
                topic_list = [t.strip() for t in review.topics.split(",")]
                for topic in topic_list:
                    topics_overall[topic] += 1
                    if review.sentiment in topics_by_sentiment:
                        topics_by_sentiment[review.sentiment][topic] += 1
        
        charts = {
            'sentiment_pie': user.chart_sentiment_pie,
            'topics_bar': user.chart_topics_bar,
            'topics_positive': user.chart_topics_positive,
            'topics_negative': user.chart_topics_negative,
            'topics_neutral': user.chart_topics_neutral
        }
        
        return {
            'sentiment_counts': dict(sentiment_counts),
            'topics_overall': dict(topics_overall),
            'topics_by_sentiment': {
                k: dict(v) for k, v in topics_by_sentiment.items()
            },
            'charts': charts
        }

