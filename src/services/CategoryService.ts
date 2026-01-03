import { fetchCategories } from "../api/category.api";

export async function getCategories() {
  const res = await fetchCategories();
  return res.successData.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));
}
