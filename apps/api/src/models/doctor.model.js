import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialty: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    availability: [{ day: String, start: String, end: String }]
  },
  { timestamps: true }
);

export const Doctor = mongoose.model('Doctor', doctorSchema);
