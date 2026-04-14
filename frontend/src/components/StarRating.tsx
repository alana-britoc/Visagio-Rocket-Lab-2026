import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
}

export function StarRating({ rating, max = 5, size = 16 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(rating) 
              ? "fill-yellow-500 text-yellow-500" 
              : "fill-transparent text-zinc-600"
          }
        />
      ))}
    </div>
  );
}