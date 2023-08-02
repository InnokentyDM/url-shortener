from pydantic import BaseModel


class ShortenedUrl(BaseModel):
    short_url: str


class CreateShortUrl(BaseModel):
    original_url: str
    user_id: int


class Url(BaseModel):
    id: int
    original_url: str
    short_url: str
    count: int
    owner_id: int

    class Config:
        orm_mode = True


class BaseUser(BaseModel):
    email: str


class CreateUser(BaseUser):
    password: str


class User(BaseUser):
    id: int
    email: str
    urls: list[Url] = []

    class Config:
        orm_mode = True
