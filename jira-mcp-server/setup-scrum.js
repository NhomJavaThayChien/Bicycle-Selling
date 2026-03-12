import 'dotenv/config';
import { Version3Client, AgileClient } from 'jira.js';
import fs from 'fs';

async function setupScrum() {
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
  const agile = new AgileClient(config);
  const projectKey = 'BS';

  console.log(`Setting up Scrum for project: ${projectKey}`);

  try {
    // 1. Find the board
    const boards = await agile.board.getAllBoards({ projectKeyOrId: projectKey });
    let board = boards.values.find(b => b.location.projectKey === projectKey);
    
    if (!board && boards.values.length > 0) {
      board = boards.values[0];
    }

    if (!board) {
      console.log('No board found for project BS. Searching all boards...');
      const allBoards = await agile.board.getAllBoards();
      board = allBoards.values.find(b => b.name.includes('Bicycle') || b.location?.projectKey === projectKey);
    }

    if (!board) {
      throw new Error('Could not find a Scrum board for project BS. Please create one manually first.');
    }

    console.log(`Using Board: ${board.name} (ID: ${board.id})`);

    // 2. Define Sprints based on TASK_ASSIGNMENT.md
    const sprintData = [
      { name: 'Sprint 1: Setup & Auth', goal: 'Auth + Setup + Core API + UI Skeleton' },
      { name: 'Sprint 2: Core Features', goal: 'Seller, Buyer, Listing' },
      { name: 'Sprint 3: Transactions & Chat', goal: 'Giao dịch, Kiểm định, Quản trị, Chat' },
      { name: 'Sprint 4: Integration & Report', goal: 'Tích hợp mở rộng + Test + Fix Bug + Báo cáo' }
    ];

    const sprints = [];
    for (const s of sprintData) {
      console.log(`Creating ${s.name}...`);
      const sprint = await agile.sprint.createSprint({
        originBoardId: board.id,
        name: s.name,
        goal: s.goal
      });
      sprints.push(sprint);
      console.log(`Created Sprint: ${sprint.name} (ID: ${sprint.id})`);
    }

    // 3. Create Issues and assign to Sprints
    // Parsing TASK_ASSIGNMENT.md (simplified mapping)
    const taskContent = fs.readFileSync('D:/old-bicycle-selling/docs/TASK_ASSIGNMENT.md', 'utf8');
    
    // We'll create key issues for each phase
    const phases = [
      { sprint: sprints[0], tasks: ['Auth & Security', 'Core API Setup', 'UI Skeleton & Layout'] },
      { sprint: sprints[1], tasks: ['Listing API', 'Buyer/Seller UI', 'Search & Filtering'] },
      { sprint: sprints[2], tasks: ['Transaction Integration', 'Chat System', 'User Management'] },
      { sprint: sprints[3], tasks: ['Reporting & Stats', 'AI Integration (Gemini)', 'Final Testing'] }
    ];

    for (const phase of phases) {
      console.log(`Adding tasks to ${phase.sprint.name}...`);
      const issueKeys = [];
      for (const t of phase.tasks) {
        const issue = await jira.issues.createIssue({
          fields: {
            project: { key: projectKey },
            summary: t,
            description: `Auto-generated from TASK_ASSIGNMENT.md for ${phase.sprint.name}`,
            issuetype: { name: 'Story' }
          }
        });
        issueKeys.push(issue.key);
        console.log(`  - Created ${issue.key}: ${t}`);
      }
      
      // Move to sprint
      await agile.sprint.moveIssuesToSprintAndRank({
        sprintId: phase.sprint.id,
        issues: issueKeys
      });
      console.log(`  Successfully moved ${issueKeys.length} issues to ${phase.sprint.name}`);
    }

    console.log('\n✅ SCRUM SETUP COMPLETE!');
  } catch (error) {
    console.error('Setup failed:', error.message);
    if (error.response?.data) {
      console.error(JSON.stringify(error.response.data, null, 2));
    }
  }
}

setupScrum();
