/* eslint-disable no-undef */
const apiUrl = 'https://api.aecra.cn/release/blog2021/backstage/';
let imgUrl = '';
let cosExpiredTime = Math.ceil(new Date().getTime() / 1000);
let cos;

function getGetParam() {
  const url = window.document.location.href.toString();
  let u = url.split('?');
  if (typeof u[1] === 'string') {
    u = u[1].split('&');
    let get = {};
    u.forEach((element) => {
      const j = element.split('=');
      get = Object.assign(get, { [j[0]]: j[1] });
    });
    return get;
  }
  return {};
}

function setLayui() {
  layui.use(['form'], () => {
    const { form } = layui;
    let published = false;
    let originData;

    // 获取文章信息
    fetch(`${apiUrl}updateInitData`, {
      // 请求方法
      method: 'POST',
      credentials: 'include',
      // 请求体
      body: JSON.stringify(getGetParam()),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (JSON.stringify(data) === '{}') {
          window.location.href = './';
        } else {
          originData = data;
          // 给表单赋值
          form.val('form', {
            title: data.title,
            tags: data.tags,
            top: data.toped === '1',
            hide: data.hided === '1',
            content: data.content,
          });
          imgUrl = data.img_url;
        }
      })
      .catch(() => {
        // console.log('catch error!', err);
        window.location.href = './login.html';
      });

    // 表单提交事件处理
    form.on('submit(formsub)', (data) => {
      if (published) {
        layer.msg('文章已发布，请勿重复提交', { icon: 7 });
        return false;
      }

      published = true;
      const formData = data.field;
      formData.top = formData.top || 'false';
      formData.hide = formData.hide || 'false';
      formData.imgUrl = imgUrl;

      // 表单校验，处理tags
      if (!new RegExp('^.{1,70}$').test(formData.title)) {
        layer.msg('文章标题过长', { icon: 2 });
        published = false;
        return false;
      }
      {
        const result = formData.tags.split(/[,，]/);
        formData.tags = [];
        for (let i = 0; i < result.length; i += 1) {
          result[i] = result[i].replace(/(^\s*)|(\s*$)/g, '');
          if (result[i].length >= 2 && result[i].length <= 15) {
            formData.tags.push(result[i]);
          }
        }
        if (result.length !== formData.tags.length) {
          layer.msg('请正确输入标签', { icon: 2 });
          published = false;
          return false;
        }
      }
      if (formData.imgUrl === '') {
        layer.msg('未上传图片', { icon: 2 });
        published = false;
        return false;
      }
      if (formData.content.length < 50) {
        layer.msg('文章内容过少', { icon: 2 });
        published = false;
        return false;
      }

      // 向后台传递表单数据
      const index = layer.load(2);
      fetch(`${apiUrl}update`, {
        // 请求方法
        method: 'POST',
        credentials: 'include',
        // 请求体
        body: JSON.stringify([originData, formData]),
      })
        .then((response) => {
          layer.close(index);
          return response.json();
        })
        .then((dataT) => {
          if (dataT.status === 0) {
            layer.msg('修改成功', { icon: 1 });
            setTimeout(() => {
              window.location.href = './article-list.html';
            }, 500);
          } else if (dataT.status === 1) {
            layer.msg('登陆状态失效', { icon: 2 });
            published = false;
          } else if (dataT.status === 2) {
            layer.msg('未收到数据', { icon: 2 });
            published = false;
          } else if (dataT.status === 4) {
            layer.msg('没有该文章的修改权限', { icon: 2 });
            published = false;
          } else {
            layer.msg('修改失败', { icon: 2 });
            published = false;
          }
        })
        .catch(() => {
          layer.msg('数据异常', { icon: 2 });
          published = false;
        });

      return false;
    });
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
        setLayui();
      }
    })
    .catch(() => {
      window.location.href = './login.html';
    });
}

checkLogin();

// eslint-disable-next-line no-unused-vars
function imgUpload(e) {
  // 初始化实例
  if (cosExpiredTime < Math.ceil(new Date().getTime() / 1000)) {
    cos = new COS({
      getAuthorization(options, callback) {
        // 异步获取临时密钥
        fetch(`${apiUrl}credential`, {
          // 请求方法
          method: 'POST',
          credentials: 'include',
          body: '{}',
        })
          .then((data) => data.json())
          .then((data) => {
            // console.log(data);
            const credentials = data && data.credentials;
            if (!data || !credentials) {
              // console.error('credentials invalid');
              return;
            }
            cosExpiredTime = credentials.expiredTime;
            callback({
              TmpSecretId: credentials.tmpSecretId,
              TmpSecretKey: credentials.tmpSecretKey,
              XCosSecurityToken: credentials.sessionToken,
              StartTime: data.startTime,
              ExpiredTime: data.expiredTime,
            });
          });
      },
    });
  }

  const fileReader = new FileReader();
  fileReader.readAsBinaryString(e.files[0]);
  fileReader.onload = (e1) => {
    const title = SparkMD5.hashBinary(e1.target.result);
    const fileType = /\.[^.]+$/.exec(e.files[0].name)[0];
    cos.putObject({
      Bucket: 'static-1255835707',
      Region: 'ap-beijing',
      Key: `cover/${title}${fileType}`,
      StorageClass: 'STANDARD',
      Body: e.files[0],
      // onProgress(progressData) {
      //   console.log(JSON.stringify(progressData));
      // },
    }, (err, data) => {
      if (data) {
        imgUrl = `https://static.aecra.cn/cover/${title}${fileType}`;
        layer.msg('图片上传成功', { icon: 1 });
      } else {
        layer.msg('图片上传失败', { icon: 2 });
      }
    });
  };
  return false;
}
