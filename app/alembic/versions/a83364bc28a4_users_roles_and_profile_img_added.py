"""Users: roles and profile img added 

Revision ID: a83364bc28a4
Revises: 5827ae27da86
Create Date: 2026-07-25 18:52:05.291380

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a83364bc28a4'
down_revision: Union[str, Sequence[str], None] = '5827ae27da86'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

user_role_enum = sa.Enum('admin', 'buyer', name='user_role_enum')


def upgrade() -> None:
    """Upgrade schema."""
    user_role_enum.create(op.get_bind(), checkfirst=True)

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('hashed_password', sa.String(length=500), nullable=False))
        batch_op.add_column(sa.Column('role', user_role_enum, nullable=False))
        batch_op.add_column(sa.Column('profile_img', sa.String(length=255), nullable=True))
        batch_op.create_index(batch_op.f('ix_users_email'), ['email'], unique=True)
        batch_op.drop_column('hash_password')


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('hash_password', sa.VARCHAR(length=255), nullable=False))
        batch_op.drop_index(batch_op.f('ix_users_email'))
        batch_op.drop_column('profile_img')
        batch_op.drop_column('role')
        batch_op.drop_column('hashed_password')

    user_role_enum.drop(op.get_bind(), checkfirst=True)
