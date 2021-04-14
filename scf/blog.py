import os

import psycopg2
import psycopg2.extras


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


def add_tags_to_articles(cursor, articles):
    for row in articles:
        cursor.execute(
            'select * from tagstb inner join tagmaptb on tagmaptb.tagid=tagstb.id and tagmaptb.articleid=%s', [row['id']])
        row['tags'] = []
        item = cursor.fetchone()
        while item:
            row['tags'].append(item['tagname'])
            item = cursor.fetchone()
    return articles


def get_article_list(cursor, data):
    data['start'] = 'start' in data and int(data['start']) or 0
    data['step'] = 'step' in data and int(data['step']) or 6

    cursor.execute('''select n.id as id,n.title as title,n.publish_time as publish_time,n.toped as toped,
                      n.update_time as update_time,n.img_url as img_url,n.clicks as clicks,usertb.username as username
                      from articletb n
                      join usertb on usertb.id=n.userid
                      where n.hided=0 and n.toped=0
                      order by update_time desc''')

    record = cursor.fetchall()
    results = []
    count = len(record)
    start = data['start']
    length = data['step']
    if data['start'] < 0:
        start = 0
    if data['start'] > count - 1:
        return []
    if data['start'] + data['step'] > count:
        length = count - start
    for i in range(start, start+length):
        results.append(record[i])

    results = add_tags_to_articles(cursor, results)

    return results


def get_article(cursor, data):
    data['id'] = 'id' in data and int(data['id']) or 1

    articleid = data['id']
    cursor.execute(
        'select * from articletb where id=%s and hided=0', [articleid])
    record = cursor.fetchall()
    result = {}
    if len(record) == 0:
        return {}
    else:
        result = record[0]
    result['clicks'] = result['clicks'] + 1
    cursor.execute(
        'update articletb set clicks=%s where id=%s', [result['clicks'], articleid])

    cursor.execute(
        'select * from tagstb inner join tagmaptb on tagmaptb.tagid=tagstb.id and tagmaptb.articleid=%s', [articleid])
    result['tags'] = []
    item = cursor.fetchone()
    while item:
        result['tags'].append(item['tagname'])
        item = cursor.fetchone()

    cursor.execute('commit')
    return result


def get_hot_article(cursor, data):
    cursor.execute(
        'select id,title from articletb where hided=0 order by clicks desc limit 4 offset 0')
    results = cursor.fetchall()

    return results


def get_search(cursor, data):
    data['q'] = 'q' in data and data['q'] or 'HTML'

    cursor.execute('''select n.id as id,n.title as title,n.publish_time as publish_time,n.toped as toped,
                      n.update_time as update_time,n.img_url as img_url,n.clicks as clicks,usertb.username as username
                      from articletb n
                      join usertb on usertb.id=n.userid
                      where n.hided=0 and title like %s
                      order by update_time desc''', ['%' + data['q'] + '%'])
    results = cursor.fetchall()

    results = add_tags_to_articles(cursor, results)

    return results


def get_tag(cursor, data):
    data['tag'] = 'tag' in data and data['tag'] or 'HTML'
    data['start'] = 'start' in data and int(data['start']) or 0
    data['step'] = 'step' in data and int(data['step']) or 6

    cursor.execute('''select n.id as id,n.title as title,n.publish_time as publish_time,n.toped as toped,
                      n.update_time as update_time,n.img_url as img_url,n.clicks as clicks,usertb.username as username
                      from articletb n
                      join usertb on usertb.id=n.userid
                      join tagstb on tagstb.tagname=%s
                      join tagmaptb on tagmaptb.tagid=tagstb.id and tagmaptb.articleid=n.id
                      where n.hided=0
                      order by update_time desc''', [data['tag']])
    record = cursor.fetchall()

    results = []
    count = len(record)
    start = data['start']
    length = data['step']
    if data['start'] < 0:
        start = 0
    if data['start'] > count - 1:
        return []
    if data['start'] + data['step'] > count:
        length = count - start
    for i in range(start, start+length):
        results.append(record[i])

    results = add_tags_to_articles(cursor, results)

    return results


def get_toped_article(cursor, data):
    cursor.execute('''select n.id as id,n.title as title,n.publish_time as publish_time,n.toped as toped,
                      n.update_time as update_time,n.img_url as img_url,n.clicks as clicks,usertb.username as username
                      from articletb n
                      join usertb on usertb.id=n.userid
                      where n.hided=0 and n.toped=1
                      order by update_time desc''')
    results = cursor.fetchall()

    results = add_tags_to_articles(cursor, results)

    return results


print(get_toped_article(get_cursor(), {'tag': "css", 'start': 0, 'step': 10}))
