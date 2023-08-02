import hashlib
import base64


def shorten_url(url):
    url_hash = hashlib.sha256(url.encode()).digest()
    url_b64 = base64.b64encode(url_hash).decode()
    short_url = url_b64[:10]
    return short_url
