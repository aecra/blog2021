# -*- coding: utf8 -*-
import json
import logging
import sys
from datetime import date, datetime

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
    logger.info('start main_handler')
    if "requestContext" not in event.keys():
        return {"errorCode":410,"errorMsg":"event is not come from api gateway"}

    result = None
    if 'content' in event['pathParameters']:
        content = event['pathParameters']['content']

        if content == 'articleList':
            logger.info('request is for articleList')
            result = blog.get_article_list(
                blog.get_cursor(), event['queryString'])

        elif content == 'article':
            logger.info('request is for article')
            result = blog.get_article(blog.get_cursor(), event['queryString'])

        elif content == 'hotArticle':
            logger.info('request is for hotArticle')
            result = blog.get_hot_article(
                blog.get_cursor(), event['queryString'])

        elif content == 'search':
            logger.info('request is for search')
            result = blog.get_search(blog.get_cursor(), event['queryString'])

        elif content == 'tag':
            logger.info('request is for tag')
            result = blog.get_tag(blog.get_cursor(), event['queryString'])

        elif content == 'topedArticle':
            logger.info('request is for topedArticle')
            result = blog.get_toped_article(
                blog.get_cursor(), event['queryString'])

        else:
            logger.info('request is unkonwn')
            result = {}

    if result == {} or result == []:
        logger.info('request is not correct')
        return {"errorCode":413,"errorMsg":"request is not correct"}
    

    return {
        "isBase64Encoded": False,
        "statusCode": 200,
        "headers": {"Content-Type": "text/html; charset=UTF-8"},
        "body": json.dumps(result, cls=JsonCustomEncoder)
    }
