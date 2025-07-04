
let currentRound = 1;
let history = [];

function startGame() {
  const startInput = document.getElementById("startRound");
  currentRound = parseInt(startInput.value);
  document.getElementById("analysis").innerHTML = "<p>📌 Hãy chọn lá bài để phân tích ván tiếp theo...</p>";
}

function getCardPoint(card) {
  if (!card) return 0;
  if (["J", "Q", "K", "10"].includes(card)) return 0;
  if (card === "A") return 1;
  return parseInt(card);
}

function submitRound() {
  const selects = document.querySelectorAll(".card-select");
  const conCards = Array.from(selects).slice(0, 3).map(s => s.value).filter(v => v);
  const caiCards = Array.from(selects).slice(3, 6).map(s => s.value).filter(v => v);

  const conPoints = conCards.map(getCardPoint).reduce((a, b) => a + b, 0) % 10;
  const caiPoints = caiCards.map(getCardPoint).reduce((a, b) => a + b, 0) % 10;

  const result = conPoints > caiPoints ? "🟦 Con" : conPoints < caiPoints ? "🟥 Cái" : "🎲 Hòa";

  const PP = conCards.length >= 2 && conCards[0] === conCards[1];
  const BP = caiCards.length >= 2 && caiCards[0] === caiCards[1];

  const lastS = conCards.length + caiCards.length;
  const T = history.filter(h => h.result === "🟥 Cái").length % 5;
  const X = currentRound - lastS + T;
  const even = X % 2 === 0;

  const giaiThich = even ? "Chẵn → 🟥 Cái" : "Lẻ → 🟦 Con";
  const ppRate = PP ? "Xảy ra" : (Math.random() * 40 + 10).toFixed(1) + "%";
  const bpRate = BP ? "Xảy ra" : (Math.random() * 40 + 10).toFixed(1) + "%";
  const tieRate = (Math.random() * 10 + 5).toFixed(1) + "%";

  const resultHTML = `
    <h2>🧠 DỰ ĐOÁN VÁN KẾ TIẾP – VÁN ${currentRound}</h2>
    <p>📐 V - S + T = ${currentRound} - ${lastS} + ${T} = ${X} → ${giaiThich}</p>
    <p>🎯 GỢI Ý CƯỢC CHÍNH: ${even ? "🟥 Cái" : "🟦 Con"}</p>
    <p>⚖️ Kèo phụ:
      <br/>🃏 Con đôi (PP): ${ppRate}
      <br/>🃏 Cái đôi (BP): ${bpRate}
      <br/>🎲 Hòa (Tie): ${tieRate}
    </p>
    <p>✅ Kết quả ván ${currentRound}: ${result}</p>
  `;

  document.getElementById("analysis").innerHTML = resultHTML;
  history.push({ round: currentRound, con: conCards, cai: caiCards, result });
  currentRound++;

  // reset dropdown
  document.querySelectorAll(".card-select").forEach(select => select.selectedIndex = 0);
}
