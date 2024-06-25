from flask import Blueprint, jsonify
from models.user import User
from config.dbConfig import db

userBp = Blueprint('userBlueprint', __name__)