const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'submissions.json');

// ── 初始化資料檔案 ───────────────────────────────────────────────
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// ── Middleware ────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ── 工具函式 ──────────────────────────────────────────────────────
function readSubmissions() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeSubmissions(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ── API Routes ────────────────────────────────────────────────────

// POST /api/contact  ── 新增表單送出
app.post('/api/contact', (req, res) => {
  const { name, phone, lineId, website, challenges, notes } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: '負責人姓名為必填欄位' });
  }
  if (!phone || !phone.trim()) {
    return res.status(400).json({ success: false, message: '聯絡電話為必填欄位' });
  }

  const submissions = readSubmissions();
  const entry = {
    id: Date.now(),
    name: name.trim(),
    phone: phone.trim(),
    lineId: (lineId || '').trim(),
    website: (website || '').trim(),
    challenges: Array.isArray(challenges)
      ? challenges
      : challenges
      ? [challenges]
      : [],
    notes: (notes || '').trim(),
    submittedAt: new Date().toISOString(),
    status: 'new'   // new | contacted | done
  };

  submissions.push(entry);
  writeSubmissions(submissions);

  console.log(`[${new Date().toLocaleString('zh-TW')}] 新諮詢申請 ── ${entry.name} / ${entry.phone}`);

  res.json({ success: true, message: '申請已成功送出！', id: entry.id });
});

// GET /api/submissions  ── 讀取全部記錄（管理後台用）
app.get('/api/submissions', (req, res) => {
  const submissions = readSubmissions();
  // 最新在前
  res.json(submissions.slice().reverse());
});

// PATCH /api/submissions/:id/status  ── 更新狀態
app.patch('/api/submissions/:id/status', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;
  const allowed = ['new', 'contacted', 'done'];

  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: '無效的狀態值' });
  }

  const submissions = readSubmissions();
  const entry = submissions.find(s => s.id === id);
  if (!entry) return res.status(404).json({ success: false, message: '記錄不存在' });

  entry.status = status;
  writeSubmissions(submissions);
  res.json({ success: true });
});

// DELETE /api/submissions/:id  ── 刪除單筆記錄
app.delete('/api/submissions/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  let submissions = readSubmissions();
  const before = submissions.length;
  submissions = submissions.filter(s => s.id !== id);

  if (submissions.length === before) {
    return res.status(404).json({ success: false, message: '記錄不存在' });
  }

  writeSubmissions(submissions);
  res.json({ success: true });
});

// ── 啟動 ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║       adlo 後端服務已啟動                ║');
  console.log(`  ║  主站：http://localhost:${PORT}             ║`);
  console.log(`  ║  後台：http://localhost:${PORT}/admin.html  ║`);
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
});
