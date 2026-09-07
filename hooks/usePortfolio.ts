import { useEffect, useState } from "react";
import { Portfolio } from "@/types/portfolio";
import { fetchMyPortfolio } from "@/utils/apiFunctions";

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

export const usePortfolio = (initial?: Portfolio) => {
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
        const portfolioData = response.data?.data || (response.data as any);

        if (portfolioData) {
          setPortfolio({
            ...defaults,
            ...portfolioData,
            links: { ...defaults.links, ...portfolioData.links },
          });
        }
      } catch (err: any) {
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
