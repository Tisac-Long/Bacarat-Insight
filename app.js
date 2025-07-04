let round = 1;
let history = [];
let prediction = null;

const ranks = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function startSession() {
  round = parseInt(document.getElementById("startRound").value) || 1;
  document.getElementById("inputSection").style.display = "block";
  document.getElementById("currentRound").innerText = round;
  const selects = ["p1", "p2", "p3", "b1", "b2", "b3"];
  selects.forEach(id => {
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
  return cards.map(cardValue).reduce((a,b) => a + b, 0) % 10;
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
    playerPair: pc[0] === pc[1],
    bankerPair: bc[0] === bc[1],
    predicted: prediction ? prediction.guess : "",
    correct: prediction ? (prediction.guess === winner ? "✅" : "❌") : ""
  };
  history.push(data);
  round++;
  document.getElementById("currentRound").innerText = round;
  displayHistory();
  makePrediction();
}

function displayHistory() {
  let html = "<h3>🧾 Lịch sử ván đã nhập</h3><ul>";
  history.forEach(r => {
    html += `<li>V${r.round}: Con [${r.playerCards.join()}] (${r.playerPoint}) - Cái [${r.bankerCards.join()}] (${r.bankerPoint}) → <b>${r.winner}</b> ${r.playerPair ? "PP" : ""} ${r.bankerPair ? "BP" : ""}`;
    if (r.predicted) html += ` | 🧠 Dự đoán: ${r.predicted} ${r.correct}`;
    html += "</li>";
  });
  html += "</ul>";
  document.getElementById("results").innerHTML = html;
}

function makePrediction() {
  if (history.length < 4) {
    prediction = null;
    document.getElementById("predictionContent").innerHTML = "<i>Cần ít nhất 4 ván để bắt đầu dự đoán...</i>";
    return;
  }

  const last = history[history.length - 1];
  const prev = history[history.length - 2];
  let guess = "Khó đoán";
  if (last.winner === prev.winner) {
    guess = last.winner;
  } else {
    guess = last.winner === "Cái thắng" ? "Con thắng" : "Cái thắng";
  }

  const ppRate = (history.filter(r => r.playerPair).length / history.length * 100).toFixed(1);
  const bpRate = (history.filter(r => r.bankerPair).length / history.length * 100).toFixed(1);

  prediction = { guess };
  document.getElementById("predictionContent").innerHTML = `
    🔮 Cầu mạnh nhất: <b>${guess}</b><br>
    🎯 Gợi ý cược: <span class='highlight'>${guess}</span><br>
    🎲 Kèo phụ: PP ${ppRate}% | BP ${bpRate}%
  `;
}
  else if (bankerPoint > playerPoint) winner = "Cái thắng";

  const result = {
    playerCards, bankerCards,
    playerPoint, bankerPoint,
    winner
  };
  history.push(result);
  displayResults();
}

function displayResults() {
  let html = "<h2>Kết quả các ván đã nhập:</h2><ul>";
  history.forEach((round, index) => {
    html += `<li>Ván ${index + 1}: Con [${round.playerCards.join(", ")}] (${round.playerPoint}) - 
      Cái [${round.bankerCards.join(", ")}] (${round.bankerPoint}) => <b>${round.winner}</b></li>`;
  });
  html += "</ul>";
  document.getElementById("results").innerHTML = html;
}
