from sqlalchemy import Column, ForeignKey, Integer, Table

from app.core.database import Model

plan_features = Table(
    "plan_features",
    Model.metadata,
    Column(
        "plan_id", Integer, ForeignKey("plans.id", ondelete="CASCADE"), primary_key=True
    ),
    Column(
        "feature_id",
        Integer,
        ForeignKey("features.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)
