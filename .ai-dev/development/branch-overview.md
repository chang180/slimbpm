# 多 AI 開發分支總覽

## 🚀 開發分支狀態

### 1. Phase 2: 使用者管理系統
- **分支**: `feature/user-management`
- **開發者**: Claude Code
- **狀態**: 準備開始
- **指示檔案**: `README-CLAUDE-CODE.md`
- **詳細指示**: `.ai-dev/development/claude-code-instructions.md`
- **進度追蹤**: `.ai-dev/development/claude-code-progress.md`

### 2. Phase 3: 流程設計器
- **分支**: `feature/workflow-designer`
- **開發者**: Codex
- **狀態**: 準備開始
- **指示檔案**: `README-CODEX.md`
- **詳細指示**: `.ai-dev/development/codex-instructions.md`
- **進度追蹤**: `.ai-dev/development/codex-progress.md`

### 3. Phase 4: 表單系統
- **分支**: `feature/form-builder`
- **開發者**: Cursor (總協調者)
- **狀態**: 準備開始
- **指示檔案**: `README-CURSOR.md`
- **詳細指示**: `.ai-dev/development/cursor-instructions.md`
- **進度追蹤**: `.ai-dev/development/cursor-progress.md`

### 4. Phase 5: 通知系統
- **分支**: `feature/notification-system`
- **開發者**: Assistant
- **狀態**: 準備開始
- **指示檔案**: `README-ASSISTANT.md`
- **詳細指示**: `.ai-dev/development/assistant-instructions.md`
- **進度追蹤**: `.ai-dev/development/assistant-progress.md`

## 📋 開發任務分配

### Claude Code - 使用者管理系統
- 使用者註冊和登入
- 角色和權限管理
- 部門管理
- 使用者設定

### Codex - 流程設計器
- 流程設計器 UI (React Flow)
- 流程定義 API
- 流程執行引擎
- 條件式流程支援

### Cursor - 表單系統
- 表單設計器 UI
- 動態表單渲染
- 表單模板系統
- 表單與流程整合

### Assistant - 通知系統
- 通知設定管理
- 通知引擎核心
- 即時通知
- 通知歷史和統計

## 🔧 開發環境設定

### 每個 AI 都需要確認的環境
```bash
# 確認當前分支
git branch

# 確認 Laravel 環境
php artisan --version

# 確認 Node.js 環境
node --version
npm --version

# 確認資料庫
php artisan migrate:status

# 執行測試
php artisan test
```

### 前端開發環境
```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建置生產版本
npm run build
```

### 程式碼格式化
```bash
# PHP 格式化
vendor/bin/pint --dirty

# JavaScript 格式化
npm run format
```

## 📝 開發流程

### 1. 每日開發流程
1. 拉取最新主分支更新
2. 檢查當前分支狀態
3. 實作當日任務
4. 執行測試確保品質
5. 提交變動並推送到分支
6. 在 commit message 中記錄進度

### 2. 提交規範
```bash
# 提交格式 - 使用詳細的 commit message 來追蹤進度
git commit -m "feat: Add feature description

- Implement specific functionality
- Add related components
- Create test cases
- Update documentation

Progress: Feature completed (X/Y tasks)
Next: Next feature implementation"
```

### 3. 進度更新
- 在 commit message 中記錄進度
- 更新對應的進度追蹤檔案
- 記錄遇到的問題和解決方案
- 使用 git commit 來追蹤進度

## 🚨 注意事項

### 1. 分支管理
- 每個 AI 在獨立分支上開發
- 定期拉取主分支更新
- 避免直接修改主分支
- 使用 feature 分支進行開發

### 2. 程式碼品質
- 所有程式碼必須通過 Lint 檢查
- 測試覆蓋率必須達到要求
- 程式碼文件必須完整
- 無明顯的效能問題

### 3. 衝突解決
- 遇到衝突時優先溝通
- 使用 git merge 解決衝突
- 保持程式碼一致性
- 記錄衝突解決過程

## 📞 支援資源

### 1. 文件參考
- Laravel 12 官方文件
- React 19 官方文件
- Tailwind CSS 4 文件
- 專案內部文件

### 2. 現有程式碼
- 查看 `app/Models/` 中的 Model 關聯
- 參考 `database/migrations/` 中的資料表結構
- 查看 `resources/js/` 中的現有組件
- 參考 `tests/` 中的測試案例

### 3. 問題回報
- 遇到問題時在 commit message 中記錄
- 提供詳細的錯誤訊息和重現步驟
- 包含相關的程式碼片段
- 使用 git commit 來追蹤問題和解決方案

## 🎯 完成標準

### 1. 功能完成
- [ ] 所有功能正常運作
- [ ] API 端點測試通過
- [ ] 前端組件測試通過
- [ ] 整合測試通過

### 2. 程式碼品質
- [ ] 程式碼通過 Lint 檢查
- [ ] 測試覆蓋率達到要求
- [ ] 程式碼文件完整
- [ ] 無明顯的效能問題

### 3. 文件更新
- [ ] API 文件更新
- [ ] 開發文件更新
- [ ] 測試文件更新
- [ ] 部署文件更新

---
**建立時間**: 2025年10月4日  
**最後更新**: 2025年10月4日
