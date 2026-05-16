document.addEventListener('DOMContentLoaded', function() {
  var path = window.location.pathname;
  var pageId = path.split('/').pop().replace('.html', '') || 'index';
  if (['dad', 'mom', 'baby'].indexOf(pageId) !== -1) {
    initBlog(pageId);
  }
});

function initBlog(pageId) {
  var blogList = document.getElementById('blog-posts');
  var blogForm = document.getElementById('blog-form');
  if (!blogList || !blogForm) return;

  renderPosts(pageId);

  window.savePost = function() {
    var titleInput = document.getElementById('post-title');
    var contentInput = document.getElementById('post-content');
    if (!titleInput.value || !contentInput.value) {
      alert('Tiêu đề và nội dung là bắt buộc! (제목과 내용을 입력해주세요!)');
      return;
    }

    var newPost = {
      id: Date.now(),
      title: titleInput.value,
      content: contentInput.value,
      date: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
      author: getAuthorName(pageId)
    };

    var posts = JSON.parse(localStorage.getItem('blog_' + pageId) || '[]');
    posts.unshift(newPost);
    localStorage.setItem('blog_' + pageId, JSON.stringify(posts));

    titleInput.value = '';
    contentInput.value = '';
    renderPosts(pageId);
  };

  window.deletePost = function(postId) {
    if (confirm('Bạn có chắc muốn xóa bài viết này? (정말 삭제하시겠습니까?)')) {
      var posts = JSON.parse(localStorage.getItem('blog_' + pageId) || '[]');
      var filtered = posts.filter(function(p) { return p.id !== postId; });
      localStorage.setItem('blog_' + pageId, JSON.stringify(filtered));
      renderPosts(pageId);
    }
  };
}

function renderPosts(pageId) {
  var blogList = document.getElementById('blog-posts');
  var posts = JSON.parse(localStorage.getItem('blog_' + pageId) || '[]');
  if (posts.length === 0) {
    blogList.innerHTML = '<p style="color: #747d8c; text-align: center;">Chưa có bài viết nào. Hãy viết bài đầu tiên! (아직 글이 없습니다.)</p>';
    return;
  }

  var html = '';
  posts.forEach(function(post) {
    html += '<div class="content-card" style="margin-bottom: 20px; position: relative;">';
    html += '<button onclick="deletePost(' + post.id + ')" style="position: absolute; top: 10px; right: 10px; border: none; background: none; font-size: 1.5rem; cursor: pointer; color: #ff4757;">×</button>';
    html += '<h4>' + post.title + '</h4>';
    html += '<p style="font-size: 0.8rem; color: #747d8c;">' + post.date + ' | Bởi: ' + post.author + '</p>';
    html += '<div style="white-space: pre-wrap; margin-top: 15px;">' + post.content + '</div>';
    html += '</div>';
  });
  blogList.innerHTML = html;
}

function getAuthorName(pageId) {
  if (pageId === 'dad') return 'Bố (아빠)';
  if (pageId === 'mom') return 'Mẹ (엄마)';
  if (pageId === 'baby') return 'Bé (아기)';
  return 'Thành viên';
}