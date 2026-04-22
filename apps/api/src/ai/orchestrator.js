import crypto from 'node:crypto';
import { eventBus } from '../events/event-bus.js';
import { EventTypes } from '../events/event-types.js';
import { PatientAgent } from './agents/patient.agent.js';
import { DoctorAgent } from './agents/doctor.agent.js';
import { RevenueAgent } from './agents/revenue.agent.js';
import { MarketingAgent } from './agents/marketing.agent.js';
import { AILog } from '../models/ai-log.model.js';
import { logger } from '../config/logger.js';

export class JarvisOrchestrator {
  constructor() {
    this.patientAgent = new PatientAgent();
    this.doctorAgent = new DoctorAgent();
    this.revenueAgent = new RevenueAgent();
    this.marketingAgent = new MarketingAgent();
  }

  start() {
    Object.values(EventTypes).forEach((eventType) => {
      eventBus.on(eventType, async (payload) => {
        await this.handleEvent({ type: eventType, payload });
      });
    });
    logger.info('JARVIS orchestrator started');
  }

  async handleEvent(event) {
    const traceId = crypto.randomUUID();

    try {
      const [patientResult, doctorResult, revenueResult, marketingResult] = await Promise.all([
        this.patientAgent.handle(event),
        this.doctorAgent.handle(event),
        this.revenueAgent.handle(event),
        this.marketingAgent.handle(event)
      ]);

      const output = {
        patientAgent: patientResult,
        doctorAgent: doctorResult,
        revenueAgent: revenueResult,
        marketingAgent: marketingResult
      };

      await AILog.create({
        eventType: event.type,
        traceId,
        source: 'jarvis-orchestrator',
        input: event.payload,
        output,
        status: 'processed'
      });

      eventBus.emit('ACTIVITY_STREAM_EVENT', {
        eventType: event.type,
        source: 'jarvis-orchestrator',
        traceId,
        createdAt: new Date().toISOString()
      });

      return { traceId, output };
    } catch (error) {
      logger.error({ err: error, event }, 'Orchestrator processing failed');

      await AILog.create({
        eventType: event.type,
        traceId,
        source: 'jarvis-orchestrator',
        input: event.payload,
        status: 'failed',
        error: error.message
      });

      throw error;
    }
  }
}
