# Hybrid Retrieval RAG Chatbot with Conversation Memory

Retrieval-augmented generation systems often fail in one of two ways: pure semantic search misses exact keyword matches, while pure keyword search misses paraphrased intent. Long conversations further degrade quality when the full history is naively stuffed into the prompt.

This project implements a RAG chatbot that combines dense and sparse retrieval, maintains conversation state intelligently, and uses a fast hosted LLM for generation.


## Problem Statement

Standard RAG pipelines rely on a single retrieval method. Dense vector search captures semantic similarity but can overlook precise term matches. BM25 captures exact terms but struggles with paraphrase and conceptual queries. In multi-turn dialogue the problem compounds: either the system forgets earlier context or it overflows the context window with unfiltered history.

The engineering task was to build a practical chatbot that uploads heterogeneous documents, indexes them with hybrid retrieval, and sustains coherent multi-turn conversations without excessive token cost or loss of relevant context.


## Project Overview

Astra RAG Chatbot accepts document uploads (PDF, DOCX, TXT, MD, HTML, JSON), builds a hybrid index, and supports multi-turn question answering grounded in those documents.

Key capabilities:

- Hybrid retrieval combining FAISS (semantic) and BM25 (keyword)
- Conversation memory with automatic summarization of older turns
- Generation via Groq-hosted Llama 3.3 70B
- Local embeddings via Sentence Transformers
- FastAPI backend and a simple web interface

The system is designed for interactive document Q&A rather than open-ended chat.


## System Architecture

```
Document Upload (PDF / DOCX / TXT / MD / HTML / JSON)
      │
      ▼
Text extraction + chunking
      │
      ▼
Embedding (Sentence Transformers) ──→ FAISS index
      │
      └──→ BM25 index
      │
      ▼
User query + conversation state
      │
      ├── Hybrid retrieval (FAISS + BM25 fusion)
      │
      ├── Memory management (recent turns + summary of older turns)
      │
      ▼
Prompt construction
      │
      ▼
Groq Llama 3.3 70B
      │
      ▼
Response + updated conversation memory
```

Retrieval and memory are treated as first-class components rather than afterthoughts.


## Technology Stack and Design Decisions

**FastAPI** provides the API layer. Typed endpoints, automatic documentation, and async support made it a natural fit for an interactive chat service that also handles file uploads and ingestion.

**FAISS** stores dense embeddings for semantic search. It is lightweight, fast for moderate document collections, and requires no external vector database for this scale.

**BM25** supplies sparse, keyword-oriented retrieval. Combining it with FAISS addresses the complementary failure modes of each method alone. Results from both are fused before being passed to the generator.

**Sentence Transformers** generate the dense embeddings locally. This keeps embedding latency predictable and avoids an additional API dependency for the retrieval stage.

**Groq + Llama 3.3 70B** handles generation. Groq’s inference speed makes multi-turn interaction feel responsive; the 70B model provides stronger reasoning and instruction following than smaller local alternatives while remaining accessible via API.

**LangChain** is used selectively for document loading, text splitting, and some retrieval utilities. The overall control flow remains explicit rather than fully agent-framework driven.


## Implementation Details

### Ingestion
Uploaded files are parsed according to type, split into overlapping chunks, embedded, and added to both the FAISS and BM25 indexes. Ingestion is exposed as a distinct API step so that indexing cost is paid once rather than on every query.

### Hybrid Retrieval
For each query the system runs both dense and sparse retrieval, then merges and re-ranks the candidate chunks. This hybrid step is the primary mechanism for improving recall across different query styles.

### Conversation Memory
Recent turns are kept in full. Older turns are periodically summarized so that long conversations remain within practical context limits while still preserving important earlier information. The memory state is updated after each exchange.

### Chat Endpoint
The `/api/chat` endpoint receives the user message, retrieves relevant chunks, assembles the prompt with memory and retrieved context, calls the LLM, and returns the answer while updating conversation state. Additional endpoints support upload, ingestion, status checks, and memory clearing.


## Challenges and Trade-offs

Hybrid retrieval requires careful fusion. Naïve concatenation of FAISS and BM25 results can surface redundant or low-quality chunks. Simple rank fusion and deduplication were necessary to keep the context clean.

Conversation summarization introduces its own latency and potential information loss. Summarizing too aggressively discards useful detail; summarizing too rarely lets the context window grow without bound. The current design keeps a window of recent full turns and summarizes the tail.

Document parsing quality varies across formats. PDFs with complex layouts and scanned content remain difficult; the system relies on standard text extraction and does not include OCR.

Prompt construction must balance retrieved context, conversation history, and system instructions without exceeding model limits. Token budgeting and truncation logic were required.


## Results

The hybrid retrieval approach improves robustness across keyword-heavy and paraphrase-heavy queries compared with either method alone. Conversation memory allows multi-turn follow-ups that remain grounded in both the documents and earlier dialogue. Generation latency via Groq remains low enough for interactive use.

Overall quality is bounded by chunking strategy, embedding model, and the underlying LLM. The architecture itself is modular enough that stronger embedding or generation models can be substituted.


## Lessons Learned

Hybrid retrieval is worth the extra implementation cost when queries are diverse. Relying on a single retrieval mode creates predictable blind spots.

Memory management is not optional for multi-turn RAG. Without explicit summarization or truncation, either context overflows or earlier relevant turns are silently dropped.

Separating ingestion from querying keeps interactive latency acceptable. Re-indexing on every request is a common source of perceived sluggishness in early RAG prototypes.

Fast hosted inference (Groq) changes the usability calculus. A stronger model that responds quickly is often more practical than a weaker local model that forces the user to wait.


## Limitations

The system is designed for moderate document collections and interactive sessions. It does not currently support multi-user isolation, persistent per-user indexes, or large-scale corpus management. Retrieval quality depends on chunking parameters and the chosen embedding model. Complex or scanned PDFs may yield incomplete text. There is no formal evaluation suite beyond manual inspection of answer groundedness.


## Future Improvements

- Persistent multi-user document stores
- Improved PDF parsing and optional OCR
- Learned fusion or re-ranking of hybrid results
- Streaming responses
- Evaluation harness for retrieval and answer quality
- Optional local LLM fallback


## Conclusion

Effective RAG is less about any single model and more about the retrieval and memory architecture that feeds it. By combining dense and sparse search and managing conversation state explicitly, the system produces more reliable, context-aware answers than a naïve vector-only pipeline.

The result is a practical document chatbot whose behavior remains inspectable and whose components can be improved independently.
