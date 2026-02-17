import { Redirect } from "expo-router";

// later → replace with API check
const hasPortfolio = true;

export default function PortfolioIndex() {
  return (
    <Redirect href={hasPortfolio ? "/portfolio/view" : "/portfolio/create"} />
  );
}
