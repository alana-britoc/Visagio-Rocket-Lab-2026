import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Edit, Trash2, Package, Ruler, Weight, 
  Star, TrendingUp, DollarSign, ShoppingCart
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { useProduct, useProductStats, useProductReviews, useProductPerformance, useUpdateProduct, useDeleteProduct } from "@/hooks/useProdutos";
import { ProductForm } from "@/components/ProductForm";
import { StarRating } from "@/components/StarRating";
import { categoriaImagens } from "@/data/categoriaImagens";

export default function ProdutoDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);

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
    return [
      { name: 'Dom', total: 0 }, { name: 'Seg', total: 0 },
      { name: 'Ter', total: 0 }, { name: 'Qua', total: 0 },
      { name: 'Qui', total: 0 }, { name: 'Sex', total: 0 },
      { name: 'Sab', total: 0 }
    ];
  }, [performanceData]);

  const imageUrl = product?.category 
    ? categoriaImagens[product.category as keyof typeof categoriaImagens] 
    : null;

  if (isLoading) {
    return (
      <div className="h-screen bg-[#001A1A] flex justify-center items-center p-10">
        <Skeleton className="w-full h-full max-w-[1300px] rounded-[48px] bg-white/5" />
      </div>
    );
  }

  if (!product) return null;

  const statCards = [
    { icon: Star, label: "Avaliação", value: stats?.avg_rating?.toFixed(1) ?? "—", color: "text-yellow-400" },
    { icon: ShoppingCart, label: "Vendas", value: stats?.total_sales ?? 0, color: "text-[#00E5CC]" },
    { icon: DollarSign, label: "Receita", value: `R$ ${stats?.total_revenue?.toLocaleString('pt-BR') ?? '0,00'}`, color: "text-[#00E5CC]" },
    { icon: TrendingUp, label: "Status", value: "Ativo", color: "text-[#00E5CC]" },
  ];

  return (
    <div className="h-screen w-screen bg-[#080808] p-4 lg:p-10 flex justify-center items-center overflow-hidden relative">
      
      <div className="absolute inset-0 opacity-40"
           style={{
             backgroundImage: `
               radial-gradient(circle at 15% 15%, rgba(0, 229, 204, 0.4) 0%, transparent 35%),
               radial-gradient(circle at 85% 25%, rgba(0, 128, 128, 0.5) 0%, transparent 40%),
               radial-gradient(circle at 50% 85%, rgba(0, 229, 204, 0.2) 0%, transparent 45%)
             `,
             filter: 'blur(100px)'
           }} />

      <div className="relative w-full max-w-[1450px] h-full max-h-[880px] bg-white/5 backdrop-blur-[60px] border border-white/10 rounded-[48px] p-6 lg:p-10 shadow-[0_30px_120px_rgba(0,0,0,0.7)] flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-700">
        
        <div className="flex justify-between items-center pb-2">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/")} 
              className="rounded-full h-10 w-10 bg-black/30 border-white/10 hover:bg-black/50 transition-colors"
            >
              <ArrowLeft size={18} />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight text-white">{product.name}</h1>
                <Badge className="bg-[#00E5CC]/10 text-[#00E5CC] border-[#00E5CC]/20 uppercase text-[10px] font-black h-5 tracking-widest px-3">
                  {product.category || "Geral"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setEditOpen(true)} 
              className="bg-[#00E5CC] hover:bg-[#00CDB8] text-[#002424] font-black rounded-full px-6 h-10 text-xs gap-2 shadow-lg shadow-[#00E5CC]/20 transition-all"
            >
              <Edit size={14} /> Editar
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-white/10 bg-black/30 hover:bg-red-500/20 hover:text-red-500 transition-all">
                  <Trash2 size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#002424]/95 backdrop-blur-2xl border-white/10 text-white rounded-[32px]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-black uppercase tracking-tight">Remover Produto</AlertDialogTitle>
                  <AlertDialogDescription className="text-white/60 text-sm">Esta ação é definitiva e apagará todos os registros deste item.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-2xl border-white/10 bg-white/5 text-white">Cancelar</AlertDialogCancel>
                  <AlertDialogAction className="rounded-2xl bg-red-600 hover:bg-red-700" onClick={() => deleteProduct.mutate(product.id, { onSuccess: () => navigate("/") })}>
                    Excluir permanentemente
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[28px] p-5 flex flex-col justify-center hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.label}</p>
                <stat.icon size={16} className={`${stat.color} group-hover:scale-110 transition-transform`} />
              </div>
              <p className="text-2xl font-black text-white tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          
          <Card className="lg:col-span-4 bg-black/20 border border-white/5 rounded-[40px] p-6 flex flex-col min-h-0 backdrop-blur-sm">
            <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Especificações e Imagem</h2>
            <div className="flex-1 min-h-0 rounded-[32px] overflow-hidden bg-black/40 border border-white/5 mb-6 relative group">
              {imageUrl ? (
                <img src={imageUrl} alt={product.name} className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <Package className="h-16 w-16 text-white/5" />
              )}
            </div>
            
            <div className="space-y-5">
              <div className="text-3xl font-black text-[#00E5CC] tracking-tighter leading-none">
                R$ {Number(product.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 text-[11px] font-bold text-white/50 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <Ruler size={14} className="text-[#00E5CC]/60" /> {product.width || '—'} cm (L)
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-white/50 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <Ruler size={14} className="text-[#00E5CC]/60" /> {product.height || '—'} cm (A)
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-white/50 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <Ruler size={14} className="text-[#00E5CC]/60" /> {product.depth || '—'} cm (P)
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-white/50 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <Weight size={14} className="text-[#00E5CC]/60" /> {product.weight || '—'} kg
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
            <Card className="h-[42%] bg-black/20 border border-white/5 rounded-[40px] p-8 flex flex-col backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#00E5CC]" /> Fluxo de Performance
                </h2>
                <Badge variant="outline" className="border-white/10 text-white/20 text-[9px] font-bold">LIVE DATA</Badge>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displayChartData}>
                    <defs>
                      <linearGradient id="colorVisagio" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E5CC" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#00E5CC" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#555', fontSize: 10, fontWeight: 700}} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#002424', border: 'none', borderRadius: '16px', fontSize: '11px', fontWeight: 700, boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}
                    />
                    <Area type="monotone" dataKey="total" stroke="#00E5CC" strokeWidth={4} fillOpacity={1} fill="url(#colorVisagio)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="h-[58%] grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
              <Card className="bg-black/20 border border-white/5 rounded-[40px] p-8 flex flex-col min-h-0 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Rating Geral</h2>
                  <div className="text-right">
                    <p className="text-3xl font-black text-yellow-400 leading-none mb-1">{stats?.avg_rating?.toFixed(1) || "0.0"}</p>
                    <StarRating rating={stats?.avg_rating || 0} size={10} />
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  {ratingStats.counts.map((count, i) => {
                    const starNum = 5 - i;
                    const percentage = ratingStats.total > 0 ? (count / ratingStats.total) * 100 : 0;
                    return (
                      <div key={starNum} className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-white/20 w-4">{starNum}★</span>
                        <Progress value={percentage} className="h-1.5 bg-black/40" />
                        <span className="text-[10px] font-bold text-white/30 w-5 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="bg-black/20 border border-white/5 rounded-[40px] p-8 flex flex-col min-h-0 backdrop-blur-sm">
                <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-6">Comentários Recentes</h2>
                <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar space-y-4">
                  {!reviews?.length ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-20">
                      <Package size={32} className="mb-2" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Sem feedbacks</p>
                    </div>
                  ) : (
                    reviews.map((r, i) => (
                      <div key={i} className="p-5 rounded-[24px] bg-black/20 border border-white/5 hover:border-[#00E5CC]/20 transition-all group">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-white uppercase tracking-tight truncate max-w-[120px]">{r.customer_name}</span>
                          <StarRating rating={r.rating} size={8} />
                        </div>
                        <p className="text-[11px] text-white/40 italic leading-relaxed line-clamp-2 mb-3">"{r.comment || "Sem comentário disponível."}"</p>
                        <p className="text-[9px] font-black text-white/10 uppercase tracking-widest">
                          {format(parseISO(r.created_at), "dd MMM yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>

        </div>

        <ProductForm 
          open={editOpen} 
          onOpenChange={setEditOpen} 
          onSubmit={(data) => {
            updateProduct.mutate({ id: product.id, ...data }, { onSuccess: () => setEditOpen(false) });
          }} 
          defaultValues={product} 
          title="Editar Produto" 
          loading={updateProduct.isPending} 
        />
      </div>
    </div>
  );
}