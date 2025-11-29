from database import DBManager
from review_analyzer import ReviewAnalyzer


def example_with_base64_charts():
    db = DBManager()
    analyzer = ReviewAnalyzer(verbose=False)
    
    reviews = [
        "Очень понравились хинкали, сочные и ароматные. Обязательно приду ещё!",
        "Обслуживание медленное, хотя посетителей было мало.",
        "Отличное место, уютная атмосфера и доброжелательный персонал.",
        "Хинкали вкусные, но суп был пересолен.",
        "Цены приятные, порции большие — рекомендую."
    ]
    
    print("\n1. Анализ отзывов...")
    results_df = analyzer.analyse_reviews(reviews, output_file=None, show_progress=False)
    
    print("\n2. Создание диаграмм в формате base64...")
    charts_base64 = analyzer.create_visualizations_base64(results_df, show=False)
    
    print("Диаграммы созданы. Ключи:", list(charts_base64.keys()))
    print(f"Размер первой диаграммы: {len(charts_base64.get('sentiment_pie', ''))} символов")
    
    print("\n3. Создание пользователя с диаграммами...")
    user = db.create_user(
        name="Тестовый пользователь",
        address="Москва, ул. Примерная, д. 1",
        chart_sentiment_pie=charts_base64.get('sentiment_pie'),
        chart_topics_bar=charts_base64.get('topics_bar'),
        chart_topics_positive=charts_base64.get('topics_positive'),
        chart_topics_negative=charts_base64.get('topics_negative'),
        chart_topics_neutral=charts_base64.get('topics_neutral')
    )
    print(f"Пользователь создан: {user.name} (ID: {user.id})")
    
    print("\n4. Сохранение отзывов...")
    for idx, row in results_df.iterrows():
        review = db.create_review(
            user_id=user.id,
            text=row['review'],
            sentiment=row['sentiment'],
            topics=row['topic']
        )
        print(f"  Отзыв {idx+1} сохранен (ID: {review.review_id})")
    
    print("\n5. Получение пользователя с диаграммами...")
    user_data = db.get_user_with_reviews(user.id)
    print(f"Пользователь: {user_data['name']}")
    print(f"Отзывов: {user_data['reviews_count']}")
    print(f"Диаграммы сохранены:")
    print(f"  - sentiment_pie: {'Да' if user_data['chart_sentiment_pie'] else 'Нет'}")
    print(f"  - topics_bar: {'Да' if user_data['chart_topics_bar'] else 'Нет'}")
    print(f"  - topics_positive: {'Да' if user_data['chart_topics_positive'] else 'Нет'}")
    
    print("\n6. Обновление диаграмм через словарь...")
    updated_user = db.save_user_charts_from_dict(user.id, charts_base64)
    print("Диаграммы обновлены!")
    
    print("\nПример завершен!")
    
    return user, charts_base64


if __name__ == "__main__":
    example_with_base64_charts()

