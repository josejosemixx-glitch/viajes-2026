/**
 * CEREBRO DIGITAL AUTÓNOMO (Google Apps Script)
 * Arquitectura CFO - Captura Total GTD
 * Despliegue: script.google.com
 */

const CONFIG = {
  GITHUB_USER: "josejosemixx-glitch", 
  GITHUB_REPO: "viajes-2026", 
  FILE_PATH: "data/ledger.json",
  WEEKLY_BUDGET_USD: 500.0,
  TARGET_EMAILS: "from:(bcp OR bogota OR nequi OR uber) -label:trash newer_than:2d",
  EMAIL_TARGET: Session.getActiveUser().getEmail()
};

function getProp(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

function runBrainCycle() {
  const githubToken = getProp("GITHUB_PAT");
  if (!githubToken) {
    console.error("Falta GITHUB_PAT en Script Properties");
    return;
  }
  
  // 1. Ingesta desde Gmail API
  const newTransactions = fetchEmails();
  if (newTransactions.length === 0) {
    return;
  }

  // 2. Extracción de Caja Negra (GitHub API)
  const ledgerData = fetchLedger(githubToken);
  let ledger = ledgerData.content ? JSON.parse(ledgerData.content) : { hashes: [], transactions: [] };
  
  // 3. Deduplicación criptográfica (SHA-256)
  let changes = 0;
  newTransactions.forEach(tx => {
    if (ledger.hashes.indexOf(tx.id) === -1) {
      ledger.transactions.push(tx);
      ledger.hashes.push(tx.id);
      changes++;
    }
  });

  if (changes > 0) {
    // 4. Correlación y Alertas de Caja Negra
    auditLiquidity(ledger.transactions);

    // 5. Persistencia Inmutable a GitHub (REST API)
    commitLedger(githubToken, ledgerData.sha, ledger);
  }
}

function fetchEmails() {
  const threads = GmailApp.search(CONFIG.TARGET_EMAILS);
  let results = [];
  
  threads.forEach(thread => {
    const messages = thread.getMessages();
    messages.forEach(msg => {
      const msgId = msg.getId(); // Workspace Message-ID
      const hash = computeSHA256(msgId);
      
      const body = msg.getPlainBody() || "";
      const { amount, currency } = extractMoney(body);
      
      if (amount > 0) {
        results.push({
          id: hash,
          date: msg.getDate().toISOString(),
          sender: msg.getFrom(),
          amount: amount,
          currency: currency
        });
      }
    });
  });
  return results;
}

function extractMoney(text) {
  const regex = /(?:USD|S\/|COP|EUR|\$)\s*([\d,\.]+)/i;
  const match = text.match(regex);
  if (match) {
    const val = parseFloat(match[1].replace(/,/g, ''));
    let curr = "USD";
    if (text.includes("S/")) curr = "PEN";
    if (text.includes("COP")) curr = "COP";
    if (text.includes("EUR")) curr = "EUR";
    return { amount: val, currency: curr };
  }
  return { amount: 0, currency: "UNKNOWN" };
}

function computeSHA256(input) {
  const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input);
  return rawHash.map(b => (b < 0 ? b + 256 : b).toString(16).padStart(2, '0')).join('');
}

function fetchLedger(token) {
  const url = `https://api.github.com/repos/${CONFIG.GITHUB_USER}/${CONFIG.GITHUB_REPO}/contents/${CONFIG.FILE_PATH}`;
  const options = {
    method: "get",
    headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github.v3+json" },
    muteHttpExceptions: true
  };
  
  const res = UrlFetchApp.fetch(url, options);
  if (res.getResponseCode() === 200) {
    const data = JSON.parse(res.getContentText());
    const decoded = Utilities.newBlob(Utilities.base64Decode(data.content)).getDataAsString();
    return { content: decoded, sha: data.sha };
  }
  return { content: null, sha: null };
}

function commitLedger(token, sha, ledgerObj) {
  const url = `https://api.github.com/repos/${CONFIG.GITHUB_USER}/${CONFIG.GITHUB_REPO}/contents/${CONFIG.FILE_PATH}`;
  const payload = {
    message: "Auto-audit: Actualización de Caja Negra y Ledger (GAS)",
    content: Utilities.base64Encode(JSON.stringify(ledgerObj, null, 2)),
    sha: sha
  };
  if (!sha) delete payload.sha;

  const options = {
    method: "put",
    headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github.v3+json" },
    payload: JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch(url, options);
}

function auditLiquidity(transactions) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  
  let totalUSD = 0;
  let alerts = [];
  
  transactions.forEach(tx => {
    const txDate = new Date(tx.date);
    if (txDate >= thirtyDaysAgo) {
      let rate = 1;
      if (tx.currency === "PEN") rate = 0.267;
      if (tx.currency === "COP") rate = 0.00025;
      if (tx.currency === "EUR") rate = 1.08;
      
      const usdVal = tx.amount * rate;
      totalUSD += usdVal;
      
      if (usdVal > 200) {
        alerts.push(`[PÉNDULO] Gasto atípico: ${tx.currency} ${tx.amount} (${tx.sender})`);
      }
    }
  });

  const TARGET_30D = CONFIG.WEEKLY_BUDGET_USD * 4.33;
  if (totalUSD > TARGET_30D) {
    alerts.push(`[RIESGO] Gasto 30D (USD ${totalUSD.toFixed(2)}) excede presupuesto (USD ${TARGET_30D.toFixed(2)}). Revisa fatiga biomecánica en Dashboard.`);
  }
  
  if (alerts.length > 0) {
    let body = `=== CEREBRO DIGITAL: AUDITORÍA DE LIQUIDEZ Y CAJA NEGRA ===\nGasto 30D: USD ${totalUSD.toFixed(2)}\n---\n`;
    alerts.forEach(a => body += a + "\n");
    MailApp.sendEmail(CONFIG.EMAIL_TARGET, "[CRÍTICO] CFO Action Required: Péndulo y Liquidez", body);
  }
}
