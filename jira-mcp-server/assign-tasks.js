import 'dotenv/config';
import { Version3Client } from 'jira.js';

async function assignTasks() {
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
  const projectKey = 'BS';

  try {
    // 1. Get all users to map IDs
    const users = await jira.userSearch.findUsers({ query: '' });
    const userMap = {};
    users.forEach(u => {
      userMap[u.displayName] = u.accountId;
      if (u.emailAddress === process.env.JIRA_EMAIL) {
        userMap['ME'] = u.accountId;
      }
    });

    // Mapping based on your request:
    // BE A: Sơn Phạm Hoàng (ME)
    // BE B: Nguyễn Ngọc Trung
    // FE A: Tới Nguyễn Trọng
    // FE B: Huuviet8834 (Search for it)
    
    const ids = {
      'BE-A': userMap['Sơn Phạm Hoàng'] || userMap['ME'],
      'BE-B': userMap['Nguyễn Ngọc Trung'],
      'FE-A': userMap['Tới Nguyễn Trọng'],
      'FE-B': userMap['Huuviet8834'] // Might be null if not found
    };

    console.log('Mapping results:', ids);

    // 2. Fetch all issues in project BS
    const search = await jira.issueSearch.searchForIssuesUsingJqlEnhancedSearch({ jql: `project = ${projectKey}`, maxResults: 100 });
    const issues = search.issues || [];

    console.log(`Processing ${issues.length} issues...`);

    for (const issue of issues) {
      if (!issue || !issue.fields || !issue.fields.summary) continue;
      const summary = issue.fields.summary;
      let assigneeId = null;

      if (summary.includes('[BE-A]')) assigneeId = ids['BE-A'];
      else if (summary.includes('[BE-B]')) assigneeId = ids['BE-B'];
      else if (summary.includes('[FE-C]')) assigneeId = ids['FE-A']; // FE-C in task map to FE A
      else if (summary.includes('[FE-D]')) assigneeId = ids['FE-B']; // FE-D in task map to FE B

      if (assigneeId) {
        console.log(`Assigning ${issue.key} to ${assigneeId} (${summary})`);
        await jira.issues.assignIssue({
          issueIdOrKey: issue.key,
          accountId: assigneeId
        });
      } else {
        console.log(`Skipping ${issue.key} - No mapping found for summary: ${summary}`);
      }
    }

    console.log('\n--- TẤT CẢ TÁC VỤ ĐÃ ĐƯỢC GÁN XONG ---');
  } catch (error) {
    console.error('Lỗi khi gán task:', error.message);
    if (error.response?.data) console.error(JSON.stringify(error.response.data, null, 2));
  }
}

assignTasks();
