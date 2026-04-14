import { Link, useLocation } from "react-router-dom";
import { LayoutGrid } from "lucide-react";

export function Header() {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">▶</span>
          </div>
          <div>
            <span className="font-bold text-foreground text-sm tracking-wide">GRUPO</span>
            <span className="font-bold text-foreground text-lg ml-1">VISAGIO</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <LayoutGrid size={16} />
            Catálogo
          </Link>
        </nav>
      </div>
    </header>
  );
}
