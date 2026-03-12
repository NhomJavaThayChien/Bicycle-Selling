import 'dotenv/config';
import { Version3Client } from 'jira.js';

async function listProjects() {
  console.log('Fetching projects from Jira...');
  const jira = new Version3Client({
    host: process.env.JIRA_HOST.startsWith('http') ? process.env.JIRA_HOST : `https://${process.env.JIRA_HOST}`,
    authentication: {
      basic: {
        email: process.env.JIRA_EMAIL,
        apiToken: process.env.JIRA_API_TOKEN,
      },
    },
  });

  try {
    const response = await jira.projects.searchProjects();
    const projects = response.values || [];
    console.log('\n--- Projects Found ---');
    projects.forEach(p => {
      console.log(`- ${p.name} (Key: ${p.key}, ID: ${p.id})`);
    });
    
    const bsProject = projects.find(p => p.key === 'BS' || p.name.includes('BS') || p.name.includes('bicycle'));
    if (bsProject) {
      console.log('\n✅ FOUND IT!');
      console.log(`Target Project: ${bsProject.name} [${bsProject.key}]`);
    } else {
      console.log('\n❌ Project not found in the list of available projects.');
    }
  } catch (error) {
    console.error('Failed to fetch projects:', error.message);
    if (error.response?.data) console.error(JSON.stringify(error.response.data, null, 2));
  }
}

listProjects();
