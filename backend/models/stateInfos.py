from config.dbConfig import db
from enum import Enum

class CategoryEnum(Enum):
    CULTURE = 'Culture'
    LAW = 'Law'
    COOKING = 'Cooking'
    HEALTH = 'Health'

class StateInfos(db.Model):
    __tablename__ = 'stateInfos'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    state_id = db.Column(db.Integer, db.ForeignKey('state.id'), nullable=False)
    category = db.Column(db.Enum(CategoryEnum), nullable=False)
    content = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())


    def __repr__(self) -> str:
        return f"StateInfos(id={self.id!r}, stateId={self.stateId!r}, category={self.category!r}, content={self.content!r})"

