/* eslint-disable no-undef */
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
      if (data.status === 0) {
        window.location.href = './';
      }
    })
    .catch(() => {
      // do nothing
    });
}

checkLogin();

layui.use('form', () => {
  const { form } = layui;

  // 监听提交
  form.on('submit(login)', (data) => {
    const formData = data.field;
    // console.log(formData);

    // 表单校验
    if (!new RegExp('^[a-zA-Z][a-zA-Z0-9_]{4,15}$').test(formData.username)) {
      layer.tips('格式错误', '#username');
      return false;
    }
    // if (!new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,18}$").test(formData.password)) {
    //   layer.tips("格式错误", "#password");
    //   return false;
    // }

    formData.password = md5(formData.password);
    // console.log(formData);

    const index = layer.load(2);
    fetch(`${apiUrl}login`, {
      // 请求方法
      method: 'POST',
      credentials: 'include',
      // 请求体
      body: JSON.stringify(formData),
    })
      .then((response) => {
        layer.close(index);
        return response.json();
      })
      .then((dataT) => {
        // console.log(dataT);
        if (dataT.status === 0) {
          window.location.href = './index.html';
        } else if (dataT.status === 1) {
          // 账号不存在
          layer.tips('账号不存在', '#username');
        } else if (dataT.status === 2) {
          // 密码错误
          layer.tips('密码错误', '#password');
        } else {
          // 未知状态码
          layer.msg('未知状态码', { icon: 2 });
        }
      })
      .catch(() => {
        layer.msg('数据异常', { icon: 2 });
      });
    return false;
  });
});
