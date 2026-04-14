import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.produto import Produto
from app.models.item_pedido import ItemPedido
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.schemas.produto import (
    ProdutoCreate,
    ProdutoUpdate,
    ProdutoResponse,
    ProdutoDetalhe,
)

router = APIRouter(prefix="/produtos", tags=["Produtos"])


@router.get("/", response_model=list[ProdutoResponse])
def listar_produtos(
    busca: Optional[str] = Query(None, description="Busca por nome ou categoria"),
    db: Session = Depends(get_db),
):
    query = db.query(Produto)
    if busca:
        query = query.filter(
            Produto.nome_produto.ilike(f"%{busca}%") |
            Produto.categoria_produto.ilike(f"%{busca}%")
        )
    return query.all()


@router.get("/{id_produto}", response_model=ProdutoDetalhe)
def detalhar_produto(id_produto: str, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    # total de vendas e receita agregados pelos itens de pedido
    vendas = db.query(
        func.count(ItemPedido.id_item).label("total"),
        func.sum(ItemPedido.preco_BRL).label("receita")
    ).filter(ItemPedido.id_produto == id_produto).first()

    # media de avaliacoes via join com itens de pedido
    media = db.query(
        func.avg(AvaliacaoPedido.avaliacao)
    ).join(
        ItemPedido, AvaliacaoPedido.id_pedido == ItemPedido.id_pedido
    ).filter(
        ItemPedido.id_produto == id_produto
    ).scalar()

    # lista de avaliacoes do produto
    avaliacoes = db.query(AvaliacaoPedido).join(
        ItemPedido, AvaliacaoPedido.id_pedido == ItemPedido.id_pedido
    ).filter(
        ItemPedido.id_produto == id_produto
    ).limit(20).all()

    return ProdutoDetalhe(
        id_produto=produto.id_produto,
        nome_produto=produto.nome_produto,
        categoria_produto=produto.categoria_produto,
        peso_produto_gramas=produto.peso_produto_gramas,
        comprimento_centimetros=produto.comprimento_centimetros,
        altura_centimetros=produto.altura_centimetros,
        largura_centimetros=produto.largura_centimetros,
        total_vendas=vendas.total or 0,
        receita_total=round(vendas.receita or 0, 2),
        media_avaliacoes=round(media, 2) if media else None,
        avaliacoes=avaliacoes,
    )


@router.post("/", response_model=ProdutoResponse, status_code=201)
def criar_produto(dados: ProdutoCreate, db: Session = Depends(get_db)):
    produto = Produto(
        id_produto=uuid.uuid4().hex,
        **dados.model_dump()
    )
    db.add(produto)
    db.commit()
    db.refresh(produto)
    return produto


@router.put("/{id_produto}", response_model=ProdutoResponse)
def atualizar_produto(
    id_produto: str, dados: ProdutoUpdate, db: Session = Depends(get_db)
):
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(produto, campo, valor)

    db.commit()
    db.refresh(produto)
    return produto


@router.delete("/{id_produto}", status_code=204)
def deletar_produto(id_produto: str, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    db.delete(produto)
    db.commit()