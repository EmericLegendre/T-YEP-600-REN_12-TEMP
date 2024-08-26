from config.dbConfig import db


class State(db.Model):
    __tablename__ = 'state'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    country_id = db.Column(db.Integer, db.ForeignKey('country.id'), nullable=False)
    population = db.Column(db.Integer, nullable=False)  # Changed to Integer
    population_name = db.Column(db.String(255), nullable=False)
    regional_capital = db.Column(db.String(255), nullable=False)

    cities = db.relationship('City', backref='state', lazy=True)
    state_infos = db.relationship('StateInfos', backref='state', lazy=True)

    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())


    def __repr__(self) -> str:
        return (f"State(id={self.id!r}, name={self.name!r}, countryId={self.country_id!r}, "
                f"population={self.population!r}, populationName={self.population_name!r}, "
                f"regionalCapital={self.regional_capital!r})")
