import { fetchProductsByCategory } from "../api/product.api";
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
    dto.category?.id ?? 0, // ✅ always use category.id
    dto.images || [],
    dto.variants?.map(mapVariant) || [],
    0, // rating
    0, // reviewCount
    dto.category // ✅ pass full category object
  );
}
export async function getCategoryProducts(
  categoryId: number,
  skip: number,
  top: number
) {
  const res = await fetchProductsByCategory(categoryId, skip, top);

  const list = res.successData || [];

  return {
    products: list.map(mapProduct),
    total: list.length, // ✅ correct
  };
}
