import { DUTCH_TAX_DATA } from "./dutch-tax-data.js";

const money = new Intl.NumberFormat("en-NL", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

let chartsLoaderPromise;

function clampNonNegative(value) {
  return Math.max(0, value);
}

function toEuro(value) {
  return money.format(value || 0);
}

function safeNum(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function computeGeneralCredit(income, yearConfig) {
  const config = yearConfig.credits.general;
  if (income <= config.phaseOutStart) {
    return config.max;
  }

  const reduction = (income - config.phaseOutStart) * config.phaseOutRate;
  return clampNonNegative(config.max - reduction);
}

function computeLabourCreditRows(income, yearConfig) {
  const segments = yearConfig.credits.labour.segments;
  const rows = [];
  let previousUpper = 0;

  for (const segment of segments) {
    const taxableAmount = clampNonNegative(Math.min(income - previousUpper, segment.upTo - previousUpper));
    const credit = taxableAmount * segment.rate;
    rows.push({
      upTo: segment.upTo,
      rate: segment.rate,
      taxableAmount,
      credit,
    });
    previousUpper = segment.upTo;
    if (income <= segment.upTo) {
      break;
    }
  }

  return rows;
}

function computeBracketBreakdown(taxableIncome, yearConfig) {
  let remaining = taxableIncome;
  const rows = [];

  for (const bracket of yearConfig.brackets) {
    if (remaining <= 0) {
      rows.push({
        upper: bracket.upper,
        label: bracket.label,
        socialRate: bracket.socialRate,
        payrollRate: bracket.payrollRate,
        taxableAmount: 0,
        socialTax: 0,
        payrollTax: 0,
      });
      continue;
    }

    const width = Number.isFinite(bracket.upper)
      ? bracket.upper - bracket.lower
      : remaining;

    const taxableAmount = clampNonNegative(Math.min(remaining, width));
    const socialTax = taxableAmount * bracket.socialRate;
    const payrollTax = taxableAmount * bracket.payrollRate;

    rows.push({
      upper: bracket.upper,
      label: bracket.label,
      taxableAmount,
      socialTax,
      payrollTax,
      socialRate: bracket.socialRate,
      payrollRate: bracket.payrollRate,
    });

    remaining -= taxableAmount;
  }

  return rows;
}

function rulingCategoryLabel(key) {
  switch (key) {
    case "young_masters":
      return "<30 + Masters";
    case "age_30_plus":
      return "Other";
    case "researcher":
      return "Researcher";
    default:
      return "None";
  }
}

function computeTaxModel(input) {
  const yearConfig = DUTCH_TAX_DATA.years[input.taxYear] || DUTCH_TAX_DATA.years[2026];
  const holidayRate = DUTCH_TAX_DATA.holidayAllowanceRate;

  const baseAnnualGross =
    input.incomePeriod === "monthly"
      ? input.grossIncome * 12
      : input.grossIncome;

  const holidayAllowance = input.includesHoliday
    ? 0
    : baseAnnualGross * holidayRate;

  const totalGross = baseAnnualGross + holidayAllowance;

  const thresholdByCategory = yearConfig.rulingThresholds[input.rulingCategory] ?? Infinity;
  const amountEarnedAboveThreshold = Math.max(0, totalGross - thresholdByCategory);
  const isDeductionPercentReached = amountEarnedAboveThreshold > totalGross * DUTCH_TAX_DATA.expatDeductionRate;
  const isDeductionCapReached = totalGross > yearConfig.rulingCap;
  const rulingDeduction = Math.min(amountEarnedAboveThreshold, totalGross * DUTCH_TAX_DATA.expatDeductionRate, yearConfig.rulingCap * DUTCH_TAX_DATA.expatDeductionRate);

  const taxableIncome = clampNonNegative(totalGross - rulingDeduction);
  const bracketRows = computeBracketBreakdown(taxableIncome, yearConfig);

  const socialSecurityTax = bracketRows.reduce(
    (sum, row) => sum + row.socialTax,
    0,
  );
  const payrollTax = bracketRows.reduce((sum, row) => sum + row.payrollTax, 0);

  const generalTaxCredit = computeGeneralCredit(taxableIncome, yearConfig);
  const labourTaxCreditRows = computeLabourCreditRows(taxableIncome, yearConfig);
  const labourTaxCredit = clampNonNegative(labourTaxCreditRows.reduce((sum, row) => sum + row.credit, 0));

  const netTaxes = socialSecurityTax + payrollTax - generalTaxCredit - labourTaxCredit;
  const annualNetIncome = totalGross - netTaxes;
  const monthlyNetIncome = annualNetIncome / 12;

  return {
    input,
    baseAnnualGross,
    holidayAllowance,
    totalGross,
    rulingCap: yearConfig.rulingCap,
    thresholdByCategory,
    isDeductionPercentReached,
    isDeductionCapReached,
    rulingDeduction,
    taxableIncome,
    bracketRows,
    socialSecurityTax,
    payrollTax,
    generalTaxCredit,
    labourTaxCreditRows,
    labourTaxCredit,
    netTaxes,
    annualNetIncome,
    monthlyNetIncome,
    effectiveTaxRate: (netTaxes / totalGross) * 100,
  };
}

function rowClass(value, extra = "") {
  const signClass = value < 0 ? "value-negative" : "value-positive";
  return `${signClass} ${extra}`.trim();
}

function buildOutputTable(model) {
  return `
    <table class="tax-output-table" aria-describedby="tax-output-caption">
      <tbody>
        <tr><td>Gross annual income</td><td class="${rowClass(model.baseAnnualGross)}">${toEuro(model.baseAnnualGross)}</td></tr>
        <tr><td>Holiday Allowance (${(DUTCH_TAX_DATA.holidayAllowanceRate * 100).toFixed(0)}%)</td><td class="${rowClass(model.holidayAllowance)}">${toEuro(model.holidayAllowance)}</td></tr>
        <tr class="section-final"><td>Total gross income</td><td class="${rowClass(model.totalGross)}">${toEuro(model.totalGross)}</td></tr>

        <tr class="section-divider"><td colspan="2"></td></tr>

        <tr><td>Expat ruling deduction</td><td class="${rowClass(-model.rulingDeduction)}-good">${toEuro(-model.rulingDeduction)}</td></tr>
        <tr class="section-final"><td>Taxable income</td><td class="${rowClass(model.taxableIncome)}">${toEuro(model.taxableIncome)}</td></tr>

        <tr class="section-divider"><td colspan="2"></td></tr>

        <tr><td>Social security tax</td><td class="${rowClass(-model.socialSecurityTax)}">${toEuro(-model.socialSecurityTax)}</td></tr>
        <tr><td>Payroll tax</td><td class="${rowClass(-model.payrollTax)}">${toEuro(-model.payrollTax)}</td></tr>
        <tr><td>General tax credit</td><td class="${rowClass(model.generalTaxCredit)}">${toEuro(model.generalTaxCredit)}</td></tr>
        <tr><td>Labour tax credit</td><td class="${rowClass(model.labourTaxCredit)}">${toEuro(model.labourTaxCredit)}</td></tr>
        <tr class="section-final"><td>Net taxes</td><td class="${rowClass(-model.netTaxes)}">${toEuro(-model.netTaxes)}</td></tr>

        <tr class="section-divider"><td colspan="2"></td></tr>

        <tr class="section-net"><td>Annual net income</td><td class="${rowClass(model.annualNetIncome, "section-net")}">${toEuro(model.annualNetIncome)}</td></tr>
        <tr class="section-net"><td>Monthly net income</td><td class="${rowClass(model.monthlyNetIncome, "section-net")}">${toEuro(model.monthlyNetIncome)}</td></tr>
        <tr class="section-net"><td>Effective Tax Rate</td><td class="${rowClass(model.effectiveTaxRate, "section-net")}">${model.effectiveTaxRate.toFixed(2)}%</td></tr>
      </tbody>
    </table>
  `;
}

function buildCalculationLines(model) {
  const lines = [];
  const threshold = model.thresholdByCategory;
  const yearConfig = DUTCH_TAX_DATA.years[model.input.taxYear] || DUTCH_TAX_DATA.years[2026];

  lines.push(`<p>Total income = ${toEuro(model.baseAnnualGross)} + ${toEuro(model.holidayAllowance)} = ${toEuro(model.totalGross)}</p>`);
  if (threshold !== Infinity) {
    if (model.isDeductionCapReached) {
        lines.push(
            `<p>Expat Deduction (${rulingCategoryLabel(model.input.rulingCategory)}) =  ${toEuro(model.rulingCap)} x ${DUTCH_TAX_DATA.expatDeductionRate} = ${toEuro(model.rulingDeduction)} (capped)</p>`,
        );
    } else if (model.isDeductionPercentReached) {
        lines.push(
            `<p>Expat Deduction (${rulingCategoryLabel(model.input.rulingCategory)}) =  ${toEuro(model.totalGross)} x ${DUTCH_TAX_DATA.expatDeductionRate} = ${toEuro(model.rulingDeduction)}</p>`,
        );
    }  else {
        lines.push(
            `<p>Expat Deduction (${rulingCategoryLabel(model.input.rulingCategory)}) = ${toEuro(model.totalGross)} - ${toEuro(threshold || 0)} = ${toEuro(model.rulingDeduction)} (taxable income cannot go below threshold)</p>`,
        );
    }
  }
  lines.push(`<p>Taxable income = ${toEuro(model.totalGross)} - ${toEuro(model.rulingDeduction)} = ${toEuro(model.taxableIncome)}</p>`);

  lines.push(`<p>Tax breakdown by bracket:</p>`);
  const tableHeaders = [
    "Bracket",
    "Amount Earned",
    "Social Rate",
    "Payroll Rate",
    "Total tax",
  ];

  const tableRows = model.bracketRows.map((row) => {
    const socialRate = row.socialRate;
    const payrollRate = row.payrollRate;
    const totalTax = row.socialTax + row.payrollTax;
    return [
      `<= ${toEuro(row.upper)}`,
      `${toEuro(row.taxableAmount)}`,
      `${(socialRate * 100).toFixed(2)}%`,
      `${(payrollRate * 100).toFixed(2)}%`,
      `${toEuro(totalTax)}`,
    ];
  });

  const colWidths = tableHeaders.map((header, colIndex) => {
    const maxCellWidth = Math.max(
      ...tableRows.map((row) => row[colIndex].length),
      header.length,
    );
    return maxCellWidth;
  });

  const formatRow = (cells) => {
    const padded = cells.map((cell, idx) => cell.padEnd(colWidths[idx], " "));
    return `| ${padded.join(" | ")} |`;
  };

  const separator = `+-${colWidths.map((width) => "-".repeat(width)).join("-+-")}-+`;
  const asciiTable = [
    separator,
    formatRow(tableHeaders),
    separator,
    ...tableRows.map((row) => formatRow(row)),
    separator,
  ].join("\n");

  lines.push(`<pre>${asciiTable}</pre>`);

  const generalConfig = yearConfig.credits.general;
  const clawbackIncome = Math.max(0, model.taxableIncome - generalConfig.phaseOutStart);
  lines.push(`<p>Amount above General Credit Phase-out = ${toEuro(model.taxableIncome)} - ${toEuro(generalConfig.phaseOutStart)} = ${toEuro(clawbackIncome)}</p>`);
  lines.push(
    `<p>General tax credit = ${toEuro(generalConfig.max)} - (${(generalConfig.phaseOutRate * 100).toFixed(3)}% x ${toEuro(clawbackIncome)}) = ${toEuro(model.generalTaxCredit)}</p>`,
  );

  lines.push(`<p>Labour tax credit breakdown by segment:</p>`);
  const labourHeaders = ["Segment", "Amount in segment", "Rate", "Credit"]; 
  const labourRows = model.labourTaxCreditRows.map((row, index) => [
    `<= ${toEuro(row.upTo)}`,
    toEuro(row.taxableAmount),
    `${(row.rate * 100).toFixed(3)}%`,
    toEuro(row.credit),
  ]);

  const labourWidths = labourHeaders.map((header, colIndex) => {
    const maxCellWidth = Math.max(
      ...labourRows.map((row) => row[colIndex].length),
      header.length,
    );
    return maxCellWidth;
  });

  const formatLabourRow = (cells) => {
    const padded = cells.map((cell, idx) => cell.padEnd(labourWidths[idx], " "));
    return `| ${padded.join(" | ")} |`;
  };

  const labourSeparator = `+-${labourWidths.map((width) => "-".repeat(width)).join("-+-")}-+`;
  const labourTable = [
    labourSeparator,
    formatLabourRow(labourHeaders),
    labourSeparator,
    ...labourRows.map((row) => formatLabourRow(row)),
    labourSeparator,
  ].join("\n");

  lines.push(`<pre>${labourTable}</pre>`);

  return lines.join("");
}

let plotlyLoaderPromise = null;

function ensurePlotly() {
  if (plotlyLoaderPromise) {
    return plotlyLoaderPromise;
  }

  plotlyLoaderPromise = new Promise((resolve, reject) => {
    // If Plotly is already attached to the window, resolve immediately
    if (window.Plotly) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    // Using the latest 2.x minified bundle
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/plotly.js/2.35.0/plotly.min.js"; 
    script.async = true;
    script.onload = () => {
      resolve();
    };
    script.onerror = () => reject(new Error("Plotly failed to load."));

    document.head.appendChild(script);
  });

  return plotlyLoaderPromise;
}

function drawSankey(model, chartEl) {
  // 1. Build all links first
  const rawLinks = [];
  rawLinks.push({ source: "Gross income", target: "Net income", value: model.rulingDeduction, hoverText: "Expat scheme deduction" });
  rawLinks.push({ source: "Gross income", target: "Taxable income", value: model.taxableIncome });

  model.bracketRows.forEach((row) => {
    rawLinks.push({ source: "Taxable income", target: row.label, value: row.taxableAmount });
    rawLinks.push({ source: row.label, target: "Government", value: row.socialTax + row.payrollTax, hoverText: `${row.label} tax`});
    rawLinks.push({ source: row.label, target: "Net income", value: row.taxableAmount - (row.socialTax + row.payrollTax), hoverText: `${row.label} net income` });
  });

  rawLinks.push({ source: "Government", target: "Net income", value: model.labourTaxCredit + model.generalTaxCredit, hoverText: "Tax credits" });
  rawLinks.push({ source: "Government", target: "Net taxes", value: model.socialSecurityTax + model.payrollTax - model.generalTaxCredit - model.labourTaxCredit, hoverText: "Net taxes" });

  // 2. Filter out 0-value flows to permanently fix Plotly's Orphan Node bug
  const activeLinks = rawLinks.filter(link => link.value > 0);

  // 3. Extract unique nodes ONLY from active flows
  const activeNodesSet = new Set();
  activeLinks.forEach(link => {
    activeNodesSet.add(link.source);
    activeNodesSet.add(link.target);
  });
  const nodes = Array.from(activeNodesSet);

  // 4. DYNAMIC COORDINATE ENGINE (SCALED DOWN FOR MORE ROOM)
  // These are the compressed anchor points that prevent top/bottom clipping
  const staticPositions = {
    "Gross income":   { x: 0.001, y: 0.15 }, 
    "Taxable income": { x: 0.25,  y: 0.45 },
    "Government":     { x: 0.75,  y: 0.65 },
    "Credits":        { x: 0.85,  y: 0.5 },
    "Net income":     { x: 0.999, y: 0.15 }, 
    "Net taxes":      { x: 0.999, y: 0.85 }  
  };

  const activeBrackets = model.bracketRows
    .map(row => row.label)
    .filter(label => activeNodesSet.has(label));

  const xCoords = [];
  const yCoords = [];

  nodes.forEach(node => {
    if (staticPositions[node]) {
      // Pin the static structural nodes
      xCoords.push(staticPositions[node].x);
      yCoords.push(staticPositions[node].y);
    } else {
      // Mathematically space out the dynamic tax brackets in column 3
      const index = activeBrackets.indexOf(node);
      const count = activeBrackets.length;

      xCoords.push(0.5); // Center column horizontally

      if (count === 1) {
        yCoords.push(0.5); // Dead center if there is only 1 bracket
      } else {
        // Automatically spread multiple brackets evenly. 
        // Compressed bounds to keep the center blocks away from the edges
        const minY = 0.30;
        const maxY = 0.70;
        const step = (maxY - minY) / (count - 1);
        
        yCoords.push(minY + (index * step)); 
      }
    }
  });

  // 5. Translate string names into integer index arrays for Plotly
  const sources = [];
  const targets = [];
  const values = [];
  const hoverText = [];

  activeLinks.forEach(link => {
    sources.push(nodes.indexOf(link.source));
    targets.push(nodes.indexOf(link.target));
    values.push(link.value);
    hoverText.push(link.hoverText || "");
  });

  // 6. Package and Render
  const data = [{
    type: "sankey",
    arrangement: "fixed", 
    node: {
      label: nodes,
      x: xCoords,
      y: yCoords,
      pad: 15,
      thickness: 10,
      color: ["#1f6feb", "#e74c3c", "#2b9348", "#f4b400", "#0b8f8c", "#2f3640", "#9b59b6"]
    },
    link: {
      source: sources,
      target: targets,
      value: values,
      customdata: hoverText,
      hovertemplate: "%{customdata}<br>%{value:,.2f} EUR<br>%{source.label} → %{target.label}<extra></extra>",
      color: values.map(() => "rgba(31, 111, 235, 0.15)") 
    }
  }];

  const layout = {
    height: 320, // Bumped up slightly for breathing room
    margin: { t: 40, b: 40, l: 15, r: 15 }, // Expanded safety margins to stop clipping
    font: {
      family: "IBM Plex Sans, sans-serif",
      size: 12,
      color: "#1e2a3a"
    }
  };

  chartEl.innerHTML = ''; 
  window.Plotly.newPlot(chartEl, data, layout, { displayModeBar: false });
}

function buildMarkup(years) {
  const yearOptions = years
    .map((year) => `<option value="${year}">${year}</option>`)
    .join("");

  return `
    <section class="dutch-tax-page" aria-label="Dutch tax calculator">
      <div class="dutch-tax-page__outer">
        <div class="dutch-tax-page__title-wrap">
        <h2 class="dutch-tax-page__title">Dutch Income Tax Calculator</h2>
        </div>
        
        <div class="dutch-tax-page__content">
        <p class="dutch-tax-page__description">This is a simple tool I made to estimate your net income in the Netherlands (Box 1). No guarantees are made regarding the accuracy of the calculations. Consult a tax professional before making any financial decisions.</p>
        </div>

        <div class="tool-shell">
            <div class="tool-card tool-card--inputs">
                <h3>Inputs</h3>
                <form id="dutch-tax-form" class="tax-form" autocomplete="off">
                <div class="tax-form__row">
                    <label for="income-period">Income period</label>
                    <select id="income-period" name="incomePeriod">
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                    </select>
                </div>

                <div class="tax-form__row">
                    <label for="gross-income">Gross income (EUR)</label>
                    <input id="gross-income" name="grossIncome" type="number" min="0" step="0.01" value="4000" required>
                </div>

                <div class="tax-form__row tax-form__row--check">
                    <label>
                    <input id="includes-holiday" name="includesHoliday" type="checkbox">
                    Income already includes holiday allowance
                    </label>
                </div>

                <div class="tax-form__row">
                    <label for="tax-year">Tax year</label>
                    <select id="tax-year" name="taxYear">${yearOptions}</select>
                </div>

                <div class="tax-form__row">
                    <label for="ruling-category">Expat ruling category</label>
                    <select id="ruling-category" name="rulingCategory">
                    <option value="none">None</option>
                    <option value="researcher">Researcher</option>
                    <option value="young_masters">Under 30 + Masters</option>
                    <option value="age_30_plus">Other</option>
                    </select>
                </div>
                </form>
            </div>

            <div class="tool-card tool-card--outputs">
                <h3>Outputs</h3>
                <div id="tax-output-table"></div>
            </div>

            <div class="tool-card tool-card--chart">
                <h3>Tax Flows</h3>
                <div id="sankey-chart" class="sankey-chart" role="img" aria-label="Income and tax flow"></div>
            </div>
        </div>

        <details class="dutch-tax-page__details" id="dutch-tax-calculation-details" closed>
        <summary>Detailed Calculations</summary>
        <div class="dutch-tax-page__details-content" id="dutch-tax-calculation-lines"></div>
        </details>
      </div>
    </section>
  `;
}

export function initDutchTaxCalculator({ host }) {
  const years = Object.keys(DUTCH_TAX_DATA.years)
    .map((year) => Number(year))
    .sort((a, b) => b - a);

  host.innerHTML = buildMarkup(years);

  const form = host.querySelector("#dutch-tax-form");
  const tableHost = host.querySelector("#tax-output-table");
  const chartEl = host.querySelector("#sankey-chart");
  const detailsHost = host.querySelector("#dutch-tax-calculation-lines");

  if (!form || !tableHost || !chartEl || !detailsHost) {
    return;
  }

  const render = async () => {
    const formData = new FormData(form);
    const input = {
      incomePeriod: formData.get("incomePeriod") || "annual",
      grossIncome: safeNum(formData.get("grossIncome")),
      includesHoliday: formData.get("includesHoliday") === "on",
      taxYear: Number(formData.get("taxYear")),
      rulingCategory: formData.get("rulingCategory") || "none",
    };

    const model = computeTaxModel(input);

    tableHost.innerHTML = buildOutputTable(model);
    detailsHost.innerHTML = buildCalculationLines(model);

    try {
      await ensurePlotly();
      drawSankey(model, chartEl);
    } catch (error) {
      console.error("Error loading Plotly or drawing Sankey chart:", error);
      chartEl.innerHTML = `<p class="chart-error">Unable to load Sankey chart.</p>`;
    }
  };

  form.addEventListener("input", render);
  form.addEventListener("change", render);

  render();
}
