# CLAUDE.md - 指令指南與協同準則

本專案供 Claude Code、Codex 與 Antigravity 團隊共同維護。

---

## 專案核心定位

- **名稱**：`JY電子檔筆記-信託業務-V8.6.0`
- **路徑**：`C:\Users\User\Desktop\115學年度\11502 信託\`
- **核心教材**：`JY電子檔筆記-信託業務-V8.6.0.pdf`（共 149 頁）
- **語言**：全專案繁體中文 (Traditional Chinese, zh-TW)

---

## 快速指令與常見工作流

### 1. 進度檢視（每次開工必做）
- 檢視前次處理進度：
  ```bash
  cat PROJECT_STATUS.md
  ```
- 確認最新檔案變更：
  ```bash
  git status
  ```

### 2. PDF 解析與文字萃取（Python 範例）
```python
import pypdf

reader = pypdf.PdfReader("JY電子檔筆記-信託業務-V8.6.0.pdf")
print("Total pages:", len(reader.pages))
# 萃取特定頁面
page_text = reader.pages[3].extract_text()
print(page_text)
```

### 3. 公式與文件格式標準
- **Markdown**：`$E = mc^2$` 或 `$$\int_0^\infty f(x)dx$$`
- **Word**：Office Math (OMML) 數學物件，不得使用點陣圖或未轉換之純文字公式

---

## 核心行為守則 (Golden Rules)

1. **不可覆蓋原始資料**：嚴格保護 `JY電子檔筆記-信託業務-V8.6.0.pdf` 與 `JY電子檔筆記-信託業-專案檔.docx`。
2. **每次變更後同步紀錄**：
   - 更新 `PROJECT_STATUS.md`（任務完成度與待確認事項）
   - 新增/移除檔案時同步更新 `README.md`
3. **推播與部署提醒**：產出網頁並推播 GitHub 後，依據 `AGENTS.md` 引導使用者確認整合至 `master-portal` 的 `sem11502` 專區。
