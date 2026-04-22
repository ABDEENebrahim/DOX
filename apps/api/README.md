# JARVIS Health OS API

Express backend implementing:
- `/appointments`
- `/users`
- `/ai/trigger`
- `/whatsapp/webhook` (Meta Cloud API verification + receiver)
- `/payments/checkout-session` (country-aware pricing)
- `/payments/webhook` (Stripe signed events)
- `/voice/doctor-assistant` (Whisper + GPT + ElevenLabs pipeline)
- `/investor/metrics`
- `/activity/feed`
- `/activity/stream` (SSE)

Includes MongoDB models, JARVIS AI orchestrator + agents, Redis/BullMQ queues, and production-focused external integrations.
