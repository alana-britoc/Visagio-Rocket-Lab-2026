export interface Produto {
  id_produto: string
  nome_produto: string
  categoria_produto: string
  peso_produto_gramas: number | null
  comprimento_centimetros: number | null
  altura_centimetros: number | null
  largura_centimetros: number | null
}

export interface AvaliacaoResumo {
  avaliacao: number
  titulo_comentario: string | null
  comentario: string | null
}

export interface ProdutoDetalhe extends Produto {
  total_vendas: number
  receita_total: number
  media_avaliacoes: number | null
  avaliacoes: AvaliacaoResumo[]
}

export interface ProdutoCreate {
  nome_produto: string
  categoria_produto: string
  peso_produto_gramas?: number
  comprimento_centimetros?: number
  altura_centimetros?: number
  largura_centimetros?: number
}

export interface ProdutoUpdate extends Partial<ProdutoCreate> {}