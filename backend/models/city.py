from config.dbConfig import db


class BaseMixin:
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())


class City(BaseMixin, db.Model):
    __tablename__ = 'city'
    name = db.Column(db.String(255), nullable=False)
    country_id = db.Column(db.Integer, db.ForeignKey('country.id'), nullable=False)
    state_id = db.Column(db.Integer, db.ForeignKey('state.id'), nullable=False)
    population = db.Column(db.Integer, nullable=False)  # Changed to Integer
    population_name = db.Column(db.String(255), nullable=False)

    city_infos = db.relationship('CityInfos', backref='city', lazy=True)

    def __repr__(self) -> str:
        return (f"City(id={self.id!r}, name={self.name!r}, country_id={self.country_id!r}, "
                f"state_id={self.state_id!r}, population={self.population!r}, population_name={self.population_name!r})")
