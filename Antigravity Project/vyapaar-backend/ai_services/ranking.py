import math
from typing import List, Dict

def calculate_vendor_score(rating: float, reviews: int, response_time_hours: float, sentiment_score: float) -> float:
    """
    Weighted Ranking Algorithm for Vendors.
    
    Weights:
    - Rating (40%): Direct customer satisfaction
    - Volume (25%): Log-scaled number of reviews to reward experience without punishing new vendors too much
    - Sentiment (25%): NLP analysis of recent reviews (-1.0 to 1.0) normalized to 0-1
    - Responsiveness (10%): Faster response times get a higher score
    """
    
    # Normalize rating (0-5 to 0-1)
    norm_rating = rating / 5.0
    
    # Normalize volume (logarithmic, assuming 1000 reviews is "max" score for volume)
    norm_volume = min(math.log10(max(reviews, 1)) / 3.0, 1.0)
    
    # Normalize sentiment (-1 to 1  => 0 to 1)
    norm_sentiment = (sentiment_score + 1) / 2.0
    
    # Normalize responsiveness (assuming 0 hours is perfect, 48 hours is worst)
    norm_response = max(0, 48 - response_time_hours) / 48.0
    
    # Apply weights
    final_score = (
        (norm_rating * 0.40) +
        (norm_volume * 0.25) +
        (norm_sentiment * 0.25) +
        (norm_response * 0.10)
    )
    
    return round(final_score * 100, 2)

def rank_vendors(vendors: List[Dict]) -> List[Dict]:
    """Sorts a list of vendor dictionaries by their calculated ML score."""
    for vendor in vendors:
        # Mocking missing data parameters for the sake of the prototype
        sentiment = vendor.get('sentiment_score', 0.8) # Default highly positive
        response = vendor.get('response_time', 2.5) # Default 2.5 hours
        
        vendor['ml_score'] = calculate_vendor_score(
            rating=vendor['rating'],
            reviews=vendor['reviews'],
            response_time_hours=response,
            sentiment_score=sentiment
        )
        
    # Sort descending
    return sorted(vendors, key=lambda x: x['ml_score'], reverse=True)
