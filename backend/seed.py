import csv
from datetime import datetime, date
from app.database import SessionLocal
from app.models.consumidor import Consumidor
from app.models.produto import Produto
from app.models.vendedor import Vendedor
from app.models.pedido import Pedido
from app.models.item_pedido import ItemPedido
from app.models.avaliacao_pedido import AvaliacaoPedido

def parse_float(value):
    try:
        return float(value) if value else None
    except:
        return None

def parse_datetime(value):
    try:
        return datetime.fromisoformat(value) if value else None
    except:
        return None

def parse_date(value):
    try:
        return date.fromisoformat(value) if value else None
    except:
        return None

def seed():
    db = SessionLocal()

    print("Populando consumidores...")
    with open("data/dim_consumidores.csv", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            db.merge(Consumidor(
                id_consumidor=row["id_consumidor"],
                prefixo_cep=row["prefixo_cep"],
                nome_consumidor=row["nome_consumidor"],
                cidade=row["cidade"],
                estado=row["estado"]
            ))
    db.commit()

    print("Populando produtos...")
    with open("data/dim_produtos.csv", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            db.merge(Produto(
                id_produto=row["id_produto"],
                nome_produto=row["nome_produto"],
                categoria_produto=row["categoria_produto"],
                peso_produto_gramas=parse_float(row["peso_produto_gramas"]),
                comprimento_centimetros=parse_float(row["comprimento_centimetros"]),
                altura_centimetros=parse_float(row["altura_centimetros"]),
                largura_centimetros=parse_float(row["largura_centimetros"])
            ))
    db.commit()

    print("Populando vendedores...")
    with open("data/dim_vendedores.csv", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            db.merge(Vendedor(
                id_vendedor=row["id_vendedor"],
                nome_vendedor=row["nome_vendedor"],
                prefixo_cep=row["prefixo_cep"],
                cidade=row["cidade"],
                estado=row["estado"]
            ))
    db.commit()

    print("Populando pedidos...")
    with open("data/fat_pedidos.csv", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            db.merge(Pedido(
                id_pedido=row["id_pedido"],
                id_consumidor=row["id_consumidor"],
                status=row["status"],
                pedido_compra_timestamp=parse_datetime(row["pedido_compra_timestamp"]),
                pedido_entregue_timestamp=parse_datetime(row["pedido_entregue_timestamp"]),
                data_estimada_entrega=parse_date(row["data_estimada_entrega"]),
                tempo_entrega_dias=parse_float(row["tempo_entrega_dias"]),
                tempo_entrega_estimado_dias=parse_float(row["tempo_entrega_estimado_dias"]),
                diferenca_entrega_dias=parse_float(row["diferenca_entrega_dias"]),
                entrega_no_prazo=row["entrega_no_prazo"]
            ))
    db.commit()

    print("Populando itens dos pedidos...")
    with open("data/fat_itens_pedidos.csv", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            db.merge(ItemPedido(
                id_pedido=row["id_pedido"],
                id_item=int(row["id_item"]),
                id_produto=row["id_produto"],
                id_vendedor=row["id_vendedor"],
                preco_BRL=parse_float(row["preco_BRL"]),
                preco_frete=parse_float(row["preco_frete"])
            ))
    db.commit()

    print("Populando avaliacoes...")
    with open("data/fat_avaliacoes_pedidos.csv", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            try:
                db.merge(AvaliacaoPedido(
                    id_avaliacao=row["id_avaliacao"],
                    id_pedido=row["id_pedido"],
                    avaliacao=int(row["avaliacao"]),
                    titulo_comentario=row["titulo_comentario"] or None,
                    comentario=row["comentario"] or None,
                    data_comentario=parse_datetime(row["data_comentario"]),
                    data_resposta=parse_datetime(row["data_resposta"])
                ))
                db.commit()
            except Exception:
                db.rollback()
    db.commit()

    db.close()
    print("Banco populado com sucesso.")

if __name__ == "__main__":
    seed()