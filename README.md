# blog2021

一份简洁的博客系统

## 页面展示

[blog2021](https://blog2021.aecra.cn/)

## 技术实现

- html，css，JavaScript，es6
- 开始是 php 写的 api，正在转为 python
- 使用了腾讯云的 scf，更加轻量化

## 虚拟主机版部署

- 修改配置文件 `api/config.php` 和 `backstage/config.php` 中的相关信息，修改图片返回地址
- 将文件上传至服务器
- 使用 `mysql.sql` 中的语句，依次创建数据库表格，最后添加用户数据（记得改账号密码）

## 云函数版部署

- 注册腾讯云账号
- 部署 postgreSQL [方法](https://cloud.tencent.com/document/product/409/42844) ,获取相关账号
- 部署云函数，设置 api 网关触发器，设置相关环境变量（见 blog.py 文件）和内网访问
- 使用 `postgreSQL.sql` 中的语句，依次创建数据库表格，最后添加用户数据（记得改账号密码）
- 修改 js 中的 api 请求地址和图片地址
- 将代码上传至 cos 等空间
