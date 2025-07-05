const cards = ['','A','2','3','4','5','6','7','8','9','10','J','Q','K'];
let van = 1;
let history = [];
let allCards = [];
let cardCount = {};

const initDeck = () => {
  cardCount = {};
  cards.slice(1).forEach(c => cardCount[c] = 8 * 4); // 8 bộ bài
};

window.onload = () => {
  initDeck();
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
  const val = parseInt(document.getElementById('startVan').value);
  if (!isNaN(val)) {
    van = val;
    updateVanDisplay();
  }
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
  const pCards = [p1.value, p2.value];
  if (p3.value) pCards.push(p3.value);
  const bCards = [b1.value, b2.value];
  if (b3.value) bCards.push(b3.value);

  const pPoint = calcPoints(pCards);
  const bPoint = calcPoints(bCards);
  const result = bPoint > pPoint ? 'B' : pPoint > bPoint ? 'P' : 'T';
  const pp = isPair(p1.value, p2.value);
  const bp = isPair(b1.value, b2.value);

  let check = '';
  if (lastPrediction) {
    check = (lastPrediction === result) ? '✅' : '❌';
  }

  // Trừ số lượng lá đã lật
  [...pCards, ...bCards].forEach(c => {
    if (c && cardCount[c] > 0) cardCount[c]--;
  });

  const game = {van, result, pp, bp, tie: result === 'T'};
  history.push(game);
  allCards.push(...pCards, ...bCards);

  const row = document.createElement('tr');
  row.innerHTML = `<td>${van}</td><td>${result}</td><td>${lastPrediction || '-'}</td><td>${check}</td><td>${pp ? '✅' : ''}</td><td>${bp ? '✅' : ''}</td><td>${result==='T'?'✅':''}</td>`;
  document.querySelector('#historyTable tbody').appendChild(row);

  van++;
  updateVanDisplay();
  document.querySelectorAll('.card-input').forEach(sel => sel.value = '');

  showPrediction();
}

function estimatePairProb() {
  const totalLeft = Object.values(cardCount).reduce((a,b)=>a+b, 0);
  let pp = 0, bp = 0;
  cards.slice(1).forEach(c => {
    const n = cardCount[c];
    if (n >= 2) {
      const prob = (n / totalLeft) * ((n - 1) / (totalLeft - 1));
      pp += prob;
      bp += prob;
    }
  });
  return {pp: (pp * 100).toFixed(1), bp: (bp * 100).toFixed(1)};
}

function estimateTieProb() {
  let tie = 9.0; // Ước lượng gần đúng
  return tie.toFixed(1);
}

function countPattern(patternFn) {
  return history.reduce((acc, g, i, arr) => {
    if (patternFn(i, arr)) acc++;
    return acc;
  }, 0);
}

function showPrediction() {
  const n = history.length;
  if (n < 1) return;

  const last = history[n - 1];
  const cardsUsed = 6;

  const GC = countPattern((i, arr) => i >= 1 && arr[i].result === arr[i-1].result);
  const LC = countPattern((i, arr) => i >= 2 && arr[i-2].result === arr[i-1].result && arr[i].result !== arr[i-1].result);
  const DC = countPattern((i, arr) => i >= 2 && arr[i-2].result !== arr[i-1].result && arr[i-1].result === arr[i].result);

  let score = (GC * 2) + (LC * 1.5) - (DC * 1.2) + (cardsUsed / 3);
  let guess = Math.round(score) % 2 === 0 ? 'B' : 'P';
  lastPrediction = guess;

  const pairProbs = estimatePairProb();
  const tieProb = estimateTieProb();

  const predictionBox = document.getElementById('predictionBox');
  predictionBox.innerHTML = `
<pre>
🧠 DỰ ĐOÁN VÁN KẾ TIẾP – VÁN ${van}
───────────────────────────────
📌 Cầu:
- C1 (Giữ cầu): ${GC}
- C3 (Lặp 2-1): ${LC}
- C4 (Đảo cầu): ${DC}

🔮 Gợi ý cược chính: ${guess === 'B' ? '🟥 Cái' : '🟦 Con'}

🎯 KÈO PHỤ – DỰ ĐOÁN:
• 🃏 Con đôi (PP): ${pairProbs.pp}%
• 🃏 Cái đôi (BP): ${pairProbs.bp}%
• 🎲 Hòa (Tie): ${tieProb}%
</pre>
  `;
}

function updateVanDisplay() {
  document.getElementById('vanSo').textContent = van;
}