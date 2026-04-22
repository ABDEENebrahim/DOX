import { User } from '../models/user.model.js';
import { Patient } from '../models/patient.model.js';
import { Doctor } from '../models/doctor.model.js';
import { AILog } from '../models/ai-log.model.js';

export async function getInvestorMetrics() {
  const [activePatients, doctorsOnboarded, paidUsers, totalAiLogs] = await Promise.all([
    Patient.countDocuments({}),
    Doctor.countDocuments({}),
    User.countDocuments({ 'subscription.status': 'active' }),
    AILog.countDocuments({})
  ]);

  const mrr = paidUsers * 199;
  const arr = mrr * 12;
  const automatedLogs = await AILog.countDocuments({ status: 'processed' });
  const aiAutomationRate = totalAiLogs === 0 ? 0 : Math.round((automatedLogs / totalAiLogs) * 100);

  return {
    mrr,
    arr,
    activePatients,
    doctorsOnboarded,
    aiAutomationRate,
    revenueByCountry: {
      UAE: Math.round(mrr * 0.35),
      KSA: Math.round(mrr * 0.3),
      INDIA: Math.round(mrr * 0.35)
    }
  };
}
