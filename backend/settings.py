from pydantic.v1 import BaseSettings


class Settings(BaseSettings):
    SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
    base_url: str = 'http://127.0.0.1:8000'


settings = Settings()
