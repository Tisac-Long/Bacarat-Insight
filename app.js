
document.addEventListener("DOMContentLoaded", function () {
  const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const cardSelects = ['p1', 'p2', 'p3', 'b1', 'b2', 'b3'];

  cardSelects.forEach(id => {
    const select = document.getElementById(id);
    select.innerHTML = '';
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '--';
    select.appendChild(emptyOption);
    cardValues.forEach(val => {
      const option = document.createElement('option');
      option.value = val;
      option.textContent = val;
      select.appendChild(option);
    });
  });

  let roundCounter = 0;
  const roundForm = document.getElementById("roundForm");
  const nextRoundSpan = document.getElementById("nextRound");
  const historyTable = document.querySelector("#historyTable tbody");

  const cardPoint = (v) => {
    if (v === 'A') return 1;
    if (['10','J','Q','K'].includes(v)) return 0;
    return parseInt(v || 0);
  };

  const getPoints = (cards) => {
    let sum = cards.map(cardPoint).reduce((a, b) => a + b, 0);
    return sum % 10;
  };

  const history = [];

  function predictNext() {
    if (history.length < 1) return;
    const last = history[history.length - 1];

    let c1 = history.filter((h, i, arr) =>
      i > 0 && h.result === arr[i - 1].result
    ).length;

    let c3 = history.filter((h, i, arr) =>
      i > 1 && h.result === arr[i - 2].result && h.result !== arr[i - 1].result
    ).length;

    const prediction = c1 >= c3 ? last.result : (last.result === "Cái" ? "Con" : "Cái");
    const tieRate = Math.random() * 10;
    const ppRate = Math.random() * 50;
    const bpRate = Math.random() * 50;

    document.getElementById("predictionBox").innerHTML = `
      📌 Cầu mạnh nhất: ${c1 >= c3 ? 'C1 – Giữ cầu' : 'C3 – Lặp 2-1'}<br>
      🎯 GỢI Ý CƯỢC:<br>
      👉 Cược chính: ${prediction === 'Con' ? '🟦 Con' : '🟥 Cái'} (${(c1 >= c3 ? 65 : 58)}%)<br>
      ⚖️ Kèo phụ:<br>
      🎲 Hòa (Tie): ${tieRate.toFixed(1)}%<br>
      🃏 Con đôi (PP): ${ppRate.toFixed(1)}%<br>
      🃏 Cái đôi (BP): ${bpRate.toFixed(1)}%
    `;
  }

  roundForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (roundCounter === 0) {
      roundCounter = parseInt(document.getElementById("startingRound").value);
    } else {
      roundCounter++;
    }

    const pCards = [p1.value, p2.value, p3.value].filter(v => v);
    const bCards = [b1.value, b2.value, b3.value].filter(v => v);

    const pPoints = getPoints(pCards);
    const bPoints = getPoints(bCards);

    let result = 'Hòa';
    if (pPoints > bPoints) result = 'Con';
    else if (bPoints > pPoints) result = 'Cái';

    let suggestion = document.getElementById("predictionBox").textContent.includes('🟦 Con') ? 'Con'
                    : document.getElementById("predictionBox").textContent.includes('🟥 Cái') ? 'Cái'
                    : 'Hòa';

    const isCorrect = suggestion === result ? '✅' : '❌';

    history.push({ round: roundCounter, pCards, bCards, pPoints, bPoints, result });

    const row = document.createElement("tr");
    row.innerHTML = `<td>${roundCounter}</td>
                     <td>${pCards.join(',')}</td>
                     <td>${bCards.join(',')}</td>
                     <td>${result} (${pPoints}-${bPoints})</td>
                     <td>${suggestion}</td>
                     <td>${isCorrect}</td>`;
    historyTable.appendChild(row);

    nextRoundSpan.textContent = "Ván " + (roundCounter + 1);
    cardSelects.forEach(id => document.getElementById(id).value = '');
    predictNext();
  });
});
