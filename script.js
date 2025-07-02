function convertCard(card) {
  if (card === 'A') return 1;
  if (['10', 'J', 'Q', 'K'].includes(card)) return 0;
  if (card === '') return 0;
  return parseInt(card);
}
function tinhKetQua() {
  let P1 = convertCard(document.getElementById("P1").value);
  let P2 = convertCard(document.getElementById("P2").value);
  let P3 = convertCard(document.getElementById("P3").value);
  let B1 = convertCard(document.getElementById("B1").value);
  let B2 = convertCard(document.getElementById("B2").value);
  let B3 = convertCard(document.getElementById("B3").value);
  let playerScore = (P1 + P2 + P3) % 10;
  let bankerScore = (B1 + B2 + B3) % 10;
  let result = '';
  if (playerScore > bankerScore) result = 'Con (Player) thắng';
  else if (playerScore < bankerScore) result = 'Cái (Banker) thắng';
  else result = 'Hòa (Tie)';
  document.getElementById("ketqua").innerText = "Điểm Con: " + playerScore +
    ", Điểm Cái: " + bankerScore + " → " + result;
}