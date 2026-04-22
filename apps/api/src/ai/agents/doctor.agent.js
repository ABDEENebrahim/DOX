export class DoctorAgent {
  async handle(event) {
    if (event.type !== 'APPOINTMENT_CREATED') {
      return { summary: null };
    }

    return {
      summary: `New appointment created for patient ${event.payload.patientId}`,
      checklist: ['Review patient history', 'Prepare care notes']
    };
  }
}
