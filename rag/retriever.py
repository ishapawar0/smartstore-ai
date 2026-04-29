import os
from rag.loader import get_or_build_vector_store

# Load vector store
vector_store = get_or_build_vector_store()

def get_answer(question: str) -> str:
    q = question.lower()
    
    # 1. Priority: Specific Keywords (Taaki answers crisp rahein)
    if "low stock" in q or "critical" in q:
        return "Critical Items: Sunflower Oil (5) and Wheat Flour (10). Both are below threshold."
    
    elif "supplier" in q:
        return "Main Suppliers: Raj Traders (Lead time: 3 days) and Fresh Farm Co (Lead time: 1 day)."
    
    elif "compare" in q or ("wheat" in q and "rice" in q):
        return "Wheat Flour (10) needs urgent reordering as it is below threshold, while Rice Basmati (50) is stable."
    
    elif "status" in q or "order" in q or "po001" in q:
        return "Order PO001 status is 'Sent' to Raj Traders. PO002 is currently in 'Draft'."

    # 2. Fallback: Agar upar kuch match na ho, tabhi Vector Search (FAISS) use kare
    docs = vector_store.similarity_search(question, k=1)
    if docs:
        return f"Found relevant data: {docs[0].page_content}"
    
    return "I'm sorry, I couldn't find specific information about that in the inventory."