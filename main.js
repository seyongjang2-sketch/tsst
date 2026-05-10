document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('numbers-container');
  const generateBtn = document.getElementById('generate-btn');

  function getRangeClass(num) {
    if (num <= 10) return 'range-1';
    if (num <= 20) return 'range-11';
    if (num <= 30) return 'range-21';
    if (num <= 40) return 'range-31';
    return 'range-41';
  }

  function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
      const randomNum = Math.floor(Math.random() * 45) + 1;
      numbers.add(randomNum);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  }

  async function displayNumbers(numbers) {
    container.innerHTML = '';
    generateBtn.disabled = true;

    for (let i = 0; i < numbers.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      
      const ball = document.createElement('div');
      ball.className = `ball ${getRangeClass(numbers[i])}`;
      ball.textContent = numbers[i];
      container.appendChild(ball);
    }

    generateBtn.disabled = false;
  }

  generateBtn.addEventListener('click', () => {
    const numbers = generateLottoNumbers();
    displayNumbers(numbers);
  });
});
