// dto/ProductDTO.ts
export interface ProductDTO {
  id: number;
  name: string;
  description: string;
  itemId: string;
  currency: string;
  isBestSelling: boolean;
  images: string[];
  richDescription: string;
  isFeatured: boolean;
  categoryId: number;
  hsnCode: string;
  taxRate: number;
  category: {
    id: number;
    name: string;
  };
  variants: ProductVariantDTO[];
}

export interface ProductVariantDTO {
  id: number;
  price: string;
  comparePrice: string;
  stock: number;
  weight: string;
  unitName: string;
  unitSymbol: string;
  isDefaultVariant: boolean;
}
