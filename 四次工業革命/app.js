
// 內建總經圖表自體完備資料庫 (保證零依賴、即使舊版快取也絕對不報錯)
const CHARTS_DATA_FALLBACK = {
  gdpCatchup: {
    title: '1960–2026 美台人均實質 GDP (國際美元) 與追趕比率',
    source: 'Maddison Project Database (2011 基準國際美元) 與 IMF 世界經濟展望 (2026.10)',
    labels: ['1960', '1980', '2001', '2010', '2026 (PPP)'],
    usData: [18057, 29611, 45878, 49267, 95210],
    twData: [2157, 8384, 26204, 37385, 103740],
    ratios: ['11.9%', '28.3%', '57.1%', '75.9%', '109.0%'],
    tableRows: [
      ['1960 年', '二次工業革命尾聲', '$18,057 美元', '$2,157 國際美元', '11.9%', '勞力密集輕工業、加工出口區、進口替代轉出口導向'],
      ['1980 年', '三次工業革命啟動', '$29,611 美元', '$8,384 國際美元', '28.3%', '十大建設完成重工業，新竹科學園區成立切入 PC 與零組件 OEM'],
      ['2001 年', '三次工業革命成熟', '$45,878 美元', '$26,204 國際美元', '57.1%', '網際網路與全球化外包，台積電開創晶圓代工 Foundry 模式'],
      ['2010 年', '四次工業革命前夕', '$49,267 美元', '$37,385 國際美元', '75.9%', '智慧型手機與行動晶片，先進封裝與高階製程逼近歐美'],
      ['2026 年', '四次工業革命深化', '$95,210 美元', '$103,740 國際美元', '109.0%', '生成式 AI 爆發，先進製程與 AI 伺服器成為全球算力硬瓶頸']
    ],
    insights: [
      '追趕速度超常速：六十餘年間台灣相對於美國的人均產值比例由約 1/9 逆轉至 109%，實現東亞奇蹟中的「大趨同」。',
      '第四次工業革命成為關鍵反超點：受惠於全球算力基礎設施爆發，台灣先進晶圓與高階伺服器取得硬瓶頸自然壟斷。',
      '名目 vs PPP 落差：雖然 PPP 人均超越美國，但名目匯率換算值（約 4.4 萬美元）仍不及美國一半，反映國內非貿易財價格與薪資結構性偏低。'
    ]
  },

  manufacturingShare: {
    title: '台灣製造業佔 GDP 比重逆勢攀升 (製造業高值化)',
    source: '行政院主計總處 (DGBAS) 2025-2026 國民所得統計年報與美國 BEA 資料庫',
    tableRows: [
      ['美國製造業 (2025)', '10.50%', '去工業化完成，專注大模型演算法、軟體生態與無形資產攫取超額利潤'],
      ['台灣製造業 (2020)', '33.20%', '疫情前資通訊硬體出口導向，維持製造業基底'],
      ['台灣製造業 (2025/2026)', '38.54%', '製造業高值化逆勢回升，整體工業產值佔比達 43.45%，罕見反全球去工業化潮流'],
      ['台灣服務業 (2025)', '55.11%', '佔比相對萎縮，承載多數就業人口，面臨生產力停滯與薪資體感溫差']
    ],
    insights: [
      '逆向工業化現象：不同於英美及多數 OECD 國家製造業持續降至 10%–15%，台灣製造業比重逆勢攀升逼近四成。',
      '就業與產值高度錯配：半導體業以不到 35 萬人（佔總就業約 3%）創造逾兩成 GDP，服務業吸納逾六成人口卻僅創造 55% 產值。'
    ]
  },

  tsmcWeightTimeline: {
    title: '台積電（2330）權重演變與「台積電條款」放寬歷史點位',
    source: '臺灣證券交易所 (TWSE) 與金管會證券期貨局公告',
    tableRows: [
      ['2016 年', '17.5%', '32.0%', '智慧型手機旗艦晶片大量出貨，奠定先進製程領導地位'],
      ['2019 年', '23.0%', '38.0%', '7 奈米 EUV 率先量產，與競爭對手拉開代際差距'],
      ['2021 年', '28.5%', '47.0%', '全球晶片缺貨潮，台積電在加權指數權重逼近三成門檻'],
      ['2023 年', '30.2%', '49.5%', '生成式 AI 與高效能運算 (HPC) 爆發，臺灣 50 權重逼近五成'],
      ['2025 年 5 月', '35.8%', '54.0%', '【法規第一波】：金管會宣布被動式 ETF 追蹤指數不再受 30% 單一持股上限約束'],
      ['2026 年 4 月', '41.5%', '58.5%', '【法規第二波】：主動型基金與主動式 ETF 單一個股上限由 10% 鬆綁至 25% (台積電條款)'],
      ['2026 年下半年', '43.2%', '60.5%', '指數「單一因子化」，HHI 指數破 0.33，有效持股數 Neff 跌破 3 檔']
    ],
    insights: [
      '單一因子化常態：加權指數權重逾 40%、臺灣 50 逾 60%，非系統性風險無法被分散，拉積盤成為統計必然。',
      '制度被迫適應現實：舊法規 10% 與 30% 限制導致巨大追蹤誤差與經理人操作扭曲，促成金管會兩波歷史性鬆綁。'
    ]
  }
};


/**
 * 核心應用邏輯與互動事件控制器
 */

// 應用狀態
const state = {
  activeView: 'ch1',
  completedChapters: new Set(),
  quizAnswers: {},
  quizSubmitted: false
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSearch();
  initSimulators();
  initQuiz();
  renderCurrentView();
  updateProgress();
  
  // 處理 URL hash
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      navigateTo(hash);
    }
  });

  if (window.location.hash) {
    navigateTo(window.location.hash.replace('#', ''));
  }
});

// 導航系統
function initNavigation() {
  document.querySelectorAll('[data-nav-target]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.getAttribute('data-nav-target');
      navigateTo(target);
    });
  });
}

function navigateTo(viewId) {
  state.activeView = viewId;
  try { window.location.hash = viewId; } catch(e){}

  // 更新側邊欄 highlight
  document.querySelectorAll('[data-nav-target]').forEach(el => {
    if (el.getAttribute('data-nav-target') === viewId) {
      el.classList.add('nav-item-active');
    } else {
      el.classList.remove('nav-item-active');
    }
  });

  renderCurrentView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 渲染當前視圖
function renderCurrentView() {
  const container = document.getElementById('view-container');
  if (!container) return;

  if (state.activeView.startsWith('ch')) {
    renderChapterView(state.activeView, container);
  } else if (state.activeView === 'lab') {
    renderLabView(container);
  } else if (state.activeView === 'quiz') {
    renderQuizView(container);
  } else if (state.activeView === 'charts') {
    renderChartsView(container);
  } else if (state.activeView === 'glossary') {
    renderGlossaryView(container);
  }
}

// 渲染章節內容
function renderChapterView(chapterId, container) {
  const chapter = COURSE_DATA.chapters.find(c => c.id === chapterId);
  if (!chapter) return;

  const isCompleted = state.completedChapters.has(chapterId);

  let html = `
    <div class="animate-fade-in max-w-4xl mx-auto pb-16">
      <!-- 章節標頭 -->
      <div class="mb-8 pb-6 border-b border-slate-200">
        <div class="flex items-center justify-between mb-3">
          <span class="badge-tech">${chapter.badge}</span>
          <span class="text-sm font-semibold text-slate-500 font-mono">${chapter.number}</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-4">${chapter.title}</h1>
        <p class="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm md:text-base leading-relaxed">
          <span class="font-semibold text-blue-700">【核心導讀】：</span>${chapter.summary}
        </p>
      </div>

      <!-- 小節內容 -->
      <div class="space-y-10">
  `;

  chapter.sections.forEach((sec, idx) => {
    html += `
      <section class="card-elevation p-6 md:p-8 bg-white rounded-2xl">
        <h2 class="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <span class="w-2.5 h-6 bg-blue-600 rounded-full inline-block"></span>
          ${sec.title}
        </h2>
        <div class="prose max-w-none text-slate-700 leading-relaxed space-y-4">
          ${formatMarkdownContent(sec.content)}
        </div>
    `;

    // 若有表格
    if (sec.tableData) {
      html += `
        <div class="mt-6 overflow-x-auto">
          <table class="edu-table">
            <thead>
              <tr>
                ${sec.tableData.headers.map(h => `<th>${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${sec.tableData.rows.map(r => `
                <tr>
                  ${r.map((cell, cIdx) => `<td class="${cIdx === 0 ? 'font-semibold text-slate-900 bg-slate-50' : ''}">${cell}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    html += `</section>`;
  });

  // 章節底部導航與完成標記
  const currentIndex = COURSE_DATA.chapters.findIndex(c => c.id === chapterId);
  const nextChapter = COURSE_DATA.chapters[currentIndex + 1];

  html += `
      <div class="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
        <button onclick="toggleChapterComplete('${chapterId}')" 
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl border font-medium text-sm transition-all ${
            isCompleted 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100' 
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
          }">
          <svg class="w-5 h-5 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          ${isCompleted ? '✓ 已完成本章學習' : '標記為已讀'}
        </button>

        <div class="flex items-center gap-3">
          ${nextChapter ? `
            <button onclick="navigateTo('${nextChapter.id}')" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm shadow-sm flex items-center gap-2 transition-all">
              進入下一章：${nextChapter.title.slice(0, 14)}... →
            </button>
          ` : `
            <button onclick="navigateTo('lab')" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm shadow-sm flex items-center gap-2 transition-all">
              前往互動量化實驗室 🔬 →
            </button>
          `}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// 簡單 Markdown 格式轉換
function formatMarkdownContent(text) {
  if (!text) return '';
  return text
    .split('\n\n')
    .map(para => {
      let trimmed = para.trim();
      if (trimmed.startsWith('- ')) {
        const listItems = trimmed.split('\n- ').map(item => item.replace(/^- /, ''));
        return `<ul class="list-disc pl-5 space-y-2 my-3">${listItems.map(li => `<li>${formatInlineStyles(li)}</li>`).join('')}</ul>`;
      } else if (trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ')) {
        const listItems = trimmed.split(/\n(?=\d+\.\s)/);
        return `<ol class="list-decimal pl-5 space-y-2 my-3">${listItems.map(li => `<li>${formatInlineStyles(li.replace(/^\d+\.\s*/, ''))}</li>`).join('')}</ol>`;
      } else if (trimmed.includes('$$')) {
        const cleaned = trimmed.replace(/\$\$/g, '');
        return `<div class="formula-box text-center text-sky-300 font-mono text-sm md:text-base my-3">${cleaned}</div>`;
      } else {
        return `<p class="leading-relaxed my-2">${formatInlineStyles(trimmed)}</p>`;
      }
    })
    .join('');
}

function formatInlineStyles(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
    .replace(/『(.*?)』/g, '<span class="text-blue-700 font-medium">『$1』</span>')
    .replace(/\$(.*?)\$/g, '<code class="bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
}

function toggleChapterComplete(chapterId) {
  if (state.completedChapters.has(chapterId)) {
    state.completedChapters.delete(chapterId);
  } else {
    state.completedChapters.add(chapterId);
  }
  updateProgress();
  renderCurrentView();
}

function updateProgress() {
  const total = COURSE_DATA.chapters.length;
  const count = state.completedChapters.size;
  const pct = Math.round((count / total) * 100);

  const bar = document.getElementById('progress-bar');
  const text = document.getElementById('progress-text');
  if (bar) bar.style.width = `${pct}%`;
  if (text) text.innerText = `${pct}% (${count}/${total} 章)`;
}

// 渲染互動實驗室視圖
function renderLabView(container) {
  container.innerHTML = `
    <div class="animate-fade-in max-w-4xl mx-auto pb-16">
      <div class="mb-8 pb-6 border-b border-slate-200">
        <span class="badge-tech bg-indigo-50 text-indigo-700">互動量化實驗室</span>
        <h1 class="text-2xl md:text-3xl font-bold text-slate-900 mt-2 mb-3">經濟學與資本市場互動試算工具</h1>
        <p class="text-slate-600 text-sm md:text-base">
          透過即時可調參數，親身體驗 ROIC-WACC 資本價值創造機制、台股市值集中度 HHI 數學分佈，以及多層穿透式投資組合的「含積量」真實曝險。
        </p>
      </div>

      <!-- 實驗工具 1: EVA 資本價值創造/減損模擬器 -->
      <div class="card-elevation p-6 md:p-8 bg-white rounded-2xl mb-10">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
          <div>
            <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span class="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded font-mono font-bold">工具 1</span>
              ROIC vs WACC 資本價值創造／減損模擬器 (EVA)
            </h2>
            <p class="text-slate-500 text-xs mt-1">公式：EVA = (ROIC - WACC) × 投資資本</p>
          </div>
          <div class="flex gap-2">
            <button onclick="setEVAPreset('tsmc')" class="text-xs px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100">先進半導體</button>
            <button onclick="setEVAPreset('traditional')" class="text-xs px-2.5 py-1.5 bg-rose-50 text-rose-700 rounded-lg font-medium hover:bg-rose-100">傳統製造業</button>
            <button onclick="setEVAPreset('service')" class="text-xs px-2.5 py-1.5 bg-amber-50 text-amber-700 rounded-lg font-medium hover:bg-amber-100">內需服務業</button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">投資資本 Invested Capital (億新台幣)</label>
            <input type="range" id="eva-ic" min="500" max="30000" step="500" value="16000" class="w-full" oninput="runEVASim()">
            <div class="text-right text-xs font-mono text-blue-600 font-bold" id="eva-ic-val">16,000 億元</div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">資本報酬率 ROIC (%)</label>
            <input type="range" id="eva-roic" min="-5" max="45" step="0.5" value="31.8" class="w-full" oninput="runEVASim()">
            <div class="text-right text-xs font-mono text-emerald-600 font-bold" id="eva-roic-val">31.8%</div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">加權平均資本成本 WACC (%)</label>
            <input type="range" id="eva-wacc" min="4" max="15" step="0.1" value="6.8" class="w-full" oninput="runEVASim()">
            <div class="text-right text-xs font-mono text-rose-600 font-bold" id="eva-wacc-val">6.8%</div>
          </div>
        </div>

        <div id="eva-result-box" class="p-5 rounded-xl border transition-all"></div>
      </div>

      <!-- 實驗工具 2: 台股 HHI 集中度與有效成分股數模擬器 -->
      <div class="card-elevation p-6 md:p-8 bg-white rounded-2xl mb-10">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
          <div>
            <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span class="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs rounded font-mono font-bold">工具 2</span>
              指數集中度赫芬達爾指數 (HHI) 與有效持股數 (Neff)
            </h2>
            <p class="text-slate-500 text-xs mt-1">公式：HHI = Σ w_i² (0-10,000點)，有效持股數 Neff = 1 / HHI_frac</p>
          </div>
          <div class="flex gap-2">
            <button onclick="setHHIPreset('tw50')" class="text-xs px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100">臺灣50 (0050)</button>
            <button onclick="setHHIPreset('taiex')" class="text-xs px-2.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100">加權指數</button>
            <button onclick="setHHIPreset('sp500')" class="text-xs px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200">美股 S&P 500</button>
          </div>
        </div>

        <div class="space-y-4 mb-6">
          <div>
            <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>第 1 大權值股 (台積電 2330) 權重</span>
              <span id="hhi-w1-val" class="font-mono text-blue-600 font-bold">54.8%</span>
            </div>
            <input type="range" id="hhi-w1" min="5" max="75" step="0.5" value="54.8" class="w-full" oninput="runHHISim()">
          </div>
          <div>
            <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>第 2 大權值股 (聯發科/鴻海) 權重</span>
              <span id="hhi-w2-val" class="font-mono text-blue-600 font-bold">7.2%</span>
            </div>
            <input type="range" id="hhi-w2" min="1" max="20" step="0.2" value="7.2" class="w-full" oninput="runHHISim()">
          </div>
        </div>

        <div id="hhi-result-box" class="p-5 rounded-xl border"></div>
      </div>

      <!-- 實驗工具 3: 投資組合穿透式「含積量」與防禦槓鈴分析 -->
      <div class="card-elevation p-6 md:p-8 bg-white rounded-2xl">
        <div class="pb-4 mb-6 border-b border-slate-100">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs rounded font-mono font-bold">工具 3</span>
                投資組合穿透式「含積量」、風險貢獻度 (PCR) 與壓力情境回測
              </h2>
              <p class="text-slate-500 text-xs mt-1">穿透拆解 0050、006208、0052、00922、0056、00878 等底層真實曝險與極端黑天鵝衝擊</p>
            </div>
            <div>
              <select id="stress-scenario-select" onchange="runPortfolioSim()" class="text-xs p-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-700 focus:ring-2 focus:ring-blue-500">
                <option value="none">常規市場情境</option>
                <option value="ai_boom">情境 1：AI 超級週期擴產 (積+30%)</option>
                <option value="downturn">情境 2：半導體景氣寒冬 (積-25%)</option>
                <option value="geopolitics">情境 3：地緣政治貿易制裁 (積-35%)</option>
                <option value="cftc">情境 4：CFTC 窄基外資賣壓 (積-15%)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-xs">
          <div>
            <label class="font-semibold text-slate-700 block mb-1">0050 / 006208 (純市值型, 積~60%)</label>
            <input type="number" id="port-0050" value="40" min="0" max="100" class="w-full p-2 border rounded-lg font-mono" oninput="runPortfolioSim()">
          </div>
          <div>
            <label class="font-semibold text-slate-700 block mb-1">0052 (科技型, 積~66%)</label>
            <input type="number" id="port-0052" value="20" min="0" max="100" class="w-full p-2 border rounded-lg font-mono" oninput="runPortfolioSim()">
          </div>
          <div>
            <label class="font-semibold text-slate-700 block mb-1">00922 / 00923 (ESG權重上限, 積~39%)</label>
            <input type="number" id="port-00922" value="0" min="0" max="100" class="w-full p-2 border rounded-lg font-mono" oninput="runPortfolioSim()">
          </div>
          <div>
            <label class="font-semibold text-slate-700 block mb-1">0056 / 00878 / 00919 (高股息, 積~0%)</label>
            <input type="number" id="port-highdiv" value="30" min="0" max="100" class="w-full p-2 border rounded-lg font-mono" oninput="runPortfolioSim()">
          </div>
          <div>
            <label class="font-semibold text-slate-700 block mb-1">主動型基金 / 主動式 ETF (積~22%)</label>
            <input type="number" id="port-active" value="10" min="0" max="100" class="w-full p-2 border rounded-lg font-mono" oninput="runPortfolioSim()">
          </div>
          <div>
            <label class="font-semibold text-slate-700 block mb-1">美股 S&P 500 / 全球軟體 ETF (積 0%)</label>
            <input type="number" id="port-us" value="0" min="0" max="100" class="w-full p-2 border rounded-lg font-mono" oninput="runPortfolioSim()">
          </div>
        </div>

        <div id="port-result-box" class="p-5 rounded-xl border"></div>
      </div>
    </div>
  `;

  runEVASim();
  runHHISim();
  runPortfolioSim();
}

// 模擬器事件與計算
function setEVAPreset(type) {
  const ic = document.getElementById('eva-ic');
  const roic = document.getElementById('eva-roic');
  const wacc = document.getElementById('eva-wacc');
  if (!ic || !roic || !wacc) return;

  if (type === 'tsmc') {
    ic.value = 16000;
    roic.value = 31.87;
    wacc.value = 6.84;
  } else if (type === 'traditional') {
    ic.value = 6500;
    roic.value = 2.13;
    wacc.value = 4.62;
  } else if (type === 'service') {
    ic.value = 800;
    roic.value = 9.89;
    wacc.value = 4.52;
  }
  runEVASim();
}

function runEVASim() {
  const ic = parseFloat(document.getElementById('eva-ic')?.value || 16000);
  const roic = parseFloat(document.getElementById('eva-roic')?.value || 31.87);
  const wacc = parseFloat(document.getElementById('eva-wacc')?.value || 6.84);

  document.getElementById('eva-ic-val').innerText = `${ic.toLocaleString()} 億元`;
  document.getElementById('eva-roic-val').innerText = `${roic.toFixed(2)}%`;
  document.getElementById('eva-wacc-val').innerText = `${wacc.toFixed(2)}%`;

  const res = SIMULATORS.calcEVA(ic, roic, wacc);
  const box = document.getElementById('eva-result-box');
  if (!box) return;

  box.className = `p-5 rounded-xl border ${res.statusClass}`;
  box.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
      <div>
        <span class="text-xs font-semibold uppercase tracking-wider block">經濟附加價值狀態診斷</span>
        <h3 class="text-lg font-bold">${res.status}</h3>
      </div>
      <div class="text-right">
        <div class="text-xs text-slate-500">超額利差 (ROIC - WACC)</div>
        <div class="text-2xl font-bold font-mono ${res.spread >= 0 ? 'text-emerald-700' : 'text-rose-700'}">
          ${res.spread > 0 ? '+' : ''}${res.spread}%
        </div>
      </div>
    </div>
    <div class="mb-3 text-sm">
      <span class="font-semibold">年化實質價值創造 (EVA)：</span>
      <span class="font-mono font-bold text-base ${res.eva >= 0 ? 'text-emerald-700' : 'text-rose-700'}">
        ${res.eva >= 0 ? '+' : ''}${res.eva.toLocaleString()} 億新台幣
      </span>
    </div>
    <p class="text-xs md:text-sm text-slate-700 leading-relaxed bg-white/70 p-3 rounded-lg border border-slate-200/60">
      ${res.analysis}
    </p>
  `;
}

function setHHIPreset(type) {
  const w1 = document.getElementById('hhi-w1');
  const w2 = document.getElementById('hhi-w2');
  if (!w1 || !w2) return;

  if (type === 'tw50') {
    w1.value = 54.8;
    w2.value = 7.2;
  } else if (type === 'taiex') {
    w1.value = 37.6;
    w2.value = 5.4;
  } else if (type === 'sp500') {
    w1.value = 7.2;
    w2.value = 6.8;
  }
  runHHISim();
}

function runHHISim() {
  const w1 = parseFloat(document.getElementById('hhi-w1')?.value || 54.8);
  const w2 = parseFloat(document.getElementById('hhi-w2')?.value || 7.2);

  document.getElementById('hhi-w1-val').innerText = `${w1}%`;
  document.getElementById('hhi-w2-val').innerText = `${w2}%`;

  const remaining = Math.max(0, 100 - w1 - w2);
  const others = [];
  const numOthers = 48;
  for (let i = 0; i < numOthers; i++) {
    others.push(remaining / numOthers);
  }

  const weights = [w1, w2, ...others];
  const res = SIMULATORS.calcHHI(weights);

  const box = document.getElementById('hhi-result-box');
  if (!box) return;

  box.className = `p-5 rounded-xl border ${res.evalColor}`;
  box.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-4">
      <div class="p-3 bg-white/80 rounded-lg border border-slate-200">
        <div class="text-xs text-slate-500 mb-1">赫芬達爾指數 (0-10,000點)</div>
        <div class="text-xl font-bold font-mono text-slate-900">${res.hhiPoints} 點</div>
        <div class="text-[10px] text-slate-400 mt-0.5">比例基準：${res.hhiFrac}</div>
      </div>
      <div class="p-3 bg-white/80 rounded-lg border border-slate-200">
        <div class="text-xs text-slate-500 mb-1">有效成分股數 Neff</div>
        <div class="text-xl font-bold font-mono text-blue-700">${res.nEff} 檔</div>
        <div class="text-[10px] text-slate-400 mt-0.5">名義持股 50 檔</div>
      </div>
      <div class="p-3 bg-white/80 rounded-lg border border-slate-200">
        <div class="text-xs text-slate-500 mb-1">結構風險評級</div>
        <div class="text-sm font-bold text-slate-800 mt-1">${res.evalRisk.split(' ')[0]}</div>
      </div>
    </div>
    <div class="text-xs md:text-sm text-slate-700 bg-white/70 p-3 rounded-lg border border-slate-200/60 leading-relaxed">
      ${parseFloat(res.nEff) < 4 ? `
        <strong>【拉積盤量化警示】：</strong>當有效成分股數低於 4 檔時，指數已經失去多元分散效果，實質上退化為「單一龍頭股波動驅動」。任何針對台積電的非系統性特質利空，都將無可避免地直接演變為全市場的系統性 Beta 殺盤。
      ` : `
        <strong>【分散度指標正常】：</strong>當有效成分股數大於 10 檔時，個股特質風險能被有效平滑，更符合資本資產定價模型（CAPM）與效率前緣的理論設定。
      `}
    </div>
  `;
}

function runPortfolioSim() {
  const allocations = {
    etf0050: parseFloat(document.getElementById('port-0050')?.value || 0),
    etf0052: parseFloat(document.getElementById('port-0052')?.value || 0),
    etf00922: parseFloat(document.getElementById('port-00922')?.value || 0),
    etf0056: parseFloat(document.getElementById('port-highdiv')?.value || 0),
    activeEtf: parseFloat(document.getElementById('port-active')?.value || 0),
    usSp500: parseFloat(document.getElementById('port-us')?.value || 0)
  };

  const stressScenario = document.getElementById('stress-scenario-select')?.value || 'none';
  const res = SIMULATORS.calcPortfolioLookThrough(allocations, stressScenario);
  const box = document.getElementById('port-result-box');
  if (!box) return;

  box.className = `p-5 rounded-xl border ${res.badgeClass}`;
  box.innerHTML = `
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-4 pb-4 border-b border-slate-200/60">
      <div class="p-2.5 bg-white/80 rounded-xl">
        <span class="text-[11px] text-slate-500 block">穿透實質含積量</span>
        <span class="text-2xl font-extrabold font-mono text-slate-900">${res.tsmcPct}%</span>
      </div>
      <div class="p-2.5 bg-white/80 rounded-xl">
        <span class="text-[11px] text-slate-500 block">非積多元資產</span>
        <span class="text-2xl font-extrabold font-mono text-blue-600">${res.nonTsmcPct}%</span>
      </div>
      <div class="p-2.5 bg-white/80 rounded-xl">
        <span class="text-[11px] text-slate-500 block">預估年化波動度</span>
        <span class="text-2xl font-extrabold font-mono text-slate-700">${res.portVol}%</span>
      </div>
      <div class="p-2.5 bg-white/80 rounded-xl">
        <span class="text-[11px] text-slate-500 block">台積電風險貢獻 (PCR)</span>
        <span class="text-2xl font-extrabold font-mono text-rose-600">${res.pcrTSMC}%</span>
      </div>
    </div>

    <!-- 壓力測試情境預測 -->
    <div class="mb-3 p-3 bg-white/90 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <div class="text-xs">
        <strong class="text-slate-900 block">${res.scenarioDesc}</strong>
        <span class="text-slate-500">預估投資組合淨值波動：</span>
      </div>
      <div class="text-lg font-bold font-mono ${res.estimatedPortfolioShock.startsWith('+') ? 'text-emerald-700' : 'text-rose-700'}">
        ${res.estimatedPortfolioShock}
      </div>
    </div>

    <div class="text-xs md:text-sm leading-relaxed p-3 bg-white/70 rounded-lg border border-slate-200/60 text-slate-800">
      ${res.diagnosis}
    </div>
  `;
}

// 測驗系統
function initQuiz() {
  state.quizAnswers = {};
  state.quizSubmitted = false;
}

function renderQuizView(container) {
  let html = `
    <div class="animate-fade-in max-w-4xl mx-auto pb-16">
      <div class="mb-8 pb-6 border-b border-slate-200">
        <span class="badge-tech bg-purple-50 text-purple-700">學術評量與知識通關</span>
        <h1 class="text-2xl md:text-3xl font-bold text-slate-900 mt-2 mb-3">宏觀經濟與資本市場通識綜合檢定</h1>
        <p class="text-slate-600 text-sm md:text-base">
          檢測您對四次工業革命、美台追趕、K型產業結構、ROIC分化、CAPM失靈與台積電條款的掌握程度。共 10 題，提供即時題解與能力評鑑。
        </p>
      </div>

      <div class="space-y-6">
  `;

  QUIZ_QUESTIONS.forEach((q, qIdx) => {
    const userAnswer = state.quizAnswers[q.id];
    const isSubmitted = state.quizSubmitted;

    html += `
      <div class="card-elevation p-6 bg-white rounded-2xl" id="question-card-${q.id}">
        <div class="flex items-center justify-between mb-3 text-xs">
          <span class="font-bold text-blue-600 font-mono">QUESTION ${String(qIdx + 1).padStart(2, '0')}</span>
          <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded">${q.topic}</span>
        </div>
        <h3 class="text-base font-bold text-slate-900 mb-4">${q.question}</h3>
        <div class="space-y-2.5">
          ${q.options.map((opt, optIdx) => {
            let optClass = 'quiz-option p-3.5 rounded-xl text-sm flex items-start gap-3';
            if (isSubmitted) {
              if (optIdx === q.answer) {
                optClass += ' correct';
              } else if (userAnswer === optIdx && optIdx !== q.answer) {
                optClass += ' wrong';
              }
            } else if (userAnswer === optIdx) {
              optClass += ' selected';
            }

            return `
              <div class="${optClass}" onclick="${!isSubmitted ? `selectQuizOption(${q.id}, ${optIdx})` : ''}">
                <span class="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">
                  ${['A', 'B', 'C', 'D'][optIdx]}
                </span>
                <span class="leading-relaxed">${opt}</span>
              </div>
            `;
          }).join('')}
        </div>

        ${isSubmitted ? `
          <div class="mt-4 p-4 rounded-xl text-xs md:text-sm bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
            <strong class="text-slate-900 block mb-1">💡 專家解析：</strong>
            ${q.explanation}
          </div>
        ` : ''}
      </div>
    `;
  });

  html += `
      </div>

      <!-- 測驗提交區 -->
      <div class="mt-8 text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
        ${!state.quizSubmitted ? `
          <button onclick="submitQuiz()" class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all">
            提交測驗並查看成績與詳細解析 →
          </button>
        ` : `
          <div id="quiz-final-score"></div>
          <button onclick="resetQuiz()" class="mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium text-sm transition-all">
            重新測驗 ⟳
          </button>
        `}
      </div>
    </div>
  `;

  container.innerHTML = html;

  if (state.quizSubmitted) {
    displayQuizResult();
  }
}

function selectQuizOption(qid, optIdx) {
  state.quizAnswers[qid] = optIdx;
  renderQuizView(document.getElementById('view-container'));
}

function submitQuiz() {
  state.quizSubmitted = true;
  renderQuizView(document.getElementById('view-container'));
}

function resetQuiz() {
  state.quizAnswers = {};
  state.quizSubmitted = false;
  renderQuizView(document.getElementById('view-container'));
}

function displayQuizResult() {
  let score = 0;
  QUIZ_QUESTIONS.forEach(q => {
    if (state.quizAnswers[q.id] === q.answer) {
      score += 10;
    }
  });

  const resDiv = document.getElementById('quiz-final-score');
  if (!resDiv) return;

  let title = '';
  let badgeClass = '';
  if (score >= 90) {
    title = '頂尖宏觀經濟與資本市場策略師 (Top Macro Strategist)';
    badgeClass = 'text-emerald-700 bg-emerald-100 border-emerald-300';
  } else if (score >= 70) {
    title = '資深產業與證券分析師 (Senior Industry Analyst)';
    badgeClass = 'text-blue-700 bg-blue-100 border-blue-300';
  } else {
    title = '市場見習研究員 (Apprentice Researcher)';
    badgeClass = 'text-amber-700 bg-amber-100 border-amber-300';
  }

  resDiv.innerHTML = `
    <div class="inline-block p-6 rounded-2xl border ${badgeClass} text-center max-w-md mx-auto">
      <div class="text-xs uppercase tracking-wider font-semibold mb-1">測驗成績結算</div>
      <div class="text-4xl font-extrabold font-mono mb-2">${score} / 100 分</div>
      <div class="text-sm font-bold mb-2">獲得頭銜：${title}</div>
      <p class="text-xs opacity-90 leading-relaxed">
        您已完整掌握台灣在第四次工業革命下的追趕歷程、K型結構成因與資本市場資產定價關鍵演化！
      </p>
    </div>
  `;
}

// 總經數據圖表中心視圖 (原生響應式向量 SVG 與結構化明細表，保證 100% 離線可用)
function renderChartsView(container) {
  const cd = (typeof COURSE_DATA !== 'undefined' && COURSE_DATA && COURSE_DATA.chartsData) ? COURSE_DATA.chartsData : CHARTS_DATA_FALLBACK;
  const gdp = (cd && cd.gdpCatchup) ? cd.gdpCatchup : CHARTS_DATA_FALLBACK.gdpCatchup;
  const mfg = (cd && cd.manufacturingShare) ? cd.manufacturingShare : CHARTS_DATA_FALLBACK.manufacturingShare;
  const tsmc = (cd && cd.tsmcWeightTimeline) ? cd.tsmcWeightTimeline : CHARTS_DATA_FALLBACK.tsmcWeightTimeline;

  container.innerHTML = `
    <div class="animate-fade-in max-w-4xl mx-auto pb-16">
      <div class="mb-8 pb-6 border-b border-slate-200">
        <span class="badge-tech bg-emerald-50 text-emerald-700">總經數據圖表中心</span>
        <h1 class="text-2xl md:text-3xl font-bold text-slate-900 mt-2 mb-3">六十載美台產值追趕與台股權重視覺化</h1>
        <p class="text-slate-600 text-sm md:text-base leading-relaxed">
          整合 Angus Maddison 歷史人均 GDP 曲線、行政院主計總處製造業高值化逆勢回升、以及臺灣證交所台積電權重突破 40% 的歷史臨界點。本中心自帶原生響應式向量圖表與完整數據明細，保證全環境零缺失顯示！
        </p>
      </div>

      <div class="space-y-12">
        <!-- 圖表 1: 美台人均 GDP 追趕曲線 -->
        <div class="card-elevation p-6 md:p-8 bg-white rounded-2xl">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
            <div>
              <span class="text-[11px] font-bold text-blue-600 uppercase tracking-wider font-mono">DATA VISUALIZATION 01</span>
              <h2 class="text-lg md:text-xl font-bold text-slate-900 mt-0.5">${gdp.title}</h2>
              <p class="text-xs text-slate-500 mt-0.5">資料來源：${gdp.source}</p>
            </div>
            <div class="flex items-center gap-3 text-xs">
              <span class="flex items-center gap-1.5 font-medium text-slate-600"><span class="w-3 h-3 rounded-full bg-slate-400 inline-block"></span> 美國</span>
              <span class="flex items-center gap-1.5 font-medium text-blue-700"><span class="w-3 h-3 rounded-full bg-blue-600 inline-block"></span> 台灣 (PPP)</span>
            </div>
          </div>

          <!-- 原生 SVG 向量折線圖 -->
          <div class="w-full overflow-hidden bg-slate-50/50 p-2 md:p-4 rounded-xl border border-slate-100 mb-6">
            ${generateSVGLineChart1()}
          </div>

          <!-- 結構化明細表 -->
          <div class="overflow-x-auto mb-6">
            <table class="edu-table">
              <thead>
                <tr>
                  <th>年份節點</th>
                  <th>所處階段</th>
                  <th>美國人均實質 GDP</th>
                  <th>台灣人均實質 GDP</th>
                  <th>追趕比率 (TW/US)</th>
                  <th>核心分工角色與驅動機制</th>
                </tr>
              </thead>
              <tbody>
                ${gdp.tableRows.map(row => `
                  <tr>
                    <td class="font-bold text-slate-900 bg-slate-50 font-mono">${row[0]}</td>
                    <td class="text-slate-600 text-xs">${row[1]}</td>
                    <td class="font-mono font-medium text-slate-700">${row[2]}</td>
                    <td class="font-mono font-bold text-blue-700 bg-blue-50/30">${row[3]}</td>
                    <td class="font-mono font-extrabold ${parseFloat(row[4]) >= 100 ? 'text-emerald-600' : 'text-slate-800'}">${row[4]}</td>
                    <td class="text-xs text-slate-600 leading-relaxed">${row[5]}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- 核心經濟洞察卡 -->
          <div class="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs md:text-sm text-slate-700 space-y-2">
            <strong class="text-blue-900 flex items-center gap-1.5 block">
              <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
              學術洞察要點：
            </strong>
            <ul class="list-disc pl-5 space-y-1.5 text-xs">
              ${gdp.insights.map(ins => `<li>${ins}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- 圖表 2: 台灣產業部門比重變遷 (柱狀圖) -->
        <div class="card-elevation p-6 md:p-8 bg-white rounded-2xl">
          <div class="pb-4 mb-4 border-b border-slate-100">
            <span class="text-[11px] font-bold text-blue-600 uppercase tracking-wider font-mono">DATA VISUALIZATION 02</span>
            <h2 class="text-lg md:text-xl font-bold text-slate-900 mt-0.5">${mfg.title}</h2>
            <p class="text-xs text-slate-500 mt-0.5">資料來源：${mfg.source}</p>
          </div>

          <!-- 原生 SVG 向量柱狀圖 -->
          <div class="w-full overflow-hidden bg-slate-50/50 p-2 md:p-4 rounded-xl border border-slate-100 mb-6">
            ${generateSVGBarChart2()}
          </div>

          <!-- 結構化明細表 -->
          <div class="overflow-x-auto mb-6">
            <table class="edu-table">
              <thead>
                <tr>
                  <th>經濟部門與時期</th>
                  <th>占 GDP 比重</th>
                  <th>總體經濟意涵與結構分工分析</th>
                </tr>
              </thead>
              <tbody>
                ${mfg.tableRows.map(row => `
                  <tr>
                    <td class="font-bold text-slate-900 bg-slate-50">${row[0]}</td>
                    <td class="font-mono font-extrabold text-blue-700">${row[1]}</td>
                    <td class="text-xs text-slate-600 leading-relaxed">${row[2]}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- 核心經濟洞察卡 -->
          <div class="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs md:text-sm text-slate-700 space-y-2">
            <strong class="text-blue-900 flex items-center gap-1.5 block">
              <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
              學術洞察要點：
            </strong>
            <ul class="list-disc pl-5 space-y-1.5 text-xs">
              ${mfg.insights.map(ins => `<li>${ins}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- 圖表 3: 台積電權重演進與法規放寬點位 (雙軌折線圖) -->
        <div class="card-elevation p-6 md:p-8 bg-white rounded-2xl">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
            <div>
              <span class="text-[11px] font-bold text-blue-600 uppercase tracking-wider font-mono">DATA VISUALIZATION 03</span>
              <h2 class="text-lg md:text-xl font-bold text-slate-900 mt-0.5">${tsmc.title}</h2>
              <p class="text-xs text-slate-500 mt-0.5">資料來源：${tsmc.source}</p>
            </div>
            <div class="flex items-center gap-3 text-xs">
              <span class="flex items-center gap-1.5 font-medium text-blue-700"><span class="w-3 h-3 rounded-full bg-blue-600 inline-block"></span> 加權指數權重</span>
              <span class="flex items-center gap-1.5 font-medium text-rose-600"><span class="w-3 h-3 rounded-full bg-rose-600 inline-block"></span> 臺灣50 (0050) 權重</span>
            </div>
          </div>

          <!-- 原生 SVG 向量折線圖 -->
          <div class="w-full overflow-hidden bg-slate-50/50 p-2 md:p-4 rounded-xl border border-slate-100 mb-6">
            ${generateSVGAreaChart3()}
          </div>

          <!-- 結構化明細表 -->
          <div class="overflow-x-auto mb-6">
            <table class="edu-table">
              <thead>
                <tr>
                  <th>時間節點</th>
                  <th>加權指數權重</th>
                  <th>臺灣50 (0050) 權重</th>
                  <th>重大制度鬆綁或產業驅動事件</th>
                </tr>
              </thead>
              <tbody>
                ${tsmc.tableRows.map(row => `
                  <tr>
                    <td class="font-bold text-slate-900 bg-slate-50 font-mono">${row[0]}</td>
                    <td class="font-mono font-bold text-blue-700">${row[1]}</td>
                    <td class="font-mono font-bold text-rose-700 bg-rose-50/30">${row[2]}</td>
                    <td class="text-xs text-slate-600 leading-relaxed">${row[3]}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- 核心經濟洞察卡 -->
          <div class="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs md:text-sm text-slate-700 space-y-2">
            <strong class="text-blue-900 flex items-center gap-1.5 block">
              <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
              學術洞察要點：
            </strong>
            <ul class="list-disc pl-5 space-y-1.5 text-xs">
              ${tsmc.insights.map(ins => `<li>${ins}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 產生圖表 1 SVG (美台人均實質 GDP 追趕曲線)
function generateSVGLineChart1() {
  const years = ['1960', '1980', '2001', '2010', '2026 (PPP)'];
  const us = [18057, 29611, 45878, 49267, 95210];
  const tw = [2157, 8384, 26204, 37385, 103740];
  const ratios = ['11.9%', '28.3%', '57.1%', '75.9%', '109.0%'];

  const w = 740, h = 330;
  const padL = 75, padR = 40, padT = 30, padB = 55;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const yMax = 120000;

  const getX = (idx) => padL + (idx / 4) * plotW;
  const getY = (val) => padT + plotH * (1 - val / yMax);

  const usPoints = us.map((v, i) => `${getX(i).toFixed(1)},${getY(v).toFixed(1)}`).join(' ');
  const twPoints = tw.map((v, i) => `${getX(i).toFixed(1)},${getY(v).toFixed(1)}`).join(' ');

  let gridSvg = '';
  for (let level = 0; level <= 120000; level += 30000) {
    const y = getY(level);
    gridSvg += `
      <line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="#e2e8f0" stroke-dasharray="3,3" />
      <text x="${padL - 10}" y="${y + 4}" font-size="10" font-family="monospace" fill="#94a3b8" text-anchor="end">$${(level/1000)}k</text>
    `;
  }

  let pointsSvg = '';
  for (let i = 0; i < 5; i++) {
    const x = getX(i);
    const yUS = getY(us[i]);
    const yTW = getY(tw[i]);
    
    pointsSvg += `
      <!-- X 軸標籤 -->
      <text x="${x}" y="${h - padB + 20}" font-size="11" font-weight="600" fill="#64748b" text-anchor="middle">${years[i]}</text>

      <!-- 追趕比率 Badge -->
      <g transform="translate(${x}, ${h - padB + 36})">
        <rect x="-24" y="-10" width="48" height="16" rx="4" fill="${i === 4 ? '#d1fae5' : '#f1f5f9'}" stroke="${i === 4 ? '#10b981' : '#cbd5e1'}" />
        <text x="0" y="2" font-size="9" font-weight="bold" font-family="monospace" fill="${i === 4 ? '#065f46' : '#475569'}" text-anchor="middle">${ratios[i]}</text>
      </g>

      <!-- 美國數據點 -->
      <circle cx="${x}" cy="${yUS}" r="5" fill="#64748b" stroke="#ffffff" stroke-width="2" />
      <text x="${x}" y="${yUS - 10}" font-size="10" font-mono="true" font-weight="bold" fill="#64748b" text-anchor="middle">$${us[i].toLocaleString()}</text>

      <!-- 台灣數據點 -->
      <circle cx="${x}" cy="${yTW}" r="6" fill="#2563eb" stroke="#ffffff" stroke-width="2" />
      <text x="${x}" y="${yTW + (i === 4 ? -12 : 18)}" font-size="10" font-mono="true" font-weight="extrabold" fill="#1d4ed8" text-anchor="middle">$${tw[i].toLocaleString()}</text>
    `;
  }

  return `
    <svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" style="display:block; width:100%; min-height:300px;" class="w-full font-sans" xmlns="http://www.w3.org/2000/svg">
      ${gridSvg}
      <polyline fill="none" stroke="#94a3b8" stroke-width="2.5" points="${usPoints}" />
      <polyline fill="none" stroke="#2563eb" stroke-width="3.5" stroke-linecap="round" points="${twPoints}" />
      ${pointsSvg}
    </svg>
  `;
}

// 產生圖表 2 SVG (台灣製造業佔比柱狀圖)
function generateSVGBarChart2() {
  const items = [
    { label: '美國製造業 (2025)', val: 10.5, color: '#94a3b8' },
    { label: '台灣製造業 (2020)', val: 33.2, color: '#60a5fa' },
    { label: '台灣製造業 (2025/2026)', val: 38.54, color: '#2563eb', highlight: true },
    { label: '台灣服務業 (2025)', val: 55.11, color: '#f59e0b' }
  ];

  const w = 740, h = 300;
  const padL = 60, padR = 40, padT = 30, padB = 60;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const yMax = 70;

  const getY = (val) => padT + plotH * (1 - val / yMax);

  let gridSvg = '';
  for (let level = 0; level <= 70; level += 17.5) {
    const y = getY(level);
    gridSvg += `
      <line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="#e2e8f0" stroke-dasharray="3,3" />
      <text x="${padL - 10}" y="${y + 4}" font-size="10" font-family="monospace" fill="#94a3b8" text-anchor="end">${level.toFixed(0)}%</text>
    `;
  }

  const barW = 85;
  const gap = (plotW - (barW * 4)) / 3;

  let barsSvg = '';
  items.forEach((item, idx) => {
    const x = padL + idx * (barW + gap);
    const y = getY(item.val);
    const barH = (padT + plotH) - y;

    barsSvg += `
      <rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="8" fill="${item.color}" opacity="0.95" />
      <text x="${x + barW/2}" y="${y - 8}" font-size="12" font-weight="bold" font-family="monospace" fill="${item.color}" text-anchor="middle">${item.val}%</text>

      ${item.highlight ? `
        <g transform="translate(${x + barW/2}, ${y - 26})">
          <rect x="-30" y="-10" width="60" height="16" rx="4" fill="#eff6ff" stroke="#2563eb" />
          <text x="0" y="2" font-size="9" font-weight="bold" fill="#1d4ed8" text-anchor="middle">逆勢回升★</text>
        </g>
      ` : ''}

      <text x="${x + barW/2}" y="${h - padB + 20}" font-size="10.5" font-weight="600" fill="#334155" text-anchor="middle">
        ${item.label.split(' ')[0]}
      </text>
      <text x="${x + barW/2}" y="${h - padB + 36}" font-size="9.5" fill="#64748b" text-anchor="middle">
        ${item.label.split(' ')[1] || ''}
      </text>
    `;
  });

  return `
    <svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" style="display:block; width:100%; min-height:280px;" class="w-full font-sans" xmlns="http://www.w3.org/2000/svg">
      ${gridSvg}
      ${barsSvg}
    </svg>
  `;
}

// 產生圖表 3 SVG (台積電加權與臺灣50雙軌權重演進)
function generateSVGAreaChart3() {
  const points = [
    { year: '2016', taiex: 17.5, tw50: 32.0 },
    { year: '2019', taiex: 23.0, tw50: 38.0 },
    { year: '2021', taiex: 28.5, tw50: 47.0 },
    { year: '2023', taiex: 30.2, tw50: 49.5 },
    { year: '2025.05', taiex: 35.8, tw50: 54.0, flag: '被動解禁30%' },
    { year: '2026.04', taiex: 41.5, tw50: 58.5, flag: '主動放寬25%' },
    { year: '2026下', taiex: 43.2, tw50: 60.5 }
  ];

  const w = 740, h = 330;
  const padL = 60, padR = 40, padT = 30, padB = 60;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const yMax = 70;

  const getX = (idx) => padL + (idx / 6) * plotW;
  const getY = (val) => padT + plotH * (1 - val / yMax);

  const taiexCoords = points.map((p, i) => `${getX(i).toFixed(1)},${getY(p.taiex).toFixed(1)}`).join(' ');
  const tw50Coords = points.map((p, i) => `${getX(i).toFixed(1)},${getY(p.tw50).toFixed(1)}`).join(' ');

  let gridSvg = '';
  for (let level = 0; level <= 70; level += 17.5) {
    const y = getY(level);
    gridSvg += `
      <line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="#e2e8f0" stroke-dasharray="3,3" />
      <text x="${padL - 10}" y="${y + 4}" font-size="10" font-family="monospace" fill="#94a3b8" text-anchor="end">${level.toFixed(0)}%</text>
    `;
  }

  const y40 = getY(40);
  const alertBand = `
    <rect x="${padL}" y="${getY(70)}" width="${plotW}" height="${y40 - getY(70)}" fill="#fef2f2" opacity="0.5" />
    <line x1="${padL}" y1="${y40}" x2="${w - padR}" y2="${y40}" stroke="#f87171" stroke-width="1.5" stroke-dasharray="4,4" />
    <text x="${w - padR - 5}" y="${y40 - 6}" font-size="9" font-weight="bold" fill="#ef4444" text-anchor="end">40% 單一因子化警戒線</text>
  `;

  let pointsSvg = '';
  points.forEach((p, i) => {
    const x = getX(i);
    const yTai = getY(p.taiex);
    const y50 = getY(p.tw50);

    pointsSvg += `
      <text x="${x}" y="${h - padB + 20}" font-size="10" font-weight="600" fill="#64748b" text-anchor="middle">${p.year}</text>
      <circle cx="${x}" cy="${yTai}" r="5" fill="#2563eb" stroke="#ffffff" stroke-width="2" />
      <text x="${x}" y="${yTai + 16}" font-size="9.5" font-mono="true" font-weight="bold" fill="#1d4ed8" text-anchor="middle">${p.taiex}%</text>

      <circle cx="${x}" cy="${y50}" r="5" fill="#dc2626" stroke="#ffffff" stroke-width="2" />
      <text x="${x}" y="${y50 - 9}" font-size="9.5" font-mono="true" font-weight="bold" fill="#b91c1c" text-anchor="middle">${p.tw50}%</text>

      ${p.flag ? `
        <line x1="${x}" y1="${y50 - 18}" x2="${x}" y2="${padT + 8}" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="2,2" />
        <g transform="translate(${x}, ${padT + 5})">
          <rect x="-38" y="-12" width="76" height="16" rx="4" fill="#fef3c7" stroke="#f59e0b" />
          <text x="0" y="0" font-size="8.5" font-weight="bold" fill="#92400e" text-anchor="middle">${p.flag}</text>
        </g>
      ` : ''}
    `;
  });

  return `
    <svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" style="display:block; width:100%; min-height:300px;" class="w-full font-sans" xmlns="http://www.w3.org/2000/svg">
      ${alertBand}
      ${gridSvg}
      <polyline fill="none" stroke="#2563eb" stroke-width="3" points="${taiexCoords}" />
      <polyline fill="none" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="5,4" points="${tw50Coords}" />
      ${pointsSvg}
    </svg>
  `;
}

// 術語辭典視圖
function renderGlossaryView(container) {
  let html = `
    <div class="animate-fade-in max-w-4xl mx-auto pb-16">
      <div class="mb-8 pb-6 border-b border-slate-200">
        <span class="badge-tech bg-blue-50 text-blue-700">經濟金融術語全書</span>
        <h1 class="text-2xl md:text-3xl font-bold text-slate-900 mt-2 mb-3">核心經濟學理論與資本市場量化術語庫</h1>
        <p class="text-slate-600 text-sm md:text-base">
          收錄本專題涵蓋之重要理論模型、量化公式與監理條款，支援快速檢索與精闢學術解析。
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  `;

  COURSE_DATA.glossary.forEach(item => {
    html += `
      <div class="card-elevation p-5 bg-white rounded-xl">
        <div class="text-xs text-blue-600 font-mono font-semibold mb-1">${item.en}</div>
        <h3 class="text-base font-bold text-slate-900 mb-2">${item.term}</h3>
        <p class="text-xs md:text-sm text-slate-600 leading-relaxed">${item.desc}</p>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// 搜尋功能
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');
  if (!searchInput || !resultsContainer) return;

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim().toLowerCase();
    if (!val) {
      resultsContainer.classList.add('hidden');
      return;
    }

    const matches = [];

    // 搜尋章節與小節
    COURSE_DATA.chapters.forEach(ch => {
      ch.sections.forEach(sec => {
        if (sec.title.toLowerCase().includes(val) || sec.content.toLowerCase().includes(val)) {
          matches.push({
            type: 'chapter',
            title: sec.title,
            parent: ch.title,
            target: ch.id
          });
        }
      });
    });

    // 搜尋術語
    COURSE_DATA.glossary.forEach(g => {
      if (g.term.toLowerCase().includes(val) || g.desc.toLowerCase().includes(val)) {
        matches.push({
          type: 'glossary',
          title: g.term,
          parent: '術語辭典',
          target: 'glossary'
        });
      }
    });

    if (matches.length > 0) {
      resultsContainer.innerHTML = matches.slice(0, 8).map(m => `
        <div onclick="navigateTo('${m.target}'); document.getElementById('search-results').classList.add('hidden');" 
             class="p-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0">
          <div class="text-[10px] text-blue-600 font-semibold">${m.parent}</div>
          <div class="text-xs font-bold text-slate-800">${m.title}</div>
        </div>
      `).join('');
      resultsContainer.classList.remove('hidden');
    } else {
      resultsContainer.innerHTML = `<div class="p-3 text-xs text-slate-400 text-center">查無相符內容</div>`;
      resultsContainer.classList.remove('hidden');
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
      resultsContainer.classList.add('hidden');
    }
  });
}

function initGlossary() {}
function initSimulators() {}
