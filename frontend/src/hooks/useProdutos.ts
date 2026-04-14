import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listarProdutos,
  listarCategorias,
  detalharProduto,
  criarProduto,
  atualizarProduto,
  deletarProduto,
} from "@/api/produtos";
import type { ProdutoCreate, ProdutoUpdate, ProdutoDetalhe, Produto } from "@/types/produto";
import { toast } from "sonner";

const mapProduto = (p: any) => ({
  ...p,
  id: p.id_produto,
  name: p.nome_produto,
  category: p.categoria_produto,
  description: p.descricao || null,
  price: p.preco_BRL || 0,
  width: p.largura_centimetros,
  height: p.altura_centimetros,
  depth: p.comprimento_centimetros,
  weight: p.peso_produto_gramas ? p.peso_produto_gramas / 1000 : null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export function useProductsWithStats(
  search?: string,
  category?: string,
  page: number = 1,
  order: string = "recentes"
) {
  const productsQuery = useQuery({
    queryKey: ["products", search, category, page, order],
    queryFn: async () => {
      const response = await listarProdutos(search, page, category, order);
      return {
        items: response.items.map(mapProduto),
        total_paginas: response.total_paginas,
        total_items: response.total,
        current_page: response.pagina,
      };
    },
  });

  const ids = productsQuery.data?.items.map((p: any) => p.id) ?? [];

  const statsQuery = useQuery({
    queryKey: ["products-stats-batch", ids],
    queryFn: async () => {
      const results = await Promise.all(ids.map((id: string) => detalharProduto(id)));
      return Object.fromEntries(
        results.map((p: ProdutoDetalhe) => [
          p.id_produto,
          {
            avg_rating: p.media_avaliacoes ?? null,
            review_count: p.avaliacoes?.length ?? 0,
            total_sales: p.total_vendas ?? 0,
            total_revenue: p.receita_total ?? 0,
          },
        ])
      );
    },
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 2,
  });

  return {
    products: productsQuery.data?.items ?? [],
    stats: statsQuery.data ?? {},
    totalPaginas: productsQuery.data?.total_paginas ?? 1,
    totalItens: productsQuery.data?.total_items ?? 0,
    isLoading: productsQuery.isLoading,
    isLoadingStats: statsQuery.isLoading,
  };
}

export function useProducts(search?: string, category?: string, page: number = 1, order: string = "recentes") {
  return useQuery({
    queryKey: ["products", search, category, page, order],
    queryFn: async () => {
      const response = await listarProdutos(search, page, category, order);
      return {
        items: response.items.map(mapProduto),
        total_paginas: response.total_paginas,
        total_items: response.total,
        current_page: response.pagina,
      };
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: listarCategorias,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => detalharProduto(id).then(mapProduto),
    enabled: !!id,
  });
}

export function useProductStats(id: string) {
  return useQuery({
    queryKey: ["product-stats", id],
    queryFn: async () => {
      const p: ProdutoDetalhe = await detalharProduto(id);
      return {
        avg_rating: p.media_avaliacoes ?? 0,
        total_sales: p.total_vendas ?? 0,
        total_revenue: p.receita_total ?? 0,
        review_count: p.avaliacoes?.length ?? 0,
      };
    },
    enabled: !!id,
  });
}

export function useProductPerformance(id: string) {
  return useQuery({
    queryKey: ["product-performance", id],
    queryFn: () =>
      fetch(`/api/produtos/${id}/performance`)
        .then(res => {
          if (!res.ok) throw new Error("Erro ao buscar performance");
          return res.json();
        }),
    enabled: !!id,
  });
}

export function useProductReviews(id: string) {
  return useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const p: ProdutoDetalhe = await detalharProduto(id);
      return (p.avaliacoes || []).map((a, i) => ({
        id: i,
        rating: a.avaliacao,
        comment: a.comentario,
        customer_name: a.titulo_comentario ?? "Consumidor",
        created_at: new Date().toISOString(),
      }));
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (product: ProdutoCreate) => criarProduto(product),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto criado com sucesso!");
    },
    onError: (e: any) => toast.error("Erro ao criar produto: " + e.message),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: ProdutoUpdate & { id: string }) =>
      atualizarProduto(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product"] });
      toast.success("Produto atualizado com sucesso!");
    },
    onError: (e: any) => toast.error("Erro ao atualizar produto: " + e.message),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletarProduto(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto removido com sucesso!");
    },
    onError: (e: any) => toast.error("Erro ao remover produto: " + e.message),
  });
}
