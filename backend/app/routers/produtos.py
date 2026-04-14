import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, desc, asc
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.produto import Produto
from app.models.item_pedido import ItemPedido
from app.models.pedido import Pedido
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.schemas.produto import (
    ProdutoCreate,
    ProdutoUpdate,
    ProdutoResponse,
    ProdutoDetalhe,
    ProdutosPaginados,
)

router = APIRouter(prefix="/produtos", tags=["Produtos"])

@router.get("/", response_model=ProdutosPaginados)
def listar_produtos(
    busca: Optional[str] = Query(None),
    categoria: Optional[str] = Query(None),
    ordem: Optional[str] = Query("recentes"),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Produto)
    
    if busca:
        query = query.filter(
            Produto.nome_produto.ilike(f"%{busca}%") |
            Produto.categoria_produto.ilike(f"%{busca}%")
        )
    if categoria:
        query = query.filter(Produto.categoria_produto == categoria)

    if ordem == "vendas_desc":
        query = query.outerjoin(ItemPedido).group_by(Produto.id_produto).order_by(desc(func.count(ItemPedido.id_item)))
    elif ordem == "rating_desc":
        query = query.outerjoin(ItemPedido).outerjoin(AvaliacaoPedido, ItemPedido.id_pedido == AvaliacaoPedido.id_pedido).group_by(Produto.id_produto).order_by(desc(func.avg(AvaliacaoPedido.avaliacao)))
    else:
        query = query.order_by(Produto.nome_produto.asc())

    total = query.count()
    produtos = query.offset((pagina - 1) * por_pagina).limit(por_pagina).all()

    return ProdutosPaginados(
        total=total,
        pagina=pagina,
        por_pagina=por_pagina,
        total_paginas=-(-total // por_pagina),
        items=produtos,
    )

@router.get("/categorias", response_model=list[str])
def listar_categorias(db: Session = Depends(get_db)):
    resultado = db.query(Produto.categoria_produto).distinct().order_by(Produto.categoria_produto).all()
    return [r[0] for r in resultado]

@router.get("/{id_produto}/performance")
def obter_performance_produto(id_produto: str, db: Session = Depends(get_db)):
    performance = db.query(
        func.date(Pedido.data_pedido).label("data"),
        func.sum(ItemPedido.preco_BRL).label("total")
    ).join(
        ItemPedido, Pedido.id_pedido == ItemPedido.id_pedido
    ).filter(
        ItemPedido.id_produto == id_produto
    ).group_by(
        func.date(Pedido.data_pedido)
    ).order_by(
        func.date(Pedido.data_pedido)
    ).limit(7).all()

    if not performance:
        return []

    return [{"name": p.data.strftime("%d/%m"), "total": float(p.total)} for p in performance]

@router.get("/{id_produto}", response_model=ProdutoDetalhe)
def detalhar_produto(id_produto: str, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    vendas = db.query(
        func.count(ItemPedido.id_item).label("total"),
        func.sum(ItemPedido.preco_BRL).label("receita")
    ).filter(ItemPedido.id_produto == id_produto).first()

    media = db.query(
        func.avg(AvaliacaoPedido.avaliacao)
    ).join(
        ItemPedido, AvaliacaoPedido.id_pedido == ItemPedido.id_pedido
    ).filter(
        ItemPedido.id_produto == id_produto
    ).scalar()

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