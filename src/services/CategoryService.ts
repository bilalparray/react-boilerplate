import { fetchCategories } from "../api/category.api";

export async function getCategories() {
  const res = await fetchCategories(0, 50);
  return res.successData.items.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));
}
