export class PatientAgent {
  async handle(event) {
    if (event.type === 'WHATSAPP_MESSAGE') {
      return {
        intent: 'patient_chat',
        action: 'respond_with_booking_options',
        message: 'I can help you book or modify your appointment.'
      };
    }

    if (event.type === 'APPOINTMENT_CREATED') {
      return {
        intent: 'booking_confirmed',
        action: 'send_confirmation',
        message: 'Your appointment has been created successfully.'
      };
    }

    return { intent: 'noop', action: 'none' };
  }
}
