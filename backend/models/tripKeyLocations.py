from config.dbConfig import db


class TripKeyLocations(db.Model):
    __tablename__ = 'trip_keyLocations'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    key_locations_id = db.Column(db.Integer, db.ForeignKey('keyLocations.id'))
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'))
    position = db.Column(db.Integer, nullable=False)

    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())


    def __repr__(self) -> str:
        return f"TripKeyLocations(id={self.id!r}, keyLocations_id={self.keyLocations_id!r}, trip_id={self.trip_id!r})"
