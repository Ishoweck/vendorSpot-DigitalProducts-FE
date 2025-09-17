"use client";

import ProductDetail from "@/components/products/ProductDetail";
import { useParams } from "next/navigation";

export default function ProductDetailPageStub() {
  const params = useParams();
  console.log("params:", params);
  return <ProductDetail/>;
}
