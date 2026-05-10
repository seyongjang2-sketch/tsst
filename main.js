document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('numbers-container');
  const generateBtn = document.getElementById('generate-btn');
  const clearBtn = document.getElementById('clear-btn');
  const themeBtn = document.getElementById('theme-btn');
  const gameCountSelect = document.getElementById('game-count');
  const body = document.body;

  // Theme Logic
  if (themeBtn) {
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);

    themeBtn.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // Lotto Logic
  if (container && generateBtn) {
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

    async function displayNumbers(count) {
      container.innerHTML = '';
      generateBtn.disabled = true;
      if (clearBtn) clearBtn.disabled = true;

      const alphabet = 'ABCDEFGHIJ';

      for (let g = 0; g < count; g++) {
        const rowWrapper = document.createElement('div');
        rowWrapper.className = 'game-row-wrapper';
        
        const label = document.createElement('div');
        label.className = 'game-label';
        label.textContent = `제 ${alphabet[g]} 게임`;
        rowWrapper.appendChild(label);

        const row = document.createElement('div');
        row.className = 'numbers-row';
        rowWrapper.appendChild(row);
        container.appendChild(rowWrapper);

        const numbers = generateLottoNumbers();
        for (let i = 0; i < numbers.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          
          const ball = document.createElement('div');
          ball.className = `ball ${getRangeClass(numbers[i])}`;
          ball.textContent = numbers[i];
          row.appendChild(ball);
        }
      }

      generateBtn.disabled = false;
      if (clearBtn) clearBtn.disabled = false;
    }

    generateBtn.addEventListener('click', () => {
      const count = parseInt(gameCountSelect.value) || 1;
      displayNumbers(count);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        container.innerHTML = '<div class="placeholder">번호 생성 버튼을 눌러주세요</div>';
      });
    }
  }
});
