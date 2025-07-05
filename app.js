const cards = ['','A','2','3','4','5','6','7','8','9','10','J','Q','K'];
let van = 1;
let history = [];

window.onload = () => {
  document.querySelectorAll('.card-input').forEach(sel => {
    cards.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.text = c;
      sel.appendChild(opt);
    });
  });
  updateVanDisplay();
}

function setStartingVan() {
  const startVal = parseInt(document.getElementById('startVan').value);
  van = isNaN(startVal) ? 1 : startVal;
  updateVanDisplay();
}

function cardValue(card) {
  if (!card) return 0;
  if (card === 'A') return 1;
  if (['10','J','Q','K'].includes(card)) return 0;
  return parseInt(card);
}

function calcPoints(cards) {
  return cards.reduce((a,b)=>a+cardValue(b),0)%10;
}

function isPair(c1, c2) {
  return c1 && c2 && c1 === c2;
}

function submitGame() {
  const pCards = [p1.value, p2.value].filter(c => c);
  if (p3.value) pCards.push(p3.value);
  const bCards = [b1.value, b2.value].filter(c => c);
  if (b3.value) bCards.push(b3.value);

  const pPoint = calcPoints(pCards);
  const bPoint = calcPoints(bCards);
  let result = bPoint > pPoint ? 'B' : pPoint > bPoint ? 'P' : 'T';
  const pp = isPair(p1.value, p2.value);
  const bp = isPair(b1.value, b2.value);
  const game = {van, pCards, bCards, pPoint, bPoint, result, pp, bp};
  history.push(game);
  showPrediction();
  van++;
  clearSelects();
  updateVanDisplay();
}

function showPrediction() {
  const prev = history.at(-1);
  if (!prev) return;

  const len = prev.pCards.length + prev.bCards.length;
  const keep = history.length >= 2 && history.at(-1).result === history.at(-2).result ? 1 : 0;
  const logic = van - len + keep;
  const guess = logic % 2 === 0 ? 'B' : 'P';

  const C1 = history.length >= 2 && history.at(-1).result === history.at(-2).result;
  const C2 = history.length >= 3 &&
             history.at(-3).result !== history.at(-2).result &&
             history.at(-2).result !== history.at(-1).result;
  const C3 = history.length >= 3 &&
             history.at(-3).result === history.at(-2).result &&
             history.at(-1).result !== history.at(-2).result;
  const C4 = history.length >= 4 &&
             history.at(-4).result === history.at(-3).result &&
             history.at(-2).result !== history.at(-3).result;

  const ppRate = (history.filter(g=>g.pp).length / history.length * 100).toFixed(1);
  const bpRate = (history.filter(g=>g.bp).length / history.length * 100).toFixed(1);
  const tieRate = (history.filter(g=>g.result==='T').length / history.length * 100).toFixed(1);

  const predictionBox = document.getElementById('predictionBox');
  predictionBox.innerHTML = `
<pre>
🧠 DỰ ĐOÁN VÁN KẾ TIẾP – VÁN ${van}
───────────────────────────────
📌 Phân tích cầu:
- C1 (Giữ cầu): ${C1 ? '✅' : '❌'}
- C2 (Cầu nhảy): ${C2 ? '✅' : '❌'}
- C3 (Lặp 2-1): ${C3 ? '✅' : '❌'}
- C4 (Đảo cầu): ${C4 ? '✅' : '❌'}

🔮 Gợi ý cầu chính: ${guess === 'B' ? '🟥 Cái' : '🟦 Con'}

🎯 KÈO PHỤ:
• 🃏 Con đôi (PP): ${ppRate}%
• 🃏 Cái đôi (BP): ${bpRate}%
• 🎲 Hòa (Tie): ${tieRate}%
</pre>
  `;
}

function clearSelects() {
  document.querySelectorAll('.card-input').forEach(sel => sel.value = '');
}

function updateVanDisplay() {
  document.getElementById('vanSo').textContent = van;
}