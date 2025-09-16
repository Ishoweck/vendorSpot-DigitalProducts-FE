"use client";

import { useParams } from "next/navigation";
export default function ProductDetailPage() {
  return <h1>This is ProductDetailPage. Param id: {useParams().id}</h1>;
}
