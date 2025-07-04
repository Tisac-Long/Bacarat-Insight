
let round = 1;
let history = [];
let prediction = null;
const ranks = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function startSession() {
  round = parseInt(document.getElementById("startRound").value) || 1;
  document.getElementById("inputSection").style.display = "block";
  document.getElementById("currentRound").innerText = round;
  document.getElementById("nextRound").innerText = round;
  const ids = ["p1", "p2", "p3", "b1", "b2", "b3"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    el.innerHTML = ranks.map(r => `<option value='${r}'>${r}</option>`).join("");
  });
}

function cardValue(card) {
  if (["10", "J", "Q", "K"].includes(card)) return 0;
  if (card === "A") return 1;
  return parseInt(card || "0") || 0;
}

function calculatePoints(cards) {
  return cards.map(cardValue).reduce((a, b) => a + b, 0) % 10;
}

function submitRound() {
  const pc = [p1.value, p2.value, p3.value].filter(c => c);
  const bc = [b1.value, b2.value, b3.value].filter(c => c);
  const pp = calculatePoints(pc);
  const bp = calculatePoints(bc);
  let winner = "Hòa";
  if (pp > bp) winner = "Con thắng";
  else if (bp > pp) winner = "Cái thắng";

  const data = {
    round: round,
    playerCards: pc,
    bankerCards: bc,
    playerPoint: pp,
    bankerPoint: bp,
    winner: winner,
    playerPair: pc.length >= 2 && pc[0] === pc[1],
    bankerPair: bc.length >= 2 && bc[0] === bc[1],
    predicted: prediction ? prediction.guess : "",
    correct: prediction ? (prediction.guess === winner ? "✅" : "❌") : ""
  };

  history.push(data);
  round++;
  document.getElementById("currentRound").innerText = round;
  document.getElementById("nextRound").innerText = round;
  resetDropdowns();
  displayHistory();
  makePrediction();
}

function resetDropdowns() {
  ["p1", "p2", "p3", "b1", "b2", "b3"].forEach(id => {
    document.getElementById(id).selectedIndex = 0;
  });
}

function countCorrect(pattern) {
  let count = 0;
  for (let i = 1; i < history.length; i++) {
    if (pattern(history[i], history[i - 1])) count++;
  }
  return count;
}

function displayHistory() {
  let html = "<h3>🧾 Lịch sử ván đã nhập</h3><ul>";
  history.forEach(r => {
    html += `<li>V${r.round}: Con [${r.playerCards.join()}] (${r.playerPoint}) - Cái [${r.bankerCards.join()}] (${r.bankerPoint}) → <b>${r.winner}</b>`;
    if (r.playerPair) html += " 🔵 PP";
    if (r.bankerPair) html += " 🔴 BP";
    if (r.predicted) html += ` | 🧠 Dự đoán: ${r.predicted} ${r.correct}`;
    html += "</li>";
  });
  html += "</ul>";
  document.getElementById("results").innerHTML = html;
}

function makePrediction() {
  if (history.length < 4) {
    prediction = null;
    document.getElementById("predictionContent").innerText = "Nhập ít nhất 4 ván để phân tích...";
    return;
  }

  const last = history[history.length - 1];
  const prev = history[history.length - 2];
  const guess = last.winner === prev.winner ? last.winner : (last.winner === "Cái thắng" ? "Con thắng" : "Cái thắng");

  // Cầu thống kê
  const C1 = countCorrect((a, b) => a.winner === b.winner); // giữ cầu
  const C3 = countCorrect((a, b) => a.winner !== b.winner); // đảo cầu

  const ppRate = (history.filter(r => r.playerPair).length / history.length * 100).toFixed(1);
  const bpRate = (history.filter(r => r.bankerPair).length / history.length * 100).toFixed(1);
  const tieRate = (history.filter(r => r.winner === "Hòa").length / history.length * 100).toFixed(1);
  const mainRate = (C1 > C3 ? (C1 / (history.length - 1)) : (C3 / (history.length - 1))) * 100;

  prediction = { guess };

  document.getElementById("predictionContent").innerText = `🧠 DỰ ĐOÁN VÁN KẾ TIẾP – VÁN ${round}
───────────────────────────────
📌 Phân tích cầu:
- C1 (Giữ cầu): ${C1 >= 2 ? "✅" : "❌"} ĐÚNG ${C1} lần
- C2 (Cầu nhảy): ❌
- C3 (Lặp 2-1): ${C3 >= 2 ? "✅" : "❌"} ĐÚNG ${C3} lần
- C4 (Đảo cầu): ❌

🔮 Cầu mạnh nhất: C1 – Giữ cầu ${guess}

🎯 GỢI Ý CƯỢC:
- 👉 Cược chính: ${guess === "Con thắng" ? "🟦 Con" : "🟥 Cái"} (${mainRate.toFixed(1)}%)
- ⚖️ Kèo phụ:
  • 🎲 Hòa (Tie): ${tieRate}%
  • 🃏 Con đôi (PP): ${ppRate}%
  • 🃏 Cái đôi (BP): ${bpRate}%`;
}
