import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import {
  updateProduct,
  createProduct,
} from "../../../api/admin/adminProduct.api";
import { fetchProduct } from "../../../api/product.api";

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>({
    name: "",
    description: "",
    categoryId: "",
    currency: "INR",
    isBestSelling: false,
    variants: [],
  });

  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchProduct(Number(id)).then((res) => setForm(res.successData));
  }, [id]);

  const submit = async () => {
    const fd = new FormData();
    fd.append("reqData", JSON.stringify(form));
    images.forEach((i) => fd.append("images", i));

    if (id) await updateProduct(Number(id), fd);
    else await createProduct(fd);

    navigate("/admin/products");
  };

  return (
    <div className="container py-4">
      <h4>{id ? "Edit" : "Create"} Product</h4>

      <input
        className="form-control my-2"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <textarea
        className="form-control my-2"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="file"
        multiple
        onChange={(e) => setImages([...e.target.files!])}
      />

      <button onClick={submit} className="btn btn-success mt-3">
        Save
      </button>
    </div>
  );
}
