function analyzeImage() {
  const resultDiv = document.getElementById('analysisResult');
  const fileInput = document.getElementById('uploadImage');
  if (!fileInput.files || fileInput.files.length === 0) {
    resultDiv.innerText = "❌ Vui lòng chọn một ảnh trước.";
    return;
  }

  // Mô phỏng kết quả phân tích ảnh – thực tế sẽ dùng AI để xử lý ảnh
  const mockResult = {
    playerCards: ['10♥', 'Q♦', '3♦'],
    bankerCards: ['6♥', 'Q♣'],
    playerPoints: 3,
    bankerPoints: 6,
    winner: 'Banker',
    isPP: false,
    isBP: false
  };

  resultDiv.innerHTML = `
    <h3>Kết quả phân tích ảnh:</h3>
    <p>🧑 Tay Con: ${mockResult.playerCards.join(', ')} → <b>${mockResult.playerPoints} điểm</b></p>
    <p>🏦 Nhà Cái: ${mockResult.bankerCards.join(', ')} → <b>${mockResult.bankerPoints} điểm</b></p>
    <p>🎯 Kết quả: <b>${mockResult.winner}</b></p>
    <p>🃏 Con đôi (PP): ${mockResult.isPP ? '✅' : '❌'} | Cái đôi (BP): ${mockResult.isBP ? '✅' : '❌'}</p>
  `;
}