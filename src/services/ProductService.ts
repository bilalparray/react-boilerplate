import { fetchBestSellingProducts } from "../api/bestSelling.api";
import { fetchProduct } from "../api/product.api";
import type { ProductDTO } from "../dto/productDTO";
import { Product } from "../models/Product";
import { ProductVariant } from "../models/ProductVaraint";
import { Unit } from "../models/Unit";

function mapVariant(v: any): ProductVariant {
  return new ProductVariant(
    v.id,
    parseFloat(v.price),
    parseFloat(v.comparePrice),
    v.stock,
    parseFloat(v.weight),
    new Unit(v.unitName, v.unitSymbol),
    v.isDefaultVariant
  );
}

function mapProduct(dto: ProductDTO): Product {
  return new Product(
    dto.id,
    dto.name,
    dto.description,
    dto.images,
    dto.variants.map(mapVariant)
  );
}

export async function getProduct(productId: number): Promise<Product> {
  const dto = await fetchProduct(productId);
  return mapProduct(dto);
}
export async function getBestSellingProducts(): Promise<Product[]> {
  const dtos = await fetchBestSellingProducts();
  return dtos.map(mapProduct);
}
