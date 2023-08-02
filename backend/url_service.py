from fastapi import Depends
from sqlalchemy.orm import Session

import models
import schemas
from db import get_db


class UrlService:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user: schemas.CreateUser):
        db_user = models.User(email=user.email, hashed_password=user.password)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def get_user_by_email(self, email: str):
        return self.db.query(models.User).filter(models.User.email ==
                                                 email).first()

    def create_short_url(self, original_url: str, short_url: str, user_id:
    int):
        db_url = models.Url(original_url=original_url, short_url=short_url,
                            owner_id=user_id)
        self.db.add(db_url)
        self.db.commit()
        self.db.refresh(db_url)
        return db_url

    def get_short_url(self, short_url: str) -> models.Url:
        db_url = self.db.query(models.Url).filter(models.Url.short_url ==
                                                  short_url).first()
        db_url.count += 1
        self.db.commit()
        self.db.refresh(db_url)
        return db_url

    def get_urls(self):
        urls = self.db.query(models.Url).all()
        return urls


def get_url_service(db: Session = Depends(get_db)) -> UrlService:
    url_service = UrlService(db=db)
    return url_service
