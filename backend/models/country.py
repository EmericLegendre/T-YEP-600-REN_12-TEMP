from config.dbConfig import db


class Country(db.Model):
    __tablename__ = 'country'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    continent = db.Column(db.String(50), nullable=False)
    sub_continent = db.Column(db.String(50), nullable=False)
    currency = db.Column(db.String(50), nullable=False)
    capital = db.Column(db.String(50), nullable=False)
    population = db.Column(db.BigInteger, nullable=False)
    population_name = db.Column(db.String(50), nullable=False)
    timezone = db.Column(db.String(50), nullable=False)
    country_infos = db.relationship('CountryInfos', backref='country')
    states = db.relationship('State', backref='country')
    cities = db.relationship('City', backref='country')
    flag = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    

    def __repr__(self) -> str:
        return (f"Country(id={self.id!r}, name={self.name!r}, continent={self.continent!r}, "
                f"sub_continent={self.sub_continent!r}, currency={self.currency!r}, capital={self.capital!r}, "
                f"population={self.population!r}, population_name={self.population_name!r}, timezone={self.timezone!r})")