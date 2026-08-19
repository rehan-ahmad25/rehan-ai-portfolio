// Post metadata. The long-form article body for each post lives as a real
// .md file under src/content/blog/<id>.md, imported via Vite's `?raw`
// suffix in BlogPost.jsx / BlogList.jsx — keeping the writing in plain
// markdown (not JS template strings) so it's portable and easy to edit.
const blogs = [
  {
    id: "training-my-own-llm",
    title: "How I Built AstraGPT: My Own 15M Parameter Language Model",
    excerpt:
      "A behind-the-scenes look at designing, training, and optimizing my own transformer-based language model from scratch using PyTorch—from tokenization to text generation.",
    tag: "LLMs",
    color: "#4C8DFF",
    date: "July 2026",
    readTime: "12 min read",
    cover: "/blogs/astra.png",
    relatedProject: "astragpt",
    githubUrl: "https://github.com/rehan-ahmad25/AstraGPT",
  },
  {
    id: "production-rag-platform",
    title: "Building a Production-Grade RAG Platform",
    excerpt:
      "Hybrid retrieval, conversation memory, and source citations — how Astra RAG went from a notebook prototype to something that could actually be trusted with real documents.",
    tag: "RAG",
    color: "#5EEAD4",
    date: "August 2026",
    readTime: "11 min read",
    cover: "/blogs/rag.png",
    relatedProject: "astra-rag",
    githubUrl: "https://github.com/rehan-ahmad25/astra-rag-chatbot",
  },
  {
    id: "realtime-voice-ai",
    title: "Engineering Real-Time Voice AI for Intelligent Receptionists",
    excerpt:
      "Speech recognition, function calling, and a latency budget measured in milliseconds — building a voice agent that can actually hold a phone call.",
    tag: "Voice AI",
    color: "#A78BFA",
    date: "July 2026",
    readTime: "9 min read",
    cover: "/blogs/voice.png",
    relatedProject: "astra-voice",
    githubUrl: "https://github.com/rehan-ahmad25/Astra-voice-receptionist",
  },
  {
    id: "ai-crime-analyzer",
    title: "Building an Intelligent Crime Analyzer with Computer Vision",
    excerpt:
      "YOLOv8, Whisper, and a unified investigator dashboard — a multi-modal pipeline for analyzing surveillance footage at scale.",
    tag: "Computer Vision",
    color: "#4C8DFF",
    date: "July 2026",
    readTime: "10 min read",
    cover: "/blogs/crime.png",
    relatedProject: "crime-analyzer",
    githubUrl: "https://github.com/rehan-ahmad25/AI-Powered-Crime-Analyzer",
  },
  {
    id: "eyepilot-eye-tracking",
    title: "Building EyePilot: An AI-Powered Eye Tracking System",
    excerpt:
      "Gaze estimation, blink detection, and cursor control — turning MediaPipe's face mesh into a hands-free way to use a computer.",
    tag: "Computer Vision",
    color: "#7FA9FF",
    date: "July 2026",
    readTime: "8 min read",
    cover: "/blogs/eyepilot.png",
    relatedProject: "eyepilot",
    githubUrl: "https://github.com/rehan-ahmad25/EyePilotAI",
  },
  {
  id: "eye-disease-detection",
  title: "Two-Stage Retinal Disease Detection with Input Validation",
  excerpt:
    "A classifier that only runs on real fundus images — using a lightweight validator before EfficientNet-B0 so the system rejects selfies and screenshots instead of inventing diagnoses.",
  tag: "Healthcare AI",
  color: "#FF7A8A",
  date: "May 2026",
  readTime: "9 min read",
  cover: "/blogs/eye.png",
  relatedProject: "eye-disease",
  githubUrl: "https://github.com/rehan-ahmad25/eye-disease-detection-ai",
},
  {
    id: "explainable-brain-tumor-classification",
    title: "Building Explainable Brain Tumor Classification with Deep Learning",
    excerpt:
      "A CNN classifier is only half the job in healthcare AI — Grad-CAM and confidence calibration are what make a prediction worth trusting.",
    tag: "Healthcare AI",
    color: "#FF7A8A",
    date: "July 2026",
    readTime: "10 min read",
    cover: "/blogs/brain.png",
    relatedProject: "brain-tumor",
    githubUrl:
      "https://github.com/rehan-ahmad25/explainable-brain-tumor-classification",
  },
  {
    id: "echoself-digital-twin",
    title: "Building EchoSelf: An AI Digital Twin from Conversations",
    excerpt:
      "No fine-tuning required — how retrieval and memory alone can make a model sound like a specific person, and where that idea gets ethically uncomfortable.",
    tag: "Generative AI",
    color: "#8B7CF6",
    date: "July 2026",
    readTime: "9 min read",
    cover: "/blogs/echo.png",
    relatedProject: "echoself",
    githubUrl: "https://github.com/rehan-ahmad25/EchoSelf",
  },
  {
    id: "cryptopulse-anomaly-detection",
    title: "Detecting Cryptocurrency Pump-and-Dump Schemes with AI",
    excerpt:
      "Statistical baselines, anomaly detection, and graph mining — a layered approach to spotting manipulated markets before the crowd notices.",
    tag: "Machine Learning",
    color: "#F2B559",
    date: "April 2026",
    readTime: "10 min read",
    cover: "/blogs/crypto.png",
    relatedProject: "crypto-pulse",
    githubUrl: "https://github.com/rehan-ahmad25/crypto-pump-detection-system",
  },
];

export default blogs;
