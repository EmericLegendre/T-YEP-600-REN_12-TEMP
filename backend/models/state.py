from config.dbConfig import db


class State(db.Model):
    __tablename__ = 'state'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    country_id = db.Column(db.Integer, db.ForeignKey('country.id'), nullable=False)
    population = db.Column(db.Integer, nullable=False)  # Changed to Integer
    populationName = db.Column(db.String(255), nullable=False)
    regionalCapital = db.Column(db.String(255), nullable=False)

    cities = db.relationship('City', backref='state', lazy=True)
    stateInfos = db.relationship('StateInfos', backref='state', lazy=True)

    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())


    def __repr__(self) -> str:
        return (f"State(id={self.id!r}, name={self.name!r}, countryId={self.countryId!r}, "
                f"population={self.population!r}, populationName={self.populationName!r}, "
                f"regionalCapital={self.regionalCapital!r})")
