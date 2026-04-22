import mongoose from 'mongoose';

const aiLogSchema = new mongoose.Schema(
  {
    eventType: { type: String, required: true, index: true },
    traceId: { type: String, required: true, index: true },
    source: { type: String, required: true },
    input: { type: mongoose.Schema.Types.Mixed },
    output: { type: mongoose.Schema.Types.Mixed },
    status: { type: String, enum: ['processed', 'failed'], required: true },
    error: { type: String }
  },
  { timestamps: true }
);

export const AILog = mongoose.model('AILog', aiLogSchema);
