const cards = ['','A','2','3','4','5','6','7','8','9','10','J','Q','K'];
let van = 1;
let history = [];
let allCards = [];

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

function countPattern(patternFn) {
  return history.reduce((acc, g, i, arr) => {
    if (patternFn(i, arr)) acc++;
    return acc;
  }, 0);
}

function submitGame() {
  const pCards = [p1.value, p2.value].filter(c => c);
  if (p3.value) pCards.push(p3.value);
  const bCards = [b1.value, b2.value].filter(c => c);
  if (b3.value) bCards.push(b3.value);

  // Dự đoán dựa vào các ván trước
  showPrediction();

  const pPoint = calcPoints(pCards);
  const bPoint = calcPoints(bCards);
  const result = bPoint > pPoint ? 'B' : pPoint > bPoint ? 'P' : 'T';
  const pp = isPair(p1.value, p2.value);
  const bp = isPair(b1.value, b2.value);
  const game = {van, pCards, bCards, pPoint, bPoint, result, pp, bp};
  history.push(game);

  allCards.push(...pCards, ...bCards);

  van++;
  clearSelects();
  updateVanDisplay();
}

function showPrediction() {
  const n = history.length;
  if (n < 1) return;

  // Sử dụng công thức mới:
  const last = history[n - 1];
  const cardsUsed = last.pCards.length + last.bCards.length;

  const GC = countPattern((i, arr) => i >= 1 && arr[i].result === arr[i-1].result);
  const LC = countPattern((i, arr) => i >= 2 && arr[i-2].result === arr[i-1].result && arr[i].result !== arr[i-1].result);
  const DC = countPattern((i, arr) => i >= 2 && arr[i-2].result !== arr[i-1].result && arr[i-1].result === arr[i].result);

  let score = (GC * 2) + (LC * 1.5) - (DC * 1.2) + (cardsUsed / 3);
  let guess = Math.round(score) % 2 === 0 ? 'B' : 'P';

  const ppRate = (history.filter(g=>g.pp).length / history.length * 100).toFixed(1);
  const bpRate = (history.filter(g=>g.bp).length / history.length * 100).toFixed(1);
  const tieRate = (history.filter(g=>g.result==='T').length / history.length * 100).toFixed(1);

  const predictionBox = document.getElementById('predictionBox');
  predictionBox.innerHTML = `
<pre>
🧠 DỰ ĐOÁN VÁN KẾ TIẾP – VÁN ${van}
───────────────────────────────
📌 Phân tích logic:
- Giữ cầu (C1): ${GC}
- Lặp 2-1 (C3): ${LC}
- Đảo cầu (C4): ${DC}
- Lá bài ván trước: ${cardsUsed}
- Điểm tổng: ${score.toFixed(1)}

🔮 Gợi ý cược chính: ${guess === 'B' ? '🟥 Cái' : '🟦 Con'}

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