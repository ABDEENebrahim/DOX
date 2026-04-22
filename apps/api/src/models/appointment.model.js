import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true
    },
    reason: { type: String }
  },
  { timestamps: true }
);

appointmentSchema.index({ patientId: 1, startAt: -1 });
appointmentSchema.index({ doctorId: 1, startAt: -1 });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
