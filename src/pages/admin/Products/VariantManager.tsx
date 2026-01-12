import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import {
  addVariant,
  deleteVariant,
  getVariants,
} from "../../../api/admin/adminProduct.api";

export default function VariantManager() {
  const { id } = useParams();
  const [variants, setVariants] = useState<any[]>([]);
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!id) return;

    getVariants(Number(id)).then((res) => {
      if (!res.isError && res.successData) {
        setVariants(res.successData);
      } else {
        setVariants([]);
      }
    });
  }, [id]);

  const add = async () => {
    await addVariant(Number(id), {
      price,
      quantity: 1,
      unitValueId: 1,
      sku: Date.now().toString(),
      stock: 10,
    });
    location.reload();
  };

  return (
    <div className="container">
      <h4>Variants</h4>
      {variants.map((v) => (
        <div key={v.id} className="d-flex justify-content-between">
          ₹{v.price}
          <button onClick={() => deleteVariant(Number(id), v.id)}>
            Delete
          </button>
        </div>
      ))}

      <input placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
      <button onClick={add}>Add Variant</button>
    </div>
  );
}
