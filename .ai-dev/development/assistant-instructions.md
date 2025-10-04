# Assistant 開發指示檔案

## 🎯 開發任務：Phase 5 - 通知系統

### 當前狀態
- **分支**: `feature/notification-system`
- **Linear Issue**: DEV-40 - Phase 5: 通知系統
- **開發者**: Assistant
- **開始時間**: 2025年10月4日

## 📋 開發任務清單

### 1. 通知設定管理
- [ ] 建立通知設定 UI
- [ ] 支援多種通知管道 (Email, LINE, Telegram, WhatsApp)
- [ ] 通知偏好設定
- [ ] 通知模板管理

### 2. 通知引擎核心
- [ ] 建立 NotificationEngine 核心類別
- [ ] 實作多管道通知發送
- [ ] 通知佇列處理
- [ ] 通知重試機制

### 3. 通知模板系統
- [ ] 通知模板 CRUD 操作
- [ ] 模板變數系統
- [ ] 多語言模板支援
- [ ] 模板預覽功能

### 4. 即時通知
- [ ] WebSocket 即時通知
- [ ] 瀏覽器推播通知
- [ ] 通知狀態追蹤
- [ ] 通知已讀/未讀管理

### 5. 通知歷史和統計
- [ ] 通知發送歷史
- [ ] 通知統計報表
- [ ] 通知效能監控
- [ ] 通知失敗分析

## 🏗️ 技術實作指南

### 1. 前端技術棧
```bash
# 安裝通知相關套件
npm install socket.io-client
npm install react-toastify
npm install react-hot-toast
```

### 2. 通知設定組件
```tsx
// resources/js/components/NotificationSettings.tsx
interface NotificationSettingsProps {
  user: User;
  onSave: (settings: NotificationSettings) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ user, onSave }) => {
  // 實作通知設定邏輯
};
```

### 3. 即時通知組件
```tsx
// resources/js/components/NotificationCenter.tsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const NotificationCenter: React.FC = () => {
  // 實作即時通知邏輯
};
```

### 4. 通知引擎實作
```php
// app/Services/NotificationEngine.php
class NotificationEngine
{
    public function sendNotification(Notification $notification, User $user): void
    {
        // 實作通知發送邏輯
    }
    
    public function sendBulkNotification(Notification $notification, array $users): void
    {
        // 實作批量通知發送邏輯
    }
    
    public function processNotificationQueue(): void
    {
        // 實作通知佇列處理邏輯
    }
}
```

### 5. 通知管道實作
```php
// app/Services/NotificationChannels/EmailChannel.php
class EmailChannel implements NotificationChannelInterface
{
    public function send(Notification $notification, User $user): bool
    {
        // 實作 Email 通知發送
    }
}

// app/Services/NotificationChannels/LineChannel.php
class LineChannel implements NotificationChannelInterface
{
    public function send(Notification $notification, User $user): bool
    {
        // 實作 LINE 通知發送
    }
}
```

### 6. WebSocket 實作
```php
// app/Events/NotificationSent.php
class NotificationSent implements ShouldBroadcast
{
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->user->id),
        ];
    }
}
```

## 📊 資料庫結構參考

### 已建立的資料表
- `notification_settings` - 通知設定
- `notifications` - 通知記錄
- `users` - 使用者 (關聯)

### 通知設定 JSON 結構
```json
{
  "channels": {
    "email": {
      "enabled": true,
      "address": "user@example.com",
      "preferences": {
        "workflow_approval": true,
        "workflow_completion": true,
        "system_updates": false
      }
    },
    "line": {
      "enabled": true,
      "user_id": "U1234567890",
      "preferences": {
        "workflow_approval": true,
        "workflow_completion": false
      }
    }
  },
  "schedule": {
    "quiet_hours": {
      "enabled": true,
      "start": "22:00",
      "end": "08:00"
    }
  }
}
```

## 🧪 測試要求

### 1. 建立測試檔案
```bash
php artisan make:test --pest NotificationEngineTest
php artisan make:test --pest NotificationChannelTest
php artisan make:test --pest WebSocketNotificationTest
```

### 2. 前端測試
```bash
# 安裝測試套件
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev vitest jsdom
```

### 3. 測試案例
- 通知引擎測試
- 通知管道測試
- WebSocket 通知測試
- API 端點測試

## 🔧 開發環境設定

### 1. 確認環境
```bash
# 確認 Laravel 版本
php artisan --version

# 確認 Node.js 版本
node --version
npm --version

# 確認前端建置
npm run build
```

### 2. 前端開發
```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建置生產版本
npm run build
```

### 3. 程式碼格式化
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
git commit -m "feat: Add notification engine with multi-channel support

- Implement NotificationEngine core class
- Add Email, LINE, Telegram notification channels
- Create notification template system
- Add WebSocket real-time notifications

Progress: Notification Engine completed (1/5 tasks)
Next: Notification template system implementation"
```

### 3. 進度更新
- 在 commit message 中記錄進度
- 更新開發文件
- 記錄遇到的問題和解決方案
- 使用 git commit 來追蹤進度

## 🚨 注意事項

### 1. 前端架構
- 使用 React 19 + TypeScript
- Socket.IO 用於即時通知
- React Toast 用於通知顯示
- 通知中心 UI 設計

### 2. 後端架構
- 事件驅動通知系統
- 佇列處理大量通知
- 多管道通知支援
- 通知重試和失敗處理

### 3. 效能考量
- 大量通知的處理效能
- WebSocket 連線管理
- 通知佇列效能
- 資料庫查詢優化

## 📞 支援資源

### 1. 文件參考
- Laravel 12 官方文件
- Socket.IO 官方文件
- React 19 官方文件
- Tailwind CSS 4 文件

### 2. 現有程式碼
- 查看 `app/Models/` 中的 Notification 相關 Model
- 參考 `database/migrations/` 中的通知相關資料表
- 查看 `resources/js/` 中的現有組件

### 3. 問題回報
- 遇到問題時在 commit message 中記錄
- 提供詳細的錯誤訊息和重現步驟
- 包含相關的程式碼片段
- 使用 git commit 來追蹤問題和解決方案

## 🎯 完成標準

### 1. 功能完成
- [ ] 通知引擎正常運作
- [ ] 多管道通知支援完整
- [ ] 即時通知功能完整
- [ ] API 端點測試通過

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
**開始開發時間**: 2025年10月4日  
**預估完成時間**: 2025年11月1日 (4週)  
**負責 AI**: Assistant  
**Linear Issue**: DEV-40
