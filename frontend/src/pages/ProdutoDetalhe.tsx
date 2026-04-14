import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Edit, Trash2, Ruler, Weight,
  Star, TrendingUp, DollarSign, ShoppingCart, Maximize2, MessageSquare
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { useProduct, useProductStats, useProductReviews, useProductPerformance, useUpdateProduct, useDeleteProduct } from "@/hooks/useProdutos";
import { ProductForm } from "@/components/ProductForm";
import { StarRating } from "@/components/StarRating";


const TEAL    = "#00E5CC";
const CORAL   = "#FF6B6B";
const AMBER   = "#FFB547";
const VIOLET  = "#7C6FFF";

export default function ProdutoDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);

  const { data: product, isLoading } = useProduct(id!);
  const { data: stats } = useProductStats(id!);
  const { data: reviews } = useProductReviews(id!);
  const { data: performanceData } = useProductPerformance(id!);
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const ratingStats = useMemo(() => {
    if (!reviews) return { counts: [0, 0, 0, 0, 0], total: 0 };
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
      const idx = Math.floor(r.rating) - 1;
      if (idx >= 0 && idx < 5) counts[idx]++;
    });
    return { counts: [...counts].reverse(), total: reviews.length };
  }, [reviews]);

  const displayChartData = useMemo(() => {
    if (performanceData && performanceData.length > 0) return performanceData;
    return [];
  }, [performanceData]);

  if (isLoading) {
    return (
      <div className="h-screen bg-[#080808] flex justify-center items-center p-10">
        <Skeleton className="w-full h-full max-w-325 rounded-4xl bg-white/5" />
      </div>
    );
  }

  if (!product) return null;

  const statCards = [
    {
      icon: Star,
      label: "Avaliação",
      value: stats?.avg_rating?.toFixed(1) ?? "0.0",
      accent: AMBER,
      bg: "rgba(255,181,71,0.08)",
      border: "rgba(255,181,71,0.18)",
    },
    {
      icon: ShoppingCart,
      label: "Vendas",
      value: (stats?.total_sales ?? 0).toLocaleString('pt-BR'),
      accent: TEAL,
      bg: "rgba(0,229,204,0.08)",
      border: "rgba(0,229,204,0.18)",
    },
    {
      icon: DollarSign,
      label: "Receita",
      value: `R$ ${stats?.total_revenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) ?? '0,00'}`,
      accent: CORAL,
      bg: "rgba(255,107,107,0.08)",
      border: "rgba(255,107,107,0.18)",
    },
    {
      icon: TrendingUp,
      label: "Status",
      value: "Ativo",
      accent: VIOLET,
      bg: "rgba(124,111,255,0.08)",
      border: "rgba(124,111,255,0.18)",
    },
  ];

  const ratingBarColor = (starNum: number) => {
    if (starNum >= 4) return TEAL;
    if (starNum === 3) return AMBER;
    return CORAL;
  };

  return (
    <div className="h-screen w-screen bg-[#080808] p-4 lg:p-10 flex justify-center items-center overflow-hidden relative text-white font-sans">

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,229,204,0.25); }
        .stat-card { transition: transform 0.2s, box-shadow 0.2s; }
        .stat-card:hover { transform: translateY(-2px); }
      `}} />

      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          radial-gradient(circle at 10% 10%, rgba(0,229,204,0.18) 0%, transparent 35%),
          radial-gradient(circle at 90% 20%, rgba(124,111,255,0.15) 0%, transparent 35%),
          radial-gradient(circle at 80% 85%, rgba(255,107,107,0.10) 0%, transparent 30%)
        `,
        filter: 'blur(80px)',
        opacity: 0.6,
      }} />

      <div className="relative w-full max-w-362.5 h-full max-h-220 bg-white/[0.04] backdrop-blur-[60px] border border-white/10 rounded-[48px] p-6 lg:p-10 shadow-[0_30px_120px_rgba(0,0,0,0.7)] flex flex-col gap-6 overflow-hidden">

        <div className="flex justify-between items-center pb-2 shrink-0">
          <div className="flex items-center gap-4">
            <Button
              variant="outline" size="icon"
              onClick={() => navigate("/")}
              className="rounded-full h-10 w-10 bg-black/30 border-white/10 hover:bg-white/10 text-white"
            >
              <ArrowLeft size={18} />
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight">{product.nome_produto}</h1>
              <Badge style={{ background: `${TEAL}18`, color: TEAL, borderColor: `${TEAL}30` }}
                className="uppercase text-[10px] font-black h-5 tracking-widest px-3 border">
                {product.categoria_produto || "Geral"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setEditOpen(true)}
              style={{ background: TEAL, color: "#002424", boxShadow: `0 4px 20px ${TEAL}40` }}
              className="hover:opacity-90 font-black rounded-full px-6 h-10 text-xs gap-2 transition-all"
            >
              <Edit size={14} /> Editar
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon"
                  className="rounded-full h-10 w-10 border-white/10 bg-black/30 hover:bg-red-500/20 hover:text-red-400 transition-all text-white">
                  <Trash2 size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#0d0d0d]/95 backdrop-blur-2xl border-white/10 text-white rounded-[32px]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-black uppercase tracking-tight">Remover Produto</AlertDialogTitle>
                  <AlertDialogDescription className="text-white/50 text-sm">Esta ação é definitiva e não pode ser desfeita.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-2xl border-white/10 bg-white/5 text-white text-xs font-bold border">Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="rounded-2xl bg-red-600 hover:bg-red-700 font-bold text-xs"
                    onClick={() => deleteProduct.mutate(product.id_produto, { onSuccess: () => navigate("/") })}>
                    Excluir produto
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          {statCards.map((stat, i) => (
            <div key={i} className="stat-card rounded-[28px] p-5 flex flex-col justify-center"
              style={{ background: stat.bg, border: `1px solid ${stat.border}` }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.label}</p>
                <stat.icon size={16} style={{ color: stat.accent }} />
              </div>
              <p className="text-2xl font-black tracking-tighter" style={{ color: stat.accent }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">

          <Card className="lg:col-span-4 bg-black/20 border-none rounded-[40px] p-8 flex flex-col justify-center backdrop-blur-sm text-white">
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Preço médio</p>
                <div className="text-5xl font-black tracking-tighter" style={{ color: TEAL }}>
                  R$ {stats?.total_sales && stats?.total_revenue
                    ? (stats.total_revenue / stats.total_sales).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                    : '0,00'}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Dimensões e Peso</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Ruler, label: "Largura", value: `${product.largura_centimetros || '0'} cm`, color: TEAL },
                    { icon: Ruler, label: "Altura", value: `${product.altura_centimetros || '0'} cm`, color: VIOLET },
                    { icon: Ruler, label: "Profund.", value: `${product.comprimento_centimetros || '0'} cm`, color: AMBER },
                    { icon: Weight, label: "Peso", value: `${(product.peso_produto_gramas / 1000).toFixed(2)} kg`, color: CORAL },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1 p-3 rounded-2xl"
                      style={{ background: `${item.color}0d`, border: `1px solid ${item.color}20` }}>
                      <span className="text-[9px] font-black uppercase" style={{ color: `${item.color}80` }}>{item.label}</span>
                      <span className="text-xs font-black flex items-center gap-1.5" style={{ color: item.color }}>
                        <item.icon size={11} /> {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-8 flex flex-col gap-6 h-full min-h-0">

            <Card className="h-[40%] bg-black/20 border-none rounded-[40px] p-8 flex flex-col backdrop-blur-sm shrink-0">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2 mb-4 shrink-0">
                <TrendingUp size={14} style={{ color: TEAL }} /> Evolução de Vendas
              </p>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="99%">
                  <AreaChart data={displayChartData}>
                    <defs>
                      <linearGradient id="gradTeal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={TEAL} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff06" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false}
                      tick={{ fill: '#555', fontSize: 10, fontWeight: 700 }} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0d1a1a', border: `1px solid ${TEAL}30`, borderRadius: '16px', fontSize: '11px', color: '#fff' }}
                      cursor={{ stroke: `${TEAL}40`, strokeWidth: 1 }}
                    />
                    <Area type="monotone" dataKey="total" stroke={TEAL} strokeWidth={3}
                      fillOpacity={1} fill="url(#gradTeal)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">

              <Card className="bg-black/20 border-none rounded-[40px] p-8 flex flex-col backdrop-blur-sm overflow-hidden h-full">
                <div className="flex items-center justify-between mb-6 shrink-0">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Avaliações</p>
                  <div className="text-right">
                    <p className="text-3xl font-black leading-none mb-1" style={{ color: AMBER }}>
                      {stats?.avg_rating?.toFixed(1) || "0.0"}
                    </p>
                    <StarRating rating={stats?.avg_rating || 0} size={10} />
                  </div>
                </div>
                <div className="flex-1 space-y-2.5 overflow-y-auto pr-1 custom-scroll">
                  {ratingStats.counts.map((count, i) => {
                    const starNum = 5 - i;
                    const pct = ratingStats.total > 0 ? (count / ratingStats.total) * 100 : 0;
                    const color = ratingBarColor(starNum);
                    return (
                      <div key={starNum} className="flex items-center gap-3">
                        <span className="text-[10px] font-black w-4 text-right" style={{ color: `${color}80` }}>{starNum}★</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}60` }} />
                        </div>
                        <span className="text-[10px] font-bold text-white/30 w-5 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="bg-black/20 border-none rounded-[40px] p-8 flex flex-col backdrop-blur-sm overflow-hidden h-full">
                <div className="flex items-center justify-between mb-5 shrink-0">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Feedbacks</p>
                  <button
                    onClick={() => setReviewsOpen(true)}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full transition-all"
                    style={{ color: TEAL, background: `${TEAL}15`, border: `1px solid ${TEAL}25` }}
                  >
                    <Maximize2 size={11} /> Ver todos
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scroll">
                  {reviews?.slice(0, 3).map((r, i) => (
                    <div key={i} className="p-4 rounded-[18px] transition-all"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-black text-white/70 uppercase truncate">{r.customer_name}</span>
                        <StarRating rating={r.rating} size={8} />
                      </div>
                      <p className="text-[11px] text-white/35 italic leading-snug line-clamp-2">"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              </Card>

            </div>
          </div>
        </div>

        <Dialog open={reviewsOpen} onOpenChange={setReviewsOpen}>
          <DialogContent className="max-w-xl border-0 text-white p-0 overflow-hidden rounded-[40px] shadow-2xl"
            style={{ background: '#0a0f0f' }}>

            <div className="relative p-8 pb-6 overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${TEAL}18 0%, transparent 60%)`, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${TEAL}15 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }} />
              <DialogHeader>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-2xl flex items-center justify-center"
                    style={{ background: `${TEAL}20`, border: `1px solid ${TEAL}30` }}>
                    <MessageSquare size={15} style={{ color: TEAL }} />
                  </div>
                  <DialogTitle className="text-xl font-black tracking-tight text-white">Feedbacks dos Clientes</DialogTitle>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs font-bold text-white/40">{reviews?.length || 0} avaliações</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black" style={{ color: AMBER }}>
                      {stats?.avg_rating?.toFixed(1) || '0.0'}
                    </span>
                    <StarRating rating={stats?.avg_rating || 0} size={10} />
                  </div>

                  <div className="flex items-end gap-0.5 h-5 ml-auto">
                    {[...ratingStats.counts].reverse().map((count, i) => {
                      const starNum = i + 1;
                      const maxCount = Math.max(...ratingStats.counts, 1);
                      const h = Math.max(4, (count / maxCount) * 20);
                      return (
                        <div key={starNum} className="w-3 rounded-sm transition-all"
                          style={{ height: `${h}px`, background: ratingBarColor(starNum), opacity: 0.7 }} />
                      );
                    })}
                  </div>
                </div>
              </DialogHeader>
            </div>

            <div className="overflow-y-auto custom-scroll p-6 pt-5 space-y-3 max-h-[55vh]">
              {reviews?.map((r, i) => (
                <div key={i} className="group p-5 rounded-[24px] transition-all duration-200 cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = `${TEAL}30`)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      {/* Avatar inicial */}
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                        style={{
                          background: [TEAL, VIOLET, AMBER, CORAL][i % 4] + '25',
                          color: [TEAL, VIOLET, AMBER, CORAL][i % 4],
                          border: `1px solid ${[TEAL, VIOLET, AMBER, CORAL][i % 4]}30`,
                        }}>
                        {(r.customer_name || 'C')[0].toUpperCase()}
                      </div>
                      <div>
                        <span className="text-[11px] font-black text-white/80 uppercase tracking-wide block leading-tight">
                          {r.customer_name || 'Consumidor'}
                        </span>
                        <span className="text-[9px] text-white/25 font-bold uppercase tracking-wider">Comprador verificado</span>
                      </div>
                    </div>
                    <StarRating rating={r.rating} size={10} />
                  </div>
                  <p className="text-[12px] text-white/45 italic leading-relaxed">"{r.comment}"</p>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Nota geral do produto</span>
              <div className="flex items-center gap-2">
                <StarRating rating={stats?.avg_rating || 0} size={12} />
                <span className="text-sm font-black" style={{ color: AMBER }}>
                  {stats?.avg_rating?.toFixed(1) || '0.0'} / 5
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <ProductForm
          open={editOpen}
          onOpenChange={setEditOpen}
          onSubmit={(data) => updateProduct.mutate({ id: product.id_produto, ...data }, { onSuccess: () => setEditOpen(false) })}
          defaultValues={product}
          title="Editar Produto"
          loading={updateProduct.isPending}
        />
      </div>
    </div>
  );
}