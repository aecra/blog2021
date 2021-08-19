# -*- coding: utf8 -*-
import json
import logging
import sys
from datetime import date, datetime, timedelta

import blog

logging.basicConfig(level=logging.INFO, stream=sys.stdout)
logger = logging.getLogger()
logger.setLevel(level=logging.INFO)


class JsonCustomEncoder(json.JSONEncoder):

    def default(self, field):

        if isinstance(field, datetime):
            return field.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(field, date):
            return field.strftime('%Y-%m-%d')
        else:
            return json.JSONEncoder.default(self, field)


def main_handler(event, context):
    logger.info(json.dumps(event, indent=2))
    logger.info('start main_handler')
    if 'requestContext' not in event.keys():
        return {'errorCode': 410, 'errorMsg': 'event is not come from api gateway'}

    result = {}
    still_on = True
    cookie = {}
    data = json.loads(event['body'])
    logger.info('get cookie')
    # 生成cookie的数据
    if 'cookie' in event['headers']:
        cookie = dict([l.split("=", 1)
                       for l in event['headers']['cookie'].split("; ")])
        cookie['username'] = 'username' in cookie and cookie['username'] or 'aecra'
        cookie['password'] = 'password' in cookie and cookie['password'] or ''
    else:
        cookie['username'] = 'username' in data and data['username'] or 'aecra'
        cookie['password'] = 'password' in data and data['password'] or ''

    if 'content' in event['pathParameters']:
        content = event['pathParameters']['content']

        logger.info('there is content in pathParameters')

        if content == 'login':
            logger.info('the content is login')
            status = blog.check_cookie(cookie)
            still_on = (status == 0) and True or False
            result = {"status": status}

        elif content == 'loginOut':
            logger.info('the content is loginOut')
            still_on = False

        else:
            # cookie校验
            logger.info('check the cookie')
            status = blog.check_cookie(cookie)
            still_on = (status == 0) and True or False
            result = {"status": status}

            if still_on:
                if content == 'credential':
                    logger.info('request is for credential')
                    result = blog.get_credential()

                elif content == 'articleList':
                    logger.info('request is for article list')
                    result = blog.get_article_list(cookie)

                elif content == 'publish':
                    logger.info('request is for publish')
                    result = blog.publish(cookie, data)

                elif content == 'statusChange':
                    logger.info('request is for statusChange')
                    result = blog.status_change(cookie, data)

                elif content == 'updateInitData':
                    logger.info('request is for updateInitData')
                    result = blog.get_update_init_data(cookie, data)

                elif content == 'update':
                    logger.info('request is for update')
                    result = blog.update(cookie, data)

                else:
                    logger.info('request is unkonwn')
                    result = {}

    if result == {} or result == [] or result == None:
        logger.info('request is not correct')
        result = {}

    # 设置cookie，并指定失效时间
    cookie_age = still_on and 'Max-Age=86400' or 'Max-Age=0'
    return {
        'isBase64Encoded': False,
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/html; charset=UTF-8',
            'Set-Cookie': [
                'password=' + cookie['password'] + '; ' + cookie_age + '; ' + 'SameSite=None' + '; ' + 'Secure',
                'username=' + cookie['username'] + '; ' + cookie_age + '; ' + 'SameSite=None' + '; ' + 'Secure'
                ],
        },
        'body': json.dumps(result, cls=JsonCustomEncoder)
    }
