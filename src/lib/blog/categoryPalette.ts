export interface CategoryAccent {
  primary: string;
  soft: string;
  border: string;
  gradient: string;
}

const PALETTE: Record<string, CategoryAccent> = {
  architecture: {
    primary: "#5eead4",
    soft: "rgba(94, 234, 212, 0.12)",
    border: "rgba(94, 234, 212, 0.22)",
    gradient:
      "radial-gradient(circle at 14% 20%, rgba(94, 234, 212, 0.24), transparent 38%), radial-gradient(circle at 84% 14%, rgba(96, 165, 250, 0.22), transparent 32%)",
  },
  "field notes": {
    primary: "#fbbf24",
    soft: "rgba(251, 191, 36, 0.12)",
    border: "rgba(251, 191, 36, 0.22)",
    gradient:
      "radial-gradient(circle at 16% 18%, rgba(251, 191, 36, 0.22), transparent 36%), radial-gradient(circle at 82% 16%, rgba(245, 158, 11, 0.18), transparent 30%)",
  },
  launch: {
    primary: "#a78bfa",
    soft: "rgba(167, 139, 250, 0.12)",
    border: "rgba(167, 139, 250, 0.22)",
    gradient:
      "radial-gradient(circle at 14% 20%, rgba(167, 139, 250, 0.22), transparent 36%), radial-gradient(circle at 84% 14%, rgba(139, 92, 246, 0.18), transparent 30%)",
  },
  product: {
    primary: "#fb7185",
    soft: "rgba(251, 113, 133, 0.12)",
    border: "rgba(251, 113, 133, 0.22)",
    gradient:
      "radial-gradient(circle at 16% 18%, rgba(251, 113, 133, 0.22), transparent 36%), radial-gradient(circle at 82% 16%, rgba(244, 63, 94, 0.18), transparent 30%)",
  },
  engineering: {
    primary: "#38bdf8",
    soft: "rgba(56, 189, 248, 0.12)",
    border: "rgba(56, 189, 248, 0.22)",
    gradient:
      "radial-gradient(circle at 14% 20%, rgba(56, 189, 248, 0.22), transparent 36%), radial-gradient(circle at 84% 14%, rgba(14, 165, 233, 0.18), transparent 30%)",
  },
};

const DEFAULT_ACCENT: CategoryAccent = {
  primary: "#5eead4",
  soft: "rgba(94, 234, 212, 0.12)",
  border: "rgba(94, 234, 212, 0.22)",
  gradient:
    "radial-gradient(circle at 14% 18%, rgba(94, 234, 212, 0.18), transparent 34%), radial-gradient(circle at 82% 16%, rgba(167, 139, 250, 0.16), transparent 28%)",
};

export function getCategoryAccent(category: string): CategoryAccent {
  const key = category.toLowerCase();
  return PALETTE[key] || DEFAULT_ACCENT;
}
