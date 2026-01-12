# GenAI Stack – No-Code / Low-Code AI Workflow Builder

GenAI Stack is a full-stack web application that allows users to upload documents (PDFs) and chat with an AI assistant powered by LLMs. The project demonstrates document ingestion, persistence, and conversational AI with a clean, modular architecture.

This project is built as part of a Full-Stack Engineering assessment.

---

## ✨ Features

- Upload PDF documents
- Extract and store document content
- Chat with AI using document context
- Document history per stack
- Dockerized backend and database
- PostgreSQL for persistence
- ChromaDB integrated for vector storage (infrastructure-ready)
- Clean UI with sidebar and chat modal

---

## 🧱 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL

### LLM
- Groq (LLaMA 3.1)

### Vector Store
- ChromaDB (Dockerized, architecture-ready)

### DevOps
- Docker
- Docker Compose

---

## 🏗️ Architecture Overview

Frontend (React)
↓
Backend (Express)
↓
PostgreSQL (documents, history)
↓
LLM (Groq API)

ChromaDB runs as a vector database service and is integrated at the service layer
for future embedding-based retrieval.



---

## 📂 Project Structure

GenAI-stack/
├── backend/
│ ├── routes/
│ ├── services/
│ ├── db.js
│ └── index.js
├── frontend/
│ ├── components/
│ ├── pages/
│ └── App.jsx
├── docker-compose.yml
└── README.md



---

## 🐳 Running the Project (Docker)

### Prerequisites
- Docker
- Docker Compose

### 1️⃣ Clone the repository
```bash
git clone <your-repo-url>
cd GenAI-stack


2️⃣ Environment Variables

GROQ_API_KEY=your_groq_api_key

DB_HOST=postgres
DB_USER=postgres
DB_PASSWORD=134567
DB_NAME=genai_stack
DB_PORT=5432


3️⃣ Start the application

docker-compose up --build


This will start:

Backend → http://localhost:8000
PostgreSQL → port 5432
ChromaDB → port 8001

🗄️ Database Setup (First Run Only)

Connect to the PostgreSQL container:
docker exec -it genai-stack-postgres-1 psql -U postgres -d genai_stack


Create required table:

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  content TEXT,
  stack_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

🧠 ChromaDB Usage

ChromaDB is deployed as a Docker service and available inside Docker at:
http://chromadb:8000


🧪 How to Test

1.Create a stack
2.Upload a PDF
3.Verify document appears in history
4.Click Chat
5.Ask questions based on the uploaded PDF



📌 Notes

1.Authentication is intentionally omitted (single-user assumption for assessment)
2.Focus is on persistence, clean UX, and system design
3.Architecture is extensible for production use

🚀 Future Improvements

1.Chunked embeddings with similarity search
2.Multi-document context selection
3.User authentication
4.Streaming LLM responses


👤 Author
Ritik Jaykar
Full-Stack Engineer