export type CountryData = {
  name: string;
  code: string;
  flag: string;
  cca2: string;
};

export const fetchCountries = async (): Promise<CountryData[]> => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,idd,cca2,flag",
    );
    const data = await response.json();

    const formatted: CountryData[] = data
      .map((c: any) => {
        const root = c.idd?.root || "";
        const suffix = c.idd?.suffixes?.[0] || "";
        return {
          name: c.name?.common || "",
          code: root + suffix,
          flag: c.flag || "",
          cca2: c.cca2 || "",
        };
      })
      .filter((c: CountryData) => c.code)
      .sort((a: CountryData, b: CountryData) => a.name.localeCompare(b.name));

    return formatted;
  } catch (error) {
    console.error("Failed to fetch countries", error);
    return [];
  }
};
