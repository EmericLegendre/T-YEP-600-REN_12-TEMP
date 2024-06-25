from flask import Flask
from db.dbConfig import dbConfig, db
from flask_migrate import Migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object(dbConfig)

    # init db & migrations
    db.init_app(app)
    migrate = Migrate(app, db)

    # New test model
    class Test(db.Model):
        __tablename__ = 'test'
        id = db.Column(db.Integer, primary_key=True, autoincrement=True)
        name = db.Column(db.String(50), nullable=False)

        def __repr__(self):
            return f'<Test {self.id}: {self.name}>'

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000)
