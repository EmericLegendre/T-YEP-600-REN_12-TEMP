from config.dbConfig import db
from enum import Enum

class CategoryEnum(Enum):
    CULTURE = 'Culture'
    TRANSPORT = 'Transport'
    COOKING = 'Cooking'
    HEALTH = 'Health'



class CityInfos(db.Model):
    """
    CityInfos model represents the information related to cities, categorized by different aspects.
    """
    __tablename__ = 'cityInfos'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cityId = db.Column(db.Integer, db.ForeignKey('city.id'), nullable=False)
    category = db.Column(db.Enum(CategoryEnum), nullable=False)
    content = db.Column(db.String(255), nullable=False)

    def __repr__(self) -> str:
        return f"CityInfos(id={self.id!r}, cityId={self.cityId!r}, category={self.category!r}, content={self.content!r})"
