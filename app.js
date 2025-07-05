
const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
let history = [];
let currentRound = 0;

function populateDropdowns() {
    const selects = ['playerCard1','playerCard2','bankerCard1','bankerCard2'];
    selects.forEach(id => {
        const sel = document.getElementById(id);
        sel.innerHTML = '<option value="">--</option>';
        ranks.forEach(r => {
            const opt = document.createElement('option');
            opt.value = opt.text = r;
            sel.add(opt);
        });
    });
}

function cardValue(c) {
    if (c === 'A') return 1;
    if (['10','J','Q','K'].includes(c)) return 0;
    return parseInt(c);
}

function calcPoints(cards) {
    return cards.map(cardValue).reduce((a,b)=>a+b,0)%10;
}

function addRound() {
    const p1 = document.getElementById("playerCard1").value;
    const p2 = document.getElementById("playerCard2").value;
    const b1 = document.getElementById("bankerCard1").value;
    const b2 = document.getElementById("bankerCard2").value;
    if (!p1 || !p2 || !b1 || !b2) return;

    const p = [p1, p2];
    const b = [b1, b2];
    const pPoint = calcPoints(p);
    const bPoint = calcPoints(b);
    const result = pPoint > bPoint ? 'P' : (bPoint > pPoint ? 'B' : 'T');
    const round = ++currentRound;

    const prev = history[history.length - 1];
    const prediction = simplePredict(round, p.length + b.length, prev?.result === result);
    const correct = prediction === result ? '✅' : '❌';

    history.push({ round, p, b, pPoint, bPoint, result, prediction, correct });
    updatePrediction();
    renderHistory();
    populateDropdowns();
}

function simplePredict(v, s, giuCau) {
    const t = giuCau ? 1 : 0;
    return ((v - s + t) % 2 === 0) ? 'B' : 'P';
}

function updatePrediction() {
    const last = history[history.length - 1];
    if (!last) return;
    const v = currentRound + 1;
    const s = last.p.length + last.b.length;
    const t = last.result === history[history.length - 2]?.result ? 1 : 0;
    const pred = ((v - s + t) % 2 === 0) ? 'B' : 'P';
    const text = `
        <strong>Ván ${v}</strong><br/>
        👉 Gợi ý cược: <b>${pred === 'B' ? '🟥 Cái' : '🟦 Con'}</b><br/>
        (theo công thức v - s + t)
    `;
    document.getElementById("predictionBox").innerHTML = text;
}

function renderHistory() {
    const tbody = document.querySelector("#historyTable tbody");
    tbody.innerHTML = '';
    history.forEach(h => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${h.round}</td>
            <td>${h.p.join(',')}</td>
            <td>${h.b.join(',')}</td>
            <td>${h.pPoint}-${h.bPoint}</td>
            <td>${h.result}</td>
            <td>${h.prediction}</td>
            <td>${h.correct}</td>
        `;
        tbody.appendChild(row);
    });
}

window.onload = populateDropdowns;
