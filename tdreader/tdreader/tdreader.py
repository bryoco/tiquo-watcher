import os
import requests
import boto3
from typing import List
from decimal import Decimal
from helpers import get_secret

URL = "https://api.tdameritrade.com/v1/marketdata/chains"
TABLE = boto3.resource("dynamodb").Table(os.environ.get("TABLE_NAME"))
APIKEY = get_secret("TD", "APIKEY")


def lambda_handler(event: dict, context: object) -> dict:
    symbol = event.get('symbol')
    quotes = get_quotes(symbol)
    write(quotes)
    return {"statusCode": "200", "headers": {"Content-type": "application/json"},
            "body": {"symbol": symbol, "quotesFetched": len(quotes)}}


def get_quotes(symbol: str) -> List[dict]:
    d = requests.get(URL, params={"apikey": APIKEY, "symbol": symbol}).json()
    d['underlyingSymbol'] = d.pop('symbol')  # avoid clash with 'symbol' in quote
    strike_maps = list(d.pop('callExpDateMap').values()) + list(d.pop('putExpDateMap').values())
    quotes = [{**d, **quote[0]} for strike_map in strike_maps for quote in strike_map.values()]

    # Decimal type hack for boto float-type errors: https://github.com/boto/boto3/issues/665
    quotes = [{k: v if not isinstance(v, float) else Decimal(str(v)) for k, v in q.items()} for q in quotes]

    # Empty string hack
    quotes = [
        {k: v if not isinstance(v, str) else v.strip() for k, v in q.items() if not isinstance(v, str) or v.strip()}
        for q in quotes
    ]
    return quotes


def write(quotes: List[dict]) -> None:
    with TABLE.batch_writer() as batch:
        for quote in quotes:
            batch.put_item(quote)
