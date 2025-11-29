import pandas as pd
from tqdm import tqdm
from sentiment_analyzer import SentimentAnalyzer
from topic_classifier import TopicClassifier
from visualizer import create_all_visualizations, create_all_visualizations_base64


class ReviewAnalyzer:
    
    def __init__(self, sentiment_model_name="blanchefort/rubert-base-cased-sentiment",
                 embedding_model_name="ai-forever/sbert_large_nlu_ru", verbose=True):
        if verbose:
            print("Инициализация ReviewAnalyzer...")
            print(f"  - Модель тональности: {sentiment_model_name}")
            print(f"  - Модель эмбеддингов: {embedding_model_name}")
        
        self.sentiment_analyzer = SentimentAnalyzer(model_name=sentiment_model_name)
        self.topic_classifier = TopicClassifier(embedding_model_name=embedding_model_name)
        
        if verbose:
            print("ReviewAnalyzer инициализирован успешно!\n")
    
    def analyse_reviews(self, reviews_list, output_file="review_analysis.csv", 
                       show_progress=True, min_topic_score=2):
        if show_progress:
            print("=" * 80)
            print("НАЧАЛО АНАЛИЗА ОТЗЫВОВ")
            print("=" * 80)
        
        if show_progress:
            print("\n" + "=" * 80)
            print("АНАЛИЗ ТОНАЛЬНОСТИ")
            print("=" * 80)
            print("\nАнализ тональности отзывов...")
        
        sentiments = self.sentiment_analyzer.analyze_batch(reviews_list)
        
        if show_progress:
            sentiment_stats = self.sentiment_analyzer.get_statistics(sentiments)
            print("\nКоличество отзывов по тональности:")
            for sentiment, count in sentiment_stats.most_common():
                print(f"  {sentiment}: {count}")
        
        if show_progress:
            print("\n" + "=" * 80)
            print("КЛАССИФИКАЦИЯ ТЕМ")
            print("=" * 80)
            print("\nКлассификация отзывов по категориям...")
        
        topics = self.topic_classifier.classify_batch(
            reviews_list, 
            return_multiple=True, 
            min_score=min_topic_score,
            show_progress=show_progress
        )
        
        if show_progress:
            topic_stats = self.topic_classifier.get_statistics(topics)
            print("\nКоличество упоминаний категорий (отзыв может относиться к нескольким):")
            for topic, count in topic_stats.most_common():
                print(f"  {topic}: {count}")
            
            print("\n" + "=" * 80)
            print("ПРИМЕРЫ АНАЛИЗА")
            print("=" * 80)
            for i in range(min(5, len(reviews_list))):
                print(f"\nОтзыв: {reviews_list[i][:60]}...")
                print(f"  Тональность: {sentiments[i]}")
                print(f"  Тема: {topics[i]}")
        
        df = pd.DataFrame({
            "review": reviews_list,
            "sentiment": sentiments,
            "topic": topics
        })
        
        if output_file:
            if show_progress:
                print("\n" + "=" * 80)
                print("СОХРАНЕНИЕ РЕЗУЛЬТАТОВ")
                print("=" * 80)
            
            df.to_csv(output_file, index=False, encoding="utf-8")
            
            if show_progress:
                print(f"\nРезультаты сохранены в {output_file}")
                print(f"Всего проанализировано отзывов: {len(reviews_list)}")
                print("\n" + "=" * 80)
        
        return df
    
    def analyse_single(self, review_text):
        sentiment = self.sentiment_analyzer.analyze(review_text)
        topic_list = self.topic_classifier.classify(review_text, return_multiple=True, min_score=2)
        topic = ", ".join(topic_list) if isinstance(topic_list, list) else topic_list
        
        return {
            'sentiment': sentiment,
            'topic': topic,
            'review': review_text
        }
    
    def get_sentiment_statistics(self, sentiments):
        return self.sentiment_analyzer.get_statistics(sentiments)
    
    def get_topic_statistics(self, topics):
        return self.topic_classifier.get_statistics(topics)
    
    def create_visualizations(self, df, output_dir=None, show=False):
        create_all_visualizations(df, output_dir=output_dir, show=show)
    
    def create_visualizations_base64(self, df, show=False):
        return create_all_visualizations_base64(df, show=show)

