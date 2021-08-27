/* eslint-disable no-undef */
const apiUrl = 'https://api.aecra.cn/release/blog2021/backstage/';

function statusChangeAjax(dataOfSend) {
  // 向后台传递表单数据
  fetch(`${apiUrl}statusChange`, {
    // 请求方法
    method: 'POST',
    credentials: 'include',
    // 请求体
    body: JSON.stringify(dataOfSend),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 0) {
        layer.msg('设置成功', { icon: 1 });
      } else {
        layer.msg('设置失败', { icon: 2 });
        window.location.href = './article-list.html';
      }
    })
    .catch(() => {
      layer.msg('数据异常', { icon: 2 });
    });
}

function setLayui() {
  layui.use('form', () => {
    const { form } = layui;

    form.on('switch(top)', (data) => {
      const formData = {};
      formData.titleId = data.value;
      formData.change = 'top';
      formData.status = data.elem.checked;

      statusChangeAjax(formData);
    });
    form.on('switch(hide)', (data) => {
      const formData = {};
      formData.titleId = data.value;
      formData.change = 'hide';
      formData.status = data.elem.checked;

      statusChangeAjax(formData);
    });
  });
}

function addToList(data) {
  let htmlStr = '';
  for (let i = 0; i < data.length; i += 1) {
    const element = data[i];
    htmlStr
          += `<div class="item">
          <div class="title">
            <a href="./update.html?id=${
  element.id
}">${
  element.title
}</a>
          </div>
          <div class="time">
            <span>发布时间：${
  element.publish_time
}</span>
            <span>修改时间：${
  element.update_time
}</span>
          </div>
          <div class="state">
            <form class="layui-form top-form" action="">
              <div class="layui-form-item">
                <label class="layui-form-label">置顶文章</label>
                <div class="layui-input-block">
                  <input ${
  element.toped === '1' ? 'checked' : ''
} type="checkbox" name="top" lay-filter="top" value="${
  element.id
}" lay-skin="switch" />
                </div>
              </div>
            </form>
            <form class="layui-form hide-form" action="">
              <div class="layui-form-item">
                <label class="layui-form-label">隐藏文章</label>
                <div class="layui-input-block">
                  <input ${
  element.hided === '1' ? 'checked' : ''
} type="checkbox" name="hide" lay-filter="hide" value="${
  element.id
}" lay-skin="switch" />
                </div>
              </div>
            </form>
          </div>
        </div>`;
  }
  document.getElementsByClassName('article-list')[0].innerHTML = htmlStr;
  return true;
}

function setArticleList() {
  fetch(`${apiUrl}articleList`, {
    // 请求方法
    method: 'POST',
    credentials: 'include',
    // 请求体
    body: '{}',
  })
    .then((response) => response.json())
    .then((data) => {
      if (addToList(data)) {
        setLayui();
      }
    })
    .catch(() => {
      layer.msg('数据异常', { icon: 2 });
    });
}
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
      } else {
        setArticleList();
      }
    })
    .catch(() => {
      window.location.href = './login.html';
    });
}
checkLogin();
