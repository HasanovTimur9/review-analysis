from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import numpy as np
import re
from collections import Counter


class SentimentAnalyzer:
    
    POSITIVE_KEYWORDS = [
        "отличн", "прекрасн", "вкусн", "понравил", "рекоменд", "хорош", 
        "уютн", "приятн", "дружелюбн", "вежлив", "быстро", "качественно",
        "божественн", "супер", "отменн", "замечательн", "восхитительн",
        "обязательно вернусь", "обязательно приду", "приходим", "придём"
    ]
    
    NEGATIVE_KEYWORDS = [
        "ужасн", "плох", "не понравил", "разочаров", "холодн", 
        "пересол", "медленн", "долго", "громк", "шумн", "тесно", "грязн",
        "неприятн", "сырым", "жестк", "сух", "хромает", "слабая",
        "недовол", "неуважен", "недружелюбн", "перепута", "безвкусн",
        "не подошёл", "не подошел"
    ]
    
    def __init__(self, model_name="blanchefort/rubert-base-cased-sentiment"):
        self.model_name = model_name
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        self.labels_map = ["negative", "neutral", "positive"]
        
        self.confidence_threshold = 0.15
        self.min_prob_threshold = 0.40
        
        print(f"Инициализирован SentimentAnalyzer с моделью: {model_name}")
    
    def split_into_sentences(self, text):
        sentences = re.split(r'[.!?…]+', text)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 3]
        return sentences if sentences else [text]
    
    def get_keyword_sentiment(self, text):
        text_lower = text.lower()
        positive_count = sum(1 for keyword in self.POSITIVE_KEYWORDS if keyword in text_lower)
        negative_count = sum(1 for keyword in self.NEGATIVE_KEYWORDS if keyword in text_lower)
        
        if positive_count > negative_count * 1.5:
            return "positive"
        elif negative_count > positive_count * 1.5:
            return "negative"
        else:
            return None
    
    def analyze_sentiment_sentence(self, text):
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        outputs = self.model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)[0].detach().numpy()
        
        neg_prob, neu_prob, pos_prob = probs
        max_idx = np.argmax(probs)
        max_prob = probs[max_idx]
        
        if max_prob < self.min_prob_threshold:
            return "neutral", probs
        
        sorted_probs = sorted(probs, reverse=True)
        if sorted_probs[0] - sorted_probs[1] < self.confidence_threshold:
            if pos_prob > 0.35 or neg_prob > 0.35:
                if abs(pos_prob - neg_prob) > 0.10:
                    return ("positive" if pos_prob > neg_prob else "negative"), probs
            return "neutral", probs
        
        return self.labels_map[max_idx], probs
    
    def analyze(self, text):
        sentences = self.split_into_sentences(text)
        
        if len(sentences) <= 1:
            sentiment, probs = self.analyze_sentiment_sentence(text)
        else:
            sentence_scores = {"positive": [], "negative": [], "neutral": []}
            
            for sentence in sentences:
                sent, probs = self.analyze_sentiment_sentence(sentence)
                sentence_scores["positive"].append(probs[2])
                sentence_scores["negative"].append(probs[0])
                sentence_scores["neutral"].append(probs[1])
            
            avg_pos = np.mean(sentence_scores["positive"])
            avg_neg = np.mean(sentence_scores["negative"])
            avg_neu = np.mean(sentence_scores["neutral"])
            
            if avg_pos > avg_neg + 0.15 and avg_pos > avg_neu:
                sentiment = "positive"
            elif avg_neg > avg_pos + 0.15 and avg_neg > avg_neu:
                sentiment = "negative"
            elif abs(avg_pos - avg_neg) < 0.20 and (avg_pos > 0.25 or avg_neg > 0.25):
                sentiment = "positive" if avg_pos > avg_neg else "negative"
            else:
                sentiment = "neutral"
        
        text_lower = text.lower()
        
        strong_negative_phrases = [
            "ужасное обслуживание", "ужасный", "ужасная", "никто не подошёл",
            "разочарован", "не понравилось", "не понравился", "не понравилась",
            "недовольными", "недоволен"
        ]
        
        strong_positive_phrases = [
            "божественн", "супер", "отменн", "прекрасн", "обязательно приду",
            "обязательно вернусь", "рекомендую", "рекомендую попробовать",
            "очень понравил", "очень вкусн", "отличное место", "отличный ресторан"
        ]
        
        has_strong_negative = any(phrase in text_lower for phrase in strong_negative_phrases)
        has_strong_positive = any(phrase in text_lower for phrase in strong_positive_phrases)
        
        if has_strong_negative and sentiment != "negative":
            sentiment = "negative"
        elif has_strong_positive and sentiment not in ["positive"]:
            if sentiment == "negative" or (sentiment == "neutral" and not has_strong_negative):
                sentiment = "positive"
        
        if sentiment == "neutral":
            keyword_sentiment = self.get_keyword_sentiment(text)
            if keyword_sentiment:
                sentiment = keyword_sentiment
        
        return sentiment
    
    def analyze_batch(self, texts):
        return [self.analyze(text) for text in texts]
    
    def get_statistics(self, sentiments):
        return Counter(sentiments)

