from config.dbConfig import db


class Trip(db.Model):
    __tablename__ = 'trip'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    archived = db.Column(db.Boolean, default=False)

    tripKeyLocations = db.relationship('TripKeyLocations', backref='trip', lazy='dynamic')

    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())


    def __repr__(self) -> str:
        return (f"Trip(id={self.id!r}, user={self.user!r}, "
                f"archived={self.archived!r})")
