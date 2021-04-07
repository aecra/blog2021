-- 用户表
create table usertb(
  id SERIAL primary key,
  username varchar(20) unique not null,
  pass_word varchar(40) not null,
  email varchar(50),
  portrait varchar(200)
);
-- 文章表
create table articletb(
  id SERIAL primary key,
  title varchar(100) not null,
  img_url varchar(200) not null default 'https://images.aecra.cn/aecra.png',
  content text not null,
  publish_time timestamp not null default now(),
  update_time timestamp not null default now(),
  hided int default 0 not null,
  toped int default 0 not null,
  clicks int default 0,
  userid int default 1 not null,
  foreign key(userid) references usertb(id)
);
-- 标签表
create table tagstb(
  id SERIAL primary key,
  tagname varchar(15) not null
);
-- 标签映射表
create table tagmaptb(
  id SERIAL primary key,
  tagid int,
  articleid int,
  foreign key(tagid) references tagstb(id),
  foreign key(articleid) references articletb(id),
  unique(tagid,articleid)
);

-- 添加用户
insert into usertb
(id,username,pass_word,email,portrait)
values
(1,'aecra','c6e3f638a7adbcb354a76085e27d0736','aecra@qq.com','https://images.aecra.cn/user/aecra.png');