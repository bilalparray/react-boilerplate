import { useState } from "react";
import { useUnits } from "../../../hooks/admin/useUnits";

export default function UnitList() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const {
    units,
    total,
    loading,
    actionLoading,
    error,
    create,
    update,
    remove,
  } = useUnits(page, pageSize);

  const totalPages = Math.ceil(total / pageSize);

  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    symbol: "",
    multiplier: 1,
    isBaseUnit: false,
    displayOrder: 1,
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      symbol: "",
      multiplier: 1,
      isBaseUnit: false,
      displayOrder: 1,
    });
    setShow(true);
  };

  const openEdit = (u: any) => {
    setEditing(u);
    setForm({ ...u });
    setShow(true);
  };

  const save = async () => {
    if (editing) {
      await update(editing.id, form);
    } else {
      await create(form);
    }
    if (!error) setShow(false);
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between mb-4">
        <h3 className="fw-bold">Units</h3>
        <button className="btn btn-success" onClick={openCreate}>
          + Add Unit
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">Loading…</div>
      ) : (
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Name</th>
              <th>Symbol</th>
              <th>Multiplier</th>
              <th>Base</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.symbol}</td>
                <td>{u.multiplier}</td>
                <td>{u.isBaseUnit ? "Yes" : "No"}</td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => openEdit(u)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    disabled={actionLoading}
                    onClick={() => remove(u.id)}>
                    {actionLoading ? "…" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="d-flex justify-content-center gap-2 mt-4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`btn ${
              page === i + 1 ? "btn-success" : "btn-outline-secondary"
            }`}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {show && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="fw-bold">
                  {editing ? "Edit Unit" : "Add Unit"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShow(false)}></button>
              </div>

              <div className="modal-body">
                {/* Name */}
                <label htmlFor="unitName" className="form-label fw-semibold">
                  Unit Name
                </label>
                <input
                  id="unitName"
                  className="form-control mb-3"
                  placeholder="Eg: Gram"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                {/* Symbol */}
                <label htmlFor="symbol" className="form-label fw-semibold">
                  Symbol
                </label>
                <input
                  id="symbol"
                  className="form-control mb-3"
                  placeholder="Eg: g, kg"
                  value={form.symbol}
                  onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                />

                {/* Multiplier */}
                <label htmlFor="multiplier" className="form-label fw-semibold">
                  Multiplier
                </label>
                <input
                  id="multiplier"
                  type="number"
                  className="form-control mb-3"
                  placeholder="Eg: 1, 1000"
                  value={form.multiplier}
                  onChange={(e) =>
                    setForm({ ...form, multiplier: Number(e.target.value) })
                  }
                />

                {/* Display Order */}
                <label
                  htmlFor="displayOrder"
                  className="form-label fw-semibold">
                  Display Order
                </label>
                <input
                  id="displayOrder"
                  type="number"
                  className="form-control mb-3"
                  placeholder="Eg: 1"
                  value={form.displayOrder}
                  onChange={(e) =>
                    setForm({ ...form, displayOrder: Number(e.target.value) })
                  }
                />

                {/* Base Unit */}
                <div className="form-check mt-2">
                  <input
                    id="isBaseUnit"
                    type="checkbox"
                    className="form-check-input"
                    checked={form.isBaseUnit}
                    onChange={(e) =>
                      setForm({ ...form, isBaseUnit: e.target.checked })
                    }
                  />
                  <label
                    htmlFor="isBaseUnit"
                    className="form-check-label fw-semibold">
                    Is Base Unit
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-light"
                  onClick={() => setShow(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  disabled={actionLoading}
                  onClick={save}>
                  {actionLoading ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
