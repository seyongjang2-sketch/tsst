// FamilySpace Open-View & Secure-Write System
(function() {
  const familyPassword = 'family2026';
  const authKey = 'family_space_authenticated';
  
  function checkAuth() {
    const isAuthenticated = sessionStorage.getItem(authKey) === 'true';
    updateUI(isAuthenticated);
  }

  function updateUI(isAuthenticated) {
    document.addEventListener('DOMContentLoaded', () => {
      // 1. Update Navbar
      const authLink = document.getElementById('nav-auth-link');
      if (authLink) {
        if (isAuthenticated) {
          authLink.innerHTML = '<a href="#" onclick="handleLogout()" class="logout-btn">로그아웃</a>';
        } else {
          authLink.innerHTML = '<a href="#" onclick="showLoginModal()" class="login-menu-btn">로그인</a>';
        }
      }

      // 2. Control Write Form Visibility (for Blog)
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
