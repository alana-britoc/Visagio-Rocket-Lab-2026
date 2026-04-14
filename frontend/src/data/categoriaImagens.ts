export const mapeamentoCategorias: Record<string, { label: string; image: string }> = {
  "informatica_acessorios": { label: "Informática", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800" },
  "pcs": { label: "Computadores", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800" },
  "pc_gamer": { label: "PC Gamer", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800" },
  "consoles_games": { label: "Games", image: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&q=80&w=800" },
  "eletronicos": { label: "Eletrônicos", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800" },
  "telefonia": { label: "Smartphones", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800" },
  "audio": { label: "Áudio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800" },
  "moveis_decoracao": { label: "Decoração", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800" },
  "moveis_sala": { label: "Sala de Estar", image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=800" },
  "moveis_quarto": { label: "Móveis de Quarto", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800" },  "moveis_de_quarto": { label: "Móveis de Quarto", image: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800" },
  "moveis_cozinha_jantar_jardim": { label: "Cozinha & Jantar", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800" },
  "cama_mesa_banho": { label: "Cama & Banho", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800" },
  "automotivo": { label: "Automotivo", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800" },
  "cool_stuff": { label: "Cool Stuff", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800" },
  "pet_shop": { label: "Pet Shop", image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800" },
  "brinquedos": { label: "Brinquedos", image: "https://images.unsplash.com/photo-1537735319906-aba88362c4b0?auto=format&fit=crop&q=80&w=800" },
  "beleza_saude": { label: "Beleza & Saúde", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800" },
  "alimentos": { label: "Alimentos", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" },
  "default": { label: "Geral", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800" }
};

export const getCategoryData = (cat: string) => {
  if (!cat) return mapeamentoCategorias["default"];

  const normalizar = (s: string) => s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, '_');

  const key = normalizar(cat);

  if (mapeamentoCategorias[key]) {
    return mapeamentoCategorias[key];
  }

  const porLabel = Object.values(mapeamentoCategorias).find(
    (item) => normalizar(item.label) === key
  );

  return porLabel || mapeamentoCategorias["default"];
};

export default getCategoryData;