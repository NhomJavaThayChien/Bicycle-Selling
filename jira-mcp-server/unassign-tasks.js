import 'dotenv/config';
import { Version3Client } from 'jira.js';

async function unassignTasks() {
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
    console.log(`Đang lấy danh sách các issue của dự án ${projectKey}...`);
    const search = await jira.issueSearch.searchForIssuesUsingJqlEnhancedSearch({ jql: `project = ${projectKey}`, maxResults: 100 });
    const issues = search.issues || [];

    console.log(`Tìm thấy ${issues.length} issue. Bắt đầu gỡ gán (Unassign)...`);

    for (const issue of issues) {
      if (!issue || !issue.key) continue;
      
      console.log(`Gỡ gán cho ${issue.key}: ${issue.fields?.summary || ''}`);
      await jira.issues.assignIssue({
        issueIdOrKey: issue.key,
        accountId: '-1' // Trong Jira API, '-1' hoặc null dùng để unassign tùy cấu hình, nhưng assignIssue thường nhận null hoặc rỗng. 
                        // Tuy nhiên để chắc chắn gỡ hẳn, ta dùng null.
      }).catch(async (err) => {
          // Thử lại với giá trị null nếu -1 không hoạt động
          return await jira.issues.assignIssue({
              issueIdOrKey: issue.key,
              accountId: null
          });
      });
    }

    console.log('\n--- ĐÃ GỠ GÁN TOÀN BỘ TASK ---');
  } catch (error) {
    console.error('Lỗi khi gỡ gán task:', error.message);
  }
}

unassignTasks();
