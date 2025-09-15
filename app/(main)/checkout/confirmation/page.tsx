'use client';

import { useEffect, useState } from "react";
import FullScreenLoader from "../../../../components/Loader";
// import ProductsPage from "./ProductPage";
import CheckoutConfirmationPage from "./CheckOutPage";

export default function YourComponent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay (e.g., fetching data, verifying token, etc.)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <FullScreenLoader />;

  return <CheckoutConfirmationPage />;
}
