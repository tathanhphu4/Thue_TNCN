const TaxConfig = require('../models/TaxConfig');
const { PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION } = require('../config/taxRules');

const loadTaxConfig = async (year) => {
  let personalDeduction = PERSONAL_DEDUCTION;
  let dependentDeduction = DEPENDENT_DEDUCTION;
  let taxBrackets = null;

  const config = await TaxConfig.findOne({ year: parseInt(year), isActive: true });
  if (config) {
    personalDeduction = config.personalDeduction;
    dependentDeduction = config.dependentDeduction;
    taxBrackets = config.taxBrackets;
  }

  return { personalDeduction, dependentDeduction, taxBrackets };
};

module.exports = { loadTaxConfig };
