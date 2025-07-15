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
  document.getElementById("suggestionNext").innerHTML = '🔮 Gợi ý cược cho ván tiếp theo: <span style="color:gray">Đang chờ...</span>';
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

  let pp = (pCards.length >= 2 && pCards[0] === pCards[1]);
  let bp = (bCards.length >= 2 && bCards[0] === bCards[1]);

  history.push({ round: currentRound, result, pp, bp });

  let prediction = getAIVoteWithStats();
  let { vote, stats } = prediction;

  document.getElementById("suggestionNext").innerHTML = `
    🔮 Gợi ý cược cho ván tiếp theo:
    <ul>
      <li><b>Chính:</b> <span style="color:green">${vote}</span></li>
      <li><b>Phụ:</b> Player Pair: ${stats.PP}% – Banker Pair: ${stats.BP}%</li>
      <li><b>Xác suất:</b> Player: ${stats.Player}%, Banker: ${stats.Banker}%, Tie: ${stats.Tie}%</li>
    </ul>`;

  document.getElementById("log").innerHTML += `
    <div style="margin-top:10px;">
      ✅ <b>Ván #${currentRound}</b> - Kết quả: <b>${result}</b><br>
      AI Voting (C1–C10): <b>${vote}</b> ${vote === result ? '✔️ ĐÚNG' : '❌ SAI'}
      ${pp ? '<br>🎯 Có Player Pair (PP)' : ''}
      ${bp ? '<br>🎯 Có Banker Pair (BP)' : ''}
    </div>
  `;

  currentRound++;
  document.getElementById("roundDisplay").innerText = "Ván #" + currentRound;
  fillDropdowns();
}

function getAIVoteWithStats() {
  if (history.length < 5) {
    return {
      vote: 'Banker',
      stats: {
        Player: 33, Banker: 40, Tie: 27, PP: 10, BP: 10
      }
    };
  }

  let weights = { Player: 0, Banker: 0, Tie: 0 };

  let last = history.at(-1).result;
  weights[last] += 2;

  if (history.length >= 2 && history.at(-1).result !== history.at(-2).result) {
    let alt = history.at(-1).result === 'Player' ? 'Banker' : 'Player';
    weights[alt] += 1.5;
  }

  if (history.length >= 3) {
    let [a, b] = [history.at(-2).result, history.at(-3).result];
    if (a === b) weights[a] += 1.2;
  }

  if (history.length >= 4) {
    let res = [history.at(-1).result, history.at(-2).result, history.at(-3).result];
    if (res.every(r => r === res[0])) weights[res[0]] += 1;
  }

  let total = history.length;
  let countP = history.filter(v => v.result === 'Player').length;
  let countB = history.filter(v => v.result === 'Banker').length;
  let countT = history.filter(v => v.result === 'Tie').length;
  let countPP = history.filter(v => v.pp).length;
  let countBP = history.filter(v => v.bp).length;

  weights['Player'] += countP / total;
  weights['Banker'] += countB / total;

  let sorted = Object.entries(weights).sort((a,b) => b[1]-a[1]);
  let vote = sorted[0][0];

  return {
    vote,
    stats: {
      Player: Math.round((countP / total) * 100),
      Banker: Math.round((countB / total) * 100),
      Tie: Math.round((countT / total) * 100),
      PP: Math.round((countPP / total) * 100),
      BP: Math.round((countBP / total) * 100),
    }
  };
}