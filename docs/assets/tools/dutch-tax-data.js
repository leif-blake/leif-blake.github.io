export const DUTCH_TAX_DATA = {
  holidayAllowanceRate: 0.08,
  years: {
    2024: {
      brackets: [
        {
          lower: 0,
          upper: 75518,
          payrollRate: 0.0975,
          socialRate: 0.2722,
          label: "Bracket 1",
        },
        {
          lower: 75518,
          upper: Infinity,
          payrollRate: 0.495,
          socialRate: 0,
          label: "Bracket 2",
        },
      ],
      rulingThresholds: {
        young_masters: 35048,
        age_30_plus: 46107,
      },
      credits: {
        general: {
          max: 3362,
          phaseOutStart: 24812,
          phaseOutRate: 0.0663,
        },
        labour: {
          segments: [
            {
              upTo: 11491,
              base: 0,
              rate: 0.08425,
            },
            {
              upTo: 24820,
              base: 968,
              rate: 0.31433,
            },
            {
              upTo: 39958,
              base: 5158,
              rate: 0.02471,
            },
            {
              upTo: 124935,
              base: 5532,
              rate: -0.0651,
            },
          ],
        },
      },
    },
    2025: {
      brackets: [
        {
          lower: 0,
          upper: 76168,
          payrollRate: 0.0852,
          socialRate: 0.273,
          label: "Bracket 1",
        },
        {
          lower: 76168,
          upper: Infinity,
          payrollRate: 0.495,
          socialRate: 0,
          label: "Bracket 2",
        },
      ],
      rulingThresholds: {
        young_masters: 35468,
        age_30_plus: 46660,
      },
      credits: {
        general: {
          max: 3068,
          phaseOutStart: 28406,
          phaseOutRate: 0.06337,
        },
        labour: {
          segments: [
            {
              upTo: 12169,
              base: 0,
              rate: 0.08053,
            },
            {
              upTo: 26288,
              base: 980,
              rate: 0.3003,
            },
            {
              upTo: 43071,
              base: 5219,
              rate: 0.02258,
            },
            {
              upTo: 129078,
              base: 5598,
              rate: -0.0651,
            },
          ],
        },
      },
    },
    2026: {
      brackets: [
        {
          lower: 0,
          upper: 77000,
          payrollRate: 0.086,
          socialRate: 0.273,
          label: "Bracket 1",
        },
        {
          lower: 77000,
          upper: Infinity,
          payrollRate: 0.495,
          socialRate: 0,
          label: "Bracket 2",
        },
      ],
      rulingThresholds: {
        young_masters: 35900,
        age_30_plus: 47200,
      },
      credits: {
        general: {
          max: 3150,
          phaseOutStart: 29000,
          phaseOutRate: 0.063,
        },
        labour: {
          segments: [
            {
              upTo: 12500,
              base: 0,
              rate: 0.08,
            },
            {
              upTo: 27000,
              base: 1000,
              rate: 0.297,
            },
            {
              upTo: 44000,
              base: 5300,
              rate: 0.022,
            },
            {
              upTo: 130000,
              base: 5675,
              rate: -0.064,
            },
          ],
        },
      },
    },
  },
};
