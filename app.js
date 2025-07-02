const history = [];

function calculatePoints(cards) {
  const values = cards.map(card => {
    if (['K', 'Q', 'J', '10'].includes(card)) return 0;
    if (card === 'A') return 1;
    return parseInt(card);
  });
  return values.reduce((a, b) => a + b, 0) % 10;
}

function submitRound() {
  const playerCards = document.getElementById("playerCards").value.toUpperCase().split(",").map(c => c.trim());
  const bankerCards = document.getElementById("bankerCards").value.toUpperCase().split(",").map(c => c.trim());

  const playerPoint = calculatePoints(playerCards);
  const bankerPoint = calculatePoints(bankerCards);

  let winner = "Hòa";
  if (playerPoint > bankerPoint) winner = "Con thắng";
  else if (bankerPoint > playerPoint) winner = "Cái thắng";

  const result = {
    playerCards, bankerCards,
    playerPoint, bankerPoint,
    winner
  };
  history.push(result);
  displayResults();
}

function displayResults() {
  let html = "<h2>Kết quả các ván đã nhập:</h2><ul>";
  history.forEach((round, index) => {
    html += `<li>Ván ${index + 1}: Con [${round.playerCards.join(", ")}] (${round.playerPoint}) - 
      Cái [${round.bankerCards.join(", ")}] (${round.bankerPoint}) => <b>${round.winner}</b></li>`;
  });
  html += "</ul>";
  document.getElementById("results").innerHTML = html;
}
