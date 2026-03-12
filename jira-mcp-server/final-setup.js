import 'dotenv/config';
import { Version3Client, AgileClient } from 'jira.js';

async function finalSetup() {
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

  try {
    // 1. Get Board
    const boards = await agile.board.getAllBoards({ projectKeyOrId: projectKey });
    const board = boards.values[0];
    if (!board) throw new Error('No board found');
    console.log(`Using Board: ${board.name} (ID: ${board.id})`);

    // 2. Create Sprints
    const sprintNames = [
      "Sprint 1: Auth & Setup",
      "Sprint 2: Core Features",
      "Sprint 3: Business Logic",
      "Sprint 4: Final Integration"
    ];

    const sprintIds = [];
    for (const name of sprintNames) {
      const sprint = await agile.sprint.createSprint({
        originBoardId: board.id,
        name: name,
        goal: "Hoàn thiện các nhiệm vụ trong phase tương ứng của TASK_ASSIGNMENT.md"
      });
      sprintIds.push(sprint.id);
      console.log(`Created ${name} (ID: ${sprint.id})`);
    }

    // 3. Define Tasks by Member and Sprint
    const tasks = [
      // SPRINT 1
      { sprintIdx: 0, member: 'BE-A', title: 'Setup project & Database', desc: 'Tạo project Spring Boot, cấu hình Neon PostgreSQL, JPA Entities.' },
      { sprintIdx: 0, member: 'BE-A', title: 'Spring Security & Auth Login/Register', desc: 'Cấu hình JWT, viết API Đăng ký/Đăng nhập, Authorization Filter.' },
      { sprintIdx: 0, member: 'BE-A', title: 'Swagger & CORS Configuration', desc: 'Cấu hình Swagger UI và CORS cho Frontend.' },
      
      { sprintIdx: 0, member: 'BE-B', title: 'Setup Third-party Sandboxes', desc: 'Thiết lập Stripe Test Mode, GHN Sandbox và Gemini API Key.' },
      
      { sprintIdx: 0, member: 'FE-C', title: 'Setup FE Project & Layout', desc: 'Khởi tạo React/Vite, cài thư viện (axios, query), build Header/Footer.' },
      { sprintIdx: 0, member: 'FE-C', title: 'Landing Page UI', desc: 'Dựng màn hình Trang chủ: Banner, nút CTA, danh sách xe nổi bật.' },
      
      { sprintIdx: 0, member: 'FE-D', title: 'Design System & Common Components', desc: 'Màu sắc, Typography, Button, Badge, Modal, Table, Pagination.' },
      { sprintIdx: 0, member: 'FE-D', title: 'Axios Interceptor & Error Pages', desc: 'Cấu hình gắn JWT tự động, trang 404, Loading Skeleton.' },

      // SPRINT 2
      { sprintIdx: 1, member: 'BE-A', title: 'Listing CRUD API', desc: 'API đăng tin, sửa/ẩn/xóa tin. API duyệt tin cho Admin.' },
      { sprintIdx: 1, member: 'BE-A', title: 'Search & Detail API', desc: 'API tìm kiếm & lọc xe, API xem chi tiết listing, tăng viewCount.' },
      { sprintIdx: 1, member: 'BE-A', title: 'Image Upload Service', desc: 'Xử lý upload ảnh và lưu URL vào listing_images.' },

      { sprintIdx: 1, member: 'BE-B', title: 'Order & Transaction API', desc: 'API tạo đơn đặt mua/đặt cọc, cập nhật trạng thái đơn (PATCH), lịch sử đơn hàng.' },
      { sprintIdx: 1, member: 'BE-B', title: 'Chat System API', desc: 'API hội thoại, gửi/nhận tin nhắn, đánh dấu đã đọc.' },

      { sprintIdx: 1, member: 'FE-C', title: 'Auth & Protected Routes UI', desc: 'Màn hình Đăng ký/Đăng nhập, setup Protected Routes.' },
      { sprintIdx: 1, member: 'FE-C', title: 'Listing UI (Search & Filter)', desc: 'Màn hình Danh sách xe với bộ lọc hãng, danh mục, giá...' },
      { sprintIdx: 1, member: 'FE-C', title: 'Listing Detail & Wishlist UI', desc: 'Màn hình Chi tiết xe, Gallery, nút Wishlist.' },

      { sprintIdx: 1, member: 'FE-D', title: 'Admin Overview & Listing Management', desc: 'Dashboard thống kê, bảng quản lý/duyệt tin PENDING.' },
      { sprintIdx: 1, member: 'FE-D', title: 'User & Catalog Management (Admin)', desc: 'Quản lý User, Danh mục, Thương hiệu.' },

      // SPRINT 3
      { sprintIdx: 2, member: 'BE-A', title: 'User Profile & Reputation', desc: 'API Profile cá nhân, xem profile người bán và điểm uy tín.' },
      { sprintIdx: 2, member: 'BE-A', title: 'Wishlist & Unit Tests', desc: 'API Wishlist, viết Unit Test cho các service Core.' },

      { sprintIdx: 2, member: 'BE-B', title: 'Payment & Shipping Integration', desc: 'Tích hợp Stripe (Payment Intent), GHN (Tính phí ship, tạo đơn, tracking).' },
      { sprintIdx: 2, member: 'BE-B', title: 'AI Chatbot & Reviews', desc: 'Tích hợp Gemini Chatbot API. API Đánh giá người bán.' },
      { sprintIdx: 2, member: 'BE-B', title: 'Inspection & Dispute System', desc: 'Quy trình kiểm định (Inspector) và tranh chấp (Admin).' },

      { sprintIdx: 2, member: 'FE-C', title: 'Seller Dashboard & Posting Form', desc: 'Form đăng tin nhiều bước, quản lý tin đăng của Seller.' },
      { sprintIdx: 2, member: 'FE-C', title: 'Checkout & Order History UI', desc: 'Form đặt mua, phí ship GHN, màn hình lịch sử đơn hàng cho Buyer.' },
      { sprintIdx: 2, member: 'FE-C', title: 'Chat / Inbox UI', desc: 'Giao diện danh sách hội thoại và khung chat real-time.' },

      { sprintIdx: 2, member: 'FE-D', title: 'Inspector Dashboard', desc: 'Màn hình yêu cầu kiểm định và form nhập báo cáo kỹ thuật.' },
      { sprintIdx: 2, member: 'FE-D', title: 'Dispute & Notification UI', desc: 'Xử lý tranh chấp, hệ thống chuông thông báo (Notification).' },

      // SPRINT 4
      { sprintIdx: 3, member: 'BE-A', title: 'Code Review & Integration', desc: 'Review code Team B, fix bug tích hợp BE+FE, hỗ trợ deploy.' },
      { sprintIdx: 3, member: 'BE-B', title: 'Reporting & Admin Stats', desc: 'API thống kê nâng cao (tổng user, doanh thu...), Unit Test Payment/Shipping.' },
      { sprintIdx: 3, member: 'FE-C', title: 'Final UI/UX & AI UI', desc: 'Review màn hình, Tích hợp Stripe UI, Gemini Chatbot UI.' },
      { sprintIdx: 3, member: 'FE-D', title: 'Advanced Reports & Dark Mode', desc: 'Biểu đồ Recharts, GHN Tracking UI, Dark Mode support.' }
    ];

    for (const sprintIdx of [0, 1, 2, 3]) {
      const sprintId = sprintIds[sprintIdx];
      const sprintTasks = tasks.filter(t => t.sprintIdx === sprintIdx);
      const issueKeys = [];

      for (const t of sprintTasks) {
        const issue = await jira.issues.createIssue({
          fields: {
            project: { key: projectKey },
            summary: `[${t.member}] ${t.title}`,
            description: t.desc,
            issuetype: { name: 'Story' },
            labels: [t.member]
          }
        });
        issueKeys.push(issue.key);
        console.log(`  - Created ${issue.key} for ${t.member}`);
      }

      await agile.sprint.moveIssuesToSprintAndRank({
        sprintId: sprintId,
        issues: issueKeys
      });
      console.log(`  Moved ${issueKeys.length} issues to Sprint ${sprintIdx + 1}`);
    }

    console.log('\n--- SETUP HOÀN TẤT ---');
  } catch (error) {
    console.error('Lỗi:', error.message);
    if (error.response?.data) console.error(JSON.stringify(error.response.data, null, 2));
  }
}

finalSetup();
