const fs = require('fs');
const path = require('path');

const trackerPath = path.join(__dirname, 'backlink-outreach-tracker.md');
const outputPath = path.join(__dirname, 'ui.html');

// Read the tracker file
const content = fs.readFileSync(trackerPath, 'utf-8');

// Parse markdown table
const lines = content.split('\n');
const dataRows = [];
let inTable = false;

for (const line of lines) {
  if (line.startsWith('| # |')) {
    inTable = true;
    continue;
  }
  if (line.startsWith('|---')) continue;
  if (inTable && line.startsWith('|')) {
    const cells = line.split('|').slice(1, -1).map(c => c.trim());
    if (cells.length >= 11) {
      dataRows.push({
        num: cells[0],
        site: cells[1],
        url: cells[2],
        contact: cells[3],
        email: cells[4],
        category: cells[5],
        targetSite: cells[6],
        anchor: cells[7],
        targetPage: cells[8],
        status: cells[9],
        followup: cells[10],
        template: cells[11] || ''
      });
    }
  }
}

// Generate HTML rows
const tableRows = dataRows.map(row => {
  const statusClass = row.status === 'outreach_sent' ? 'status-sent' : 
                      row.status === 'form_submitted' ? 'status-form' : 'status-pending';
  return `    <tr>
      <td>${row.num}</td>
      <td>${escapeHtml(row.site)}</td>
      <td><a href="${row.url}" target="_blank">link</a></td>
      <td>${escapeHtml(row.contact)}</td>
      <td>${row.email === '—' ? '<em>—</em>' : escapeHtml(row.email)}</td>
      <td><span class="pill ${statusClass}">${escapeHtml(row.status)}</span></td>
      <td>${escapeHtml(row.category)}</td>
      <td>${escapeHtml(row.targetSite)}</td>
    </tr>`;
}).join('\n');

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CRM Dashboard - Backlink Outreach</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f0f; color: #f5f5f5; margin: 0; }
    h1, h2 { color: #d4af37; margin: 8px 0; }
    .layout { display: flex; min-height: 100vh; }
    .sidebar { width: 240px; background: #111; border-right: 1px solid #222; padding: 20px 16px; position: fixed; top: 0; left: 0; height: 100vh; overflow-y: auto; box-sizing: border-box; }
    .sidebar h3 { color: #d4af37; font-size: 13px; margin: 14px 0 6px; text-transform: uppercase; letter-spacing: 0.08em; }
    .sidebar a { display: block; text-decoration: none; color: #d4af37; background: #1b1b1b; padding: 8px 10px; border-radius: 8px; border: 1px solid #2a2a2a; font-size: 12px; margin-bottom: 8px; }
    .sidebar a:hover { background: #262626; }
    .sidebar .external { background: #222; border-color: #3a3a3a; }
    .content { flex: 1; margin-left: 240px; padding: 24px; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .stat-card { background: #1a1a1a; border: 1px solid #333; border-radius: 10px; padding: 16px; text-align: center; }
    .stat-card h3 { color: #d4af37; font-size: 32px; margin: 0; }
    .stat-card p { color: #bbb; margin: 4px 0 0; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; background: #1a1a1a; border: 1px solid #333; border-radius: 10px; overflow: hidden; }
    th, td { border: 1px solid #2f2f2f; padding: 8px 10px; text-align: left; }
    th { background: #222; color: #d4af37; position: sticky; top: 0; z-index: 10; }
    tr:nth-child(even) { background: #141414; }
    tr:hover { background: #1f1f1f; }
    .pill { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-right: 4px; }
    .status-pending { background: #333; color: #ff9800; }
    .status-sent { background: #1b5e20; color: #4caf50; }
    .status-form { background: #0d47a1; color: #2196f3; }
    .scroll { max-height: calc(100vh - 200px); overflow: auto; border-radius: 10px; }
    a { color: #d4af37; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .filter-bar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
    .filter-bar button { background: #1b1b1b; border: 1px solid #333; color: #d4af37; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px; }
    .filter-bar button:hover { background: #262626; }
    .filter-bar button.active { background: #d4af37; color: #000; }
    em { color: #666; }
  </style>
</head>
<body>
  <div class="sidebar">
    <h3 style="color:#d4af37;margin-top:0;">📊 CRM</h3>
    <a href="#stats">Stats Overview</a>
    <a href="#backlinks">Backlink Tracker</a>
    <a class="external" href="directory.html">Directory View</a>
    <h3>Filter by Status</h3>
    <button onclick="filterTable('all')" style="width:100%;margin-bottom:8px;background:#1b1b1b;border:1px solid #333;color:#d4af37;padding:8px;border-radius:6px;cursor:pointer;">All Sites</button>
    <button onclick="filterTable('pending')" style="width:100%;margin-bottom:8px;background:#1b1b1b;border:1px solid #333;color:#d4af37;padding:8px;border-radius:6px;cursor:pointer;">Pending</button>
    <button onclick="filterTable('outreach_sent')" style="width:100%;margin-bottom:8px;background:#1b1b1b;border:1px solid #333;color:#d4af37;padding:8px;border-radius:6px;cursor:pointer;">Outreach Sent</button>
    <button onclick="filterTable('form_submitted')" style="width:100%;background:#1b1b1b;border:1px solid #333;color:#d4af37;padding:8px;border-radius:6px;cursor:pointer;">Form Submitted</button>
  </div>

  <main class="content">
    <h1>🎯 Backlink Outreach Dashboard</h1>
    <p style="color:#bbb;font-size:13px;">Total sites: ${dataRows.length} | Last updated: ${new Date().toLocaleDateString()}</p>

    <div class="stats" id="stats">
      <div class="stat-card">
        <h3>${dataRows.length}</h3>
        <p>Total Sites</p>
      </div>
      <div class="stat-card">
        <h3>${dataRows.filter(r => r.status === 'pending').length}</h3>
        <p>Pending Outreach</p>
      </div>
      <div class="stat-card">
        <h3>${dataRows.filter(r => r.status === 'outreach_sent').length}</h3>
        <p>Outreach Sent</p>
      </div>
      <div class="stat-card">
        <h3>${dataRows.filter(r => r.email !== '—').length}</h3>
        <p>With Email Contact</p>
      </div>
    </div>

    <h2 id="backlinks">Backlink Outreach Tracker</h2>
    <div class="scroll">
      <table id="backlinkTable">
        <thead>
          <tr>
            <th>#</th>
            <th>Site</th>
            <th>URL</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Status</th>
            <th>Category</th>
            <th>Target Site</th>
          </tr>
        </thead>
        <tbody>
${tableRows}
        </tbody>
      </table>
    </div>
  </main>

  <script>
    function filterTable(status) {
      const rows = document.querySelectorAll('#backlinkTable tbody tr');
      rows.forEach(row => {
        const statusCell = row.querySelector('.pill');
        if (status === 'all' || statusCell.textContent.includes(status)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }
  </script>
</body>
</html>`;

fs.writeFileSync(outputPath, html);
console.log('✅ ui.html regenerated with ' + dataRows.length + ' backlinks');
