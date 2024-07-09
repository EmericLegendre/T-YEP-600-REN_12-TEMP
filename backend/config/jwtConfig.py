import os
from dotenv import load_dotenv

load_dotenv()


class jwtConfig:
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = False
