import { getInvestorMetrics } from '../services/investor.service.js';

export async function investorMetricsHandler(req, res, next) {
  try {
    const metrics = await getInvestorMetrics();
    return res.status(200).json(metrics);
  } catch (error) {
    return next(error);
  }
}
