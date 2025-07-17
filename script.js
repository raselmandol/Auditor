async function fetchLog() {
  const res = await fetch('log.txt');
  const text = await res.text();
  parseLog(text);
}

function parseLog(text) {
  const repos = [];
  const blocks = text.split("## 📁 ").slice(1); // Skip title

  blocks.forEach(block => {
    const lines = block.split("\n");
    const name = lines[0].trim();
    const description = lines.find(l => l.includes("Description:"))?.split("Description:")[1].trim();
    const readme = lines.find(l => l.includes("README:"))?.split(":")[1].trim();
    const release = lines.find(l => l.includes("Latest Release:"))?.split(":")[1].trim();
    const issues = parseInt(lines.find(l => l.includes("Open Issues:"))?.split(":")[1]) || 0;
    const prs = parseInt(lines.find(l => l.includes("Open PRs:"))?.split(":")[1]) || 0;

    repos.push({ name, description, readme, release, issues, prs });
  });

  renderRepos(repos);
  renderChart(repos);
}

function renderRepos(repos) {
  const container = document.getElementById('repos');
  container.innerHTML = '';
  repos.forEach(r => {
    container.innerHTML += `
      <div class="repo-card">
        <h2>${r.name}</h2>
        <p><strong>Description:</strong> ${r.description || 'N/A'}</p>
        <p><strong>README:</strong> ${r.readme}</p>
        <p><strong>Release:</strong> ${r.release}</p>
        <p>Issues: ${r.issues} | PRs: ${r.prs}</p>
      </div>
    `;
  });

  const now = new Date();
  document.getElementById('timestamp').textContent = now.toLocaleString();
}

function renderChart(repos) {
  const ctx = document.getElementById('repoChart').getContext('2d');
  const labels = repos.map(r => r.name);
  const issueCounts = repos.map(r => r.issues);
  const prCounts = repos.map(r => r.prs);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Issues', data: issueCounts, backgroundColor: '#f44336' },
        { label: 'PRs', data: prCounts, backgroundColor: '#2196f3' }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

fetchLog();
