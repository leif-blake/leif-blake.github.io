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

function computeLabourCredit(income, yearConfig) {
  const segments = yearConfig.credits.labour.segments;
  let previousUpper = 0;
  let credit = 0;

  for (const segment of segments) {
    if (income <= segment.upTo) {
      credit = segment.base + (income - previousUpper) * segment.rate;
      return clampNonNegative(credit);
    }
    previousUpper = segment.upTo;
  }

  const lastSegment = segments[segments.length - 1];
  const overflowCredit =
    lastSegment.base + (income - lastSegment.upTo) * lastSegment.rate;

  return clampNonNegative(overflowCredit);
}

function computeBracketBreakdown(taxableIncome, yearConfig) {
  let remaining = taxableIncome;
  const rows = [];

  for (const bracket of yearConfig.brackets) {
    if (remaining <= 0) {
      rows.push({
        label: bracket.label,
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
      label: bracket.label,
      taxableAmount,
      socialTax,
      payrollTax,
    });

    remaining -= taxableAmount;
  }

  return rows;
}

function rulingCategoryLabel(key) {
  switch (key) {
    case "young_masters":
      return "Young + masters";
    case "age_30_plus":
      return "30+";
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

  const thresholdByCategory = yearConfig.rulingThresholds[input.rulingCategory] || Infinity;
  const rulingAllowed =
    input.rulingCategory !== "none" && baseAnnualGross >= thresholdByCategory;
  const rulingDeduction = rulingAllowed ? totalGross * 0.3 : 0;

  const taxableIncome = clampNonNegative(totalGross - rulingDeduction);
  const bracketRows = computeBracketBreakdown(taxableIncome, yearConfig);

  const socialSecurityTax = bracketRows.reduce(
    (sum, row) => sum + row.socialTax,
    0,
  );
  const payrollTax = bracketRows.reduce((sum, row) => sum + row.payrollTax, 0);

  const generalTaxCredit = computeGeneralCredit(taxableIncome, yearConfig);
  const labourTaxCredit = computeLabourCredit(taxableIncome, yearConfig);

  const netTaxes = socialSecurityTax + payrollTax - generalTaxCredit - labourTaxCredit;
  const annualNetIncome = totalGross - netTaxes;
  const monthlyNetIncome = annualNetIncome / 12;

  return {
    input,
    baseAnnualGross,
    holidayAllowance,
    totalGross,
    rulingAllowed,
    rulingDeduction,
    taxableIncome,
    bracketRows,
    socialSecurityTax,
    payrollTax,
    generalTaxCredit,
    labourTaxCredit,
    netTaxes,
    annualNetIncome,
    monthlyNetIncome,
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
        <tr><td>Holiday Allowance</td><td class="${rowClass(model.holidayAllowance)}">${toEuro(model.holidayAllowance)}</td></tr>
        <tr class="section-final"><td>Total gross income</td><td class="${rowClass(model.totalGross)}">${toEuro(model.totalGross)}</td></tr>

        <tr class="section-divider"><td colspan="2"></td></tr>

        <tr><td>30% ruling deduction</td><td class="${rowClass(-model.rulingDeduction)}">${toEuro(-model.rulingDeduction)}</td></tr>
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
      </tbody>
    </table>
  `;
}

function buildCalculationLines(model) {
  const lines = [];
  const threshold = DUTCH_TAX_DATA.years[model.input.taxYear].rulingThresholds[model.input.rulingCategory];

  lines.push(`<p>Total income = ${toEuro(model.baseAnnualGross)} + ${toEuro(model.holidayAllowance)} = ${toEuro(model.totalGross)}</p>`);
  lines.push(
    `<p>30% ruling (${rulingCategoryLabel(model.input.rulingCategory)}): threshold ${toEuro(
      threshold || 0,
    )}, deduction = ${toEuro(model.rulingDeduction)}</p>`,
  );
  lines.push(`<p>Taxable income = ${toEuro(model.totalGross)} - ${toEuro(model.rulingDeduction)} = ${toEuro(model.taxableIncome)}</p>`);

  for (const row of model.bracketRows) {
    const totalRate = row.taxableAmount === 0 ? 0 : (row.socialTax + row.payrollTax) / row.taxableAmount;
    lines.push(
      `<p>${row.label}: income ${toEuro(row.taxableAmount)}, tax rate ${(totalRate * 100).toFixed(2)}%, tax ${toEuro(
        row.socialTax + row.payrollTax,
      )}</p>`,
    );
  }

  lines.push(`<p>General tax credit = ${toEuro(model.generalTaxCredit)}</p>`);
  lines.push(`<p>Labour tax credit = ${toEuro(model.labourTaxCredit)}</p>`);
  lines.push(`<p>Net taxes = ${toEuro(model.netTaxes)}</p>`);

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

  const rows = [];

  rows.push(["Total income", "30% deduction", model.rulingDeduction]);
  rows.push(["Total income", "Taxable income", model.taxableIncome]);

  model.bracketRows.forEach((row, index) => {
    const bracketNode = `${row.label}`;
    const bracketTaxNode = `Tax ${index + 1}`;
    rows.push(["Taxable income", bracketNode, row.taxableAmount]);
    rows.push([bracketNode, bracketTaxNode, row.socialTax + row.payrollTax]);
  });

  rows.push(["Taxable income", "Net income", model.annualNetIncome]);

  dataTable.addRows(rows.filter((row) => row[2] > 0));

  const chart = new window.google.visualization.Sankey(chartEl);
  chart.draw(dataTable, {
    width: chartEl.clientWidth,
    height: 260,
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
        <div class="dutch-tax-page__title-wrap">
        <h2 class="dutch-tax-page__title">Dutch Tax Calculator</h2>
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
                    <label for="ruling-category">30% ruling category</label>
                    <select id="ruling-category" name="rulingCategory">
                    <option value="none">None</option>
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

        <details class="dutch-tax-page__details" id="dutch-tax-calculation-details" open>
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
      await ensureGoogleCharts();
      drawSankey(model, chartEl);
    } catch (error) {
      chartEl.innerHTML = `<p class="chart-error">Unable to load Sankey chart.</p>`;
    }
  };

  form.addEventListener("input", render);
  form.addEventListener("change", render);

  render();
}
