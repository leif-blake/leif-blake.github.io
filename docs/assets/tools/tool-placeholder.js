export function initPlaceholderTool({ host }) {
  host.innerHTML = `
    <section class="tool-shell" aria-labelledby="coming-soon-heading">
      <div class="tool-card tool-card--inputs">
        <h2 id="coming-soon-heading">More Tools coming when I get inspired!</h2>
        <p>If you have any tools you'd like to see, please get in touch at the contact links below!</p>
      </div>
    </section>
  `;
}
