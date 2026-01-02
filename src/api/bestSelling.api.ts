export async function fetchBestSellingProducts() {
  const res = await fetch(
    "https://api.wildvalleyfoods.in/api/v1/product/isBestSelling"
  );

  const json = await res.json();
  return json.successData; // same shape as product list
}
