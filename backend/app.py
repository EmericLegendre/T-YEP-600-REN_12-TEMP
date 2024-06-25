from flask import Flask
from config.dbConfig import dbConfig, db
from flask_migrate import Migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object(dbConfig)

    # init config & migrations
    db.init_app(app)
    migrate = Migrate(app, db)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000)
