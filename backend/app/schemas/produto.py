from typing import Optional
from pydantic import BaseModel


class ProdutoBase(BaseModel):
    nome_produto: str
    categoria_produto: str
    peso_produto_gramas: Optional[float] = None
    comprimento_centimetros: Optional[float] = None
    altura_centimetros: Optional[float] = None
    largura_centimetros: Optional[float] = None


class ProdutoCreate(ProdutoBase):
    pass


class ProdutoUpdate(BaseModel):
    nome_produto: Optional[str] = None
    categoria_produto: Optional[str] = None
    peso_produto_gramas: Optional[float] = None
    comprimento_centimetros: Optional[float] = None
    altura_centimetros: Optional[float] = None
    largura_centimetros: Optional[float] = None


class AvaliacaoResumo(BaseModel):
    avaliacao: int
    titulo_comentario: Optional[str] = None
    comentario: Optional[str] = None
    model_config = {"from_attributes": True}

class ProdutoDetalhe(BaseModel):
    id_produto: str
    nome_produto: str
    categoria_produto: str
    peso_produto_gramas: Optional[float] = 0.0
    comprimento_centimetros: Optional[float] = 0.0
    altura_centimetros: Optional[float] = 0.0
    largura_centimetros: Optional[float] = 0.0
    total_vendas: int = 0
    receita_total: float = 0.0
    media_avaliacoes: float = 0.0
    avaliacoes: list[AvaliacaoResumo] = []
    model_config = {"from_attributes": True}

class ProdutoResponse(ProdutoBase):
    id_produto: str

    model_config = {"from_attributes": True}

class ProdutosPaginados(BaseModel):
    total: int
    pagina: int
    por_pagina: int
    total_paginas: int
    items: list[ProdutoResponse]

    model_config = {"from_attributes": True}