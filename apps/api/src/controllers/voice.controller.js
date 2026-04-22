import { z } from 'zod';
import { doctorVoiceAssistantPipeline } from '../services/voice-ai.service.js';

export const doctorAssistantSchema = z.object({
  audioBase64: z.string().min(1),
  mimeType: z.string().optional(),
  context: z.string().optional()
});

export async function doctorAssistantHandler(req, res, next) {
  try {
    const result = await doctorVoiceAssistantPipeline(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
