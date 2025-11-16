# 快速開始指南

## 安裝與運行

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

3. **訪問應用**
   打開瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 主要頁面

- **首頁** (`/`) - 公司介紹和服務概覽
- **成本計算器** (`/calculator`) - 裝修成本估算工具
- **作品集** (`/portfolio`) - 過往項目展示
- **關於我們** (`/about`) - 公司詳細資訊
- **聯絡我們** (`/contact`) - 聯絡表單

## 自訂配置

### 修改 WhatsApp 號碼

編輯 `components/contact/contact-form.tsx`:

```typescript
const phoneNumber = "85212345678"; // 替換為您的 WhatsApp 號碼
```

### 更新聯絡資訊

編輯以下文件：
- `components/footer.tsx` - 頁尾聯絡資訊
- `components/contact/contact-form.tsx` - 聯絡表單中的電話號碼

### 添加作品集項目

編輯 `components/portfolio/portfolio-gallery.tsx` 中的 `SAMPLE_PROJECTS` 陣列。

### 修改計算器價格

編輯 `lib/calculator.ts` 中的價格常數：
- `BASE_PRICE_PER_SQFT` - 每平方呎基礎價格
- `QUALITY_MULTIPLIERS` - 材料級別倍數
- `ROOM_BASE_COSTS` - 房間基礎成本
- `SPECIAL_REQUIREMENT_COSTS` - 特殊要求成本

## 功能測試

### 測試計算器

1. 訪問 `/calculator`
2. 填寫所有步驟的表單
3. 查看報價結果
4. 測試 PDF 匯出功能

### 測試作品集

1. 訪問 `/portfolio`
2. 測試篩選功能
3. 點擊項目查看詳情
4. 測試前後對比滑動效果

### 測試聯絡表單

1. 訪問 `/contact`
2. 填寫表單並提交
3. 測試 WhatsApp 連結

## 部署

### Vercel 部署

1. 將代碼推送到 GitHub
2. 在 Vercel 中導入專案
3. 自動部署完成

### 其他平台

```bash
npm run build
npm start
```

## 注意事項

- 作品集圖片目前使用 placeholder，需要替換為實際圖片
- WhatsApp 號碼需要更新為實際號碼
- 聯絡資訊需要更新為實際資訊
- 計算器價格公式可根據實際業務需求調整

