export function initPlaceholderTool({ host }) {
  host.innerHTML = `
    <section class="tool-shell" aria-labelledby="coming-soon-heading">
      <div class="tool-card tool-card--inputs">
        <h2 id="coming-soon-heading">Tool Placeholder</h2>
        <p>Use this module as a template for your next tool.</p>
      </div>
      <div class="tool-card tool-card--outputs">
        <p>Each tool can define its own inputs, outputs, and chart area in a separate file.</p>
      </div>
      <div class="tool-card tool-card--chart">
        <p>Future visual output area.</p>
      </div>
    </section>
  `;
}
