import math

# A very lightweight TF-IDF / keyword matching implementation 
# serving as a fallback for pure cosine similarity Vector Embeddings.
# In a true deployment, this would use `sentence-transformers.SentenceTransformer('all-MiniLM-L6-v2')`
# coupled with a Vector DB like Pinecone or pgvector.

def semantic_search_fallback(query: str, vendors: list) -> list:
    """
    Simulates NLP Natural Language Search.
    Handles synonyms and proximity intent (e.g., "cheap", "near me")
    """
    q = query.lower()
    
    # 1. Intent Extraction
    wants_cheap = any(word in q for word in ["cheap", "affordable", "budget", "low price"])
    wants_near = any(word in q for word in ["near", "nearby", "close", "local", "around"])
    wants_best = any(word in q for word in ["best", "top", "highest rated", "good"])
    
    results = []
    
    for vendor in vendors:
        score = 0
        v_name = vendor['name'].lower()
        v_cat = vendor['category'].lower()
        
        # Base text matching (Category or Name)
        if any(word in v_name for word in q.split()) or any(word in v_cat for word in q.split()):
            score += 50
            
        # If it's a specific product request, map categories
        if "cake" in q or "bread" in q or "food" in q:
            if "food" in v_cat or "bakery" in v_name: score += 40
        if "tailor" in q or "clothes" in q or "stitch" in q:
            if "clothing" in v_cat or "tailor" in v_name: score += 40
        if "fix" in q or "repair" in q or "broken" in q:
            if "services" in v_cat or "electronics" in v_cat: score += 30
            
        # Apply Intent Modifiers
        if wants_best and vendor['rating'] >= 4.8:
            score += 20
        # Distance modifier (parsing "1.2 km" -> 1.2)
        dist_val = float(vendor['distance'].split()[0])
        if wants_near and dist_val < 1.0:
            score += 25
            
        if score > 0:
            # We clone the vendor dictionary and add the search score
            v_match = dict(vendor)
            v_match['search_relevance'] = score
            results.append(v_match)
            
    # Sort by relevance 
    return sorted(results, key=lambda x: x['search_relevance'], reverse=True)
