import logging

from fastapi import Depends, FastAPI, HTTPException
from starlette.responses import RedirectResponse

import schemas
from settings import settings
from db import init_db
from url_service import UrlService, get_url_service
from utils import shorten_url

app = FastAPI()

logger = logging.getLogger()


@app.on_event("startup")
async def startup_event():
    init_db()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/register", response_model=schemas.User)
def register(user: schemas.CreateUser, url_service: UrlService =
Depends(get_url_service)):
    db_user = url_service.get_user_by_email(user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="User already exists")
    return url_service.create_user(user)


@app.post("/login")
def login():
    pass


@app.get("/urls")
def urls_list():
    pass


@app.post("/urls")
def create_url(url: schemas.CreateShortUrl, url_service:
UrlService = Depends(get_url_service)):
    short_url = shorten_url(url.original_url)
    db_short_url = url_service.create_short_url(
        original_url=url.original_url,
        short_url=short_url,
        user_id=url.user_id)
    return f'{settings.base_url}/r/{db_short_url.short_url}'


@app.delete("/urls/{id}")
def delete_url(id: int):
    pass


@app.get("/r/{url}")
def redirect(url: str, url_service: UrlService = Depends(get_url_service)):
    short_url = url_service.get_short_url(url)
    return RedirectResponse(short_url.original_url)
