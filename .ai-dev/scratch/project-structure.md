# SlimBPM

一個基於 Laravel 13 和 React 的現代化商業流程管理系統。

## 🚀 技術棧

### 後端
- **Laravel 13.14.0** - PHP 框架
- **PHP 8.4.12** - 程式語言
- **SQLite** - 資料庫
- **Laravel Fortify** - 身份驗證
- **Laravel Wayfinder** - 路由管理

### 前端
- **React 19** - UI 框架
- **Inertia.js 3.3.1** - SPA 框架
- **TypeScript 5.7.2** - 類型安全
- **Tailwind CSS 4.1.12** - 樣式框架
- **Radix UI** - 無障礙 UI 元件
- flux ui pro版元件，計畫於11月黑色星期五特價時購買，現在先使用類似的替代品建構，待購入後將其代入置換

### 開發工具
- **Vite 7.3.5** - 建構工具
- **Pest 4.7.2** - 測試框架
- **Laravel Pint** - 程式碼格式化
- **ESLint & Prettier** - 程式碼品質
- **Laravel Boost** - 開發輔助

## 📁 專案結構

```
slimbpm/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # 控制器
│   │   ├── Middleware/      # 中介軟體
│   │   └── Requests/        # 表單驗證
│   ├── Models/              # Eloquent 模型
│   └── Providers/           # 服務提供者
├── resources/
│   ├── js/
│   │   ├── components/      # React 元件
│   │   ├── pages/          # 頁面元件
│   │   ├── layouts/        # 佈局元件
│   │   └── hooks/          # 自定義 Hooks
│   └── css/                # 樣式檔案
├── routes/                 # 路由定義
├── database/               # 資料庫遷移和種子
└── tests/                  # 測試檔案
```

## 🛠️ 安裝與設定

### 系統需求
- PHP 8.2+
- Node.js 18+
- Composer
- SQLite

### 安裝步驟

1. **複製專案**
```bash
git clone <repository-url>
cd slimbpm
```

2. **安裝 PHP 依賴**
```bash
composer install
```

3. **安裝 Node.js 依賴**
```bash
npm install
```

4. **環境設定**
```bash
cp .env.example .env
php artisan key:generate
```

5. **資料庫設定**
```bash
php artisan migrate
```

6. **建構前端資源**
```bash
npm run build
```

### 開發環境

啟動開發伺服器：
```bash
composer run dev
```

這個命令會同時啟動：
- Laravel 開發伺服器 (http://localhost:8000)
- Vite 開發伺服器 (熱重載)
- 佇列監聽器
- 日誌監聽器

### 其他可用命令

```bash
# 測試
composer run test
php artisan test

# 程式碼格式化
vendor/bin/pint --dirty

# 前端格式化
npm run format
npm run lint

# 建構生產版本
npm run build
```

## 🔐 功能特色

### 身份驗證系統
- ✅ 使用者註冊/登入
- ✅ 密碼重設
- ✅ 電子郵件驗證
- ✅ 雙因素驗證 (2FA)
- ✅ 密碼確認

### 使用者介面
- ✅ 響應式設計
- ✅ 深色/淺色主題
- ✅ 現代化 UI 元件
- ✅ 無障礙設計 (a11y)
- ✅ 側邊欄導航

### 設定頁面
- ✅ 個人資料管理
- ✅ 密碼變更
- ✅ 外觀設定
- ✅ 雙因素驗證設定

## 🧪 測試

專案使用 Pest 測試框架，包含：

- **功能測試** - 身份驗證流程
- **單元測試** - 個別功能測試
- **瀏覽器測試** - 端到端測試 (Pest v4)

執行測試：
```bash
php artisan test
```

## 📝 開發規範

### 程式碼風格
- 使用 Laravel Pint 進行 PHP 程式碼格式化
- 使用 Prettier 進行前端程式碼格式化
- 遵循 PSR-12 標準

### 提交規範
- 每個功能都必須有對應的測試
- 使用描述性的變數和方法名稱
- 遵循現有的程式碼慣例

## 🚀 部署

### 生產環境建構
```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 環境變數
確保設定正確的環境變數：
- `APP_ENV=production`
- `APP_DEBUG=false`
- 資料庫連線設定
- 郵件服務設定

## 📚 學習資源

- [Laravel 13 文件](https://laravel.com/docs)
- [Inertia.js 文件](https://inertiajs.com)
- [React 文件](https://react.dev)
- [Tailwind CSS 文件](https://tailwindcss.com)
- [Pest 測試文件](https://pestphp.com)

## 🤝 貢獻

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

此專案使用 MIT 授權條款 - 查看 [LICENSE](LICENSE) 檔案了解詳情。

---

**注意**: 這是一個全新的 Laravel 專案，目前包含基本的身份驗證和使用者管理功能。更多商業流程管理功能正在開發中。
