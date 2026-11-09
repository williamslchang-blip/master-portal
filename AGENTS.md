# Master Portal 開發與維護規範 (Master Guidelines)

## 網站與資源登錄自動化規範

每當在此專案或相關課程專案中新增、修改或發布網站至 GitHub 時，Agent 必須主動執行整合確認：

1. **主動詢問**：「檢測到新網頁/教材上傳，請問是否需要將此項目整合至 Master Portal 總門戶網站？」
2. **確認分類與欄位**：確認 Tier 1/Tier 2 分類、code、title、desc、html/htmlPresentation、interactiveTool、excelModel、docx 等資訊。
3. **自動寫入與部署**：更新 `master-portal/index.html` 的 `masterData` 與 `GITHUB_PAGES_BASE`，完成 git push 並驗證 GitHub Pages 成功上線。
