// src/utils/fraudDetection.js

/**
 * Rules for fraud detection
 */
export const fraudRules = {
  vinCloning: {
    maxQueriesPerDay: 5,
    maxDifferentLocationsPerDay: 2,
    riskScoreThreshold: 75,
  },
  odometerRollback: {
    maxAllowedDiscrepancy: 1000, // miles
    riskScoreThreshold: 80,
  }
};

/**
 * Mock function to detect VIN cloning
 * @param {string} vin - The Vehicle Identification Number
 * @param {Object} queryContext - Context of the query (e.g., location, time)
 * @returns {Object} - Fraud analysis result
 */
export const detectVinCloning = async (vin, queryContext = {}) => {
  // Mock logic: randomly flag VINs that start with '1FA' as high risk for cloning
  // In a real scenario, this would check against a database of recent queries, locations, and stolen vehicle records
  const isSuspicious = vin.startsWith('1FA') && Math.random() > 0.5;
  
  if (isSuspicious) {
    return {
      isFlagged: true,
      riskScore: 85,
      reason: 'Multiple queries from geographically distant locations within 24 hours.',
      recommendation: 'Verify physical VIN plate and secondary VIN locations.'
    };
  }

  return {
    isFlagged: false,
    riskScore: 10,
    reason: 'Normal query pattern detected.',
    recommendation: 'Proceed with standard checks.'
  };
};

/**
 * Mock function to detect odometer rollback
 * @param {string} vin - The Vehicle Identification Number
 * @param {number} currentMileage - The currently reported mileage
 * @param {Array<Object>} historicalRecords - Array of historical mileage records
 * @returns {Object} - Fraud analysis result
 */
export const detectOdometerRollback = async (vin, currentMileage, historicalRecords = []) => {
  if (!historicalRecords || historicalRecords.length === 0) {
    // Mock historical data if none provided
    historicalRecords = [
      { date: '2023-01-15', mileage: Math.max(0, currentMileage - 15000) },
      { date: '2024-02-20', mileage: Math.max(0, currentMileage - 5000) }
    ];
  }

  // Find the highest recorded mileage in history
  const maxHistoricalMileage = Math.max(...historicalRecords.map(record => record.mileage));

  // If current mileage is less than historical mileage, it's a rollback
  if (currentMileage < maxHistoricalMileage) {
    const discrepancy = maxHistoricalMileage - currentMileage;
    
    return {
      isFlagged: true,
      riskScore: 95,
      reason: `Current mileage (${currentMileage}) is less than previously recorded mileage (${maxHistoricalMileage}). Discrepancy: ${discrepancy}.`,
      recommendation: 'Investigate vehicle history and physical condition. Potential odometer tampering.'
    };
  }

  // Check for unusually low mileage over a long period (mock logic)
  const isSuspiciouslyLow = currentMileage < 10000 && historicalRecords.length > 2;

  if (isSuspiciouslyLow) {
      return {
          isFlagged: true,
          riskScore: 60,
          reason: 'Mileage is unusually low for the vehicle age and history.',
          recommendation: 'Verify mileage with physical service records.'
      }
  }

  return {
    isFlagged: false,
    riskScore: 5,
    reason: 'Mileage progression appears consistent.',
    recommendation: 'Proceed with standard checks.'
  };
};

/**
 * Comprehensive fraud analysis for a vehicle
 * @param {Object} vehicleData - Vehicle data including VIN, mileage, etc.
 * @returns {Object} - Complete fraud report
 */
export const runComprehensiveFraudCheck = async (vehicleData) => {
  const { vin, mileage, queryContext, historicalRecords, historyReport, vehicle } = vehicleData;

  const vinCheck = await detectVinCloning(vin, queryContext);
  const odometerCheck = await detectOdometerRollback(vin, mileage, historicalRecords);

  const report = historyReport || vehicle?.historyReport;
  const theftTitleRisk = report?.theftTitle?.stolenFlag ? 95 : (report?.theftTitle?.titleFlags?.length ? 70 : 10);
  const damageSeverity = report?.damage?.maxSeverity || 'none';
  const damageRisk = damageSeverity === 'severe' ? 85 : damageSeverity === 'moderate' ? 60 : damageSeverity === 'minor' ? 30 : 5;
  const confidenceRisk = report?.confidence?.overall === 'low' ? 55 : report?.confidence?.overall === 'medium' ? 25 : 5;

  const overallRiskScore = Math.max(vinCheck.riskScore, odometerCheck.riskScore, theftTitleRisk, damageRisk, confidenceRisk);
  const riskTier = overallRiskScore >= 75 ? 'high' : overallRiskScore >= 45 ? 'medium' : 'low';
  const isFlagged = riskTier !== 'low';

  const explanations = [];
  if (report?.mileage?.rollbackDetected || odometerCheck.isFlagged) explanations.push('Mileage anomaly detected from time-series records.');
  if (report?.theftTitle?.stolenFlag) explanations.push('Vehicle appears on stolen watchlist signals.');
  if ((report?.theftTitle?.titleFlags || []).length) explanations.push(`Title flags detected: ${(report.theftTitle.titleFlags || []).join(', ')}.`);
  if (damageSeverity !== 'none') explanations.push(`Damage history indicates ${damageSeverity} severity incidents.`);
  if (report?.confidence?.overall === 'low') explanations.push('Low data confidence: limited source coverage.');

  return {
    vin,
    isFlagged,
    riskTier,
    overallRiskScore,
    checks: {
      vinCloning: vinCheck,
      odometerRollback: odometerCheck,
      theftTitle: { riskScore: theftTitleRisk },
      damage: { riskScore: damageRisk, severity: damageSeverity },
      confidence: { riskScore: confidenceRisk, level: report?.confidence?.overall || 'unknown' }
    },
    explanations,
    recommendedActions: isFlagged
      ? ['Verify identity/title documents physically.', 'Request third-party inspection before payment.']
      : ['Proceed with standard purchase workflow.'],
    timestamp: new Date().toISOString()
  };
};

export default {
  fraudRules,
  detectVinCloning,
  detectOdometerRollback,
  runComprehensiveFraudCheck
};
