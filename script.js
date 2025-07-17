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
    const description = lines.find(l => l.includes("Description:"))?.split("Description:")[1]?.trim();
    const language = lines.find(l => l.includes("Language:"))?.split("Language:")[1]?.trim();
    const stars = parseInt(lines.find(l => l.includes("Stars:"))?.split("Stars:")[1]) || 0;
    const forks = parseInt(lines.find(l => l.includes("Forks:"))?.split("Forks:")[1]) || 0;
    const size = parseInt(lines.find(l => l.includes("Size:"))?.split("Size:")[1]) || 0;
    const created = lines.find(l => l.includes("Created:"))?.split("Created:")[1]?.trim();
    const updated = lines.find(l => l.includes("Updated:"))?.split("Updated:")[1]?.trim();
    const readme = lines.find(l => l.includes("README:"))?.split("README:")[1]?.trim();
    const release = lines.find(l => l.includes("Latest Release:"))?.split("Latest Release:")[1]?.trim();
    const issues = parseInt(lines.find(l => l.includes("Open Issues:"))?.split("Open Issues:")[1]) || 0;
    const prs = parseInt(lines.find(l => l.includes("Open PRs:"))?.split("Open PRs:")[1]) || 0;
    const commits = parseInt(lines.find(l => l.includes("Commits (last year):"))?.split("Commits (last year):")[1]) || 0;
    const contributors = parseInt(lines.find(l => l.includes("Contributors:"))?.split("Contributors:")[1]) || 0;
    const workflows = parseInt(lines.find(l => l.includes("Workflows:"))?.split("Workflows:")[1]) || 0;

    repos.push({ 
      name, description, language, stars, forks, size, created, updated,
      readme, release, issues, prs, commits, contributors, workflows
    });
  });

  renderRepos(repos);
  renderCharts(repos);
}

function renderRepos(repos) {
  const container = document.getElementById('repos');
  container.innerHTML = '';
  repos.forEach(r => {
    const readmeStatus = r.readme === 'Available' ? '✅' : '❌';
    const activityLevel = r.commits > 100 ? '🔥 Very Active' : r.commits > 50 ? '🟡 Active' : r.commits > 10 ? '🟠 Moderate' : '⚫ Low';
    
    container.innerHTML += `
      <div class="repo-card">
        <h2>${r.name}</h2>
        <div class="repo-stats">
          <span class="language">${r.language || 'N/A'}</span>
          <span class="stars">⭐ ${r.stars}</span>
          <span class="forks">🍴 ${r.forks}</span>
        </div>
        <p><strong>Description:</strong> ${r.description || 'No description'}</p>
        <div class="repo-details">
          <p><strong>README:</strong> ${readmeStatus} ${r.readme}</p>
          <p><strong>Latest Release:</strong> ${r.release || 'None'}</p>
          <p><strong>Activity:</strong> ${activityLevel} (${r.commits} commits)</p>
          <p><strong>Size:</strong> ${r.size} KB</p>
          <p><strong>Contributors:</strong> ${r.contributors}</p>
          <p><strong>Created:</strong> ${r.created}</p>
          <p><strong>Last Updated:</strong> ${r.updated}</p>
        </div>
        <div class="repo-metrics">
          <span class="metric">Issues: ${r.issues}</span>
          <span class="metric">PRs: ${r.prs}</span>
          <span class="metric">Workflows: ${r.workflows}</span>
        </div>
      </div>
    `;
  });

  const now = new Date();
  document.getElementById('timestamp').textContent = now.toLocaleString();
}

function renderCharts(repos) {
  // Issues and PRs Chart
  const ctx1 = document.getElementById('issuesPRsChart').getContext('2d');
  const labels = repos.map(r => r.name);
  const issueCounts = repos.map(r => r.issues);
  const prCounts = repos.map(r => r.prs);

  new Chart(ctx1, {
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
      plugins: { 
        title: { display: true, text: 'Issues & Pull Requests' },
        legend: { position: 'bottom' } 
      }
    }
  });

  // Stars and Forks Chart
  const ctx2 = document.getElementById('starsForksChart').getContext('2d');
  const starCounts = repos.map(r => r.stars);
  const forkCounts = repos.map(r => r.forks);

  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Stars', data: starCounts, backgroundColor: '#ffeb3b' },
        { label: 'Forks', data: forkCounts, backgroundColor: '#4caf50' }
      ]
    },
    options: {
      responsive: true,
      plugins: { 
        title: { display: true, text: 'Stars & Forks' },
        legend: { position: 'bottom' } 
      }
    }
  });

  // Commit Activity Chart
  const ctx3 = document.getElementById('activityChart').getContext('2d');
  const commitCounts = repos.map(r => r.commits);

  new Chart(ctx3, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Commits (Last Year)',
        data: commitCounts,
        borderColor: '#9c27b0',
        backgroundColor: 'rgba(156, 39, 176, 0.1)',
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: { 
        title: { display: true, text: 'Repository Activity' },
        legend: { position: 'bottom' } 
      }
    }
  });

  // Language Distribution
  const ctx4 = document.getElementById('languageChart').getContext('2d');
  const languageData = {};
  repos.forEach(r => {
    const lang = r.language || 'Unknown';
    languageData[lang] = (languageData[lang] || 0) + 1;
  });

  new Chart(ctx4, {
    type: 'doughnut',
    data: {
      labels: Object.keys(languageData),
      datasets: [{
        data: Object.values(languageData),
        backgroundColor: [
          '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', 
          '#9966ff', '#ff9f40', '#ff6384', '#c9cbcf'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: { 
        title: { display: true, text: 'Programming Languages' },
        legend: { position: 'right' } 
      }
    }
  });
}

fetchLog();
