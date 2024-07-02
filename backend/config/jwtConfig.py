import os
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager

load_dotenv()


class jwtConfig:
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')


jwt = jwtConfig()
