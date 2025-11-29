import sys
from database import DBManager
from review_analyzer import ReviewAnalyzer


def test_database_connection():
    print("\n" + "=" * 80)
    print("ТЕСТ 1: Подключение к базе данных")
    print("=" * 80)
    try:
        db = DBManager()
        session = db.get_session()
        session.close()
        print("✅ Подключение к БД успешно!")
        return db
    except Exception as e:
        print(f"❌ Ошибка подключения к БД: {e}")
        print("\nУбедитесь, что:")
        print("  1. PostgreSQL запущен на localhost:5432")
        print("  2. База данных 'postgres' существует")
        print("  3. Пользователь и пароль: postgres/postgres")
        return None


def test_create_tables(db):
    print("\n" + "=" * 80)
    print("ТЕСТ 2: Создание таблиц")
    print("=" * 80)
    try:
        db.create_tables()
        print("✅ Таблицы созданы успешно!")
        return True
    except Exception as e:
        print(f"❌ Ошибка создания таблиц: {e}")
        return False


def test_user_operations(db):
    print("\n" + "=" * 80)
    print("ТЕСТ 3: Работа с пользователями")
    print("=" * 80)
    try:
        user = db.create_user(
            name="Тестовый пользователь",
            address="Москва, ул. Тестовая, д. 1"
        )
        print(f"✅ Пользователь создан: {user.name} (ID: {user.id})")
        
        retrieved_user = db.get_user(user.id)
        if retrieved_user and retrieved_user.id == user.id:
            print(f"✅ Пользователь получен: {retrieved_user.name}")
        else:
            print("❌ Ошибка получения пользователя")
            return None
        
        return user
    except Exception as e:
        print(f"❌ Ошибка работы с пользователями: {e}")
        return None


def test_analyzer():
    print("\n" + "=" * 80)
    print("ТЕСТ 4: Работа анализатора отзывов")
    print("=" * 80)
    try:
        analyzer = ReviewAnalyzer(verbose=False)
        
        test_reviews = [
            "Очень понравились хинкали, сочные и ароматные. Обязательно приду ещё!",
            "Обслуживание медленное, хотя посетителей было мало.",
            "Отличное место, уютная атмосфера и доброжелательный персонал."
        ]
        
        print(f"Анализ {len(test_reviews)} тестовых отзывов...")
        results_df = analyzer.analyse_reviews(
            test_reviews, 
            output_file=None, 
            show_progress=True
        )
        
        print(f"✅ Анализ завершен! Результатов: {len(results_df)}")
        print("\nПримеры результатов:")
        for idx, row in results_df.head(3).iterrows():
            print(f"  {idx+1}. {row['sentiment']}: {row['review'][:50]}...")
        
        return analyzer, results_df
    except Exception as e:
        print(f"❌ Ошибка анализа: {e}")
        import traceback
        traceback.print_exc()
        return None, None


def test_visualizations(analyzer, results_df):
    print("\n" + "=" * 80)
    print("ТЕСТ 5: Создание диаграмм в base64")
    print("=" * 80)
    try:
        charts_base64 = analyzer.create_visualizations_base64(results_df, show=False)
        
        print(f"✅ Диаграммы созданы!")
        print("\nСозданные диаграммы:")
        for key, value in charts_base64.items():
            size = len(value) if value else 0
            print(f"  - {key}: {size} символов (base64)")
        
        if charts_base64.get('sentiment_pie', '').startswith('data:image'):
            print("✅ Формат base64 корректен (начинается с 'data:image')")
        else:
            print("⚠️ Предупреждение: формат может быть некорректным")
        
        return charts_base64
    except Exception as e:
        print(f"❌ Ошибка создания диаграмм: {e}")
        import traceback
        traceback.print_exc()
        return None


def test_save_to_db(db, user, results_df, charts_base64):
    print("\n" + "=" * 80)
    print("ТЕСТ 6: Сохранение данных в БД")
    print("=" * 80)
    try:
        updated_user = db.save_user_charts_from_dict(user.id, charts_base64)
        if updated_user:
            print(f"✅ Диаграммы сохранены для пользователя {updated_user.name}")
        else:
            print("❌ Ошибка сохранения диаграмм")
            return False
        
        saved_reviews = []
        for idx, row in results_df.iterrows():
            review = db.create_review(
                user_id=user.id,
                text=row['review'],
                sentiment=row['sentiment'],
                topics=row['topic']
            )
            saved_reviews.append(review)
        
        print(f"✅ Отзывов сохранено: {len(saved_reviews)}")
        return True
    except Exception as e:
        print(f"❌ Ошибка сохранения в БД: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_retrieve_from_db(db, user):
    print("\n" + "=" * 80)
    print("ТЕСТ 7: Получение данных из БД")
    print("=" * 80)
    try:
        user_data = db.get_user_with_reviews(user.id)
        
        if user_data:
            print(f"✅ Пользователь получен: {user_data['name']}")
            print(f"   Адрес: {user_data.get('address', 'не указан')}")
            print(f"   Отзывов: {user_data['reviews_count']}")
            
            charts_present = []
            if user_data.get('chart_sentiment_pie'):
                charts_present.append('sentiment_pie')
            if user_data.get('chart_topics_bar'):
                charts_present.append('topics_bar')
            if user_data.get('chart_topics_positive'):
                charts_present.append('topics_positive')
            
            print(f"   Диаграмм сохранено: {len(charts_present)}")
            if charts_present:
                print(f"   Диаграммы: {', '.join(charts_present)}")
            
            if user_data['reviews_count'] > 0:
                print(f"\n   Примеры отзывов:")
                for review in user_data['reviews'][:3]:
                    print(f"     - {review['sentiment']}: {review['text'][:40]}...")
            
            return True
        else:
            print("❌ Не удалось получить данные пользователя")
            return False
    except Exception as e:
        print(f"❌ Ошибка получения данных: {e}")
        import traceback
        traceback.print_exc()
        return False


def run_all_tests():
    print("=" * 80)
    print("ТЕСТИРОВАНИЕ СИСТЕМЫ АНАЛИЗА ОТЗЫВОВ")
    print("=" * 80)
    
    db = test_database_connection()
    if not db:
        print("\n❌ Не удалось подключиться к БД. Проверьте подключение.")
        return False
    
    if not test_create_tables(db):
        print("\n⚠️ Возможно, таблицы уже существуют. Продолжаем...")
    
    user = test_user_operations(db)
    if not user:
        print("\n❌ Тест пользователей не пройден.")
        return False
    
    analyzer, results_df = test_analyzer()
    if not analyzer or results_df is None:
        print("\n❌ Тест анализа не пройден.")
        return False
    
    charts_base64 = test_visualizations(analyzer, results_df)
    if not charts_base64:
        print("\n❌ Тест визуализаций не пройден.")
        return False
    
    if not test_save_to_db(db, user, results_df, charts_base64):
        print("\n❌ Тест сохранения не пройден.")
        return False
    
    if not test_retrieve_from_db(db, user):
        print("\n❌ Тест получения данных не пройден.")
        return False
    
    print("\n" + "=" * 80)
    print("РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ")
    print("=" * 80)
    print("✅ Все тесты пройдены успешно!")
    print(f"\nПроверьте данные в БД:")
    print(f"  - Пользователь ID: {user.id}")
    print(f"  - Имя: {user.name}")
    print(f"  - Отзывов сохранено: {len(results_df)}")
    print("=" * 80)
    
    return True


if __name__ == "__main__":
    try:
        success = run_all_tests()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\nТестирование прервано пользователем.")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Критическая ошибка: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

