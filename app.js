
let currentRound = 1;
let history = [];

function startGame() {
  const startInput = document.getElementById("startRound");
  currentRound = parseInt(startInput.value);
  document.getElementById("analysis").innerHTML = "<p>📌 Hãy gửi ảnh ván bài...</p>";
}

document.getElementById("imageInput").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const imgData = evt.target.result;
    analyzeImage(imgData); // giả lập phân tích ảnh
  };
  reader.readAsDataURL(file);
});

function analyzeImage(img) {
  // 🔍 Đây là phần xử lý ảnh (giả lập tạm thời)
  const lastS = 5; // ví dụ 5 lá bài ván trước
  const T = 3;     // ví dụ Cái thắng 3 lần
  const X = currentRound - lastS + T;

  const even = X % 2 === 0;
  const giaiThich = even ? "Chẵn → 🟥 Cái" : "Lẻ → 🟦 Con";

  const ppRate = (Math.random() * 40 + 20).toFixed(1);
  const bpRate = (Math.random() * 40 + 20).toFixed(1);
  const tieRate = (Math.random() * 10 + 5).toFixed(1);

  const resultHTML = `
    <h2>🧠 DỰ ĐOÁN VÁN KẾ TIẾP – VÁN ${currentRound}</h2>
    <p>📐 V - S + T = ${currentRound} - ${lastS} + ${T} = ${X} → ${giaiThich}</p>
    <p>🎯 GỢI Ý CƯỢC CHÍNH: ${even ? "🟥 Cái" : "🟦 Con"}</p>
    <p>⚖️ Kèo phụ:
      <br/>🃏 Con đôi (PP): ${ppRate}%
      <br/>🃏 Cái đôi (BP): ${bpRate}%
      <br/>🎲 Hòa (Tie): ${tieRate}%
    </p>
  `;
  document.getElementById("analysis").innerHTML = resultHTML;
  history.push({ round: currentRound, x: X, even, ppRate, bpRate, tieRate });
  currentRound += 1;
}
