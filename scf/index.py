# -*- coding: utf8 -*-
import json
import blog
from datetime import date
from datetime import datetime


class JsonCustomEncoder(json.JSONEncoder):

    def default(self, field):

        if isinstance(field, datetime):
            return field.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(field, date):
            return field.strftime('%Y-%m-%d')
        else:
            return json.JSONEncoder.default(self, field)


def main_handler(event, context):
    result = None
    if 'content' in event['pathParameters']:
        content = event['pathParameters']['content']

        if content == 'articleList':
            result = blog.get_article_list(
                blog.get_cursor(), event['queryString'])

        elif content == 'article':
            result = blog.get_article(blog.get_cursor(), event['queryString'])

        elif content == 'hotArticle':
            result = blog.get_hot_article(
                blog.get_cursor(), event['queryString'])

        elif content == 'search':
            result = blog.get_search(blog.get_cursor(), event['queryString'])

        elif content == 'tag':
            result = blog.get_tag(blog.get_cursor(), event['queryString'])

        elif content == 'topedArticle':
            result = blog.get_toped_article(
                blog.get_cursor(), event['queryString'])

        else:
            result = {}

    return {
        "isBase64Encoded": False,
        "statusCode": 200,
        "headers": {"Content-Type": "text/html; charset=UTF-8"},
        "body": json.dumps(result, cls=JsonCustomEncoder)
    }
