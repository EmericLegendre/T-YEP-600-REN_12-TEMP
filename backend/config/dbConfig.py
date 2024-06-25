import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy

load_dotenv()


class dbConfig:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')


db = SQLAlchemy()
