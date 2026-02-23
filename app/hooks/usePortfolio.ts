// hooks/usePortfolio.ts
import { useEffect, useState } from "react";
import { Portfolio } from "../types/portfolio";
import { fetchMyPortfolio } from "../utils/apiFunctions";

export const usePortfolio = (initial?: Portfolio) => {
  const defaults: Portfolio = {
    name: "",
    profession: "",
    bio: "",
    location: "",
    contact: {
      countryCode: "",
      phone: "",
    },
    email: "",
    services: [],
    skills: [],
    experience: [] as any[],
    gallery: [],
    links: {},
  };

  const [portfolio, setPortfolio] = useState<Portfolio>({
    ...defaults,
    ...initial,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setLoading(true);
        const response = await fetchMyPortfolio();
        const portfolioData = response.data.data; // The API returns { success: true, data: { ... } }

        if (portfolioData) {
          setPortfolio({
            ...defaults,
            ...portfolioData,
            links: { ...defaults.links, ...portfolioData.links },
          });
        }
      } catch (err: any) {
        // If 404, it might just mean the user doesn't have a portfolio yet
        if (err.response?.status !== 404) {
          setError(err.message || "Failed to fetch portfolio");
        }
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, []);

  return { portfolio, setPortfolio, loading, error };
};
