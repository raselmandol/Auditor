const fs = require('fs');
const { Octokit } = require("@octokit/rest");

const token = process.env.GH_TOKEN;
const username = "raselmandol"; // GitHub username

const octokit = new Octokit({ auth: token });

(async () => {
  const repos = await octokit.paginate(octokit.repos.listForUser, {
    username,
    per_page: 100
  });

  const timestamp = new Date().toISOString();
  let log = `# GitHub Audit Log\n\n**Last updated:** ${timestamp}\n\n`;

  for (const repo of repos) {
    log += `## ${repo.name}\n`;
    log += `🔹 Description: ${repo.description || "N/A"}\n`;
    log += `🔹 Private: ${repo.private ? "Yes" : "No"}\n`;

    // README
    try {
      await octokit.repos.getReadme({ owner: username, repo: repo.name });
      log += `🔹 README: Available\n`;
    } catch {
      log += `🔹 README: Not Found\n`;
    }

    // Releases
    const releases = await octokit.repos.listReleases({ owner: username, repo: repo.name });
    if (releases.data.length > 0) {
      log += `🔹 Latest Release: ${releases.data[0].name || releases.data[0].tag_name}\n`;
    } else {
      log += `🔹 Latest Release: None\n`;
    }

    // Issues + PRs
    const [issues, pulls] = await Promise.all([
      octokit.issues.listForRepo({ owner: username, repo: repo.name, state: "open" }),
      octokit.pulls.list({ owner: username, repo: repo.name, state: "open" })
    ]);
    log += ` Open Issues: ${issues.data.length}\n`;
    log += ` Open PRs: ${pulls.data.length}\n`;

    // Actions
    try {
      const workflows = await octokit.actions.listRepoWorkflows({ owner: username, repo: repo.name });
      for (const wf of workflows.data.workflows) {
        log += ` Workflow: ${wf.name} → Status: ${wf.state}\n`;
      }
    } catch {
      log += ` Workflows: N/A\n`;
    }

    log += `---\n\n`;
  }

  fs.writeFileSync('log.txt', log);
})();
