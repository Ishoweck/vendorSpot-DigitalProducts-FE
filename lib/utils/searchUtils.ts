import { Product } from "@/types/product";

export interface SearchResult {
  type: "product" | "category" | "vendor";
  id: string;
  name: string;
  description?: string;
  url: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const searchProducts = async (query: string): Promise<SearchResult[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products?search=${encodeURIComponent(query)}&limit=5`);
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data.map((product: Product) => ({
        type: "product" as const,
        id: product._id,
        name: product.name,
        description: product.description,
        url: `/products/${product._id}`
      }));
    }
    return [];
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

export const searchCategories = async (query: string): Promise<SearchResult[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data
        .filter((category: Category) => 
          category.name.toLowerCase().includes(query.toLowerCase())
        )
        .map((category: Category) => ({
          type: "category" as const,
          id: category._id,
          name: category.name,
          description: category.description,
          url: `/products?category=${category.slug}`
        }));
    }
    return [];
  } catch (error) {
    console.error("Error searching categories:", error);
    return [];
  }
};

export const searchVendors = async (query: string): Promise<SearchResult[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products?vendor=${encodeURIComponent(query)}&limit=5`);
    const data = await response.json();
    
    if (data.success && data.data) {
      const vendors = new Map<string, SearchResult>();
      
      data.data.forEach((product: Product) => {
        const vendorName = typeof product.vendorId === 'object' 
          ? product.vendorId.businessName 
          : product.vendorId;
          
        if (vendorName && !vendors.has(vendorName)) {
          vendors.set(vendorName, {
            type: "vendor" as const,
            id: vendorName,
            name: vendorName,
            description: `Products by ${vendorName}`,
            url: `/products?vendor=${encodeURIComponent(vendorName)}`
          });
        }
      });
      
      return Array.from(vendors.values());
    }
    return [];
  } catch (error) {
    console.error("Error searching vendors:", error);
    return [];
  }
};

export const performGlobalSearch = async (query: string): Promise<SearchResult[]> => {
  if (!query.trim()) return [];
  
  const [products, categories, vendors] = await Promise.all([
    searchProducts(query),
    searchCategories(query),
    searchVendors(query)
  ]);
  
  return [...products, ...categories, ...vendors].slice(0, 10);
}; 