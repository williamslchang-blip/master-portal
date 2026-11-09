#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Master Portal 網站與教材登錄小助手
可用於快速向 C:\\Users\\User\\master-portal\\index.html 註冊新的教學網站、模型或個案
"""

import os
import sys
import json
import subprocess

PORTAL_DIR = r"C:\Users\User\master-portal"
INDEX_PATH = os.path.join(PORTAL_DIR, "index.html")

def main():
    print("=" * 60)
    print(" Master Portal 網站與教學資源整合小精靈")
    print("=" * 60)

    if not os.path.exists(INDEX_PATH):
        print(f"[錯誤] 找不到 Master Portal 首頁: {INDEX_PATH}")
        sys.exit(1)

    with open(INDEX_PATH, "r", encoding="utf-8") as f:
        html_content = f.read()

    print("\n可用的 Tier 1 主類別：")
    print("  1. sem11501       - 11501 學期課程主控台")
    print("  2. cases          - 實務財務個案教學庫")
    print("  3. finance        - 財務計算分析")
    print("  4. sem11502       - 11502 學期微課程與信託")
    print("  5. master_thesis  - 碩士在職專班論文")
    print("  6. 自訂其它類別")

    t1_choice = input("\n請選擇主類別編號 (預設 2: cases): ").strip() or "2"
    t1_map = {
        "1": "sem11501",
        "2": "cases",
        "3": "finance",
        "4": "sem11502",
        "5": "master_thesis"
    }
    tier1_key = t1_map.get(t1_choice, t1_choice)

    print(f"\n[已選主類別: {tier1_key}]")
    sub_key = input("請輸入子分類 ID (例: case3 / leadership / climate / 自訂): ").strip()
    code = input("請輸入項目代號 (例: 個案 3 全套 / W08 / SIM-03): ").strip()
    title = input("請輸入完整標題: ").strip()
    desc = input("請輸入項目摘要與特色說明: ").strip()
    html_pres = input("教學簡報網站相對或絕對 URL (可空白): ").strip()
    tool_url = input("互動式財務模型 / 模擬器 URL (可空白): ").strip()
    excel_url = input("Excel 財務模型路徑 (可空白): ").strip()
    docx_url = input("Word 個案或指引路徑 (可空白): ").strip()

    print("\n--- 待登記資料預覽 ---")
    entry = {
        "code": code,
        "title": title,
        "desc": desc
    }
    if html_pres:
        entry["htmlPresentation"] = html_pres
        entry["html"] = html_pres
    if tool_url:
        entry["interactiveTool"] = tool_url
    if excel_url:
        entry["excelModel"] = excel_url
    if docx_url:
        entry["docx"] = docx_url

    print(json.dumps(entry, ensure_ascii=False, indent=2))

    confirm = input("\n是否確認寫入 master-portal/index.html 並發布至 GitHub? (y/n): ").strip().lower()
    if confirm != 'y':
        print("[取消] 未做任何修改。")
        return

    print("\n[提示] 您可以直接在對話中呼叫 AI 助理自動執行精確定位寫入、JSON 解析校驗與 git push！")

if __name__ == "__main__":
    main()
