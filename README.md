#  GitHub Auditor

A comprehensive GitHub repository analytics dashboard that automatically monitors and visualizes your GitHub repositories with detailed insights, statistics, and interactive charts.

![GitHub Auditor Dashboard](https://img.shields.io/badge/GitHub-Auditor-blue?style=for-the-badge&logo=github)
![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-green?style=for-the-badge&logo=githubactions)
![Chart.js](https://img.shields.io/badge/Chart.js-Visualizations-orange?style=for-the-badge&logo=chartdotjs)

##  Features

###  **Interactive Dashboard**
- **Multiple Chart Types**: Bar charts, line graphs, and doughnut charts for comprehensive data visualization
- **Repository Cards**: Detailed information cards for each repository with activity indicators
- **Real-time Data**: Automatically updated every 6 hours with fresh repository statistics

###  **Analytics & Metrics**
- **Repository Overview**: Stars, forks, size, language, and creation dates
- **Activity Tracking**: Commit activity over the last year with activity level indicators
- **Development Metrics**: Open issues, pull requests, and workflow status
- **Contributor Analysis**: Number of contributors per repository
- **README Status**: Automatic detection of README file availability
- **Release Tracking**: Latest release information for each repository

###  **Visual Elements**
- **Language Distribution**: Pie chart showing programming language usage across repositories
- **Stars & Forks Comparison**: Visual comparison of repository popularity
- **Issues & PRs Tracking**: Monitor open issues and pull requests
- **Activity Levels**: Color-coded activity indicators (🔥 Very Active, 🟡 Active, 🟠 Moderate, ⚫ Low)

##  Quick Start

### Prerequisites
- GitHub account with repositories
- GitHub Personal Access Token (Classic)
- GitHub Pages enabled (optional, for hosting the dashboard)

### 1. Fork/Clone Repository
```bash
git clone https://github.com/raselmandol/Auditor.git
cd Auditor
```

### 2. Setup GitHub Secrets
Go to your repository **Settings** -> **Secrets and variables** -> **Actions** and add:

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `PAT_TOKEN` | GitHub Personal Access Token (Classic) with `repo` scope | ✅ Yes |
| `GH_TOKEN` | Same as PAT_TOKEN (for API calls) | ✅ Yes |
| `GIT_USER_NAME` | Your GitHub username | ✅ Yes |
| `GIT_USER_EMAIL` | Your GitHub email | ✅ Yes |

### 3. Create Personal Access Token
1. Go to GitHub **Settings** -> **Developer settings** -> **Personal access tokens** -> **Tokens (classic)**
2. Click **Generate new token**
3. Select scopes: `repo`, `workflow`
4. Copy the token and add it as `PAT_TOKEN` and `GH_TOKEN` secrets

### 4. Configure Username
Edit `audit.js` and update the username:
```javascript
const username = "your-github-username"; // Replace with your username
```

### 5. Enable GitHub Pages (Optional)
1. Go to repository **Settings** -> **Pages**
2. Select **Deploy from a branch**
3. Choose **main** branch, **/ (root)** folder
4. Your dashboard will be available at: `https://your-username.github.io/Auditor/`

##  How It Works

### Automated Workflow
The GitHub Actions workflow (`audit.yml`) runs:
- **Every 6 hours** automatically
- **On code changes** (but not on log.txt updates to avoid loops)
- **Manually** via GitHub Actions interface

### Data Collection Process
1. **Repository Fetching**: Uses GitHub API to get all public repositories
2. **Detailed Analysis**: Collects comprehensive data for each repository:
   - Basic info (description, language, stars, forks)
   - README status and latest releases
   - Issues, PRs, and workflow information
   - Commit activity and contributor count
3. **Log Generation**: Creates structured log file (`log.txt`)
4. **Auto-commit**: Pushes updated data back to repository

### Dashboard Rendering
1. **Data Parsing**: JavaScript parses the log file
2. **Chart Generation**: Creates interactive charts using Chart.js
3. **Card Rendering**: Displays repository information in organized cards
4. **Real-time Updates**: Shows last update timestamp


##  Usage Examples

### Viewing Your Dashboard
- **GitHub Pages**: `https://your-username.github.io/Auditor/`
- **Local**: Open `index.html` in your browser

### Manual Workflow Trigger
1. Go to **Actions** tab in your repository
2. Select **GitHub Auditor** workflow
3. Click **Run workflow**

### Customizing Data Collection
Modify `audit.js` to add more metrics:
```javascript
// Add custom data collection
const customData = await octokit.someAPI.method({ owner: username, repo: repo.name });
log += ` Custom Metric: ${customData.value}\n`;
```

##  Dashboard Components

### Charts
- **Issues & Pull Requests**: Bar chart comparing open issues and PRs
- **Stars & Forks**: Repository popularity metrics
- **Repository Activity**: Line chart showing commit activity trends
- **Programming Languages**: Distribution of languages across repositories

### Repository Cards
Each card displays:
- Repository name with language badge
- Stars and forks count
- Description and README status
- Activity level with commit count
- Size, contributors, and dates
- Metrics for issues, PRs, and workflows

##  Configuration

### Workflow Schedule
To change the update frequency, edit `audit.yml`:
```yaml
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours
  # - cron: '0 0 * * *'   # Daily at midnight
  # - cron: '0 0 * * 0'   # Weekly on Sunday
```

### Styling Customization
Modify `style.css` to change:
- Color schemes
- Layout arrangements
- Card designs
- Chart appearances


##  License

This project is open source and available under the [MIT License](LICENSE).

##  Acknowledgments

- **GitHub API**: For providing comprehensive repository data
- **Chart.js**: For beautiful and interactive charts
- **GitHub Actions**: For automated workflow execution
- **GitHub Pages**: For free dashboard hosting
- **Copilot**, **Claude Sonnet 4**, **GPT-4.1**: For always helping me debug errors, suggest code and fixes, and build this repo—including this README.

