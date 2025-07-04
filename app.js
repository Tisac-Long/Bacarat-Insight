let currentRound = 1;
let history = [];

function setStartRound() {
  const input = parseInt(document.getElementById("startRound").value);
  currentRound = input || 1;
  document.getElementById("currentRoundText").innerText = `Ván hiện tại: #${currentRound}`;
}

function analyzeImage() {
  const resultDiv = document.getElementById("analysisResult");
  const imageInput = document.getElementById("uploadImage");

  if (!imageInput.files || imageInput.files.length === 0) {
    resultDiv.innerText = "❌ Bạn chưa chọn ảnh!";
    return;
  }

  // 🔄 Mô phỏng nhận diện ảnh (OCR)
  const v = {
    round: currentRound,
    P: ['Q♦', '5♠'],     // bài đứng Player
    B: ['K♣', '9♥'],     // bài đứng Banker
    P_extra: [],         // bài rút thêm Player
    B_extra: ['4♦'],     // bài rút thêm Banker
    P_point: 5,
    B_point: 3,
    winner: 'Player',
    pp: false,
    bp: false
  };
  history.push(v);

  const nextRound = currentRound + 1;
  const analysis = {
    C1: '✅ đúng 4 lần',
    C2: '❌',
    C3: '✅ đúng 2 lần',
    C4: '❌',
    best: 'C1 – Giữ cầu Con',
    mainBet: v.winner,
    ppRate: '34.8%',
    bpRate: '38.6%',
    tieRate: '9.1%'
  };

  resultDiv.innerHTML = `
    <h3>🧠 DỰ ĐOÁN VÁN KẾ TIẾP – VÁN ${nextRound}</h3>
    <p><b>📌 Phân tích cầu:</b><br>
    - C1 (Giữ cầu): ${analysis.C1}<br>
    - C2 (Cầu nhảy): ${analysis.C2}<br>
    - C3 (Lặp 2-1): ${analysis.C3}<br>
    - C4 (Đảo cầu): ${analysis.C4}</p>

    <p>🔮 Cầu mạnh nhất: <b>${analysis.best}</b></p>
    <p>🎯 GỢI Ý CƯỢC:<br>
    👉 Cược chính: <b>${analysis.mainBet}</b><br>
    ⚖️ Kèo phụ:<br>
    • 🎲 Hòa (Tie): ${analysis.tieRate}<br>
    • 🃏 Con đôi (PP): ${analysis.ppRate}<br>
    • 🃏 Cái đôi (BP): ${analysis.bpRate}</p>
  `;

  currentRound = nextRound;
  document.getElementById("currentRoundText").innerText = `Ván hiện tại: #${currentRound}`;
}