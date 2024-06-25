from config.dbConfig import db

class KeyLocations(db.Model):
    __tablename__ = 'keyLocations'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    latitude = db.Column(db.String(255), nullable=False)
    longitude = db.Column(db.String(255), nullable=False)

    def __repr__(self) -> str:

        return f"User(id={self.id!r}, name={self.name!r}, description={self.description!r}, latitude={self.latitude!r}, longitude={self.longitude!r})"