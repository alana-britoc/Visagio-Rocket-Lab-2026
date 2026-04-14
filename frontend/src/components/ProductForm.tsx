import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { X, Package, Tag, Weight, Ruler, ChevronDown, Loader2, Check, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useCategories } from "@/hooks/useProdutos";
import type { ProdutoCreate } from "@/types/produto";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProdutoCreate) => void;
  defaultValues?: Partial<ProdutoCreate>;
  title: string;
  loading?: boolean;
}

const inputClass =
  "bg-zinc-900/80 border border-white/[0.07] rounded-xl h-10 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-0 focus-visible:border-emerald-500/30 transition-all text-sm font-medium";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold tracking-widest text-zinc-500 uppercase mb-2">
      {children}
    </label>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase whitespace-nowrap">{children}</span>
      <div className="flex-1 h-px bg-white/[0.04]" />
    </div>
  );
}

export function ProductForm({ open, onOpenChange, onSubmit, defaultValues, title, loading }: ProductFormProps) {
  const { data: categorias } = useCategories();
  const [catQuery, setCatQuery] = useState(defaultValues?.categoria_produto || "");
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<ProdutoCreate>({
    defaultValues: {
      nome_produto: defaultValues?.nome_produto || "",
      categoria_produto: defaultValues?.categoria_produto || "",
      peso_produto_gramas: defaultValues?.peso_produto_gramas ?? undefined,
      comprimento_centimetros: defaultValues?.comprimento_centimetros ?? undefined,
      altura_centimetros: defaultValues?.altura_centimetros ?? undefined,
      largura_centimetros: defaultValues?.largura_centimetros ?? undefined,
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
      setCatQuery(defaultValues?.categoria_produto || "");
      setCatOpen(false);
    }
  }, [open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredCats = (categorias || []).filter(
    (c: string) => c && c.trim() !== "" && c.toLowerCase().includes(catQuery.toLowerCase())
  );

  const isNew =
    catQuery.trim() !== "" &&
    !filteredCats.some((c: string) => c.toLowerCase() === catQuery.toLowerCase());

  function selectCategory(cat: string) {
    setCatQuery(cat);
    setValue("categoria_produto", cat);
    setCatOpen(false);
  }

  function handleCatInput(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setCatQuery(v);
    setValue("categoria_produto", v);
    setCatOpen(true);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0d0d0d] border border-white/[0.06] rounded-3xl p-0 max-w-xl w-full shadow-2xl shadow-black/70 gap-0 outline-none [&>button]:hidden">

        <div className="relative px-8 pt-8 pb-6 border-b border-white/[0.05]">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.05] via-transparent to-transparent pointer-events-none rounded-t-3xl" />
          <div className="absolute -top-16 -right-16 w-52 h-52 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />

          <DialogHeader className="space-y-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Package size={18} className="text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight leading-tight">{title}</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Preencha os dados do produto abaixo</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-zinc-500 hover:text-zinc-200 transition-all"
              >
                <X size={14} />
              </button>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-7 space-y-7">

          <div>
            <SectionTitle>Identificação</SectionTitle>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Nome do Produto *</FieldLabel>
                <Input
                  {...register("nome_produto", { required: true })}
                  placeholder="Ex: Camiseta Preta M"
                  className={inputClass}
                />
                {errors.nome_produto && (
                  <p className="mt-1.5 text-[11px] text-red-400 font-medium">Campo obrigatório</p>
                )}
              </div>

              <div>
                <FieldLabel>Categoria *</FieldLabel>
                <input type="hidden" {...register("categoria_produto", { required: true })} />
                <div className="relative" ref={catRef}>
                  <div
                    className={`relative flex items-center bg-zinc-900/80 border rounded-xl h-10 px-3 cursor-text transition-all ${
                      catOpen
                        ? "border-emerald-500/30 ring-1 ring-emerald-500/50"
                        : errors.categoria_produto
                        ? "border-red-500/40"
                        : "border-white/[0.07] hover:border-white/[0.12]"
                    }`}
                    onClick={() => setCatOpen(true)}
                  >
                    <Tag size={13} className="text-zinc-600 shrink-0 mr-2" />
                    <input
                      className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none font-medium min-w-0"
                      placeholder="Selecionar ou criar..."
                      value={catQuery}
                      onChange={handleCatInput}
                      onFocus={() => setCatOpen(true)}
                    />
                    <ChevronDown
                      size={13}
                      className={`shrink-0 text-zinc-600 transition-transform duration-200 ${catOpen ? "rotate-180 text-emerald-400" : ""}`}
                    />
                  </div>

                  {catOpen && (
                    <div className="absolute z-50 mt-1.5 w-full bg-[#131313] border border-white/[0.07] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
                      {filteredCats.length > 0 && (
                        <div className="p-1.5">
                          <p className="px-3 py-1.5 text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
                            Existentes
                          </p>
                          <div className="max-h-40 overflow-y-auto">
                            {filteredCats.map((cat: string) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => selectCategory(cat)}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-zinc-300 hover:bg-white/[0.05] hover:text-white transition-all text-left"
                              >
                                <span className="truncate">{cat.replace(/_/g, " ")}</span>
                                {catQuery.toLowerCase() === cat.toLowerCase() && (
                                  <Check size={13} className="text-emerald-400 shrink-0" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {isNew && (
                        <>
                          {filteredCats.length > 0 && <div className="mx-3 h-px bg-white/[0.05]" />}
                          <div className="p-1.5">
                            <button
                              type="button"
                              onClick={() => selectCategory(catQuery.trim())}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-emerald-400 hover:bg-emerald-500/10 transition-all text-left"
                            >
                              <div className="w-5 h-5 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                <Plus size={11} />
                              </div>
                              <span>
                                Criar <span className="font-bold">"{catQuery.trim()}"</span>
                              </span>
                            </button>
                          </div>
                        </>
                      )}

                      {filteredCats.length === 0 && !isNew && (
                        <div className="px-4 py-5 text-center text-xs text-zinc-600 font-medium">
                          Digite para criar uma nova categoria
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {errors.categoria_produto && (
                  <p className="mt-1.5 text-[11px] text-red-400 font-medium">Campo obrigatório</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <SectionTitle>Dimensões & Peso</SectionTitle>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <FieldLabel>Largura (cm)</FieldLabel>
                <div className="relative">
                  <Ruler size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                  <Input
                    {...register("largura_centimetros", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
                    type="number"
                    step="0.01"
                    placeholder="0"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Altura (cm)</FieldLabel>
                <div className="relative">
                  <Ruler size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                  <Input
                    {...register("altura_centimetros", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
                    type="number"
                    step="0.01"
                    placeholder="0"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Comprimento (cm)</FieldLabel>
                <div className="relative">
                  <Ruler size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                  <Input
                    {...register("comprimento_centimetros", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
                    type="number"
                    step="0.01"
                    placeholder="0"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Peso (g)</FieldLabel>
                <div className="relative">
                  <Weight size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                  <Input
                    {...register("peso_produto_gramas", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
                    type="number"
                    placeholder="0"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1 border-t border-white/[0.05]">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-10 px-5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-zinc-200 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-10 px-6 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Produto"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}