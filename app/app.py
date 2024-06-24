from typing import List, Dict
from flask import Flask, jsonify
import mysql.connector

app = Flask(__name__)

def favorite_colors() -> List[Dict[str, str]]:
    config = {
        'user': 'root',
        'password': 'root',
        'host': 'db',
        'port': '3306',
        'database': 'knights'
    }
    connection = mysql.connector.connect(**config)
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM favorite_colors')
    results = [{"name": name, "color": color} for (name, color) in cursor]
    cursor.close()
    connection.close()

    return results

@app.route('/')
def index() -> str:
    return jsonify({'favorite_colors': favorite_colors()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
