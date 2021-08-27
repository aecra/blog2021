const apiUrl = 'https://api.aecra.cn/release/blog2021/backstage/';

function checkLogin() {
  // 登陆验证
  fetch(`${apiUrl}login`, {
    // 请求方法
    method: 'POST',
    credentials: 'include',
    // 请求体
    body: '{}',
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status !== 0) {
        window.location.href = './login.html';
      }
    })
    .catch(() => {
      window.location.href = './login.html';
    });
}

checkLogin();

setInterval(() => {
  const img = document.getElementsByClassName('inner-img')[0];
  const titles = document.getElementsByClassName('inner-title');
  for (let i = 0; i < titles.length; i += 1) {
    titles[i].style.lineHeight = `${img.clientHeight / 3}px`;
    // console.log(titles[i].style.lineHeight,img.style.height);
  }
}, 200);

// eslint-disable-next-line no-unused-vars
function loginOut() {
  fetch(`${apiUrl}loginOut`, {
    // 请求方法
    method: 'POST',
    credentials: 'include',
    // 请求体
    body: '{}',
  }).then(() => {
    window.location.href = './login.html';
  });
}
