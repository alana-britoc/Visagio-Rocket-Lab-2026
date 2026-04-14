from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.produto import Produto
from app.models.item_pedido import ItemPedido
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.models.pedido import Pedido

class ProdutoService:
    def __init__(self, db: Session):
        self.db = db

    def get_detalhes_completo(self, id_produto: str):
        try:
            produto = self.db.query(Produto).filter(Produto.id_produto == id_produto).first()
            
            if not produto:
                return None

            stats = self.db.query(
                func.count(ItemPedido.id_item).label("total_vendas"),
                func.sum(ItemPedido.preco_BRL).label("receita_total")
            ).filter(ItemPedido.id_produto == id_produto).first()

            media = self.db.query(
                func.avg(AvaliacaoPedido.avaliacao)
            ).join(
                ItemPedido, AvaliacaoPedido.id_pedido == ItemPedido.id_pedido
            ).filter(ItemPedido.id_produto == id_produto).scalar()

            avaliacoes_db = self.db.query(AvaliacaoPedido).join(
                ItemPedido, AvaliacaoPedido.id_pedido == ItemPedido.id_pedido
            ).filter(ItemPedido.id_produto == id_produto).limit(20).all()

            return {
                "id_produto": produto.id_produto,
                "nome_produto": produto.nome_produto,
                "categoria_produto": produto.categoria_produto,
                "peso_produto_gramas": produto.peso_produto_gramas,
                "comprimento_centimetros": produto.comprimento_centimetros,
                "altura_centimetros": produto.altura_centimetros,
                "largura_centimetros": produto.largura_centimetros,
                "total_vendas": stats.total_vendas or 0,
                "receita_total": float(stats.receita_total or 0),
                "media_avaliacoes": float(media or 0),
                "avaliacoes": [
                    {
                        "avaliacao": r.avaliacao,
                        "comentario": r.comentario or "Sem comentário",
                        "titulo_comentario": None,
                    } for r in avaliacoes_db
                ]
            }
                
        except Exception as e:
            print(f"ERRO NO SERVICE: {str(e)}")
            raise e

    def get_performance(self, id_produto: str):
        resultado = (
            self.db.query(
                func.strftime('%Y-%m', Pedido.pedido_compra_timestamp).label("mes"),
                func.count(ItemPedido.id_item).label("total")
            )
            .join(Pedido, ItemPedido.id_pedido == Pedido.id_pedido)
            .filter(ItemPedido.id_produto == id_produto)
            .group_by("mes")
            .order_by("mes")
            .all()
        )

        return [{"name": row.mes, "total": row.total} for row in resultado]