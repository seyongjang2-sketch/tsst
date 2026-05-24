// FamilySpace Open-View & Secure-Write System
(function() {
  const familyPassword = 'family2026';
  const authKey = 'family_space_authenticated';
  
  function checkAuth() {
    const isAuthenticated = sessionStorage.getItem(authKey) === 'true';
    updateUI(isAuthenticated);
  }

  function highlightActiveLink() {
    const path = window.location.pathname;
    const pageName = path.split('/').pop() || 'index.html';
    const hash = window.location.hash;

    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      link.classList.remove('active');

      // Check if this link matches the page and hash
      if (href === pageName || (hash && href === `${pageName}${hash}`)) {
        link.classList.add('active');
      } else if (!hash && href.startsWith(pageName) && !href.includes('#')) {
        // If there's no hash and the link points to the page without a hash
        link.classList.add('active');
      }
    });
  }

  function updateUI(isAuthenticated) {
    document.addEventListener('DOMContentLoaded', () => {
      // 1. Highlight Active Link
      highlightActiveLink();
      window.addEventListener('hashchange', highlightActiveLink);

      // 2. Inject Login Modal if missing
      if (!document.getElementById('login-modal-overlay')) {
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'login-modal-overlay';
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
          <div class="login-modal">
            <button class="modal-close" onclick="closeLoginModal()">&times;</button>
            <h2>가족 로그인</h2>
            <p>우리 가족 시크릿 아지트 입장</p>
            <div class="modal-input-group">
              <input type="password" id="modal-p-input" class="modal-input" placeholder="비밀번호" onkeypress="if(event.key==='Enter') handleModalLogin()">
              <span id="modal-toggle-btn" class="modal-toggle-view" onclick="toggleModalPassword()">👁️</span>
            </div>
            <button onclick="handleModalLogin()" class="modal-login-btn">입장하기</button>
          </div>
        `;
        document.body.appendChild(modalOverlay);
      }

      // 3. Update Navbar Login/Logout button
      const authLink = document.getElementById('nav-auth-link');
      if (authLink) {
        if (isAuthenticated) {
          authLink.innerHTML = '<a href="#" onclick="handleLogout()" class="logout-btn">로그아웃</a>';
        } else {
          authLink.innerHTML = '<a href="#" onclick="showLoginModal()" class="login-menu-btn">로그인</a>';
        }
      }

      // 4. Control Write Form Visibility (for Blog)
      const writeForm = document.getElementById('blog-write-section');
      const loginAlert = document.getElementById('blog-login-alert');
      if (writeForm) {
        writeForm.style.display = isAuthenticated ? 'block' : 'none';
      }
      if (loginAlert) {
        loginAlert.style.display = isAuthenticated ? 'none' : 'block';
      }
    });
  }

  window.showLoginModal = function() {
    const modal = document.getElementById('login-modal-overlay');
    if (modal) modal.classList.add('active');
  };

  window.closeLoginModal = function() {
    const modal = document.getElementById('login-modal-overlay');
    if (modal) modal.classList.remove('active');
  };

  window.handleModalLogin = function() {
    const val = document.getElementById('modal-p-input').value;
    if (val === familyPassword) {
      sessionStorage.setItem(authKey, 'true');
      alert('환영합니다, 가족 여러분!');
      window.location.reload();
    } else {
      alert('비밀번호가 올바르지 않습니다.');
    }
  };

  window.toggleModalPassword = function() {
    const input = document.getElementById('modal-p-input');
    const btn = document.getElementById('modal-toggle-btn');
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = '🔒';
    } else {
      input.type = 'password';
      btn.textContent = '👁️';
    }
  };

  window.handleLogout = function() {
    sessionStorage.removeItem(authKey);
    alert('로그아웃 되었습니다.');
    window.location.reload();
  };

  // Run initial check
  checkAuth();
})();
