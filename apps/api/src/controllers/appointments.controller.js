import { z } from 'zod';
import { createAppointment, listAppointments } from '../services/appointment.service.js';

export const createAppointmentSchema = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().min(1),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  reason: z.string().optional()
});

export async function createAppointmentHandler(req, res, next) {
  try {
    const appointment = await createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
}

export async function listAppointmentsHandler(req, res, next) {
  try {
    const appointments = await listAppointments();
    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
}
