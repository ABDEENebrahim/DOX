export class MarketingAgent {
  async handle(event) {
    return {
      campaignStub: true,
      campaignType: 'retention',
      audienceHint: event.payload?.patientId ? 'existing_patient' : 'general'
    };
  }
}
