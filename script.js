const cards = ['','A','2','3','4','5','6','7','8','9','10','J','Q','K'];
let currentRound = 1;
let history = [];

window.onload = function () {
  fillDropdowns();
};

function fillDropdowns() {
  for (let i = 1; i <= 3; i++) {
    ['p'+i, 'b'+i].forEach(id => {
      const sel = document.getElementById(id);
      sel.innerHTML = '';
      cards.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.text = c;
        sel.appendChild(opt);
      });
    });
  }
}

function resetRound() {
  const start = parseInt(document.getElementById("startRound").value);
  currentRound = isNaN(start) ? 1 : start;
  document.getElementById("roundDisplay").innerText = "Ván #" + currentRound;
}

function cardToPoint(card) {
  if (!card) return 0;
  if (card === 'A') return 1;
  if (['10','J','Q','K'].includes(card)) return 0;
  return parseInt(card);
}

function calcPoint(cards) {
  return cards.reduce((sum, c) => sum + cardToPoint(c), 0) % 10;
}

function addRound() {
  let pCards = [p1.value, p2.value, p3.value].filter(c => c !== '');
  let bCards = [b1.value, b2.value, b3.value].filter(c => c !== '');

  if (pCards.length < 2 || bCards.length < 2) {
    alert("Nhập tối thiểu 2 lá cho mỗi bên!");
    return;
  }

  let pPoint = calcPoint(pCards);
  let bPoint = calcPoint(bCards);
  let result = 'Tie';
  if (pPoint > bPoint) result = 'Player';
  else if (bPoint > pPoint) result = 'Banker';

  history.push({ round: currentRound, pCards, bCards, pPoint, bPoint, result });

  let aiVote = getAIVote();

  document.getElementById("log").innerHTML += `
    <div style="margin-top:10px;">
      ✅ <b>Ván #${currentRound}</b> - Kết quả: <b>${result}</b><br>
      AI Voting (kết hợp C1–C10) dự đoán: <b>${aiVote}</b> ${aiVote === result ? '✔️ ĐÚNG' : '❌ SAI'}
    </div>
  `;

  currentRound++;
  document.getElementById("roundDisplay").innerText = "Ván #" + currentRound;
  fillDropdowns();
}

function getAIVote() {
  if (history.length < 5) return 'Banker'; // Ưu tiên Banker nếu chưa có đủ dữ liệu

  // Giả lập logic C1–C10 kết hợp theo trọng số
  let weights = { Player: 0, Banker: 0, Tie: 0 };

  // C1: giữ cầu
  let last = history.at(-1).result;
  weights[last] += 2;

  // C2: đảo cầu
  if (history.length >= 2 && history.at(-1).result !== history.at(-2).result) {
    let alt = history.at(-1).result === 'Player' ? 'Banker' : 'Player';
    weights[alt] += 1.5;
  }

  // C3: 2 ván trước giống nhau
  if (history.length >= 3) {
    let [a, b] = [history.at(-2).result, history.at(-3).result];
    if (a === b) weights[a] += 1.2;
  }

  // C4: 3 ván cùng kết quả
  if (history.length >= 4) {
    let res = [history.at(-1).result, history.at(-2).result, history.at(-3).result];
    if (res.every(r => r === res[0])) weights[res[0]] += 1;
  }

  // C5–C9 (giả lập đơn giản): cộng thêm theo xu hướng lịch sử
  let totalP = history.filter(v => v.result === 'Player').length;
  let totalB = history.filter(v => v.result === 'Banker').length;
  weights['Player'] += totalP / history.length;
  weights['Banker'] += totalB / history.length;

  // C10: Voting theo tổng trọng số
  let sorted = Object.entries(weights).sort((a, b) => b[1] - a[1]);
  return sorted[0][0];
}