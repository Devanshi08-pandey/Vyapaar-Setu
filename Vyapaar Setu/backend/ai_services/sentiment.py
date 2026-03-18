try:
    from transformers import pipeline
    # Initialize the sentiment analysis pipeline using a lightweight DistilBERT model.
    # We use a try-except block so the backend doesn't crash if PyTorch/Transformers isn't installed.
    sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
    HAS_TRANSFORMERS = True
except ImportError:
    HAS_TRANSFORMERS = False

def analyze_review_sentiment(review_text: str) -> dict:
    """
    Analyzes a review string and returns a classification (Positive, Neutral, Negative)
    and a confidence score.
    """
    if not HAS_TRANSFORMERS:
        # Fallback keyword-based analysis if heavy dependencies aren't installed
        text = review_text.lower()
        if any(word in text for word in ['good', 'great', 'awesome', 'excellent', 'fast', 'fresh', 'love']):
            return {"label": "POSITIVE", "score": 0.88, "method": "fallback"}
        elif any(word in text for word in ['bad', 'terrible', 'late', 'cold', 'expensive']):
            return {"label": "NEGATIVE", "score": 0.92, "method": "fallback"}
        else:
            return {"label": "NEUTRAL", "score": 0.50, "method": "fallback"}

    # Actual ML Inference
    try:
        result = sentiment_analyzer(review_text)[0] # Returns dict like {'label': 'POSITIVE', 'score': 0.99}
        # We classify high confidence positive/negative, else neutral
        label = result['label']
        if result['score'] < 0.65:
            label = "NEUTRAL"
            
        return {
            "label": label,
            "score": round(result['score'], 4),
            "method": "huggingface_distilbert"
        }
    except Exception as e:
        return {"label": "NEUTRAL", "score": 0.0, "error": str(e)}
