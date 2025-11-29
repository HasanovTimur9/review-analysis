from sentence_transformers import SentenceTransformer
import numpy as np
import re
from collections import Counter
from pymorphy3 import MorphAnalyzer
from tqdm import tqdm


class TopicClassifier:
    
    TOPIC_CATEGORIES = {
        "Еда": [
            "еда", "кухня", "блюдо", "вкусн", "вкус", "порция", "порции",
            "хинкали", "хачапури", "шашлык", "суп", "плов", "мясо", "говядина",
            "салат", "закуска", "десерт", "десерты", "соус", "соусы", "специя",
            "пересол", "пресн", "жестк", "сух", "сыр", "сырой", "холодн", "горяч",
            "ароматн", "сочн", "питание", "рецепт", "готов", "приготов"
        ],
        "Обслуживание": [
            "обслуживание", "сервис", "официант", "официанты", "персонал",
            "подошёл", "подошел", "принесли", "принести", "заказ", "счёт",
            "вежлив", "дружелюбн", "приветлив", "помог", "помочь", "объяснил",
            "медленн", "долго", "быстро", "скорость", "ожидание", "ждать",
            "перепута", "ошибка", "неуважен", "недружелюбн"
        ],
        "Атмосфера и интерьер": [
            "атмосфера", "интерьер", "место", "заведение", "ресторан",
            "уютн", "приятн", "комфортн", "свет", "пространство", "простор",
            "музыка", "громк", "шумн", "тих", "тесно", "просторн",
            "компания", "семейный", "ужин", "посидеть", "сидеть",
            "грязн", "чисто", "запах", "туалет", "гигиена"
        ],
        "Цена": [
            "цена", "цены", "стоимость", "дорого", "дешево", "недорого",
            "дорогие", "дешевые", "порция", "порции", "соотношение",
            "качество", "цена-качество", "покупать", "оплата", "счёт",
            "напиток", "напитки", "вино"
        ]
    }
    
    def __init__(self, embedding_model_name="ai-forever/sbert_large_nlu_ru"):
        self.embedding_model_name = embedding_model_name
        self.embedding_model = SentenceTransformer(embedding_model_name)
        self.morph = MorphAnalyzer()
        
        print(f"Инициализирован TopicClassifier с моделью: {embedding_model_name}")
    
    def lemmatize_word(self, word):
        parsed = self.morph.parse(word.lower())[0]
        return parsed.normal_form
    
    def classify(self, review, return_multiple=True, min_score=2):
        review_lower = review.lower()
        review_words = set([self.lemmatize_word(word) for word in re.findall(r'\b[а-яё]+\b', review_lower)])
        
        category_scores = {}
        
        for category, keywords in self.TOPIC_CATEGORIES.items():
            score = 0
            lemmatized_keywords = set([self.lemmatize_word(kw) for kw in keywords])
            
            matches = review_words.intersection(lemmatized_keywords)
            score = len(matches)
            
            for keyword in keywords:
                if len(keyword.split()) > 1 and keyword in review_lower:
                    score += 2
            
            category_scores[category] = score
        
        max_score = max(category_scores.values()) if category_scores.values() else 0
        
        if return_multiple and max_score > 0:
            relevant_categories = [
                cat for cat, score in category_scores.items() 
                if score >= min_score or (max_score > 0 and score >= max_score * 0.5)
            ]
            
            if relevant_categories:
                relevant_categories.sort(key=lambda x: category_scores[x], reverse=True)
                return relevant_categories
            
            if max_score > 0:
                return [max(category_scores.items(), key=lambda x: x[1])[0]]
        
        if max_score > 0:
            top_categories = [cat for cat, score in category_scores.items() if score == max_score]
            
            if len(top_categories) > 1:
                category_descriptions = {
                    "Еда": "вкусная еда, блюда, кухня, порции, хинкали, хачапури, шашлык, салаты",
                    "Обслуживание": "официанты, сервис, скорость обслуживания, персонал, заказ",
                    "Атмосфера и интерьер": "атмосфера ресторана, интерьер, музыка, уют, место",
                    "Цена": "цены, стоимость, соотношение цены и качества, порции"
                }
                
                review_embedding = self.embedding_model.encode([review], show_progress_bar=False)[0]
                max_similarity = -1
                best_category = top_categories[0]
                
                for category in top_categories:
                    desc_embedding = self.embedding_model.encode([category_descriptions[category]], show_progress_bar=False)[0]
                    similarity = np.dot(review_embedding, desc_embedding) / (
                        np.linalg.norm(review_embedding) * np.linalg.norm(desc_embedding)
                    )
                    if similarity > max_similarity:
                        max_similarity = similarity
                        best_category = category
                
                return [best_category] if return_multiple else best_category
            
                return top_categories if return_multiple else top_categories[0]
        
        category_descriptions = {
            "Еда": "вкусная еда, блюда, кухня, порции, хинкали, хачапури, шашлык, салаты",
            "Обслуживание": "официанты, сервис, скорость обслуживания, персонал, заказ",
            "Атмосфера и интерьер": "атмосфера ресторана, интерьер, музыка, уют, место",
            "Цена": "цены, стоимость, соотношение цены и качества, порции"
        }
        
        review_embedding = self.embedding_model.encode([review], show_progress_bar=False)[0]
        max_similarity = -1
        best_category = "Еда"
        
        for category, description in category_descriptions.items():
            desc_embedding = self.embedding_model.encode([description], show_progress_bar=False)[0]
            similarity = np.dot(review_embedding, desc_embedding) / (
                np.linalg.norm(review_embedding) * np.linalg.norm(desc_embedding)
            )
            if similarity > max_similarity:
                max_similarity = similarity
                best_category = category
        
        return [best_category] if return_multiple else best_category
    
    def classify_batch(self, reviews, return_multiple=True, min_score=2, show_progress=True):
        topics = []
        iterator = tqdm(reviews, desc="Классификация") if show_progress else reviews
        
        for review in iterator:
            topic_list = self.classify(review, return_multiple=return_multiple, min_score=min_score)
            topic_str = ", ".join(topic_list) if isinstance(topic_list, list) else topic_list
            topics.append(topic_str)
        
        return topics
    
    def get_statistics(self, topics):
        topic_counts = Counter()
        for topic_str in topics:
            topic_list = [t.strip() for t in topic_str.split(",")]
            for topic in topic_list:
                topic_counts[topic] += 1
        return topic_counts

