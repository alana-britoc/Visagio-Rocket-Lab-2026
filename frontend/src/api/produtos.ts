import axios from 'axios'
import type { Produto, ProdutoDetalhe, ProdutoCreate, ProdutoUpdate } from '../types/produto'

export interface PaginatedProdutos {
  total: number
  pagina: number
  por_pagina: number
  total_paginas: number
  items: Produto[]
}

const api = axios.create({
  baseURL: 'http://localhost:8000',
})

export const listarProdutos = async (
  busca?: string,
  pagina: number = 1,
  categoria?: string,
  ordem: string = "recentes" 
): Promise<PaginatedProdutos> => {
  const { data } = await api.get('/produtos/', {
    params: {
      ...(busca ? { busca } : {}),
      ...(categoria ? { categoria } : {}),
      pagina,
      por_pagina: 20,
      ordem, 
    },
  })
  return data
}

export const listarCategorias = async (): Promise<string[]> => {
  const { data } = await api.get('/produtos/categorias')
  return data
}

export const detalharProduto = async (id: string): Promise<ProdutoDetalhe> => {
  const { data } = await api.get(`/produtos/${id}`)
  return data
}

export const criarProduto = async (produto: ProdutoCreate): Promise<Produto> => {
  const { data } = await api.post('/produtos/', produto)
  return data
}

export const atualizarProduto = async (id: string, produto: ProdutoUpdate): Promise<Produto> => {
  const { data } = await api.put(`/produtos/${id}`, produto)
  return data
}

export const deletarProduto = async (id: string): Promise<void> => {
  await api.delete(`/produtos/${id}`)
}