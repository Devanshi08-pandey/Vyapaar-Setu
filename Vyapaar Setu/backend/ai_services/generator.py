import time

def generate_product_description(product_name: str, category: str = "Local") -> str:
    """
    Simulates an LLM API call (like OpenAI GPT-4 or Gemini) to generate
    high-converting, professional product descriptions for vendors.
    """
    
    # In reality:
    # response = openai.ChatCompletion.create(
    #    model="gpt-3.5-turbo",
    #    messages=[{"role": "user", "content": f"Write a 2 sentence product description selling {product_name}"}]
    # )
    # return response.choices[0].message.content
    
    time.sleep(1) # Simulate network latency for API call
    
    name_lower = product_name.lower()
    
    if "bread" in name_lower or "cake" in name_lower or "croissant" in name_lower:
        return f"Indulge in our freshly baked {product_name}, handcrafted daily using premium ingredients. The perfect blend of rich flavors and perfect textures to satisfy your cravings right here in the neighborhood."
        
    if "repair" in name_lower or "fix" in name_lower or "service" in name_lower:
        return f"Professional, reliable, and swift {product_name} services. Our expert technicians ensure top-quality results with a focus on durability and customer satisfaction, keeping your household running smoothly."
        
    if "dress" in name_lower or "tailor" in name_lower or "shirt" in name_lower:
        return f"Experience unparalleled craftsmanship with our custom {product_name}. Tailored to perfection, we combine high-quality fabrics with modern designs to give you a flawless fit for any occasion."
        
    # Generic fallback
    return f"Discover the exceptional quality of our {product_name}. Sourced and prepared with the utmost care, it stands as a testament to our commitment to delivering the best to our local community."
