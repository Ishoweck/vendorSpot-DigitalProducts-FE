import { useEffect, useState } from "react";
import FullScreenLoader from "../../../components/Loader";
import ProductsPage from "./ProductPage";

export default function YourComponent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay (e.g., fetching data, verifying token, etc.)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <FullScreenLoader />;

  return <ProductsPage />;
}
