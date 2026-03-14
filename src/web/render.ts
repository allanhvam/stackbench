export function renderHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Stackbench</title>
    <style>
      :root {
        --bg-top: #f7efe4;
        --bg-bottom: #f3f8ed;
        --ink: #17223b;
        --ink-muted: #4d5b7c;
        --card: rgba(255, 255, 255, 0.82);
        --accent: #0b8f87;
        --accent-soft: #c9f1ee;
        --warn: #b96c00;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        color: var(--ink);
        font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
        background: radial-gradient(circle at 20% 10%, #ffe9d6 0%, transparent 40%),
                    radial-gradient(circle at 85% 25%, #d6efe9 0%, transparent 35%),
                    linear-gradient(160deg, var(--bg-top), var(--bg-bottom));
        min-height: 100vh;
      }
      .shell {
        max-width: 980px;
        margin: 0 auto;
        padding: 2rem 1rem 3rem;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 0.7rem;
      }
      .brand-icon {
        width: 38px;
        height: 38px;
        flex: 0 0 auto;
      }
      h1 {
        margin: 0;
        font-size: clamp(1.8rem, 4vw, 3rem);
        letter-spacing: -0.03em;
      }
      .subtitle {
        margin-top: 0.5rem;
        color: var(--ink-muted);
      }
      .card {
        margin-top: 1.25rem;
        background: var(--card);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(23, 34, 59, 0.08);
        border-radius: 20px;
        padding: 1rem;
      }
      .tab-bar {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
      }
      .tab-btn {
        border: 1px solid rgba(23, 34, 59, 0.12);
        background: rgba(255, 255, 255, 0.7);
        color: var(--ink-muted);
        border-radius: 999px;
        padding: 0.35rem 0.75rem;
        font-size: 0.85rem;
        cursor: pointer;
      }
      .tab-btn.active {
        background: var(--accent-soft);
        color: #0b4f4a;
        border-color: rgba(11, 79, 74, 0.2);
        font-weight: 600;
      }
      .view {
        margin-top: 0.65rem;
      }
      .scenario-group + .scenario-group {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(23, 34, 59, 0.08);
      }
      .scenario-title {
        margin: 0;
        font-size: 1rem;
      }
      .scenario-link {
        border: 0;
        background: none;
        padding: 0;
        margin: 0;
        color: var(--ink);
        font: inherit;
        font-size: inherit;
        text-align: left;
        cursor: pointer;
        text-decoration: underline;
        text-decoration-color: rgba(11, 143, 135, 0.35);
        text-underline-offset: 3px;
      }
      .scenario-link:hover {
        color: var(--accent);
      }
      .result-cell-btn {
        border: 0;
        background: none;
        color: inherit;
        font: inherit;
        padding: 0;
        margin: 0;
        cursor: pointer;
        text-decoration: underline;
        text-decoration-color: rgba(11, 143, 135, 0.35);
        text-underline-offset: 3px;
      }
      .result-cell-btn:hover {
        color: var(--accent);
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
      }
      th, td {
        text-align: left;
        padding: 0.65rem;
        vertical-align: top;
      }
      th {
        color: var(--ink-muted);
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      tr + tr { border-top: 1px solid rgba(23, 34, 59, 0.08); }
      .tech {
        font-weight: 600;
        color: var(--accent);
      }
      .muted {
        color: var(--ink-muted);
      }
      .empty {
        color: var(--warn);
        font-weight: 600;
      }
      .run-time {
        margin-top: 0.85rem;
        text-align: right;
        color: var(--ink-muted);
        font-size: 0.85rem;
      }
      .page-footer {
        margin-top: 1.25rem;
        display: flex;
        align-items: center;
        gap: 0.55rem;
        justify-content: flex-end;
      }
      .footer-cta {
        color: var(--ink-muted);
        text-decoration: none;
        font-size: 0.85rem;
      }
      .footer-cta:hover {
        color: var(--accent);
        text-decoration: underline;
      }
      .github-link {
        width: 38px;
        height: 38px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.74);
        border: 1px solid rgba(23, 34, 59, 0.12);
        color: var(--ink);
        transition: transform 0.15s ease, background 0.15s ease;
      }
      .github-link:hover {
        background: #ffffff;
        transform: translateY(-1px);
      }
      .github-link svg {
        width: 20px;
        height: 20px;
      }
      .scenario-dialog {
        border: 1px solid rgba(23, 34, 59, 0.15);
        border-radius: 16px;
        max-width: min(680px, 92vw);
        width: 100%;
        padding: 0;
      }
      .scenario-dialog::backdrop {
        background: rgba(23, 34, 59, 0.25);
      }
      .scenario-dialog-body {
        padding: 1rem;
      }
      .scenario-dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }
      .scenario-dialog-title {
        margin: 0;
        font-size: 1.1rem;
      }
      .scenario-dialog-close {
        border: 1px solid rgba(23, 34, 59, 0.15);
        background: #fff;
        border-radius: 8px;
        padding: 0.3rem 0.55rem;
        cursor: pointer;
      }
      .scenario-dialog-prompt {
        margin: 0.8rem 0 0;
        white-space: pre-wrap;
        color: var(--ink-muted);
        line-height: 1.45;
      }
      @media (max-width: 700px) {
        table, thead, tbody, tr, td, th { display: block; }
        thead { display: none; }
        tr {
          border-top: 1px solid rgba(23, 34, 59, 0.08);
          padding: 0.6rem 0;
        }
        td {
          padding: 0.3rem 0;
        }
        td::before {
          content: attr(data-label) ": ";
          color: var(--ink-muted);
          font-size: 0.85rem;
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <div class="brand">
        <svg class="brand-icon" viewBox="0 0 64 64" role="img" aria-label="Stackbench icon">
          <defs>
            <linearGradient id="stackbenchGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#0b8f87" />
              <stop offset="100%" stop-color="#1f5a8a" />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#stackbenchGradient)" />
          <path d="M14 39c0-6 4-10 10-10h16c6 0 10-4 10-10" fill="none" stroke="#eafdf9" stroke-width="4" stroke-linecap="round" />
          <circle cx="23" cy="44" r="5" fill="#ffe9d6" />
          <circle cx="41" cy="31" r="5" fill="#ffe9d6" />
          <circle cx="51" cy="17" r="5" fill="#ffe9d6" />
        </svg>
        <h1>Stackbench</h1>
      </div>
      <p class="subtitle">How an AI model chooses technologies across scenarios.</p>

      <section class="card" id="table"></section>

      <footer class="page-footer">
        <a
          class="footer-cta"
          href="https://github.com/allanhvam/stackbench/pulls"
          target="_blank"
          rel="noreferrer noopener"
        >
          New scenario? Submit PR
        </a>
        <a
          class="github-link"
          href="https://github.com/allanhvam/stackbench"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Stackbench on GitHub"
          title="Stackbench on GitHub"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0.5c-6.35 0-11.5 5.16-11.5 11.53 0 5.09 3.29 9.41 7.86 10.93 0.58 0.11 0.79-0.25 0.79-0.56 0-0.28-0.01-1.02-0.01-2-3.2 0.7-3.87-1.55-3.87-1.55-0.52-1.33-1.27-1.68-1.27-1.68-1.04-0.71 0.08-0.7 0.08-0.7 1.15 0.08 1.76 1.19 1.76 1.19 1.02 1.76 2.67 1.25 3.32 0.96 0.1-0.74 0.4-1.25 0.72-1.54-2.55-0.29-5.23-1.28-5.23-5.71 0-1.26 0.44-2.29 1.18-3.1-0.12-0.29-0.51-1.47 0.11-3.06 0 0 0.96-0.31 3.15 1.18a10.9 10.9 0 0 1 5.73 0c2.19-1.49 3.15-1.18 3.15-1.18 0.62 1.59 0.23 2.77 0.11 3.06 0.73 0.81 1.18 1.84 1.18 3.1 0 4.44-2.68 5.41-5.24 5.7 0.41 0.36 0.78 1.06 0.78 2.14 0 1.55-0.01 2.8-0.01 3.18 0 0.31 0.21 0.68 0.8 0.56 4.56-1.52 7.85-5.84 7.85-10.93C23.5 5.66 18.35 0.5 12 0.5z" />
          </svg>
        </a>
      </footer>

      <dialog class="scenario-dialog" id="scenario-dialog">
        <div class="scenario-dialog-body">
          <div class="scenario-dialog-header">
            <h2 class="scenario-dialog-title" id="scenario-dialog-title">Scenario</h2>
            <button class="scenario-dialog-close" id="scenario-dialog-close" type="button">Close</button>
          </div>
          <p class="scenario-dialog-prompt" id="scenario-dialog-prompt"></p>
        </div>
      </dialog>
    </main>

    <script>
      function formatRunAt(startedAt) {
        if (!startedAt) {
          return 'N/A';
        }
        return new Date(startedAt).toLocaleString();
      }

      async function boot() {
        const tableEl = document.getElementById('table');
        const dialogEl = document.getElementById('scenario-dialog');
        const dialogTitleEl = document.getElementById('scenario-dialog-title');
        const dialogPromptEl = document.getElementById('scenario-dialog-prompt');
        const dialogCloseEl = document.getElementById('scenario-dialog-close');

        const [resultRes, scenarioRes] = await Promise.all([
          fetch('/api/results'),
          fetch('/api/scenarios')
        ]);
        const payload = await resultRes.json();
        const scenarios = await scenarioRes.json();
        const promptById = Object.fromEntries(scenarios.map((scenario) => [scenario.id, scenario.prompt]));

        dialogCloseEl.addEventListener('click', () => {
          dialogEl.close();
        });

        dialogEl.addEventListener('click', (event) => {
          if (event.target === dialogEl) {
            dialogEl.close();
          }
        });

        function openScenarioDialog(title, prompt) {
          dialogTitleEl.textContent = title;
          dialogPromptEl.textContent = prompt || 'No prompt found for this scenario.';
          dialogEl.showModal();
        }

        function wireScenarioLinks() {
          const links = tableEl.querySelectorAll('.scenario-link');
          links.forEach((link) => {
            link.addEventListener('click', () => {
              const caseId = link.getAttribute('data-case-id');
              const title = link.textContent || 'Scenario';
              const prompt = caseId ? promptById[caseId] : null;
              openScenarioDialog(title, prompt);
            });
          });
        }

        function getDecisionValue(decision, field) {
          if (field === 'runtime') {
            return decision.runtime;
          }
          if (field === 'language') {
            return decision.language;
          }
          if (field === 'webServer') {
            return decision.webServer;
          }
          if (field === 'database') {
            return decision.database;
          }
          return null;
        }

        function wireOverallResultCells() {
          const cells = tableEl.querySelectorAll('.result-cell-btn');
          cells.forEach((cell) => {
            cell.addEventListener('click', () => {
              const caseId = cell.getAttribute('data-case-id');
              const field = cell.getAttribute('data-field');
              const fieldLabel = cell.getAttribute('data-field-label') || 'Choice';

              if (!caseId || !field) {
                return;
              }

              const rows = payload.cases.filter((row) => row.caseId === caseId);
              const caseTitle = rows[0]?.caseTitle || 'Scenario';
              const detailLines = rows.map((row) => {
                const value = getDecisionValue(row.decision, field) || '-';
                return row.model + ': ' + value;
              });

              openScenarioDialog(caseTitle + ' - ' + fieldLabel, detailLines.join('\\n'));
            });
          });
        }

        if (!payload || !payload.cases || payload.cases.length === 0) {
          tableEl.innerHTML = '<div class="empty">No benchmark results yet. Run npm run benchmark first.</div>';
          return;
        }

        function normalizeChoice(value) {
          const compact = String(value).trim().replace(/\\s+/g, ' ');
          return compact
            .replace(/\\s*\\([^)]*\\)/g, '')
            .replace(/\\s*\\(v?\\d+(?:\\.\\d+)*\\)$/i, '')
            .replace(/\\s+v?\\d+(?:\\.\\d+)*(?:\\s*(?:lts|rc\\d*))?$/i, '')
            .replace(/\\s+/g, ' ')
            .trim();
        }

        function mostCommon(values) {
          const counts = new Map();
          values
            .filter((value) => value && String(value).trim().length > 0)
            .forEach((value) => {
              const normalized = normalizeChoice(value);
              if (!normalized) {
                return;
              }
              const key = normalized.toLowerCase();
              const existing = counts.get(key);
              if (existing) {
                existing.count += 1;
                return;
              }

              counts.set(key, { count: 1, label: normalized });
            });

          if (counts.size === 0) {
            return '-';
          }

          const entries = Array.from(counts.values());
          const maxCount = Math.max(...entries.map((entry) => entry.count));
          const topEntries = entries.filter((entry) => entry.count === maxCount);

          if (topEntries.length !== 1) {
            return '-';
          }

          return topEntries[0].label;
        }

        function sortScenarioGroupsByName(groups) {
          return groups.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
        }

        function renderOverallView() {
          const grouped = new Map();
          payload.cases.forEach((row) => {
            if (!grouped.has(row.caseId)) {
              grouped.set(row.caseId, { id: row.caseId, title: row.caseTitle, items: [] });
            }
            grouped.get(row.caseId).items.push(row);
          });

          const rowsHtml = sortScenarioGroupsByName(Array.from(grouped.values())).map((group) =>
            '<tr>' +
              '<td data-label="Scenario"><button class="scenario-link" type="button" data-case-id="' + group.id + '">' + group.title + '</button></td>' +
              '<td data-label="Runtime" class="tech"><button class="result-cell-btn" type="button" data-case-id="' + group.id + '" data-field="runtime" data-field-label="Runtime">' + mostCommon(group.items.map((item) => item.decision.runtime)) + '</button></td>' +
              '<td data-label="Language" class="tech"><button class="result-cell-btn" type="button" data-case-id="' + group.id + '" data-field="language" data-field-label="Language">' + mostCommon(group.items.map((item) => item.decision.language)) + '</button></td>' +
              '<td data-label="Web Server" class="tech"><button class="result-cell-btn" type="button" data-case-id="' + group.id + '" data-field="webServer" data-field-label="Web Server">' + mostCommon(group.items.map((item) => item.decision.webServer)) + '</button></td>' +
              '<td data-label="Database" class="tech"><button class="result-cell-btn" type="button" data-case-id="' + group.id + '" data-field="database" data-field-label="Database">' + mostCommon(group.items.map((item) => item.decision.database)) + '</button></td>' +
            '</tr>'
          ).join('');

          return (
            '<div class="view">' +
              '<table>' +
                '<thead>' +
                  '<tr>' +
                    '<th>Scenario</th>' +
                    '<th>Runtime</th>' +
                    '<th>Language</th>' +
                    '<th>Web Server</th>' +
                    '<th>Database</th>' +
                  '</tr>' +
                '</thead>' +
                '<tbody>' + rowsHtml + '</tbody>' +
              '</table>' +
            '</div>'
          );
        }

        function renderScenarioGroupsView() {
          const grouped = new Map();
          payload.cases.forEach((row) => {
            if (!grouped.has(row.caseId)) {
              grouped.set(row.caseId, { id: row.caseId, title: row.caseTitle, items: [] });
            }
            grouped.get(row.caseId).items.push(row);
          });

          const groupsHtml = sortScenarioGroupsByName(Array.from(grouped.values())).map((group) => {
            const rows = group.items.map((row) =>
              '<tr>' +
                '<td data-label="Model" class="tech">' + row.model + '</td>' +
                '<td data-label="Runtime" class="tech">' + (row.decision.runtime || '-') + '</td>' +
                '<td data-label="Language" class="tech">' + (row.decision.language || '-') + '</td>' +
                '<td data-label="Web Server" class="tech">' + (row.decision.webServer || '-') + '</td>' +
                '<td data-label="Database" class="tech">' + (row.decision.database || '-') + '</td>' +
              '</tr>'
            ).join('');

            return (
              '<section class="scenario-group">' +
                '<h3 class="scenario-title"><button class="scenario-link" type="button" data-case-id="' + group.id + '">' + group.title + '</button></h3>' +
                '<table>' +
                  '<thead>' +
                    '<tr>' +
                      '<th>Model</th>' +
                      '<th>Runtime</th>' +
                      '<th>Language</th>' +
                      '<th>Web Server</th>' +
                      '<th>Database</th>' +
                    '</tr>' +
                  '</thead>' +
                  '<tbody>' + rows + '</tbody>' +
                '</table>' +
              '</section>'
            );
          }).join('');

          return '<div class="view">' + groupsHtml + '</div>';
        }

        function renderScreen(view) {
          tableEl.innerHTML =
            '<div class="tab-bar">' +
              '<button class="tab-btn ' + (view === 'overall' ? 'active' : '') + '" data-view="overall">Overall</button>' +
              '<button class="tab-btn ' + (view === 'scenario' ? 'active' : '') + '" data-view="scenario">By Scenario</button>' +
            '</div>' +
            (view === 'overall' ? renderOverallView() : renderScenarioGroupsView()) +
            '<div class="run-time">Run: ' + formatRunAt(payload.startedAt) + '</div>';

          const buttons = tableEl.querySelectorAll('.tab-btn');
          buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
              renderScreen(btn.getAttribute('data-view'));
            });
          });

          wireScenarioLinks();
          wireOverallResultCells();
        }

        renderScreen('overall');
      }

      boot().catch((err) => {
        document.getElementById('table').innerHTML = '<div class="empty">Error loading results: ' + err.message + '</div>';
      });
    </script>
  </body>
</html>`;
}