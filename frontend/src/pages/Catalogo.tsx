import { useState, useEffect } from 'react'
import { Search, Plus, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductCard } from '@/components/ProductCard'
import { ProductForm } from '@/components/ProductForm'
import { useProductsWithStats, useCategories, useCreateProduct } from '@/hooks/useProdutos'
import { getCategoryData } from '@/data/categoriaImagens'

export default function Catalogo() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [categoria, setCategoria] = useState('all')
  const [ordenacao, setOrdenacao] = useState('vendas_desc')
  const [pagina, setPagina] = useState(1)
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPagina(1)
    }, 500)

    return () => clearTimeout(handler)
  }, [searchTerm])

  const { products, stats, totalPaginas, totalItens, isLoading } = useProductsWithStats(
    debouncedSearch,
    categoria === 'all' ? '' : categoria,
    pagina,
    ordenacao
  )

  const { data: categorias } = useCategories()
  const createProduct = useCreateProduct()

  const neonStyles = "flex-1 bg-[#1a1a1a] border-none rounded-full h-12 text-zinc-400 font-medium transition-all duration-300 outline-none focus:ring-0 focus:ring-offset-0 data-[state=open]:ring-2 data-[state=open]:ring-emerald-500/50 data-[state=open]:shadow-[0_0_20px_rgba(16,185,129,0.4)] data-[state=open]:text-emerald-400"

  return (
    <div className="min-h-screen bg-[#080808] text-white p-4 md:p-8 flex justify-center overflow-x-hidden">
      <div className="w-full max-w-450 space-y-6">

        <div className="bg-[#121212] border border-white/5 rounded-4xl p-6 md:p-8">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Catálogo</h1>

            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
              <div className="relative flex-1 min-w-70">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <Input
                  placeholder="Pesquisar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 bg-[#1a1a1a] border-none rounded-full h-12 text-zinc-300 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-0 transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <Select value={categoria} onValueChange={(v) => { setCategoria(v); setPagina(1); }}>
                  <SelectTrigger className={neonStyles}>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 rounded-2xl shadow-2xl p-1 outline-none">
                    <SelectItem value="all" className="rounded-xl focus:bg-emerald-500/10 focus:text-emerald-400 cursor-pointer outline-none">
                      Todas as Categorias
                    </SelectItem>
                    {Array.from(new Set(
                      (categorias ?? [])
                        .filter((c) => c && c.trim() !== "")
                        .map((cat) => getCategoryData(cat).label)
                    )).map((labelBonito) => {
                      const originalKey = (categorias ?? []).find(
                        (c) => getCategoryData(c).label === labelBonito
                      ) ?? ""

                      return (
                        <SelectItem
                          key={labelBonito}
                          value={originalKey}
                          className="rounded-xl focus:bg-emerald-500/10 focus:text-emerald-400 cursor-pointer outline-none"
                        >
                          {labelBonito}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>

                <Select value={ordenacao} onValueChange={(v) => { setOrdenacao(v); setPagina(1); }}>
                  <SelectTrigger className={neonStyles}>
                    <ArrowUpDown size={14} className="mr-2" />
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 rounded-2xl p-1 outline-none">
                    <SelectItem value="vendas_desc" className="rounded-xl focus:bg-emerald-500/10 focus:text-emerald-400 cursor-pointer outline-none">Mais Vendidos</SelectItem>
                    <SelectItem value="vendas_asc" className="rounded-xl focus:bg-emerald-500/10 focus:text-emerald-400 cursor-pointer outline-none">Menos Vendidos</SelectItem>
                    <SelectItem value="rating_desc" className="rounded-xl focus:bg-emerald-500/10 focus:text-emerald-400 cursor-pointer outline-none">Melhores Notas</SelectItem>
                    <SelectItem value="rating_asc" className="rounded-xl focus:bg-emerald-500/10 focus:text-emerald-400 cursor-pointer outline-none">Menores Notas</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => setFormOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full h-12 px-6 gap-2 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/20"
                >
                  <Plus size={18} />
                  Novo Produto
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#121212] border border-white/5 rounded-4xl p-8 flex flex-col gap-8 min-h-150">
          {isLoading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,280px))] gap-6 justify-center w-full">
              {Array.from({ length: 10 }, (_, i) => (
                <Skeleton key={i} className="h-80 w-full rounded-3xl bg-zinc-800/50" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-zinc-500 italic font-medium">
              Nenhum produto encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,280px))] gap-6 justify-center w-full">
              {products.map((p: any) => (
                <ProductCard key={p.id_produto} product={p} stats={stats[p.id_produto]} />
              ))}
            </div>
          )}

          {totalPaginas > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
              <p className="text-sm text-zinc-500 font-medium">
                Página <span className="text-emerald-500 font-bold">{pagina}</span> de <span className="text-zinc-300 font-bold">{totalPaginas}</span> ({totalItens} produtos)
              </p>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-white/5 bg-[#1a1a1a] hover:bg-zinc-800 text-zinc-400 transition-all hover:border-emerald-500/50 disabled:opacity-20 outline-none focus:ring-0"
                  onClick={() => setPagina(p => Math.max(1, p - 1))}
                  disabled={pagina === 1}
                >
                  <ChevronLeft size={18} />
                </Button>

                <div className="flex items-center justify-center min-w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-bold border border-emerald-500/20">
                  {pagina}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-white/5 bg-[#1a1a1a] hover:bg-zinc-800 text-zinc-400 transition-all hover:border-emerald-500/50 disabled:opacity-20 outline-none focus:ring-0"
                  onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                  disabled={pagina === totalPaginas}
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={(data) => {
          createProduct.mutate(data, { onSuccess: () => setFormOpen(false) })
        }}
        title="Novo Produto"
        loading={createProduct.isPending}
      />
    </div>
  )
}