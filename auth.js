// FamilySpace Authentication & Modal System
(function() {
  const familyPassword = 'family2026';
  const authKey = 'family_space_authenticated';
  
  const path = window.location.pathname;
  const isPublicPage = path.endsWith('/') || path.endsWith('index.html') || path.endsWith('privacy.html') || path.endsWith('terms.html');

  function checkAuth() {
    const isAuthenticated = sessionStorage.getItem(authKey) === 'true';
    
    // Redirect to login page if accessing private area without auth
    if (!isPublicPage && !isAuthenticated) {
      window.location.href = 'index.html?triggerLogin=true';
      return;
    }

    updateNavbarUI(isAuthenticated);
  }

  function updateNavbarUI(isAuthenticated) {
    document.addEventListener('DOMContentLoaded', () => {
      const authLink = document.getElementById('nav-auth-link');
      if (authLink) {
        if (isAuthenticated) {
          authLink.innerHTML = '<a href="#" onclick="handleLogout()" class="logout-btn">로그아웃</a>';
        } else {
          authLink.innerHTML = '<a href="#" onclick="showLoginModal()" class="login-menu-btn">로그인</a>';
        }
      }
      
      // Auto-trigger modal if requested via URL
      if (window.location.search.includes('triggerLogin=true')) {
        showLoginModal();
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
    window.location.href = 'index.html';
  };

  checkAuth();
})();
