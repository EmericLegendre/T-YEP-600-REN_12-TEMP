from flask import Blueprint, jsonify
from models.state import State
from config.dbConfig import db

stateBp = Blueprint('stateBlueprint', __name__)
