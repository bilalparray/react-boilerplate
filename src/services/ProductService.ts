import { fetchBestSellingProducts } from "../api/bestSelling.api";
import {
  fetchPaginatedProducts,
  fetchProduct,
  fetchProductCount,
} from "../api/product.api";
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
    dto.category.id,
    dto.images,
    dto.variants.map(mapVariant)
  );
}

export async function getProduct(productId: number): Promise<Product> {
  const response = await fetchProduct(productId);
  const dto = response.successData; // Assuming the data is in the `data` property of the response
  if (dto != null) {
    return mapProduct(dto);
  } else {
    throw new Error("Data is null");
  }
}
export async function getProductCount(): Promise<number> {
  const res = await fetchProductCount();
  return res.successData.intResponse;
}
export async function getBestSellingProducts(): Promise<Product[]> {
  const dtos = await fetchBestSellingProducts();
  return dtos.map(mapProduct);
}
export async function getPaginatedProducts(skip: number, top: number) {
  const response = await fetchPaginatedProducts(skip, top);
  return {
    products: response.successData.map(mapProduct),
  };
}
export async function getPaginatedProductsForGrid(skip: number, top: number) {
  const response = await fetchPaginatedProducts(skip, top);
  return response.successData.map(mapProduct);
}
