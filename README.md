# 🏪 SmartStore AI

> Built for small and medium retail businesses across India 
> who are tired of managing inventory through spreadsheets 
> and chasing suppliers manually.

---

## The Problem I Solved

Meet Raj. He owns a mid-size grocery distribution business. 
Every week his team spends 10+ hours manually checking stock 
levels and sending purchase order emails to 20+ suppliers.

SmartStore AI gives Raj one intelligent dashboard to run 
his entire business — with an AI assistant he can actually 
talk to.

---

## What's Built

### ✅ Module A — Inventory Dashboard
Live inventory view with color-coded stock health:
- 🟢 Green = Stock is healthy
- 🟡 Amber = Getting low, reorder soon
- 🔴 Red = Critical, immediate action needed

### ✅ Module B — Supplier & Purchase Orders
Manage vendor directory and track all purchase orders 
with status badges — Sent, Received, Pending.

### ✅ Module C — AI Store Assistant
Ask your store questions in plain English:
- *"Which products are low on stock?"*
- *"Who are our suppliers?"*
- *"What is the status of PO001?"*

The AI uses RAG (Retrieval Augmented Generation) — it 
searches actual store data before answering. 
No hallucinations, no made-up numbers.

---

## How It Works — Architecture
React Frontend (Port 3000)
│
│  HTTP POST /api/chat
▼
FastAPI Backend (Port 8000)
│
▼
RAG Pipeline
├── HuggingFace Embeddings
│   └── all-MiniLM-L6-v2 (runs locally, no API key)
├── FAISS Vector Store (local index)
└── Similarity Search → Answer Generation

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js + Tailwind CSS |
| Backend | FastAPI + Uvicorn |
| AI/RAG | LangChain + FAISS |
| Embeddings | HuggingFace all-MiniLM-L6-v2 |
| HTTP Client | Axios |

> No external AI API key required — 
> embeddings run fully locally!

---

## Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+

### Step 1 — Clone
```bash
git clone https://github.com/yourusername/smartstore-ai.git
cd smartstore-ai
```

### Step 2 — Install Python packages
```bash
pip install -r requirements.txt
```

### Step 3 — Terminal 1 (Backend)
```bash
C:\Python313\python.exe -m uvicorn main:app --reload
```
Runs at → http://localhost:8000

### Step 4 — Terminal 2 (Frontend)
```bash
cd frontend
npm install
npm start
```
Runs at → http://localhost:3000

---

## Project Structure
smartstore-ai/
├── main.py           # FastAPI server
├── rag/
│   ├── loader.py     # Data → Chunks → FAISS
│   └── retriever.py  # Question → Answer
├── frontend/
│   └── src/
│       └── App.js    # React UI
└── requirements.txt

## Try These Questions
"Which products are low on stock?"
"Tell me about our suppliers"
"What is the status of PO001?"
"How many products do we have?"


---

## Known Limitations

| Feature | Status | Reason |
|---------|--------|--------|
| PostgreSQL | ❌ Mock data | Time constraint |
| JWT Auth | ❌ Not built | Time constraint |
| Invoice OCR | ❌ Not built | Time constraint |
| Demand Forecast | ❌ Not built | Time constraint |
| Docker | ❌ Not built | Time constraint |

---

## AI Disclosure

As permitted in task guidelines — AI tools used:
- **Claude AI** — Code suggestion & debugging

All code written and understood personally.
Happy to walk through every line in review call.