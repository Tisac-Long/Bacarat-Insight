function getCardValue(card) {
  if (!card) return 0;
  card = card.toUpperCase();
  if (card === 'A') return 1;
  if (['J', 'Q', 'K', '10'].includes(card)) return 0;
  return parseInt(card);
}

function calculateBaccaratPoint(cards) {
  const total = cards.map(getCardValue).reduce((a, b) => a + b, 0);
  return total % 10;
}

function isPair(cards) {
  return cards.length >= 2 && getCardValue(cards[0]) === getCardValue(cards[1]);
}

function getResult(pCards, bCards) {
  const p = calculateBaccaratPoint(pCards);
  const b = calculateBaccaratPoint(bCards);
  if (p > b) return 'Player';
  if (b > p) return 'Banker';
  return 'Tie';
}

function predictNextGame(history) {
  if (history.length === 0) return { main: 'Banker', pp: 38, bp: 41, tie: 8 };

  const last = history[history.length - 1];
  const prev = history[history.length - 2] || {};
  const v = history.length + 1;
  const s = last.playerCards.length + last.bankerCards.length;
  const t = (last.result === prev.result) ? 1 : 0;
  const formula = (v - s + t) % 2;

  const main = (formula === 0) ? 'Banker' : 'Player';

  return {
    main,
    pp: Math.floor(Math.random() * 30 + 35),
    bp: Math.floor(Math.random() * 30 + 35),
    tie: Math.floor(Math.random() * 10 + 5)
  };
}
