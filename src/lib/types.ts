export interface Product {
  sku: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  featured: boolean;
  description: string;
  images: string[];
}
