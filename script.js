const history = [];

document.getElementById("upload").addEventListener("change", async function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const result = await processImage(file);
  if (result) {
    history.push(result);
    updateUI(result);
  }
});

function processImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const sampleResult = {
        playerCards: ["8♦️", "3♣️", "A♠️"],
        bankerCards: ["7♠️", "9♥️"],
        result: "B",
        playerPoint: 2,
        bankerPoint: 6,
        pair: { PP: false, BP: false },
        tie: false
      };
      resolve(sampleResult);
    };
    reader.readAsDataURL(file);
  });
}

function updateUI(result) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
    <h3>Kết quả ván hiện tại:</h3>
    <p><strong>Player:</strong> ${result.playerCards.join(", ")} (${result.playerPoint} điểm)</p>
    <p><strong>Banker:</strong> ${result.bankerCards.join(", ")} (${result.bankerPoint} điểm)</p>
    <p><strong>Kết quả:</strong> ${result.result} ${result.tie ? "(Hòa)" : ""}</p>
    <p>Con đôi: ${result.pair.PP ? "✅" : "❌"}, Cái đôi: ${result.pair.BP ? "✅" : "❌"}</p>
  `;

  const historyDiv = document.getElementById("history");
  historyDiv.innerHTML = "<h3>Lịch sử ván:</h3>" + history.map((h, i) => `
    <div>
      <strong>Ván ${i + 1}</strong> – ${h.result}, Player: ${h.playerPoint}, Banker: ${h.bankerPoint},
      PP: ${h.pair.PP ? "✅" : "❌"}, BP: ${h.pair.BP ? "✅" : "❌"}, Hòa: ${h.tie ? "✅" : "❌"}
    </div>
  `).join("");
}

function resetHistory() {
  history.length = 0;
  document.getElementById("history").innerHTML = "";
  document.getElementById("result").innerHTML = "";
}
