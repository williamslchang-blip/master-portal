/**
 * 互動量化模擬器與測驗題庫邏輯 (整合 Codex 專家量化模組)
 */

const SIMULATORS = {
  // 1. EVA 與 ROIC - WACC 資本價值創造計算機
  calcEVA: function(investedCapital, roic, wacc) {
    const spread = roic - wacc;
    const eva = (spread / 100) * investedCapital;
    let status = '';
    let statusClass = '';
    let analysis = '';

    if (spread > 15) {
      status = '卓越超額價值創造 (Value Multiplier)';
      statusClass = 'text-emerald-700 bg-emerald-50 border-emerald-300';
      analysis = '【先進半導體模式】：企業具備極寬廣的技術與先進製程壟斷護城河，資本回報 (ROIC) 達 25%~35%，遠大於 7%~9% 之 WACC。每年投入之 300~400 億美元 CapEx 透過定價權全數轉嫁並轉化為實質經濟利潤，形成估值與獲利的正向飛輪。';
    } else if (spread > 0) {
      status = '穩健經濟利潤創造 (Economic Profit)';
      statusClass = 'text-blue-700 bg-blue-50 border-blue-300';
      analysis = '企業報酬能覆蓋股權與債務成本，營運健全。但多數屬於內需服務或特定利基零組件，缺乏全球定價權，需持續防範競爭加劇與通膨墊高成本。';
    } else if (spread === 0) {
      status = '資本損益平衡點 (Zero Economic EVA)';
      statusClass = 'text-amber-700 bg-amber-50 border-amber-300';
      analysis = '企業產出剛好彌補所有機會成本與股東要求回報率，未創造真正的超額財富。';
    } else {
      status = '資本陷阱與價值減損 (Value Destruction)';
      statusClass = 'text-rose-700 bg-rose-50 border-rose-300';
      analysis = '【傳統重資產產業警戒】：ROIC (2%~4%) 低於 WACC (6%~8%)。在此 EVA 為負的狀態下，企業為符合減碳法規、支付碳費與老舊維護所被迫進行的任何非生產性 CapEx，實質上都在銷毀股東權益，陷入越投資越貧困的資本陷阱。';
    }

    return {
      investedCapital,
      roic,
      wacc,
      spread: spread.toFixed(2),
      eva: Math.round(eva),
      status,
      statusClass,
      analysis
    };
  },

  // 2. 指數集中度 HHI 與有效成分股數 Neff 計算機 (採用標準 0~10,000 點規模與 0~1 比例)
  calcHHI: function(weights) {
    let sumSq = 0;
    weights.forEach(w => {
      const frac = w / 100;
      sumSq += (frac * frac);
    });

    const hhiFrac = sumSq;
    const hhiPoints = Math.round(sumSq * 10000);
    const nEff = 1 / hhiFrac;

    let evalRisk = '';
    let evalColor = '';
    if (hhiPoints >= 2500) {
      evalRisk = '極度高度集中 (Extreme Concentration / 單一因子化)';
      evalColor = 'text-rose-700 bg-rose-50 border-rose-300';
    } else if (hhiPoints >= 1500) {
      evalRisk = '中度集中市場 (Moderate Concentration)';
      evalColor = 'text-amber-700 bg-amber-50 border-amber-300';
    } else {
      evalRisk = '充分分散多元市場 (Well-Diversified)';
      evalColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
    }

    return {
      hhiFrac: hhiFrac.toFixed(4),
      hhiPoints,
      nEff: nEff.toFixed(2),
      evalRisk,
      evalColor
    };
  },

  // 3. 投資組合穿透式「含積量」、風險貢獻度 (PCR) 與壓力情境回測
  calcPortfolioLookThrough: function(allocations, stressScenario = 'none') {
    // 預設各標的含積量係數
    const tsmcWeights = {
      etf0050: 0.60,
      etf006208: 0.60,
      etf0052: 0.66,
      etf00922: 0.39,
      etf0056: 0.00,
      etf00878: 0.00,
      activeEtf: 0.22,
      tsmcStock: 1.00,
      usSp500: 0.00
    };

    let totalWeight = 0;
    let tsmcSum = 0;

    for (let key in allocations) {
      const w = parseFloat(allocations[key]) || 0;
      totalWeight += w;
      tsmcSum += w * (tsmcWeights[key] || 0);
    }

    const tsmcFrac = totalWeight > 0 ? (tsmcSum / totalWeight) : 0;
    const tsmcPct = tsmcFrac * 100;
    const nonTsmcPct = 100 - tsmcPct;

    // 邊際風險貢獻度 (Percentage Contribution to Risk, PCR_TSMC)
    // 假設台積電年化波動度 32%，非積組合波動度 16%，相關係數 0.55
    const sigT = 0.32;
    const sigO = 0.16;
    const rho = 0.55;
    const cov = sigT * sigO * rho;
    const wT = tsmcFrac;
    const wO = 1 - tsmcFrac;
    const varP = (wT * wT * sigT * sigT) + (wO * wO * sigO * sigO) + (2 * wT * wO * cov);
    const sigP = Math.sqrt(varP);

    // PCR_TSMC = [ wT * (wT*sigT^2 + wO*cov) ] / varP
    const pcrTSMC = varP > 0 ? ((wT * (wT * sigT * sigT + wO * cov)) / varP) * 100 : 0;

    // 壓力情境衝擊試算
    let tsmcShock = 0;
    let nonTsmcShock = 0;
    let scenarioDesc = '';

    switch(stressScenario) {
      case 'ai_boom':
        tsmcShock = 30;
        nonTsmcShock = 6;
        scenarioDesc = '【AI 超級週期擴產】：先進晶圓產能供不應求，台積電大漲 30%，非積板塊溫和上漲 6%';
        break;
      case 'downturn':
        tsmcShock = -25;
        nonTsmcShock = -8;
        scenarioDesc = '【半導體庫存調整與景氣寒冬】：科技硬體 CapEx 縮手，台積電回檔 25%，其餘股票下跌 8%';
        break;
      case 'geopolitics':
        tsmcShock = -35;
        nonTsmcShock = -12;
        scenarioDesc = '【地緣政治與貿易制裁衝擊】：先進製程出口管制升級，台積電重挫 35%，非積權值下跌 12%';
        break;
      case 'cftc':
        tsmcShock = -15;
        nonTsmcShock = -2;
        scenarioDesc = '【CFTC 39-20 窄基外資賣壓】：因單一權重大於 30% 觸發窄基指數，美系被動部位調整引發台積電下修 15%';
        break;
      default:
        scenarioDesc = '【常規市場狀態】：無極端外生衝擊';
    }

    const estimatedPortfolioShock = (tsmcFrac * tsmcShock) + (wO * nonTsmcShock);

    let diagnosis = '';
    let badgeClass = '';
    if (tsmcPct >= 50) {
      diagnosis = '【極高特質風險・偽分散型組合】：您的組合穿透含積量超過 50%，台積電單一公司貢獻了超過 70% 的整體投資組合風險！這實質上已退化為「台積電個股＋衛星點綴」，無法抵禦半導體行業的下行風險。';
      badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
    } else if (tsmcPct >= 30) {
      diagnosis = '【大盤加權型配置】：含積量約 30%–45%，貼近加權指數真實權重。兼顧了 AI 算力高成長紅利，並透過非積資產（金融/傳產/中小型電子）提供了基底防護。';
      badgeClass = 'bg-blue-100 text-blue-800 border-blue-300';
    } else if (tsmcPct >= 10) {
      diagnosis = '【結構性槓鈴平衡型配置】：含積量約 10%–25%，透過高股息 ETF 或海外 S&P 500 資產進行對沖。既享有算力成長動能，又大幅降低了單一股票特質黑天鵝之衝擊。';
      badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
    } else {
      diagnosis = '【純防禦／低科技曝險組合】：含積量低於 10%，實質偏向金融、傳產與海外資產。在第四次工業革命以算力為主的牛市中會承受極大負追蹤誤差，但具備極高現金流抗震性。';
      badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }

    return {
      totalWeight,
      tsmcPct: tsmcPct.toFixed(1),
      nonTsmcPct: nonTsmcPct.toFixed(1),
      portVol: (sigP * 100).toFixed(1),
      pcrTSMC: pcrTSMC.toFixed(1),
      scenarioDesc,
      estimatedPortfolioShock: (estimatedPortfolioShock > 0 ? '+' : '') + estimatedPortfolioShock.toFixed(2) + '%',
      diagnosis,
      badgeClass
    };
  }
};

// 專業測驗題庫 (10 題完整解析)
const QUIZ_QUESTIONS = [
  {
    id: 1,
    topic: "歷次工業革命",
    question: "諾貝爾經濟學獎得主羅伯特·索洛（Robert Solow）提出的「索洛悖論」（Solow Paradox），主要在描述什麼經濟現象？",
    options: [
      "科技進步必然導致工人全面永久失業的盧德主義現象",
      "通用目的技術（GPT）初期因流程重組與無形資產投資，生產力統計未立刻反映的 J 曲線延遲",
      "農業社會因為人口增長而陷入長期生存線掙扎的馬爾薩斯陷阱",
      "政府過度補貼新興科技導致資源錯置與金融泡沫"
    ],
    answer: 1,
    explanation: "索洛於 1987 年提出「你在哪裡都能看到電腦時代的痕跡，唯獨在生產力統計中看不到」。通用目的技術問世初期，企業必須耗費龐大資源重構組織與培訓人才，因此生產力往往經歷平緩期，待基礎設施普及後才呈現陡峭 J 曲線爆發。"
  },
  {
    id: 2,
    topic: "美台經濟追趕",
    question: "根據國際貨幣基金組織（IMF）2026年最新預測與歷史數據，台灣人均 GDP 出現「PPP 超越美國，但名目美元仍僅約美國一半」的現象，其核心經濟學解釋為：",
    options: [
      "台灣的通膨率遠高於美國，導致購買力數據被嚴重高估",
      "可貿易科技部門的高生產力未能充分透過非貿易財物價與薪資調升（巴拉薩－薩繆爾森效應）轉化，外匯順差部分外溢為海外設備進口與外幣資產",
      "美國的實質 GDP 成長率在第四次工業革命期間已全面停滯",
      "購買力平價統計完全忽略了匯率波動，不具備學術參考價值"
    ],
    answer: 1,
    explanation: "台灣科技業享有全球定價權，但巨額順差高比例用於海外進口先進設備（如 EUV）、外資分紅匯出與海外投資，加上央行穩定匯率防禦策略，使國內非貿易財（餐飲、交通、房租）物價維持相對低廉，導致 PPP 購買力人均產值突破 10 萬美元，但名目匯率換算值約 4.4 萬美元。"
  },
  {
    id: 3,
    topic: "產業結構轉型",
    question: "在第四次工業革命期間，台灣與美國在產業產值結構上走出截然不同的路徑，下列敘述何者正確？",
    options: [
      "美台兩國均遵循傳統發展模式，製造業佔 GDP 比重均已降至 10% 以下",
      "美國轉向無形資產、軟體平台與演算法；台灣則逆勢出現「製造業高值化回升」，製造業佔 GDP 接近四成，半導體成為實體算力自然壟斷者",
      "台灣已經成功轉型為以金融業與文創服務業為最大產值核心的經濟體",
      "美國因製造業回流政策，其製造業佔比已反超服務業達到 60% 以上"
    ],
    answer: 1,
    explanation: "受惠於全球對 AI 晶片與伺服器的剛性狂熱需求，2025年台灣製造業佔 GDP 逆勢升至 38.54%（整體工業達 43.45%），服務業降至 55.11%；而美國製造業僅佔約 10%–11%，產值由軟體、生技、品牌等無形資產平台支配。"
  },
  {
    id: 4,
    topic: "K型結構與ROIC",
    question: "在公司財務理論中，判斷一間企業的資本支出（CapEx）究竟是在「創造價值」還是「破壞價值」，最關鍵的指標利差為：",
    options: [
      "營收年增率 (YoY) − 營業利益率",
      "ROIC（投資資本報酬率） − WACC（加權平均資本成本）",
      "本益比 (PE) − 股價淨值比 (PB)",
      "毛利率 − 營業費用率"
    ],
    answer: 1,
    explanation: "經濟附加價值 EVA = (ROIC − WACC) × 投資資本。只有當 ROIC 高於 WACC 時，每新增一塊錢 CapEx 才能為股東創造真實的超額回報；若 ROIC 低於 WACC，即使營收成長，實質上都在侵蝕股東權益（如傳產面臨強制減碳支出卻無轉嫁能力）。"
  },
  {
    id: 5,
    topic: "科技型荷蘭病",
    question: "台灣目前出現的「科技型荷蘭病（Tech Dutch Disease）」要素虹吸效應，主要表現在哪一方面？",
    options: [
      "全台頂尖理工人才、水電資源與資本市場資金高度單向集中於先進半導體聚落，使傳統製造業與中小企業面臨要素排擠與估值折價",
      "科技業過度依賴政府財政救濟，消耗國家稅收",
      "台灣本幣過度貶值導致完全無法從國外進口原物料",
      "農業產能過剩引發嚴重物價緊縮"
    ],
    answer: 0,
    explanation: "科技型荷蘭病並非傳統天然資源枯竭，而是優勢半導體部門吸納了前 10% 頂尖人才、優先水電配置與絕大多數機構法人與 ETF 資金，導致傳統傳產與非科技服務業面臨人才荒與資本流動性折價。"
  },
  {
    id: 6,
    topic: "指數集中度與CAPM",
    question: "若台股臺灣 50 指數中台積電單一檔權重達 60%，其赫芬達爾指數（HHI = Σ w_i^2）約為 0.38，換算出的「有效成分股數（N_eff = 1/HHI）」約為：",
    options: [
      "50 檔（完全無影響）",
      "25 檔",
      "不到 3 檔（約 2.6 檔）",
      "12 檔"
    ],
    answer: 2,
    explanation: "N_eff = 1 / HHI ≈ 1 / 0.38 ≈ 2.63 檔。這表示雖然成分股名義上有 50 檔，但統計上的實質分散度相當於只買了不到 3 檔股票，單一權值股的特質波動直接演變成全市場 Beta 波動。"
  },
  {
    id: 7,
    topic: "因子投資異象",
    question: "在台灣資本市場的 K 型結構下，傳統 Fama-French 因子中的「規模因子（SMB）」與「價值因子（HML）」出現何種異象反轉？",
    options: [
      "中小型股獲得歷史最高超額報酬，價值股大幅跑贏成長股",
      "SMB 轉為強烈負值（超大市值龍頭憑藉巨額 CapEx 護城河獨享高 ROIC），且傳統低估值價值股因 ROIC < WACC 陷入價值陷阱",
      "因子模型完全精準預測，台股所有股票報酬均勻回歸平均值",
      "現金殖利率越高的股票，資本利得漲幅越大"
    ],
    answer: 1,
    explanation: "先進半導體建立在每年數百億美元 CapEx 護城河之上，唯有超大龍頭享有高利潤與高 ROIC，使 SMB 長期為負；同時石化、鋼鐵等傳統價值股盈利停滯，低估值並未迎來修復，形成價值陷阱。"
  },
  {
    id: 8,
    topic: "ETF法規演進",
    question: "金管會於 2026 年 4 月發布的第二波「台積電條款」，針對「主動型共同基金與主動式 ETF」做出了何種關鍵放寬？",
    options: [
      "全面取消所有持股上限，經理人可 100% 買進單一股票",
      "若個股佔大盤加權指數超過 10%，投資該檔個股比重上限由原先的 10% 調升至最高 25%",
      "強制所有基金必須排除權值超過 20% 的個股",
      "禁止主動型 ETF 追蹤任何包含科技股的指數"
    ],
    answer: 1,
    explanation: "2026年4月24日生效的新規，讓主動型經理人與主動式 ETF 對單一檔佔大盤逾 10% 的股票（目前僅台積電符合），持股上限從原本僵化的 10% 放寬至最高 25%，緩解主動操盤手結構性低配龍頭的績效劣勢。"
  },
  {
    id: 9,
    topic: "資產配置實務",
    question: "投資人若同時持有「0050（純市值型）」、「006208」與「0052（科技主題 ETF）」，在資產配置上最容易犯下什麼錯誤？",
    options: [
      "信用違約風險過高",
      "「偽分散（Pseudo-Diversification）」陷阱，穿透到底層台積電總曝險比例可能飆破 60%–65%，本質上仍是重押單一標的並被重複收取管理費",
      "現金流過度膨脹導致無法再投資",
      "流動性不足無法賣出"
    ],
    answer: 1,
    explanation: "穿透式檢視（Look-Through Analysis）顯示，三者底層重疊度極高，均重度持有台積電，並未產生分散不同產業特質風險的效果，反而支付了多次管理費。"
  },
  {
    id: 10,
    topic: "投資策略本質",
    question: "在台灣 K 型產業結構下，「純市值型 ETF（如 0050）」與「高股息 ETF（如 0056、00878）」的搭配，在經濟實質上本質屬於：",
    options: [
      "股債平衡配置",
      "貨幣避險策略",
      "「先進半導體算力壟斷」與「成熟製造／金融內需」的產業槓鈴配置（Barbell Strategy）",
      "跨國套利交易"
    ],
    answer: 2,
    explanation: "高股息 ETF 因篩選殖利率門檻系統性低配或未持有台積電，實質轉向金融、傳產與成熟代工；市值型 ETF 則緊密貼合高 CapEx、高 ROIC 的先進半導體。兩者的組合本質上就是押注 K 型結構兩端的產業槓鈴配置。"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SIMULATORS, QUIZ_QUESTIONS };
}
