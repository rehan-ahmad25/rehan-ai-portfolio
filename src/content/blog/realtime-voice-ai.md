# Designing a Voice AI Receptionist for Dental Clinics

Voice interfaces introduce constraints that text chatbots never face. Latency, turn-taking, tool reliability, and the cost of a misunderstood utterance all become first-class engineering concerns.

This project explores those constraints by building the backend for an AI receptionist that can book, reschedule, and cancel dental appointments through natural spoken conversation.


## Problem Statement

Small clinics still rely heavily on human receptionists for routine tasks: checking availability, booking appointments, answering questions about hours and services. These interactions are repetitive, high-volume, and interruptible.

Existing phone trees are rigid. General-purpose voice assistants lack domain-specific tools and database integration. The missing piece is a reliable backend that a voice agent can call during a live conversation to perform real clinic operations.


## Project Overview

Astra is a voice receptionist for a dental clinic. The voice layer is handled by Vapi. The system described here is the FastAPI backend that powers the agent’s tools.

The backend exposes endpoints for:

- Booking a new appointment
- Retrieving available time slots
- Cancelling an existing appointment
- Rescheduling an appointment
- Returning clinic hours, location, and list of services

When a caller speaks, Vapi manages speech recognition and synthesis. Whenever the conversation requires real data or a state change, Vapi invokes one of the tool endpoints.


## System Architecture

```
Caller
  │
  ▼
Vapi (speech-to-text, dialogue management, text-to-speech)
  │
  │  tool calls
  ▼
FastAPI Backend
  ├── Appointment routes  → service layer → SQLAlchemy → SQLite
  └── Clinic info routes  → static constants / simple lookups
  │
  ▼
Structured tool response returned to Vapi
  │
  ▼
Spoken reply to caller
```

All tool endpoints live under `/api/tools/` and accept the payload shapes Vapi may send. Responses are normalized into the format Vapi expects.


## Technology Stack and Design Decisions

**Vapi** was selected for the voice layer because it provides managed speech models, telephony integration, and a clean tool-calling interface. Building a comparable voice stack from scratch would have dominated the project timeline.

**FastAPI** provided automatic OpenAPI documentation, dependency injection for database sessions, and Pydantic validation with minimal boilerplate. These features matter when the same endpoints must be both reliable under voice latency constraints and easy to inspect during development.

**SQLAlchemy** (core style) was used instead of a full Flask-SQLAlchemy or Django ORM. The data model is simple (primarily an Appointment table), so a lightweight approach reduced ceremony while still giving transactional control.

**SQLite** was sufficient for development and demonstration. It requires zero external services and is created automatically on first run. The code is structured so the database URL can later point to PostgreSQL without rewriting the query layer.

**ngrok** was used during local testing so Vapi could reach the development server. This introduced operational friction (changing URLs on every restart) that would disappear in a proper deployment.


## Implementation Details

### Tool Contract
Each Vapi tool maps to a single POST endpoint. The backend accepts both the nested Vapi envelope and a flat argument payload. A small helper normalizes the incoming data so the route handlers stay clean.

### Appointment Logic
Booking, cancellation, and rescheduling all follow the same pattern:

1. Validate phone number, date (YYYY-MM-DD), and time (12-hour format with AM/PM)
2. Check for conflicts against existing appointments
3. Perform the database write inside a transaction
4. Return a structured result that Vapi can speak

Available slots are currently drawn from a fixed daily template (09:00 AM, 10:30 AM, 02:00 PM, 04:00 PM). This simplified conflict checking and kept the first version predictable.

### Clinic Information
Hours, location, and services are stored as constants. These endpoints are essentially read-only lookups, which keeps latency low for common questions.

### Project Structure
Routes, services, schemas, database models, and utilities are separated. The separation made it possible to change validation rules or database logic without touching the Vapi-facing layer.


## Challenges and Trade-offs

Vapi’s request payload format was not always consistent. Early versions of the endpoints failed silently when the arguments arrived in an unexpected shape. Defensive parsing and explicit logging were required.

Voice latency is unforgiving. Any slow database query or unhandled exception surfaces as an awkward pause or a generic error spoken to the caller. This forced careful attention to validation order and error messages that could be spoken naturally.

The fixed slot template is a deliberate simplification. A production system would need configurable schedules, provider-specific calendars, and double-booking protection under concurrent load. Those requirements were deferred.

ngrok free-tier URLs change on every restart. During development this meant repeatedly updating tool configurations in the Vapi dashboard. The friction is acceptable for a prototype and disappears once the backend is deployed to a stable public URL.


## Results

The system successfully handles end-to-end voice conversations for the supported operations. Callers can book, reschedule, and cancel appointments; the corresponding rows appear in the SQLite database in real time. Basic clinic questions are answered without human intervention.

The conversation quality depends heavily on the tool descriptions provided to Vapi and on the clarity of the backend responses. Ambiguous tool definitions produce incorrect function calls; precise definitions produce reliable behavior.


## Lessons Learned

Tool design is as important as model capability. A voice agent is only as reliable as the functions it can call and the contracts those functions enforce.

Validation must happen early and produce messages that can be spoken. A stack trace is useless to a caller; a calm “that time is already taken, would you like 10:30 instead?” is useful.

Separating the voice platform from the business logic backend is the correct boundary. It allows the conversation layer and the clinic logic to evolve independently.

Operational concerns (stable URLs, authentication, concurrent writes) appear earlier than expected when the interface is a live phone call.


## Limitations

The current system is a prototype. Slot availability is limited to four fixed times per day. SQLite is not suitable for concurrent production traffic. Tool endpoints currently lack authentication. There is no multi-clinic or multi-provider support. All of these are acknowledged constraints of the present implementation.


## Future Improvements

- Replace SQLite with PostgreSQL
- Add API-key or request-signature verification on tool routes
- Support configurable clinic schedules and provider calendars
- Deploy to a permanent HTTPS endpoint
- Add basic analytics on call outcomes and tool usage

These changes move the system from demonstration to something a small clinic could actually trial.


## Conclusion

Voice agents expose the quality of backend engineering more quickly than text interfaces. Latency, error handling, and data consistency become audible.

This project demonstrates a clean separation between a managed voice platform and a purpose-built clinic backend, together with the practical trade-offs required to make the combination work under real conversational constraints.

**Repository:** [https://github.com/rehan-ahmad25/Astra-voice-receptionist](https://github.com/rehan-ahmad25/Astra-voice-receptionist)
