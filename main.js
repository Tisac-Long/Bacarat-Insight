const history = [];
const cardOptions = ['','A','2','3','4','5','6','7','8','9','10','J','Q','K'];

function populateDropdowns() {
  document.querySelectorAll('select.card').forEach(select => {
    select.innerHTML = cardOptions.map(c => `<option value="${c}">${c}</option>`).join('');
  });
}

function addRound() {
  const round = parseInt(document.getElementById("startRound").value) + history.length;

  const pCards = Array.from(document.querySelectorAll(".player")).map(s => s.value).filter(v => v);
  const bCards = Array.from(document.querySelectorAll(".banker")).map(s => s.value).filter(v => v);

  if (pCards.length < 2 || bCards.length < 2) {
    alert("Nhập ít nhất 2 lá mỗi bên.");
    return;
  }

  const pPoint = calculateBaccaratPoint(pCards);
  const bPoint = calculateBaccaratPoint(bCards);
  const result = getResult(pCards, bCards);
  const prediction = predictNextGame(history);

  const correct = prediction.main === result ? '✅' : '❌';

  history.push({ round, playerCards: pCards, bankerCards: bCards, result });

  document.getElementById("historyTable").innerHTML += `
    <tr>
      <td>${round}</td>
      <td>${pCards.join(',')}</td>
      <td>${bCards.join(',')}</td>
      <td>${pPoint} - ${bPoint}</td>
      <td>${result}</td>
      <td>${prediction.main}</td>
      <td>${correct}</td>
    </tr>
  `;

  document.getElementById("nextRound").innerText = round + 1;

  document.getElementById("predictionBox").innerHTML = `
    <b>🔮 DỰ ĐOÁN:</b><br/>
    👉 Cược chính: <b>${prediction.main}</b><br/>
    ⚖️ Kèo phụ:<br/>
    • 🎲 Hòa (Tie): ${prediction.tie}%<br/>
    • 🃏 Con đôi (PP): ${prediction.pp}%<br/>
    • 🃏 Cái đôi (BP): ${prediction.bp}%
  `;

  // Reset dropdown
  populateDropdowns();
}

populateDropdowns();
