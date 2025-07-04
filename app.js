let currentRound = 1;

function setStartRound() {
  const input = document.getElementById("roundInput").value;
  currentRound = parseInt(input) || 1;
  document.getElementById("currentRoundText").innerText = `Đang ở ván #${currentRound}`;
}

function analyzeImage() {
  const fileInput = document.getElementById("uploadImage");
  const resultDiv = document.getElementById("analysisResult");

  if (!fileInput.files || fileInput.files.length === 0) {
    resultDiv.innerText = "❌ Vui lòng chọn một ảnh trước.";
    return;
  }

  const roundNumber = currentRound;
  currentRound++;
  document.getElementById("currentRoundText").innerText = `Đang ở ván #${currentRound}`;

  const mockResult = {
    playerCards: ['10♥', 'Q♦', '3♦'],
    bankerCards: ['6♥', 'Q♣'],
    playerPoints: 3,
    bankerPoints: 6,
    winner: 'Banker',
    isPP: false,
    isBP: false,
    tieRate: '8.2%',
    ppRate: '39.6%',
    bpRate: '42.7%',
    bestC: 'C1 – Giữ cầu Cái',
    C1: '✅ đúng 3 lần',
    C2: '❌',
    C3: '✅ đúng 2 lần',
    C4: '❌'
  };

  resultDiv.innerHTML = `
    <h3>🧠 DỰ ĐOÁN VÁN KẾ TIẾP – VÁN ${roundNumber + 1}</h3>
    <p><b>📌 Phân tích cầu:</b><br>
    - C1 (Giữ cầu): ${mockResult.C1}<br>
    - C2 (Cầu nhảy): ${mockResult.C2}<br>
    - C3 (Lặp 2-1): ${mockResult.C3}<br>
    - C4 (Đảo cầu): ${mockResult.C4}</p>

    <p>🔮 Cầu mạnh nhất: <b>${mockResult.bestC}</b></p>
    <p>🎯 GỢI Ý CƯỢC:<br>
    👉 Cược chính: <b>${mockResult.winner}</b><br>
    ⚖️ Kèo phụ:<br>
    • 🎲 Hòa (Tie): ${mockResult.tieRate}<br>
    • 🃏 Con đôi (PP): ${mockResult.ppRate}<br>
    • 🃏 Cái đôi (BP): ${mockResult.bpRate}</p>
  `;
}