// hooks/usePortfolio.ts
import { useState } from "react";
import { Portfolio } from "../types/portfolio";

export const usePortfolio = (initial?: Portfolio) => {
  const defaults: Portfolio = {
    name: "",
    profession: "",
    bio: "",
    services: [],
    skills: [],
    gallery: [],
    links: {},
  };

  const [portfolio, setPortfolio] = useState<Portfolio>({
    ...defaults,
    ...initial,
  });

  return { portfolio, setPortfolio };
};
