from flask import Blueprint, jsonify
from models.city import City
from config.dbConfig import db

cityBp = Blueprint('cityBlueprint', __name__)
