import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createProduct,
  updateProduct,
} from "../../../api/admin/adminProduct.api";
import { fetchProduct } from "../../../api/product.api";
import { getCategories } from "../../../services/CategoryService";
import { getUnits } from "../../../services/admin/unit.service";

interface VariantForm {
  unitValueId: number;
  quantity: number;
  weight: number;
  price: number;
  comparePrice: number;
  stock: number;
  sku: string;
  barcode?: string;
  isDefaultVariant: boolean;
}

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    richDescription: "",
    itemId: "",
    categoryId: "",
    hsnCode: "",
    taxRate: 0,
    currency: "INR",
    isBestSelling: false,
    variants: [] as VariantForm[],
  });

  // Load dropdowns
  useEffect(() => {
    getCategories().then(setCategories);
    getUnits(0, 100).then(setUnits);
  }, []);

  // Load product if edit
  useEffect(() => {
    if (!id) return;

    fetchProduct(Number(id)).then((res) => {
      const p = res.successData;
      if (p)
        setForm({
          name: p.name || "",
          description: p.description || "",
          richDescription: p.richDescription || "",
          itemId: p.itemId || "",
          categoryId: String(p.categoryId),
          hsnCode: p.hsnCode || "",
          taxRate: p.taxRate || 0,
          currency: p.currency || "INR",
          isBestSelling: p.isBestSelling || false,
          variants: p.variants.map((v: any) => ({
            unitValueId: v.unitId,
            quantity: v.quantity,
            weight: v.weight || 0,
            price: v.price,
            comparePrice: v.comparePrice || 0,
            stock: v.stock,
            sku: v.sku,
            barcode: v.barcode || "",
            isDefaultVariant: v.isDefaultVariant,
          })),
        });
    });
  }, [id]);

  // Add new variant
  const addVariant = () => {
    setForm((f) => ({
      ...f,
      variants: [
        ...f.variants,
        {
          unitValueId: units[0]?.id || 0,
          quantity: 1,
          weight: 0,
          price: 0,
          comparePrice: 0,
          stock: 0,
          sku: "",
          isDefaultVariant: f.variants.length === 0,
        },
      ],
    }));
  };

  // Generate SKU
  const generateSku = (index: number) => {
    const v = form.variants[index];
    const unit = units.find((u) => u.id === v.unitValueId);
    const sku = `${
      form.itemId || form.name.replace(/\s+/g, "").toUpperCase()
    }-${v.quantity}${unit?.symbol || ""}`;
    updateVariant(index, "sku", sku);
  };

  const updateVariant = (i: number, key: string, value: any) => {
    const variants = [...form.variants];
    variants[i] = { ...variants[i], [key]: value };
    setForm({ ...form, variants });
  };

  const setDefault = (i: number) => {
    const variants = form.variants.map((v, idx) => ({
      ...v,
      isDefaultVariant: idx === i,
    }));
    setForm({ ...form, variants });
  };

  const submit = async () => {
    setLoading(true);

    const fd = new FormData();
    fd.append("reqData", JSON.stringify(form));
    images.forEach((i) => fd.append("images", i));

    if (id) await updateProduct(Number(id), fd);
    else await createProduct(fd);

    navigate("/products");
  };

  return (
    <div className="container py-4">
      <h4 className="mb-4">{id ? "Edit Product" : "Add New Product"}</h4>

      {/* BASIC INFO */}
      <div className="card mb-4">
        <div className="card-header fw-bold">Basic Information</div>
        <div className="card-body row g-3">
          <div className="col-md-6">
            <label className="form-label">Product Name *</label>
            <input
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Item ID</label>
            <input className="form-control" value={form.itemId} disabled />
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label className="form-label">Rich Description</label>
            <textarea
              className="form-control"
              rows={4}
              value={form.richDescription}
              onChange={(e) =>
                setForm({ ...form, richDescription: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* CATEGORY + TAX */}
      <div className="card mb-4">
        <div className="card-header fw-bold">Category & Tax</div>
        <div className="card-body row g-3">
          <div className="col-md-6">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={form.categoryId}
              onChange={(e) =>
                setForm({ ...form, categoryId: e.target.value })
              }>
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">HSN Code</label>
            <input
              className="form-control"
              value={form.hsnCode}
              onChange={(e) => setForm({ ...form, hsnCode: e.target.value })}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Tax %</label>
            <input
              type="number"
              className="form-control"
              value={form.taxRate}
              onChange={(e) =>
                setForm({ ...form, taxRate: Number(e.target.value) })
              }
            />
          </div>

          <div className="col-12">
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={form.isBestSelling}
                onChange={(e) =>
                  setForm({ ...form, isBestSelling: e.target.checked })
                }
              />
              <label className="form-check-label">
                ⭐ Mark as Best Selling
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* VARIANTS */}
      <div className="card mb-4">
        <div className="card-header fw-bold d-flex justify-content-between">
          Product Variants
          <button className="btn btn-sm btn-primary" onClick={addVariant}>
            + Add Variant
          </button>
        </div>

        <div className="card-body">
          {form.variants.map((v, i) => (
            <div key={i} className="border rounded p-3 mb-3">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Unit</label>
                  <select
                    className="form-select"
                    value={v.unitValueId}
                    onChange={(e) =>
                      updateVariant(i, "unitValueId", Number(e.target.value))
                    }>
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <label className="form-label">Qty</label>
                  <input
                    type="number"
                    className="form-control"
                    value={v.quantity}
                    onChange={(e) =>
                      updateVariant(i, "quantity", Number(e.target.value))
                    }
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Weight</label>
                  <input
                    type="number"
                    className="form-control"
                    value={v.weight}
                    onChange={(e) =>
                      updateVariant(i, "weight", Number(e.target.value))
                    }
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={v.price}
                    onChange={(e) =>
                      updateVariant(i, "price", Number(e.target.value))
                    }
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Compare</label>
                  <input
                    type="number"
                    className="form-control"
                    value={v.comparePrice}
                    onChange={(e) =>
                      updateVariant(i, "comparePrice", Number(e.target.value))
                    }
                  />
                </div>

                <div className="col-md-1">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    value={v.stock}
                    onChange={(e) =>
                      updateVariant(i, "stock", Number(e.target.value))
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">SKU</label>
                  <input
                    className="form-control"
                    value={v.sku}
                    onChange={(e) => updateVariant(i, "sku", e.target.value)}
                  />
                </div>

                <div className="col-md-6 d-flex align-items-end gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => generateSku(i)}>
                    Auto SKU
                  </button>
                  <button
                    className={`btn btn-sm ${
                      v.isDefaultVariant ? "btn-success" : "btn-outline-primary"
                    }`}
                    onClick={() => setDefault(i)}>
                    {v.isDefaultVariant ? "Default" : "Make Default"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IMAGES */}
      <div className="card mb-4">
        <div className="card-header fw-bold">Product Images</div>
        <div className="card-body">
          <input
            type="file"
            multiple
            onChange={(e) => setImages([...e.target.files!])}
          />
        </div>
      </div>

      <button
        className="btn btn-success btn-lg"
        disabled={loading}
        onClick={submit}>
        {loading ? "Saving..." : "Save Product"}
      </button>
    </div>
  );
}
