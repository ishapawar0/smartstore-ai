#from dotenv import load_dotenv
import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.schema import Document

#load_dotenv()

#GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
FAISS_INDEX_PATH = "rag/faiss_index"


def get_sample_documents():
    """
    Abhi ke liye sample store data manually define kar rahe hain.
    Baad mein yeh real PostgreSQL database se aayega.
    """
    sample_data = [
        "Product: Rice Basmati, SKU: RB001, Category: Grains, "
        "Stock: 50 units, Price: 120 per kg, Reorder threshold: 20 units",

        "Product: Wheat Flour, SKU: WF002, Category: Grains, "
        "Stock: 10 units, Price: 45 per kg, Reorder threshold: 25 units",

        "Product: Sunflower Oil, SKU: SO003, Category: Oils, "
        "Stock: 5 units, Price: 180 per litre, Reorder threshold: 15 units",

        "Supplier: Raj Traders, Email: raj@traders.com, "
        "Categories: Grains, Oils, Lead time: 3 days",

        "Supplier: Fresh Farm Co, Email: fresh@farm.com, "
        "Categories: Dairy, Vegetables, Lead time: 1 day",

        "Purchase Order: PO001, Supplier: Raj Traders, "
        "Status: Sent, Items: Rice Basmati x100, Total: 12000",

        "Purchase Order: PO002, Supplier: Fresh Farm Co, "
        "Status: Draft, Items: Milk x50, Total: 2500",
    ]

    documents = []
    for i, text in enumerate(sample_data):
        doc = Document(
            page_content=text,
            metadata={"source": "store_data", "id": i}
        )
        documents.append(doc)

    print(f"[Loader] {len(documents)} sample documents ready")
    return documents



def split_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
        separators=["\n\n", "\n", ".", " ", ""],
    )
    chunks = splitter.split_documents(documents)
    print(f"[Splitter] {len(chunks)} chunks ready")
    return chunks


def build_vector_store(chunks):
    print("[Embeddings] Generating embeddings...")

    embeddings = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2"
    )

    vector_store = FAISS.from_documents(chunks, embeddings)
    vector_store.save_local(FAISS_INDEX_PATH)

    print("[FAISS] Vector store saved!")
    return vector_store

def load_vector_store():
    embeddings = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2"
    )

    vector_store = FAISS.load_local(
        FAISS_INDEX_PATH,
        embeddings,
        allow_dangerous_deserialization=True,
    )

    print("[FAISS] Existing vector store loaded!")
    return vector_store

#main function
def get_or_build_vector_store():
    if os.path.exists(FAISS_INDEX_PATH):
        return load_vector_store()
    else:
        docs = get_sample_documents()
        chunks = split_documents(docs)
        return build_vector_store(chunks)


# test
if __name__ == "__main__":
    vs = get_or_build_vector_store()

    # Test query
    results = vs.similarity_search("which products are low on stock?", k=3)
    print("\n--- Search Results ---")
    for i, doc in enumerate(results):
        print(f"\nResult {i+1}: {doc.page_content}")