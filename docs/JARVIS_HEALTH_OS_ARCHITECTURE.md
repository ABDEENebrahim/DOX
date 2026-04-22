# JARVIS HEALTH OS — Production-Grade Monorepo Architecture

## 1) Text-Based Architecture Diagram

```text
                               ┌──────────────────────────────────┐
                               │          Client Channels         │
                               │  WhatsApp | Voice Calls | Web    │
                               └───────────────┬──────────────────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    │                          │                          │
        ┌───────────▼───────────┐  ┌───────────▼───────────┐  ┌──────────▼──────────┐
        │ WhatsApp Bot Service  │  │  Voice AI Service     │  │  Dashboard (Next.js)│
        │(Webhook + Session Mgmt│  │(STT/TTS + Call Control│  │  Admin + Ops UI      │
        └───────────┬───────────┘  └───────────┬───────────┘  └──────────┬──────────┘
                    │                          │                          │
                    └───────────────┬──────────┴───────────────┬──────────┘
                                    │                          │
                           ┌────────▼──────────────────────────▼────────┐
                           │            API Service (Node.js)            │
                           │ Auth | RBAC | Patient | Appointment | Billing│
                           └────────┬──────────────────────────┬─────────┘
                                    │                          │
                          Sync CRUD │                          │ Async Commands
                                    │                          │
                       ┌────────────▼────────────┐    ┌────────▼─────────────────┐
                       │       MongoDB Atlas     │    │ Event Bus (SNS/SQS or    │
                       │  OLTP + Read Models     │    │ EventBridge + SQS queues)│
                       └────────────┬────────────┘    └────────┬─────────────────┘
                                    │                          │
                                    │                          │
                  ┌─────────────────▼─────────────┐  ┌─────────▼─────────────────┐
                  │      AI Core Orchestrator     │  │      Worker Queue System   │
                  │ Intent Router | Policy Engine │  │ Notifications | Reminders  │
                  │ Prompt Compiler | Context Mgmt│  │ Claims | Audit Projections │
                  └───────────────┬───────────────┘  └─────────┬─────────────────┘
                                  │                            │
                      ┌───────────▼────────────────────────────▼─────────────┐
                      │                  AI Agents Swarm                      │
                      │ triage-agent | scheduling-agent | adherence-agent     │
                      │ coding-agent | escalation-agent | summarization-agent │
                      └──────────────────────────┬────────────────────────────┘
                                                 │
                                         ┌───────▼─────────┐
                                         │ External Systems│
                                         │ EHR | Labs | SMS│
                                         │ Calendar | Email│
                                         └─────────────────┘
```

---

## 2) Monorepo Folder Structure

```text
jarvis-health-os/
├─ apps/
│  ├─ api/                          # Node.js backend API (REST/GraphQL)
│  │  ├─ src/
│  │  │  ├─ modules/
│  │  │  │  ├─ auth/
│  │  │  │  ├─ patients/
│  │  │  │  ├─ appointments/
│  │  │  │  ├─ providers/
│  │  │  │  ├─ care-plans/
│  │  │  │  ├─ billing/
│  │  │  │  ├─ integrations/
│  │  │  │  └─ audit/
│  │  │  ├─ middleware/
│  │  │  ├─ events/
│  │  │  ├─ dto/
│  │  │  └─ main.ts
│  │  ├─ test/
│  │  ├─ Dockerfile
│  │  └─ package.json
│  │
│  ├─ ai-core/                      # Orchestrator service
│  │  ├─ src/
│  │  │  ├─ orchestration/
│  │  │  ├─ policy/
│  │  │  ├─ memory/
│  │  │  ├─ prompting/
│  │  │  ├─ tool-registry/
│  │  │  ├─ event-handlers/
│  │  │  └─ main.ts
│  │  ├─ test/
│  │  ├─ Dockerfile
│  │  └─ package.json
│  │
│  ├─ ai-agents/                    # Swarm runtime
│  │  ├─ src/
│  │  │  ├─ agents/
│  │  │  │  ├─ triage-agent/
│  │  │  │  ├─ scheduling-agent/
│  │  │  │  ├─ adherence-agent/
│  │  │  │  ├─ coding-agent/
│  │  │  │  └─ escalation-agent/
│  │  │  ├─ coordinator/
│  │  │  ├─ guardrails/
│  │  │  ├─ tools/
│  │  │  └─ main.ts
│  │  ├─ test/
│  │  ├─ Dockerfile
│  │  └─ package.json
│  │
│  ├─ whatsapp-bot/
│  │  ├─ src/
│  │  │  ├─ webhooks/
│  │  │  ├─ session/
│  │  │  ├─ templates/
│  │  │  ├─ media/
│  │  │  └─ main.ts
│  │  ├─ test/
│  │  ├─ Dockerfile
│  │  └─ package.json
│  │
│  ├─ voice-ai/
│  │  ├─ src/
│  │  │  ├─ stt/
│  │  │  ├─ tts/
│  │  │  ├─ call-control/
│  │  │  ├─ realtime-session/
│  │  │  └─ main.ts
│  │  ├─ test/
│  │  ├─ Dockerfile
│  │  └─ package.json
│  │
│  ├─ dashboard/                    # Next.js application
│  │  ├─ src/
│  │  │  ├─ app/
│  │  │  ├─ components/
│  │  │  ├─ features/
│  │  │  ├─ lib/
│  │  │  └─ hooks/
│  │  ├─ public/
│  │  ├─ Dockerfile
│  │  └─ package.json
│  │
│  └─ workers/                      # Queue processors
│     ├─ src/
│     │  ├─ consumers/
│     │  ├─ jobs/
│     │  ├─ retry/
│     │  ├─ dlq/
│     │  └─ main.ts
│     ├─ test/
│     ├─ Dockerfile
│     └─ package.json
│
├─ packages/
│  ├─ shared-types/                 # DTOs, event contracts, enums
│  ├─ shared-config/                # env schema, lint, tsconfig presets
│  ├─ shared-logger/                # structured logging + tracing helpers
│  ├─ shared-auth/                  # JWT/OAuth helpers + RBAC
│  ├─ shared-events/                # outbox, publisher, consumer SDK
│  ├─ shared-db/                    # Mongo schemas, repository abstractions
│  ├─ shared-observability/         # metrics, tracing, health probes
│  └─ shared-ai/                    # prompt templates + safety policies
│
├─ infra/
│  ├─ docker/
│  │  ├─ docker-compose.local.yml
│  │  └─ base-images/
│  ├─ terraform/
│  │  ├─ modules/
│  │  │  ├─ networking/
│  │  │  ├─ ecs-fargate/
│  │  │  ├─ mongodb-atlas/
│  │  │  ├─ queues/
│  │  │  ├─ observability/
│  │  │  └─ secrets/
│  │  ├─ envs/
│  │  │  ├─ dev/
│  │  │  ├─ staging/
│  │  │  └─ prod/
│  │  └─ main.tf
│  ├─ k8s/                          # optional future migration target
│  └─ scripts/
│
├─ docs/
│  ├─ architecture/
│  ├─ adr/                          # architecture decision records
│  ├─ runbooks/
│  ├─ api-contracts/
│  └─ security/
│
├─ .github/
│  ├─ workflows/
│  │  ├─ ci.yml
│  │  ├─ cd-staging.yml
│  │  └─ cd-prod.yml
│  └─ CODEOWNERS
│
├─ tools/
│  ├─ eslint/
│  ├─ prettier/
│  ├─ tsconfig/
│  └─ scripts/
│
├─ package.json                     # workspace root
├─ pnpm-workspace.yaml
├─ turbo.json (or nx.json)
├─ .env.example
└─ README.md
```

---

## 3) Service Definitions

1. **API (Node.js)**
   - Unified domain API for patient, provider, appointment, billing, and admin workflows.
   - Enforces authN/authZ, input validation, and emits domain events via outbox.

2. **AI Core (Orchestrator)**
   - Receives intents from channels/API, resolves policy constraints, selects agent workflow.
   - Maintains short-term context and writes decision/audit artifacts.

3. **AI Agents (Swarm System)**
   - Specialized, independently deployable agents coordinated by a swarm coordinator.
   - Supports multi-agent planning, confidence scoring, and escalation-to-human policy.

4. **WhatsApp Bot**
   - Inbound/outbound WhatsApp integration (webhook receiver + template sender).
   - Normalizes messages/events and forwards requests to API/AI Core.

5. **Voice AI Service**
   - Real-time voice interactions: STT, TTS, call controls, interruption handling.
   - Emits transcript + intent events for orchestration.

6. **Dashboard (Next.js)**
   - Operational command center for clinicians and support teams.
   - Live event feed, patient timeline, queue visibility, intervention controls.

7. **Worker Queue System**
   - Async task execution for reminders, notifications, retries, document generation.
   - DLQ, idempotency, exponential backoff, and job replay support.

---

## 4) Event-Driven Data Flow

1. External interaction arrives via WhatsApp/Voice/Dashboard.
2. Channel service validates request and emits ingress event (`WHATSAPP_MESSAGE_RECEIVED`, `VOICE_TRANSCRIPT_READY`).
3. API stores command in MongoDB and writes event to outbox.
4. Outbox relays to event bus; consumers (AI Core, Workers, Dashboard stream) subscribe.
5. AI Core invokes swarm agents as needed and emits decision events (`TRIAGE_COMPLETED`, `ESCALATION_REQUIRED`).
6. Workers execute async side-effects (notifications, scheduling sync, billing checks).
7. Materialized read models are updated for dashboard queries.
8. Every critical action writes immutable audit events for compliance.

**Reliability patterns**
- Transactional outbox + idempotent consumers.
- Retry with DLQ and replay tooling.
- Correlation IDs and distributed tracing across all events.

---

## 5) MongoDB Schema Design (High-Level)

### Core Collections
- `patients`
  - `_id`, `mrn`, `demographics`, `contact`, `consents`, `risk_flags`, `created_at`, `updated_at`
- `providers`
  - `_id`, `name`, `specialty`, `availability_rules`, `locations`, `status`
- `appointments`
  - `_id`, `patient_id`, `provider_id`, `type`, `start_at`, `end_at`, `status`, `source`, `meta`
- `conversations`
  - `_id`, `patient_id`, `channel` (whatsapp/voice/web), `state`, `last_message_at`
- `messages`
  - `_id`, `conversation_id`, `direction`, `payload`, `intent`, `sentiment`, `created_at`
- `ai_cases`
  - `_id`, `patient_id`, `case_type`, `priority`, `state`, `assigned_agent`, `decision_summary`
- `tasks`
  - `_id`, `type`, `status`, `scheduled_for`, `attempts`, `max_attempts`, `payload`
- `audit_logs`
  - `_id`, `actor`, `action`, `resource_type`, `resource_id`, `before`, `after`, `timestamp`
- `event_store`
  - `_id`, `event_id`, `event_type`, `aggregate_type`, `aggregate_id`, `payload`, `occurred_at`, `version`
- `outbox_events`
  - `_id`, `event_type`, `payload`, `status`, `published_at`, `retry_count`

### Index Strategy
- Compound indexes:
  - `appointments(patient_id, start_at)`
  - `messages(conversation_id, created_at)`
  - `tasks(status, scheduled_for)`
  - `event_store(aggregate_id, occurred_at)`
- TTL indexes:
  - Ephemeral session docs and temporary voice artifacts.
- Partial indexes:
  - Active tasks (`status in queued|retrying`) and open AI cases.

### Data Governance
- Encrypt PHI fields at rest + field-level encryption where needed.
- Soft delete for operational entities; immutable event/audit history.
- Strict schema validation with versioned documents.

---

## 6) System Event Types (Canonical Contract Set)

### Patient & Clinical
- `PATIENT_CREATED`
- `PATIENT_UPDATED`
- `CARE_PLAN_CREATED`
- `RISK_FLAG_RAISED`

### Appointment Lifecycle
- `APPOINTMENT_CREATED`
- `APPOINTMENT_CONFIRMED`
- `APPOINTMENT_RESCHEDULED`
- `APPOINTMENT_CANCELLED`
- `APPOINTMENT_REMINDER_DUE`

### Messaging & Voice
- `WHATSAPP_MESSAGE_RECEIVED`
- `WHATSAPP_MESSAGE_SENT`
- `VOICE_CALL_STARTED`
- `VOICE_TRANSCRIPT_READY`
- `VOICE_CALL_ENDED`

### AI Orchestration
- `AI_INTENT_DETECTED`
- `AI_TRIAGE_STARTED`
- `AI_TRIAGE_COMPLETED`
- `AI_AGENT_TASK_ASSIGNED`
- `AI_AGENT_TASK_COMPLETED`
- `AI_ESCALATION_REQUIRED`
- `AI_RESPONSE_GENERATED`

### Worker & Integration
- `JOB_QUEUED`
- `JOB_STARTED`
- `JOB_COMPLETED`
- `JOB_FAILED`
- `DLQ_MESSAGE_CREATED`
- `EHR_SYNC_REQUESTED`
- `EHR_SYNC_COMPLETED`

### Security & Audit
- `AUTH_LOGIN_SUCCEEDED`
- `AUTH_LOGIN_FAILED`
- `RBAC_PERMISSION_DENIED`
- `AUDIT_LOG_WRITTEN`

---

## 7) Deployment Architecture (Docker + AWS)

### Runtime Topology
- **Containerization**: every app/service has independent Dockerfile; shared base images for Node runtime consistency.
- **Compute**: AWS ECS Fargate (or EKS if required later).
- **Routing**:
  - Public ALB -> API, Dashboard, channel webhooks.
  - Internal service discovery for AI Core, agents, and workers.
- **Data**: MongoDB Atlas (multi-AZ), with private peering to AWS VPC.
- **Events/Queues**:
  - EventBridge for event routing (or SNS)
  - SQS for worker queues + DLQs
- **Storage**: S3 for call recordings, artifacts, and exports.
- **Secrets**: AWS Secrets Manager + KMS.
- **Observability**: CloudWatch + OpenTelemetry collector + centralized logs (e.g., OpenSearch).

### Environments
- `dev` -> lower-cost shared infra.
- `staging` -> production-like, pre-release validation.
- `prod` -> multi-AZ, autoscaling, strict alerting and SLOs.

### CI/CD
- Monorepo-aware pipeline (Nx/Turbo + pnpm workspaces):
  - Lint/test/build affected services.
  - Build/push Docker images.
  - Deploy via Terraform + GitHub Actions workflows.
  - Progressive rollout (canary/blue-green) for API and AI services.

---

## 8) Operational Principles (Production Grade)

- **Security-first**: zero-trust service auth, least-privilege IAM, encrypted transport, signed webhooks.
- **Compliance-ready**: immutable audits, retention policies, PHI isolation boundaries.
- **Resilience**: idempotent consumers, backpressure controls, circuit breakers, graceful degradation.
- **Scalability**: stateless APIs, horizontal autoscaling, queue-based workload smoothing.
- **Observability**: end-to-end traces with correlation IDs from ingress to downstream actions.
