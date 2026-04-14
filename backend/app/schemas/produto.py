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


class ProdutoDetalhe(ProdutoBase):
    id_produto: str
    total_vendas: int
    receita_total: float
    media_avaliacoes: Optional[float] = None
    avaliacoes: list[AvaliacaoResumo] = []

    model_config = {"from_attributes": True}


class ProdutoResponse(ProdutoBase):
    id_produto: str

    model_config = {"from_attributes": True}