export const DUTCH_TAX_DATA = {
  holidayAllowanceRate: 0.08,
  expatDeductionRate: 0.3,
  years: {
    2024: {
      brackets: [
        {
          lower: 0,
          upper: 38883,
          payrollRate: 0.0932,
          socialRate: 0.2765,
          label: "Bracket 1",
        },
        {
          lower: 38883,
          upper: 78426,
          payrollRate: 0.3697,
          socialRate: 0,
          label: "Bracket 2",
        },
        {
          lower: 78426,
          upper: Infinity,
          payrollRate: 0.495,
          socialRate: 0,
          label: "Bracket 3",
        },
      ],
      rulingThresholds: {
        young_masters: 35048,
        age_30_plus: 46107,
        researcher: 0
      },
      rulingCap: 233000,
      credits: {
        general: {
          max: 3362,
          phaseOutStart: 24812,
          phaseOutRate: 0.0663,
        },
        labour: {
          segments: [
            {
              upTo: 11490,
              rate: 0.08425,
            },
            {
              upTo: 24820,
              rate: 0.31433,
            },
            {
              upTo: 39957,
              rate: 0.02471,
            },
            {
              upTo: Infinity,
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
          upper: 38883,
          payrollRate: 0.0932,
          socialRate: 0.265,
          label: "Bracket 1",
        },
        {
          lower: 38883,
          upper: 78426,
          payrollRate: 0.3748,
          socialRate: 0,
          label: "Bracket 2",
        },
        {
          lower: 78426,
          upper: Infinity,
          payrollRate: 0.495,
          socialRate: 0,
          label: "Bracket 3",
        },
      ],
      rulingThresholds: {
        young_masters: 35468,
        age_30_plus: 46660,
        researcher: 0
      },
      rulingCap: 246000,
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
              rate: 0.08053,
            },
            {
              upTo: 26288,
              rate: 0.30030,
            },
            {
              upTo: 43071,
              rate: 0.02258,
            },
            {
              upTo: Infinity,
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
          upper: 38883,
          payrollRate: 0.081,
          socialRate: 0.2765,
          label: "Bracket 1",
        },
        {
          lower: 38883,
          upper: 78426,
          payrollRate: 0.3756,
          socialRate: 0,
          label: "Bracket 2",
        },
        {
          lower: 78426,
          upper: Infinity,
          payrollRate: 0.495,
          socialRate: 0,
          label: "Bracket 3",
        },
      ],
      rulingThresholds: {
        young_masters: 36497,
        age_30_plus: 48013,
        researcher: 0
      },
      rulingCap: 262000,
      credits: {
        general: {
          max: 3115,
          phaseOutStart: 29736,
          phaseOutRate: 0.06398,
        },
        labour: {
          segments: [
            {
              upTo: 11965,
              rate: 0.08324,
            },
            {
              upTo: 25845,
              rate: 0.31009,
            },
            {
              upTo: 45592,
              rate: 0.0195,
            },
            {
              upTo: Infinity,
              rate: -0.0651,
            },
          ],
        },
      },
    },
  },
};
