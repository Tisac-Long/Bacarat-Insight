const cardValues = {
    'A': 1, '2': 2, '3': 3, '4': 4, '5': 5,
    '6': 6, '7': 7, '8': 8, '9': 9,
    '10': 0, 'J': 0, 'Q': 0, 'K': 0
};
const cardKeys = Object.keys(cardValues);
const history = [];

function createDropdownOptions(select) {
    select.innerHTML = '<option value="">--</option>';
    cardKeys.forEach(card => {
        const opt = document.createElement('option');
        opt.value = card;
        opt.textContent = card;
        select.appendChild(opt);
    });
}

document.querySelectorAll('.card-select').forEach(sel => createDropdownOptions(sel));

document.getElementById('round-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const currentRound = parseInt(document.getElementById('current-round').value);
    const nextRound = history.length ? history[history.length - 1].round + 1 : currentRound;

    const selects = document.querySelectorAll('.card-select');
    const pCards = Array.from(selects).slice(0, 3).map(s => s.value).filter(Boolean);
    const bCards = Array.from(selects).slice(3).map(s => s.value).filter(Boolean);

    if (pCards.length < 2 || bCards.length < 2) return alert('Cần nhập ít nhất 2 lá mỗi bên');

    const pTotal = pCards.reduce((sum, c) => sum + cardValues[c], 0) % 10;
    const bTotal = bCards.reduce((sum, c) => sum + cardValues[c], 0) % 10;

    let result = 'Hòa';
    if (pTotal > bTotal) result = 'Con';
    else if (bTotal > pTotal) result = 'Cái';

    const lastSuggestion = history.length ? history[history.length - 1].suggest : '';
    const correct = lastSuggestion === result ? '✅' : '❌';

    const suggest = predictNext(history);

    history.push({
        round: nextRound,
        pCards: pCards.join(','),
        bCards: bCards.join(','),
        pTotal, bTotal,
        result, suggest
    });

    document.querySelector('#next-round').textContent = nextRound + 1;
    renderHistory();
    showSuggestion(nextRound + 1, suggest);
    document.querySelectorAll('.card-select').forEach(s => s.selectedIndex = 0);
});

function predictNext(history) {
    if (history.length === 0) return 'Con';

    const last = history[history.length - 1];
    const keepC1 = history.length >= 2 &&
        history[history.length - 1].result === history[history.length - 2].result;
    return keepC1 ? last.result : (last.result === 'Con' ? 'Cái' : 'Con');
}

function renderHistory() {
    const tbody = document.querySelector('#history-table tbody');
    tbody.innerHTML = '';
    history.forEach((row, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.round}</td><td>${row.pCards}</td><td>${row.bCards}</td>
            <td>${row.pTotal}</td><td>${row.bTotal}</td>
            <td>${row.result}</td><td>${row.suggest}</td><td>${i === 0 ? '' : (history[i - 1].suggest === row.result ? '✅' : '❌')}</td>`;
        tbody.appendChild(tr);
    });
}

function showSuggestion(round, suggest) {
    document.getElementById('suggestions').innerHTML = `
        <li>👉 Cược chính: ${suggest === 'Con' ? '🟦 Con' : '🟥 Cái'}</li>
        <li>🃏 Kèo phụ dự kiến: Tạm thời chưa tính</li>
    `;
}
