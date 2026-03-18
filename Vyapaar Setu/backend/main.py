from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from ai_services.search import semantic_search_fallback
from ai_services.ranking import rank_vendors
from ai_services.generator import generate_product_description
from ai_services.sentiment import analyze_review_sentiment

app = FastAPI(title="VyapaarSetu AI Backend")

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schemas ---
class Vendor(BaseModel):
    id: int
    name: str
    category: str
    distance: str
    rating: float
    reviews: int
    img: str

class ProductDescriptionRequest(BaseModel):
    product_name: str
    keywords: Optional[str] = None

class SearchQuery(BaseModel):
    query: str

# --- Mock Data ---
MOCK_VENDORS = [
    {"id": 1, "name": "The Crusty Loaf Bakery", "category": "Food & Groceries", "distance": "0.8 km", "rating": 4.9, "reviews": 124, "img": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=60"},
    {"id": 2, "name": "QuickFix Electricals", "category": "Home Services", "distance": "1.2 km", "rating": 4.7, "reviews": 89, "img": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=60"},
    {"id": 3, "name": "Fresh Farms Produce", "category": "Food & Groceries", "distance": "2.1 km", "rating": 4.8, "reviews": 312, "img": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=60"}
]

# --- Routes ---

@app.get("/")
def read_root():
    return {"message": "VyapaarSetu AI Backend is running."}

@app.get("/api/vendors")
def get_vendors():
    """Return all local vendors for discovery dashboard Ranked by ML."""
    ranked = rank_vendors(MOCK_VENDORS)
    return ranked

@app.post("/api/ai/search")
def smart_search(query: SearchQuery):
    """
    NLP Smart Search.
    Uses semantic_search_fallback from ai_services/search.py
    """
    if not query.query.strip():
        return {"query": query.query, "results": rank_vendors(MOCK_VENDORS), "ai_note": "Showing all trending vendors."}
        
    results = semantic_search_fallback(query.query, MOCK_VENDORS)
    return {
        "query": query.query,
        "results": results,
        "ai_note": f"AI narrowed down to {len(results)} relevant vendor matches."
    }

@app.post("/api/ai/generate-description")
def generate_description(request: ProductDescriptionRequest):
    """
    LLM Product Description Generator.
    Uses generator.py
    """
    draft = generate_product_description(request.product_name)
    return {"draft_description": draft}

class ChatRequest(BaseModel):
    message: str

@app.post("/api/ai/chat")
def chat_with_ai(request: ChatRequest):
    """
    VyapaarSetu AI Chatbot.
    Simple logic for now, could be expanded to full RAG.
    """
    msg = request.message.lower()
    if "price" in msg or "cost" in msg:
        response = "Our marketplace features dynamic pricing. You can find the 'Starting From' rates on each vendor's card!"
    elif "delivery" in msg or "fast" in msg:
        response = "Many vendors offer ⚡ Hyper-Fast delivery (10-15 mins). Look for the lightning badge in the market!"
    elif "nearby" in msg or "location" in msg:
        response = "We use real-time GPS nodes to show vendors within your immediate vicinity. Accuracy is our priority."
    else:
        response = f"I'm analyzing your request about '{request.message}'. Our AI hub is currently indexing local trends to better assist you!"
    
    return {"reply": response, "sender": "bot"}
