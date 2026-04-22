export class RevenueAgent {
  async handle(event) {
    if (event.type === 'SUBSCRIPTION_ACTIVE') {
      return {
        pricingTier: 'active_subscriber',
        discountPercent: 10,
        note: 'Apply subscriber discount for supported services.'
      };
    }

    return { pricingTier: 'standard', discountPercent: 0 };
  }
}
