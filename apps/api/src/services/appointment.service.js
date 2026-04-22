import { Appointment } from '../models/appointment.model.js';
import { eventBus } from '../events/event-bus.js';
import { EventTypes } from '../events/event-types.js';
import { notificationsQueue } from '../queue/queues.js';

export async function createAppointment(payload) {
  const appointment = await Appointment.create(payload);

  eventBus.emit(EventTypes.APPOINTMENT_CREATED, {
    appointmentId: appointment.id,
    patientId: appointment.patientId,
    doctorId: appointment.doctorId,
    startAt: appointment.startAt
  });

  await notificationsQueue.add('appointment-created', {
    appointmentId: appointment.id,
    patientId: appointment.patientId,
    template: 'appointment_confirmation'
  });

  return appointment;
}

export async function listAppointments(query = {}) {
  return Appointment.find(query).sort({ startAt: 1 }).lean();
}
