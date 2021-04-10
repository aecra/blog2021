import os
import time

import psycopg2
import psycopg2.extras
from sts.sts import Sts


def get_config():
    return {
        'user': os.environ['SQL_USER'],
        'password': os.environ['SQL_PASSWOED'],
        'host': os.environ['SQL_HOST'],
        'port': os.environ['SQL_PORT'],
        'database': os.environ['SQL_DATABASE']
    }


def get_cursor():
    config = get_config()
    connection = psycopg2.connect(user=config['user'],
                                  password=config['password'],
                                  host=config['host'],
                                  port=config['port'],
                                  database=config['database'])
    cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    return cursor


def get_credential():
    config = {
        'url': 'https://sts.tencentcloudapi.com/',
        'domain': 'sts.tencentcloudapi.com',
        'duration_seconds': 60,
        'secret_id': os.environ['COS_SECRET_ID'],
        'secret_key': os.environ['COS_SECRET_KEY'],
        'bucket': 'static-1255835707',
        'region': 'ap-beijing',
        'allow_prefix': 'cover/*',
        'allow_actions': [
            'name/cos:PutObject',
        ],

    }
    sts = Sts(config)
    response = sts.get_credential()
    return response


def check_cookie(cookie):
    cursor = get_cursor()
    cursor.execute('select * from usertb where username=%s',
                   [cookie['username']])
    record = cursor.fetchall()
    if len(record) == 0:
        return 1

    if record[0]['pass_word'] == cookie['password']:
        return 0
    else:
        return 2


def get_article_list(cookie):
    cursor = get_cursor()
    cursor.execute('''select n.id,n.title,n.publish_time,n.update_time,n.toped,n.hided
                      from articletb n
                      join usertb on usertb.username=%s and usertb.id=n.userid
                      order by update_time desc''', [cookie['username']])
    record = cursor.fetchall()
    return record


def publish(cookie, data):
    cursor = get_cursor()
    # 获取用户id
    cursor.execute('select * from usertb where username=%s',
                   [cookie['username']])
    userid = cursor.fetchall()[0]['id']
    a_title = data['title']
    a_img_url = data['imgUrl']
    a_content = data['content']
    a_publish_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())
    a_update_time = a_publish_time
    a_hided = data['hide'] == 'true' and 1 or 0
    a_toped = data['top'] == 'true' and 1 or 0
    a_clicks = 0
    a_userid = userid
    cursor.execute('''INSERT INTO articletb
                      (title,img_url,content,publish_time,update_time,hided,toped,clicks,userid)
                      VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id''', [a_title, a_img_url, a_content, a_publish_time, a_update_time, a_hided, a_toped, a_clicks, a_userid])

    a_id = cursor.fetchall()[0]['id']
    for tag in data['tags']:
        # 标签不存在就插入标签
        cursor.execute('select * from tagstb where tagname=%s', [tag])
        if len(cursor.fetchall()) == 0:
            # 向数据库插入标签
            cursor.execute('insert into tagstb(tagname) values(%s)', [tag])

        # 获取标签id
        cursor.execute('select * from tagstb where tagname=%s', [tag])
        tagid = cursor.fetchall()[0]['id']

        # 向映射表中插入数据
        cursor.execute(
            'insert into tagmaptb(tagid,articleid) values(%s,%s)', [tagid, a_id])
    
    cursor.execute('commit')
    return {'status': 0}


def status_change(cookie, data):
    cursor = get_cursor()
    # 获取用户id
    cursor.execute('select * from usertb where username=%s',
                   [cookie['username']])
    userid = cursor.fetchall()[0]['id']

    field = data['change'] == 'top' and 'toped' or 'hided'
    status = data['status'] and 1 or 0
    articleid = data['titleId']

    # 获取该文章的用户id
    cursor.execute('select userid from articletb where id=%s', [articleid])
    userid2 = cursor.fetchall()[0]['userid']

    if userid != userid2:
        return {'status': 4}

    # 更新文章状态
    if field == 'toped':
        cursor.execute('update articletb set toped=%s where id=%s', [
                       status, articleid])
    else:
        cursor.execute('update articletb set hided=%s where id=%s',
                       [status, articleid])

    cursor.execute('commit')
    return {'status': 0}


def get_update_init_data(cookie, data):
    cursor = get_cursor()
    # 获取用户id
    cursor.execute('select * from usertb where username=%s',
                   [cookie['username']])
    userid = cursor.fetchall()[0]['id']

    # 查询该账号下的该文章
    articleid = data['id']
    cursor.execute(
        'select * from articletb where id=%s and userid=%s', [articleid, userid])
    return_json = cursor.fetchall()[0]
    if return_json == None:
        return {}

    cursor.execute(
        'select * from tagstb inner join tagmaptb on tagmaptb.tagid=tagstb.id and tagmaptb.articleid=%s', [articleid])
    return_json['tags'] = []
    for tag in cursor.fetchall():
        return_json['tags'].append(tag['tagname'])

    return return_json


def update(cookie, data):
    cursor = get_cursor()
    # 获取用户id
    cursor.execute('select * from usertb where username=%s',
                   [cookie['username']])
    userid = cursor.fetchall()[0]['id']
    # 账号信息不符
    if userid != data[0]['userid']:
        return {'status': 4}
    # 修改数据库中的文章信息
    a_title = data[1]['title']
    a_img_url = data[1]['imgUrl']
    a_content = data[1]['content']
    a_update_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())
    a_hided = data[1]['hide'] == 'true' and 1 or 0
    a_toped = data[1]['top'] == 'true' and 1 or 0
    a_id = data[0]['id']

    cursor.execute('''update articletb set
                      title=%s,img_url=%s,content=%s,update_time=%s,hided=%s,toped=%s
                      where id=%s''', [a_title, a_img_url, a_content, a_update_time, a_hided, a_toped, a_id])

    # 修改标签映射
    for tag in data[0]['tags']:
        if tag not in data[1]['tags']:
            # 不存在的标签
            # 删除该标签同文章的映射
            cursor.execute('''delete tagmaptb from tagmaptb,tagstb
                              where tagmaptb.articleid=%s and tagmaptb.tagid=tagstb.id and tagstb.tagname=%s''', [a_id, tag])

            # 检查该标签是否为其他文章的标签，如果不是，那么删除该标签
            cursor.execute('''select * from tagmaptb
                              inner join tagstb on tagstb.tagname=%s and tagmaptb.tagid=tagstb.id''', [tag])

            if len(cursor.fetchall()) == 0:
                cursor.execute('delete from tagstb where tagname=%s', [tag])

    for tag in data[1]['tags']:
        if tag not in data[0]['tags']:
            # 新增的标签
            # 检查数据库中是否存在该标签,如果没有，那么添加该标签
            cursor.execute('select * from tagstb where tagname=%s', [tag])
            if len(cursor.fetchall()) == 0:
                cursor.execute(
                    'insert into tagstb (tagname) values(%s)', [tag])

            # 添加该标签同文章的映射
            # 获取标签id
            cursor.execute('select * from tagstb where tagname=%s', [tag])
            tagid = cursor.fetchall()[0]['id']
            cursor.execute(
                'insert into tagmaptb (tagid, articleid) values(%s,%s)', [tagid, a_id])
    
    cursor.execute('commit')
    return {'status': 0}
