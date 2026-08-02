const projects = [
  {
    id: "astragpt",
    index: "1",
    name: "AstraGPT",
    category: "LARGE LANGUAGE MODEL",
    tagline: "Custom GPT-style language model",
    description:
     "Built and trained a custom GPT-style language model from scratch using PyTorch, including tokenizer training, data preprocessing, model architecture, and text generation. Trained on hundreds of millions of tokens to explore the complete LLM development pipeline.",
    stack: ["PyTorch", "Transformers", "Python", "SentencePiece", "LLM"],
    image: "chat",
    screenshot: "/projects/astra.png",
    github: "https://github.com/rehan-ahmad25/AstraGPT",
    demo: "",
    year: "2025",
    color: "#4C8DFF",
  },
 {
  id: "astra-voice",
  index: "2",
  name: "Astra Voice Receptionist",
  category: "Voice AI",
  tagline: "Real-time AI voice receptionist",
  description:
    "Built a low-latency voice AI agent capable of handling phone conversations, booking appointments, answering FAQs, and transferring calls. Integrated Vapi with LLMs and function calling to enable real-time business workflows.",
  stack: [
    "Vapi",
    "Python",
    "LLMs",
    "Function Calling",
    "AI Agents"
  ],
  image: "voice",
  screenshot: "/projects/voice.png",
  github: "https://github.com/rehan-ahmad25/Astra-voice-receptionist",
  demo: "",
  year: "2025",
  color: "#7CE7E1",
},
{
  id: "astra-rag",
  index: "3",
  name: "Astra RAG Platform",
  category: "Large Language Models",
  tagline: "Enterprise Retrieval-Augmented Generation System",
  description:
    "A production-oriented RAG platform that enables users to upload documents, build a hybrid knowledge base, and chat with their data using grounded AI responses. Features hybrid retrieval (FAISS + BM25), conversation memory, automatic chat summarization, source citations with similarity scores, and support for multiple document formats.",
  stack: [
    "Python",
    "FastAPI",
    "LangChain",
    "FAISS",
    "BM25",
    "Groq Llama 3.3",
    "Sentence Transformers"
  ],
  image: "rag",
  screenshot: "/projects/rag.png",
  github: "https://github.com/rehan-ahmad25/astra-rag-chatbot",
  demo: "",
  year: "2025",
  color: "#5EEAD4",
},
 
{
  id: "brain-tumor",
  index: "4",
  name: "Explainable Brain Tumor Classification",
  category: "Computer Vision",
  tagline: "Interpretable brain tumor detection with AI",
  description:
    "A deep learning system for classifying brain MRI scans into multiple tumor categories with explainable AI. Integrated Grad-CAM visualizations to highlight the regions influencing model predictions, improving transparency and trust.",
  stack: [
    "PyTorch",
    "OpenCV",
    "Grad-CAM",
    "FastAPI",
    "CNN"
  ],
  image: "brain",
  screenshot: "/projects/brain.png",
  github: "https://github.com/rehan-ahmad25/explainable-brain-tumor-classification",
  demo: "",
  year: "2025",
  color: "#FF7A8A",
},
{
  id: "eye-disease",
  index: "5",
  name: "Eye Disease Detection AI",
  category: "Computer Vision",
  tagline: "AI-powered retinal disease classification",
  description:
    "A computer vision application for detecting retinal diseases from fundus images using deep learning. Developed an end-to-end pipeline for image preprocessing, disease classification, and confidence-based predictions to support early diagnosis.",
  stack: [
    "PyTorch",
    "OpenCV",
    "FastAPI",
    "CNN",
    "NumPy"
  ],
  image: "eye",
  screenshot: "/projects/eye.png",
  github: "https://github.com/rehan-ahmad25/eye-disease-detection-ai",
  demo: "",
  year: "2025",
  color: "#63D2FF",
},
{
  id: "echoself",
  index: "8",
  name: "EchoSelf",
  category: "Generative AI",
  tagline: "AI digital twin built from WhatsApp conversations",
  description:
    "An AI-powered digital twin that recreates a user's communication style from WhatsApp chat history. Leveraging Retrieval-Augmented Generation (RAG) and prompt engineering, it delivers context-aware responses that reflect the user's tone, vocabulary, and conversational patterns without training a custom model.",
  stack: [
    "Python",
    "LLMs",
    "RAG",
    "Prompt Engineering",
    "FastAPI"
  ],
  image: "chat",
  screenshot: "/projects/echoself.png",
  github: "https://github.com/rehan-ahmad25/EchoSelf",
  demo: "",
  year: "2025",
  color: "#8B7BFF",
},
 {
  id: "eyepilot",
  index: "6",
  name: "EyePilot AI",
  category: "Computer Vision",
  tagline: "Eye-controlled PC assistant",
  description:
    "A real-time computer vision application that enables hands-free computer control using eye gaze and blink detection. Built with MediaPipe Face Mesh for accurate iris tracking and intuitive cursor interaction.",
  stack: [
    "Python",
    "MediaPipe",
    "OpenCV",
    "PyAutoGUI",
    "PyQt6"
  ],
  image: "vision",
  screenshot: "/projects/eyemouse.png",
  github: "https://github.com/rehan-ahmad25/EyePilotAI",
  demo: "",
  year: "2025",
  color: "#7FA9FF",
},
  {
    id: "crime-analyzer",
    index: "7",
    name: "Crime Analyzer",
    category: "AI / Multi-modal",
    tagline: "Multi-modal AI forensic evidence analysis platform",
    description:
      "A full-stack forensic analysis platform that processes video and audio evidence together — a custom fine-tuned YOLOv8 model detects weapons in footage, while OpenAI Whisper transcribes spoken audio, surfacing both in a unified investigator dashboard. Built with 31 REST API endpoints and JWT + OTP-based authentication for secure access.",
    stack: ["Python", "Flask", "YOLOv8", "OpenAI Whisper", "JWT/OTP Auth"],
    image: "data",
    screenshot: "/projects/camera.png",
    github: "https://github.com/rehan-ahmad25/AI-Powered-Crime-Analyzer",
    demo: "",
    year: "2024",
    color: "#4C8DFF",
  },
  
{
  id: "crypto-pulse",
  index: "9",
  name: "CryptoPulse",
  category: "Machine Learning",
  tagline: "Real-time crypto market anomaly detection",
  description:
    "A real-time cryptocurrency monitoring system that detects abnormal market behavior using statistical analysis, machine learning, and graph-based mining techniques. Designed to identify potential pump-and-dump schemes through multi-layer anomaly detection and early warning signals.",
  stack: [
    "Python",
    "Scikit-learn",
    "Pandas",
    "NetworkX",
    "Plotly"
  ],
  image: "crypto",
  screenshot: "/projects/crypto-pulse.png",
  github: "https://github.com/rehan-ahmad25/crypto-pump-detection-system",
  demo: null,
  year: "2025",
  color: "#F7C948",
},

];

export default projects;
