# Multi-Modal Crime Evidence Analysis Pipeline

Investigators still spend large amounts of time manually reviewing surveillance video and audio. The repetitive nature of the work, combined with attention fatigue, creates both efficiency and reliability problems.

This project builds a multi-modal analysis system that processes uploaded video and audio evidence, extracts structured signals from each modality, and presents them in a unified case report.


## Problem Statement

Manual review of hours of CCTV footage and associated audio is slow and error-prone. Existing commercial tools are often expensive or closed. Open-source demos usually address either vision or audio in isolation and rarely include the surrounding application concerns: authentication, case isolation, and report generation.

The engineering goal was a practical pipeline that combines weapon-oriented computer vision with speech analysis, while enforcing per-user case boundaries and producing inspectable outputs.


## Project Overview

The Crime Analyzer accepts video and/or audio uploads and runs two complementary analysis modules:

- Computer Vision: object detection (including a custom fine-tuned YOLOv8 weapon model), tracking, motion analysis, and keyframe extraction
- Natural Language Processing: Whisper transcription, keyword extraction, and sentiment analysis

Results are organized into a case timeline and report. The application includes user registration, email OTP verification, password recovery, and strict per-user case isolation.


## System Architecture

```
User (authenticated)
      │
      ▼
Case creation + media upload
      │
      ├── Video ──→ CV module (YOLOv8 + tracking + motion + keyframes)
      │
      └── Audio ──→ NLP module (Whisper + keywords + sentiment)
      │
      ▼
Analysis pipeline (orchestration)
      │
      ▼
Structured results stored per case
      │
      ▼
Case detail view (timeline, detections, transcript, report)
```

Vision and language modules can be selected independently. The pipeline records which modules ran and surfaces their outputs side by side.


## Technology Stack and Design Decisions

**YOLOv8** serves as the detection backbone. A custom fine-tuned checkpoint is used for weapon classes that are absent or poorly represented in the standard COCO set. This dual-model approach (general COCO detector + specialized weapon detector) improves coverage without requiring a single model to handle every class equally well.

**OpenAI Whisper** handles transcription. It was chosen for robustness across accents and recording conditions. The resulting text becomes the substrate for keyword and sentiment analysis.

**Flask + Flask-Login + Flask-Mail** provide the application and authentication layer. Email OTP verification and password reset flows were implemented to raise the security baseline beyond simple username/password forms.

**SQLite + SQLAlchemy** store users, cases, and analysis metadata. For a single-server demonstration this removes external dependencies while still supporting relational queries and per-user isolation.

**OpenCV** supports frame extraction, annotation, and basic motion analysis.


## Implementation Details

### Authentication
Registration requires email verification via OTP. Passwords are hashed. Sessions are managed by Flask-Login. Password recovery also uses OTP. All case routes are protected and filtered by the authenticated user ID so that one user cannot access another user’s evidence.

### Computer Vision Module
Video is sampled (not every frame) to keep runtime manageable. Frames are passed through the detection models. Bounding boxes, class labels, and confidence scores are recorded. Simple tracking and motion cues are derived across sampled frames. Representative keyframes are stored for the report.

### NLP Module
Audio is transcribed by Whisper. The transcript is scanned for relevant keywords and passed through a sentiment analysis stage. Timestamps allow alignment with the visual timeline when both modalities are present.

### Case Management
Each analysis run is attached to a case record. The frontend provides upload, progress, and a detail view that presents detections, transcript, timeline, and generated keyframes together.


## Challenges and Trade-offs

Weapon detection required a custom model because standard COCO weights do not cover firearms adequately. Training and integrating the second model added complexity but measurably improved relevant detections.

Processing full-resolution video at native frame rate is expensive. Frame sampling was introduced as a practical trade-off between coverage and runtime on available hardware.

Whisper transcription quality depends on audio conditions. Distant or noisy surveillance audio produces incomplete transcripts; the system surfaces the transcript rather than hiding low-confidence regions.

Authentication and case isolation added substantial application code relative to a pure model demo. These features are essential for any system that handles sensitive evidence, even at prototype scale.

Coordinating asynchronous analysis jobs (so the UI does not block) required careful status tracking and polling from the frontend.


## Results

The pipeline successfully processes uploaded video and audio, producing object detections (including weapons when present), transcripts, keyword lists, sentiment signals, and keyframe summaries. Authenticated users see only their own cases. The combined timeline view makes it possible to inspect visual and linguistic evidence in parallel.

Detection and transcription quality remain bounded by model capability and input quality; the system’s contribution is the integration and the surrounding case workflow.


## Lessons Learned

Multi-modal systems are only as useful as their alignment and presentation layers. Raw detections and raw transcripts become valuable when they can be examined together on a shared timeline.

Security and isolation requirements appear early when the domain involves evidence. Treating them as later additions creates rework.

Custom fine-tuning is sometimes necessary even when strong general models exist. Domain gaps (firearms in COCO) are real and must be measured rather than assumed away.

Operational concerns — job status, storage of intermediate artifacts, and graceful failure — dominate once the system moves beyond a notebook.


## Limitations

This is a prototype, not a forensic tool. The weapon model and Whisper transcription have not been validated on operational surveillance data. There is no formal chain-of-custody support. SQLite and the current authentication scheme are appropriate for demonstration and controlled testing only. Frame sampling necessarily trades temporal resolution for speed.


## Future Improvements

- Real-time or streaming analysis paths
- Stronger multi-object tracking
- Face-related analysis only where legally and ethically appropriate
- Migration to a production database and hardened authentication
- Cloud deployment with GPU workers for heavier workloads
- Richer reporting and export formats


## Conclusion

The core engineering problem was not any single model; it was the reliable combination of vision and language analysis inside a case-oriented application that respects user boundaries.

By treating detection, transcription, authentication, and reporting as equal parts of the system, the project produces inspectable multi-modal outputs rather than isolated model scores.
