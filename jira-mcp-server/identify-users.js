import 'dotenv/config';
import { Version3Client } from 'jira.js';

async function listAllUsers() {
  const config = {
    host: process.env.JIRA_HOST.startsWith('http') ? process.env.JIRA_HOST : `https://${process.env.JIRA_HOST}`,
    authentication: {
      basic: {
        email: process.env.JIRA_EMAIL,
        apiToken: process.env.JIRA_API_TOKEN,
      },
    },
  };

  const jira = new Version3Client(config);

  try {
    // Search for all users
    const users = await jira.userSearch.findUsers({ query: '' });
    console.log('--- DANH SÁCH NGƯỜI DÙNG JIRA ---');
    for (const u of users) {
      if (u.accountType === 'atlassian') {
        console.log(`Tên: ${u.displayName} | ID: ${u.accountId} | Email: ${u.emailAddress || 'Ẩn'}`);
      }
    }
  } catch (e) {
    console.error('Lỗi khi lấy danh sách user:', e.message);
  }
}

listAllUsers();
