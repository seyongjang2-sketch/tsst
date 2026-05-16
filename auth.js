(function() {
  var password = 'family2026'; // Default password
  var authKey = 'family_space_auth';
  var isLoginPage = window.location.pathname.indexOf('login.html') !== -1;

  function checkAuth() {
    if (sessionStorage.getItem(authKey) === 'true') {
      if (isLoginPage) window.location.href = 'index.html';
      return;
    }
    if (!isLoginPage) {
      window.location.href = 'login.html';
    }
  }

  window.login = function(inputPass) {
    if (inputPass === password) {
      sessionStorage.setItem(authKey, 'true');
      window.location.href = 'index.html';
    } else {
      alert('비밀번호가 틀렸습니다! (Sai mật khẩu!)');
    }
  };

  window.logout = function() {
    sessionStorage.removeItem(authKey);
    window.location.href = 'login.html';
  };

  checkAuth();
})();