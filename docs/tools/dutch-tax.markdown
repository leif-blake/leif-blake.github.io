---
layout: page
title: Dutch Income Tax Calculator
permalink: /tools/dutch-tax/
description: Estimate your monthly and annual net income in the Netherlands using Box 1 brackets, tax credits, holiday allowance, and optional 30% ruling assumptions.
---

<link rel="stylesheet" href="{{ '/assets/tools/tools.css' | relative_url }}">

<script type="module">
  import { initDutchTaxCalculator } from "{{ '/assets/tools/dutch-tax-calculator.js' | relative_url }}";

  const host = document.getElementById("tool-host");
  if (host) {
    initDutchTaxCalculator({ host });
  }
</script>

<div class="dutch-tax-page" aria-label="Dutch tax calculator">
  <p>This is a simple tool I made to estimate your net income in the Netherlands (Box 1). No guarantees are made regarding the accuracy of the calculations. Consult a tax professional before making any financial decisions.</p>
  </div>

<div class="tools-shell" id="tools-shell">
  <div class="tools-shell__host" id="tool-host" aria-live="polite"></div>
</div>

<div class="dutch-tax-seo-copy">
  <p></p>
  <p>This calculator estimates Dutch Box 1 personal income outcomes from a gross salary input. It supports monthly or annual income, optional holiday allowance inclusion, tax year selection, and expat ruling scenarios.</p>
  <ul>
    <li>Outputs: annual net income, monthly net income, effective tax rate</li>
    <li>Breakdown: expat ruling deduction, social security tax, payroll tax, general tax credit, labour tax credit</li>
  </ul>
  <p>Last updated: {{ site.time | date: "%Y-%m-%d" }}</p>
</div>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Dutch Income Tax Calculator",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "description": "Estimate Dutch net income from gross salary using Box 1 brackets, tax credits, holiday allowance handling, and optional expat ruling assumptions.",
  "url": "{{ '/tools/dutch-tax/' | absolute_url }}",
  "author": {
    "@type": "Person",
    "name": "Leif Blake"
  }
}
</script>
