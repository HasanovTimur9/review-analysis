from database import DBManager


def example_usage():
    db = DBManager()
    
    print("\n1. Создание таблиц...")
    db.create_tables()
    
    print("\n2. Создание пользователя...")
    user = db.create_user(
        name="Иван Иванов",
        address="Москва, ул. Примерная, д. 1",
        chart_sentiment_pie="sentiment_pie_chart.png",
        chart_topics_bar="topics_bar_chart.png",
        chart_topics_positive="topics_by_positive.png",
        chart_topics_negative="topics_by_negative.png",
        chart_topics_neutral="topics_by_neutral.png"
    )
    print(f"Создан пользователь: {user.name} (ID: {user.id})")
    
    print("\n3. Создание отзывов...")
    review1 = db.create_review(
        user_id=user.id,
        text="Очень понравились хинкали, сочные и ароматные. Обязательно приду ещё!",
        sentiment="positive",
        topics="Еда"
    )
    print(f"Создан отзыв ID: {review1.review_id}")
    
    review2 = db.create_review(
        user_id=user.id,
        text="Обслуживание медленное, хотя посетителей было мало.",
        sentiment="negative",
        topics="Обслуживание"
    )
    print(f"Создан отзыв ID: {review2.review_id}")
    
    reviews_data = [
        {
            'text': 'Отличное место, уютная атмосфера и доброжелательный персонал.',
            'sentiment': 'positive',
            'topics': 'Атмосфера и интерьер, Обслуживание'
        },
        {
            'text': 'Хинкали вкусные, но суп был пересолен.',
            'sentiment': 'negative',
            'topics': 'Еда'
        }
    ]
    reviews = db.create_reviews_batch(user.id, reviews_data)
    print(f"Создано отзывов: {len(reviews)}")
    
    print("\n4. Получение пользователя с отзывами...")
    user_data = db.get_user_with_reviews(user.id)
    print(f"Пользователь: {user_data['name']}")
    print(f"Количество отзывов: {user_data['reviews_count']}")
    
    print("\n5. Получение всех пользователей...")
    all_users = db.get_all_users()
    print(f"Всего пользователей: {len(all_users)}")
    
    print("\n6. Получение всех отзывов...")
    all_reviews = db.get_all_reviews(limit=10)
    print(f"Отзывов в БД: {len(all_reviews)}")
    
    print("\nПример использования завершен!")


if __name__ == "__main__":
    example_usage()

