// FamilySpace Authentication System
(function() {
  const familyPassword = 'family2026';
  const authKey = 'family_space_authenticated';
  
  // Current page detection
  const path = window.location.pathname;
  const isIndexPage = path.endsWith('/') || path.endsWith('index.html');
  const isLoginPage = path.endsWith('login.html');
  const isPublicPage = isIndexPage || isLoginPage || path.endsWith('privacy.html') || path.endsWith('terms.html');

  function checkAuth() {
    const isAuthenticated = sessionStorage.getItem(authKey) === 'true';
    
    // If not public page and not authenticated, redirect to login
    if (!isPublicPage && !isAuthenticated) {
      window.location.href = 'login.html';
      return;
    }

    // Update Navbar UI based on auth status
    updateNavbarUI(isAuthenticated);
  }

  function updateNavbarUI(isAuthenticated) {
    document.addEventListener('DOMContentLoaded', () => {
      const authLink = document.getElementById('nav-auth-link');
      if (authLink) {
        if (isAuthenticated) {
          authLink.innerHTML = '<a href="#" onclick="handleLogout()" class="logout-btn">로그아웃 (Đăng xuất)</a>';
        } else {
          authLink.innerHTML = '<a href="login.html" class="login-menu-btn">로그인 (Đăng nhập)</a>';
        }
      }
    });
  }

  window.handleLogin = function(inputPass) {
    if (inputPass === familyPassword) {
      sessionStorage.setItem(authKey, 'true');
      alert('환영합니다, 가족 여러분! (Chào mừng gia đình!)');
      window.location.href = 'index.html';
    } else {
      alert('비밀번호가 올바르지 않습니다. (Mật khẩu không đúng)');
    }
  };

  window.handleLogout = function() {
    sessionStorage.removeItem(authKey);
    alert('로그아웃 되었습니다. (Đã đăng xuất)');
    window.location.href = 'index.html';
  };

  // Run initial check
  checkAuth();
})();
