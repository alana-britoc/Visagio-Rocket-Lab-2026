import { useNavigate } from "react-router-dom";
import { Package, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";
import getCategoryData from '@/data/categoriaImagens';
interface ProductCardProps {
  product: {
    id_produto: string;
    nome_produto: string;
    categoria_produto: string;
  };
  stats?: {
    avg_rating: number | null;
    review_count: number;
    total_sales: number;
    total_revenue: number;
  };
}

export function ProductCard({ product, stats }: ProductCardProps) {
  const navigate = useNavigate();
  const categoryData = getCategoryData(product.categoria_produto);

  return (
    <Card
      className="visagio-card-hover cursor-pointer border-border bg-card overflow-hidden transition-all duration-300 hover:ring-1 hover:ring-orange-500/50"
      onClick={() => navigate(`/produtos/${product.id_produto}`)}
    >
      <div className="aspect-4/3 bg-secondary flex items-center justify-center overflow-hidden">
        {categoryData?.image ? (
          <img
            src={categoryData.image}
            alt={categoryData.label}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <Package className="h-12 w-12 text-muted-foreground" />
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground line-clamp-1">
            {product.nome_produto}
          </h3>
        </div>

        {categoryData?.label && (
          <Badge
            variant="outline"
            className="text-[10px] uppercase tracking-wider border-orange-500/30 text-orange-600 bg-orange-500/5"
          >
            {categoryData.label}
          </Badge>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          {stats ? (
            <>
              <div className="flex items-center gap-1.5 pt-2">
                {stats.avg_rating !== null ? (
                  <>
                    <StarRating rating={stats.avg_rating} size={13} />
                    <span className="text-[11px] text-zinc-500">
                      ({stats.review_count})
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] text-zinc-500 uppercase tracking-tighter">
                    Sem avaliações
                  </span>
                )}
              </div>
              {stats.total_sales > 0 && (
                <div className="flex items-center gap-1 text-[11px] font-medium text-green-500 pt-2">
                  <TrendingUp size={12} />
                  {stats.total_sales} vendas
                </div>
              )}
            </>
          ) : (
            <div className="h-4 w-full bg-white/5 animate-pulse rounded mt-2" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;