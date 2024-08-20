from config.dbConfig import db


class KeyLocations(db.Model):
    __tablename__ = 'keyLocations'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    place_id = db.Column(db.String, nullable=False)

    tripKeyLocations = db.relationship('TripKeyLocations', backref='keyLocations', lazy=True)

    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def __repr__(self) -> str:
        return f"KeyLocations(id={self.id!r}, name={self.name!r}, place_id={self.place_id!r})"
