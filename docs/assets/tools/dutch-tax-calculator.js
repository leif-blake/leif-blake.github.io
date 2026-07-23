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

  const expatDeductionRate = input.expatDeductionPercent / 100;
  const thresholdByCategory = yearConfig.rulingThresholds[input.rulingCategory] ?? Infinity;
  const amountEarnedAboveThreshold = Math.max(0, totalGross - thresholdByCategory);
  const isDeductionPercentReached = amountEarnedAboveThreshold > totalGross * expatDeductionRate;
  const isDeductionCapReached = totalGross > yearConfig.rulingCap;
  const rulingDeduction = Math.min(amountEarnedAboveThreshold, totalGross * expatDeductionRate, yearConfig.rulingCap * expatDeductionRate);

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
    expatDeductionRate,
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
            `<p>Expat Deduction (${rulingCategoryLabel(model.input.rulingCategory)}) =  ${toEuro(model.rulingCap)} x ${model.expatDeductionRate} = ${toEuro(model.rulingDeduction)} (capped)</p>`,
        );
    } else if (model.isDeductionPercentReached) {
        lines.push(
            `<p>Expat Deduction (${rulingCategoryLabel(model.input.rulingCategory)}) =  ${toEuro(model.totalGross)} x ${model.expatDeductionRate} = ${toEuro(model.rulingDeduction)}</p>`,
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

function ensureGoogleCharts() {
  if (chartsLoaderPromise) {
    return chartsLoaderPromise;
  }

  chartsLoaderPromise = new Promise((resolve, reject) => {
    if (window.google && window.google.charts) {
      window.google.charts.load("current", { packages: ["sankey"] });
      window.google.charts.setOnLoadCallback(resolve);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/charts/loader.js";
    script.async = true;
    script.onload = () => {
      window.google.charts.load("current", { packages: ["sankey"] });
      window.google.charts.setOnLoadCallback(resolve);
    };
    script.onerror = () => reject(new Error("Google Charts failed to load."));

    document.head.appendChild(script);
  });

  return chartsLoaderPromise;
}

function drawSankey(model, chartEl) {
  const dataTable = new window.google.visualization.DataTable();
  dataTable.addColumn("string", "From");
  dataTable.addColumn("string", "To");
  dataTable.addColumn("number", "Amount");
  // 1. Add a dedicated column for the custom HTML tooltip
  dataTable.addColumn({ type: "string", role: "tooltip", p: { html: true } });

  const rawRows = [];
  rawRows.push(["Gross income", "Expat deduction", model.rulingDeduction]);
  rawRows.push(["Expat deduction", "Net income", model.rulingDeduction]);
  rawRows.push(["Gross income", "Taxable income", model.taxableIncome]);

  model.bracketRows.forEach((row, index) => {
    const bracketNode = `${row.label}`;
    const bracketTaxNode = `Tax ${index + 1}`;
    rawRows.push(["Taxable income", bracketNode, row.taxableAmount]);
    rawRows.push([bracketNode, "Governement", row.socialTax + row.payrollTax]);
    rawRows.push([bracketNode, "Net income", row.taxableAmount - (row.socialTax + row.payrollTax)]);
  });

  rawRows.push(["Governement", "Credits", model.labourTaxCredit + model.generalTaxCredit]);
  rawRows.push(["Credits", "Net income", model.labourTaxCredit + model.generalTaxCredit]);
  rawRows.push(["Governement", "Net taxes", model.socialSecurityTax + model.payrollTax - model.generalTaxCredit - model.labourTaxCredit]);

  // 2. Instantiate the formatter 
  const formatter = new window.google.visualization.NumberFormat({
    pattern: "#,##0.00",
  });

  // 3. Filter rows and map them to include the pre-formatted HTML tooltip string
  const processedRows = rawRows
    .filter((row) => row[2] > 0)
    .map((row) => {
      const from = row[0];
      const to = row[1];
      const amount = row[2];
      const formattedAmount = formatter.formatValue(amount);
      
      // Construct a clean custom HTML layout mimicking the original look
      const tooltipHtml = `
        <div style="padding: 10px; font-family: 'IBM Plex Sans'; font-size: 13px; color: #1e2a3a; background: #fff; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-radius: 4px;">
          <strong>${from} &rarr; ${to}</strong><br/>
          <span>Amount: <b>${formattedAmount}</b></span>
        </div>
      `;
      
      return [from, to, amount, tooltipHtml];
    });

  dataTable.addRows(processedRows);

  const chart = new window.google.visualization.Sankey(chartEl);
  chart.draw(dataTable, {
    width: chartEl.clientWidth,
    height: 260,
    // 4. Instruct the chart to render custom HTML tooltips
    tooltip: { isHtml: true }, 
    sankey: {
      node: {
        width: 14,
        nodePadding: 20,
        label: {
          fontName: "IBM Plex Sans",
          fontSize: 12,
          color: "#1e2a3a",
        },
        colors: ["#1f6feb", "#e74c3c", "#2b9348", "#f4b400", "#0b8f8c", "#2f3640"],
      },
      link: {
        colorMode: "gradient",
      },
    },
  });
}

function buildMarkup(years) {
  const yearOptions = years
    .map((year) => `<option value="${year}">${year}</option>`)
    .join("");

  return `
    <section class="dutch-tax-page" aria-label="Dutch tax calculator">
      <div class="dutch-tax-page__outer">
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

                <details class="dutch-tax-page__details" id="dutch-tax-advanced-options" closed>
                <summary>Advanced Options</summary>
                <div class="slider-container" style="display: flex; flex-direction: column; gap: 8px; font-family: system-ui, sans-serif; max-width: 300px;">
                  <label for="expat-deduction-rate">
                    Expat Deduction Rate (%): <strong id="expat-deduction-rate-value">${DUTCH_TAX_DATA.defaultExpatDeductionRate * 100}</strong>
                  </label>
                  <input 
                    type="range" 
                    id="expat-deduction-rate" 
                    min="0" 
                    max="100"
                    name="expatDeductionPercent" 
                    value="${DUTCH_TAX_DATA.defaultExpatDeductionRate * 100}" 
                  />
                </div>
                <div class="dutch-tax-page__details-content" id="dutch-tax-advanced-options-content"></div>
                </details>

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

function initSlider(id, onUpdate) {
  const slider = document.getElementById(id);
  const display = document.getElementById(`${id}-value`);

  if (!slider || !display) return;

  // 'input' fires live while dragging
  slider.addEventListener('input', (e) => {
    const val = e.target.value; // Value as percentage  
    // Update live value in UI
    display.textContent = val;
    
    // Send value elsewhere in your app code
    if (typeof onUpdate === 'function') {
      onUpdate(val);
    }
  });
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
      expatDeductionPercent: safeNum(formData.get("expatDeductionPercent")),
    };

    const model = computeTaxModel(input);

    tableHost.innerHTML = buildOutputTable(model);
    detailsHost.innerHTML = buildCalculationLines(model);

    try {
      await ensureGoogleCharts();
      drawSankey(model, chartEl);
    } catch (error) {
      chartEl.innerHTML = `<p class="chart-error">Unable to load Sankey chart.</p>`;
    }
  };

  form.addEventListener("input", render);
  form.addEventListener("change", render);

  render();
  initSlider("expat-deduction-rate", (val) => {
    // Handle the updated expat deduction rate here
    console.log("Updated expat deduction rate:", val);
  });
}
