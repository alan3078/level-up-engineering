# 豐進裝修工程有限公司 - 香港裝修公司網站

一個現代化的香港裝修公司網站，提供成本計算器、作品集展示、公司介紹和聯絡功能。

## 功能特色

### 🧮 成本計算器
- 多步驟表單引導用戶輸入裝修需求
- 即時計算裝修成本估算
- 詳細的報價單項目分解
- 支援 PDF 匯出報價單

### 🎨 作品集
- 展示過往裝修項目
- 物業類型和風格篩選
- 裝修前後對比滑動效果
- 項目詳細資訊展示

### 👥 公司介紹
- 服務項目介紹
- 團隊成員展示
- 客戶評價展示

### 📞 聯絡功能
- 聯絡表單
- WhatsApp 整合
- 表單驗證

## 技術棧

- **框架**: Next.js 14+ (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **UI 組件**: shadcn/ui
- **表單管理**: React Hook Form
- **驗證**: Zod
- **PDF 生成**: jsPDF
- **通知**: Sonner

## 開始使用

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

在瀏覽器中打開 [http://localhost:3000](http://localhost:3000) 查看應用程式。

### 建置生產版本

```bash
npm run build
npm start
```

## 專案結構

```
├── app/                    # Next.js App Router 頁面
│   ├── page.tsx           # 首頁
│   ├── calculator/        # 計算器頁面
│   ├── portfolio/         # 作品集頁面
│   ├── about/             # 關於我們頁面
│   ├── contact/           # 聯絡頁面
│   └── layout.tsx         # 根佈局
├── components/            # React 組件
│   ├── calculator/        # 計算器組件
│   ├── portfolio/         # 作品集組件
│   ├── company/           # 公司介紹組件
│   ├── contact/           # 聯絡組件
│   ├── navigation/         # 導航組件
│   └── ui/                # shadcn/ui 組件
├── lib/                   # 工具函數
│   ├── types.ts           # TypeScript 類型定義
│   ├── calculator.ts      # 計算器邏輯
│   └── pdf-export.ts      # PDF 匯出功能
└── public/                # 靜態資源
```

## 主要功能說明

### 成本計算器邏輯

計算器根據以下因素計算裝修成本：

1. **物業類型**: 公屋、居屋、私樓、村屋（不同基礎價格）
2. **實用面積**: 平方呎數
3. **房間配置**: 睡房、客廳、廚房、浴室數量
4. **裝修範圍**: 全屋或局部裝修
5. **材料級別**: 基本、標準、豪華
6. **特殊要求**: 拆牆、水電改動、訂造傢俬

計算結果包含：
- 最低估算
- 平均估算
- 最高估算
- 詳細項目分解

### 自訂配置

#### 修改 WhatsApp 號碼

在 `components/contact/contact-form.tsx` 中修改：

```typescript
const phoneNumber = "85212345678"; // 替換為實際 WhatsApp 號碼
```

#### 修改聯絡資訊

在 `components/footer.tsx` 和 `components/contact/contact-form.tsx` 中更新聯絡資訊。

#### 添加作品集項目

在 `components/portfolio/portfolio-gallery.tsx` 中的 `SAMPLE_PROJECTS` 陣列添加新項目。

## 環境變數

目前不需要環境變數，但未來可以添加：

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: WhatsApp 號碼
- `NEXT_PUBLIC_CONTACT_EMAIL`: 聯絡電郵
- `NEXT_PUBLIC_API_URL`: API 端點（如果使用後端）

## 瀏覽器支援

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 授權

MIT License

## 聯絡

如有問題或建議，請透過網站聯絡表單或 WhatsApp 聯絡我們。
