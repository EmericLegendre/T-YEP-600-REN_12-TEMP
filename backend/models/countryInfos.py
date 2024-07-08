from config.dbConfig import db
from enum import Enum

class CategoryEnum(Enum):
    LANGUAGE = 'Language'
    CULTURE = 'Culture'
    LAW = 'Law'
    COOKING = 'Cooking'
    HEALTH = 'Health'

class CountryInfos(db.Model):
    __tablename__ = 'countryInfos'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    country_id = db.Column(db.Integer, db.ForeignKey('country.id'), nullable=False)
    category = db.Column(db.Enum(CategoryEnum), nullable=False)
    content = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())


    def __repr__(self) -> str:
        return (f"CountryInfos(id={self.id!r}, countryId={self.countryId!r}, category={self.category!r}, "
                f"content={self.content!r})")