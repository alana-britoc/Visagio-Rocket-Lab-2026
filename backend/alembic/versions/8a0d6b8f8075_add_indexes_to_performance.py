"""add_indexes_to_performance

Revision ID: 8a0d6b8f8075
Revises: 001
Create Date: 2026-04-14 11:01:13.089268

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '8a0d6b8f8075'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_index('idx_itens_produto', 'produtos', ['id_produto'])
    op.create_index('idx_itens_pedido', 'itens_pedidos', ['id_pedido'])
    op.create_index('idx_aval_pedido', 'avaliacoes_pedidos', ['id_pedido'])
    op.create_index('idx_pedidos_consumidor', 'consumidores', ['id_consumidor'])

def downgrade() -> None:
    pass
