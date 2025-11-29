from database import DBManager


def init_database(drop_existing=False):
    print("=" * 80)
    print("ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ")
    print("=" * 80)
    
    db = DBManager()
    
    if drop_existing:
        print("\nУдаление существующих таблиц...")
        db.drop_tables()
    
    print("\nСоздание таблиц...")
    db.create_tables()
    
    print("\n" + "=" * 80)
    print("База данных инициализирована успешно!")
    print("=" * 80)


if __name__ == "__main__":
    import sys
    
    drop_existing = False
    if len(sys.argv) > 1 and sys.argv[1] == "--drop":
        drop_existing = True
        print("ВНИМАНИЕ: Будут удалены все существующие таблицы!")
        response = input("Продолжить? (yes/no): ")
        if response.lower() != 'yes':
            print("Отменено.")
            sys.exit(0)
    
    init_database(drop_existing=drop_existing)

