---
layout: page
title: Tools
permalink: /tools/
---

<link rel="stylesheet" href="{{ '/assets/tools/tools.css' | relative_url }}">

<div class="tools-shell" id="tools-shell">
  <div class="tools-shell__toolbar">
    <label class="tools-shell__select-label" for="tool-select">Select tool</label>
    <select id="tool-select" class="tools-shell__select" aria-label="Select a tool"></select>
  </div>

  <div class="tools-shell__host" id="tool-host" aria-live="polite"></div>
</div>

<script type="module" src="{{ '/assets/tools/tools-hub.js' | relative_url }}"></script>
