from config.dbConfig import db


class KeyLocations(db.Model):
    __tablename__ = 'keyLocations'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def __repr__(self) -> str:
        return f"KeyLocations(id={self.id!r}, name={self.name!r}, description={self.description!r}, latitude={self.latitude!r}, longitude={self.longitude!r})"
