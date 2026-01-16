import { useState } from "react";
import { useUnits } from "../../../hooks/admin/useUnits";
import { toast } from "react-toastify";
import "./UnitList.css";

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
    if (!form.name.trim()) {
      toast.error("Unit name is required");
      return;
    }

    if (!form.symbol.trim()) {
      toast.error("Unit symbol is required");
      return;
    }

    if (form.multiplier <= 0) {
      toast.error("Multiplier must be greater than 0");
      return;
    }

    if (editing) {
      await update(editing.id, form);
    } else {
      await create(form);
    }

    if (!error) {
      setShow(false);
    }
  };

  const deleteRow = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this unit? This action cannot be undone."
      )
    ) {
      return;
    }

    await remove(id);
  };

  return (
    <div className="units-page">
      {/* Page Header */}
      <div className="units-header">
        <div>
          <h2 className="units-title">Units Management</h2>
          <p className="units-subtitle">
            Manage measurement units for your products
          </p>
        </div>
        <div className="units-stats">
          <div className="stat-item">
            <span className="stat-label">Total Units</span>
            <span className="stat-value">{total}</span>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <button className="btn btn-primary btn-add" onClick={openCreate}>
          <i className="bi bi-plus-circle-fill me-2"></i>
          Add New Unit
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger alert-custom" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Units Table - Desktop */}
      <div className="units-table-card">
        {loading ? (
          <div className="loading-state">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading units...</p>
          </div>
        ) : units.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-rulers empty-icon"></i>
            <h5 className="empty-title">No units found</h5>
            <p className="empty-text">
              Get started by creating your first unit (e.g., Kilogram, Gram,
              Litre)
            </p>
            <button className="btn btn-primary" onClick={openCreate}>
              <i className="bi bi-plus-circle me-1"></i>
              Create Unit
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-responsive d-none d-md-block">
              <table className="table units-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Symbol</th>
                    <th>Multiplier</th>
                    <th>Base Unit</th>
                    <th>Display Order</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map((u, i) => (
                    <tr key={u.id} className="unit-row">
                      <td>
                        <div className="unit-number">
                          {(page - 1) * pageSize + i + 1}
                        </div>
                      </td>
                      <td>
                        <div className="unit-name">
                          <i className="bi bi-rulers me-2"></i>
                          {u.name}
                        </div>
                      </td>
                      <td>
                        <div className="unit-symbol">
                          <span className="symbol-badge">{u.symbol}</span>
                        </div>
                      </td>
                      <td>
                        <div className="unit-multiplier">
                          <span className="multiplier-badge">
                            {u.multiplier}x
                          </span>
                        </div>
                      </td>
                      <td>
                        {u.isBaseUnit ? (
                          <span className="base-unit-badge base-unit-active">
                            <i className="bi bi-star-fill me-1"></i>
                            Base Unit
                          </span>
                        ) : (
                          <span className="base-unit-badge base-unit-inactive">
                            <i className="bi bi-star me-1"></i>
                            Standard
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="unit-display-order">
                          <span className="order-badge">{u.displayOrder}</span>
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-edit"
                            onClick={() => openEdit(u)}
                            disabled={actionLoading}>
                            <i className="bi bi-pencil-fill me-1"></i>
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-delete"
                            onClick={() => deleteRow(u.id)}
                            disabled={actionLoading}>
                            <i className="bi bi-trash-fill me-1"></i>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="units-mobile d-md-none">
              {units.map((u) => (
                <div key={u.id} className="unit-card-mobile">
                  <div className="unit-card-header">
                    <div className="unit-card-name-symbol">
                      <div className="unit-name-mobile">
                        <i className="bi bi-rulers me-2"></i>
                        {u.name}
                      </div>
                      <div className="unit-symbol-mobile">
                        <span className="symbol-badge-mobile">{u.symbol}</span>
                      </div>
                    </div>
                    {u.isBaseUnit && (
                      <span className="base-unit-badge-mobile base-unit-active">
                        <i className="bi bi-star-fill me-1"></i>
                        Base
                      </span>
                    )}
                  </div>

                  <div className="unit-card-body">
                    <div className="unit-info-row">
                      <span className="info-label">
                        <i className="bi bi-123 me-1"></i>
                        Multiplier
                      </span>
                      <span className="multiplier-badge-mobile">
                        {u.multiplier}x
                      </span>
                    </div>

                    <div className="unit-info-row">
                      <span className="info-label">
                        <i className="bi bi-sort-numeric-down me-1"></i>
                        Display Order
                      </span>
                      <span className="order-badge-mobile">{u.displayOrder}</span>
                    </div>

                    <div className="unit-info-row">
                      <span className="info-label">Base Unit</span>
                      {u.isBaseUnit ? (
                        <span className="base-unit-indicator base-unit-active">
                          <i className="bi bi-check-circle-fill me-1"></i>
                          Yes
                        </span>
                      ) : (
                        <span className="base-unit-indicator base-unit-inactive">
                          <i className="bi bi-x-circle me-1"></i>
                          No
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="unit-card-footer">
                    <button
                      className="btn btn-outline-primary btn-sm flex-fill me-2"
                      onClick={() => openEdit(u)}
                      disabled={actionLoading}>
                      <i className="bi bi-pencil-fill me-1"></i>
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm flex-fill"
                      onClick={() => deleteRow(u.id)}
                      disabled={actionLoading}>
                      <i className="bi bi-trash-fill me-1"></i>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && units.length > 0 && (
          <div className="pagination-wrapper">
            <div className="pagination-info">
              <span>
                Showing <strong>{(page - 1) * pageSize + 1}</strong> to{" "}
                <strong>{Math.min(page * pageSize, total)}</strong> of{" "}
                <strong>{total}</strong> units
              </span>
            </div>

            <div className="pagination-controls">
              <button
                className="btn btn-outline-secondary btn-pagination"
                disabled={page === 1 || loading}
                onClick={() => setPage(page - 1)}>
                <i className="bi bi-chevron-left"></i>
                Previous
              </button>

              <div className="page-numbers">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`btn btn-pagination-number ${
                        pageNum === page
                          ? "btn-primary active"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() => setPage(pageNum)}
                      disabled={loading}>
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                className="btn btn-outline-secondary btn-pagination"
                disabled={page >= totalPages || loading}
                onClick={() => setPage(page + 1)}>
                Next
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {show && (
        <div
          className="modal-overlay"
          onClick={() => !actionLoading && setShow(false)}>
          <div
            className="modal-content-custom"
            onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h5 className="modal-title-custom">
                <i className="bi bi-rulers me-2"></i>
                {editing ? "Edit Unit" : "Create New Unit"}
              </h5>
              <button
                className="btn-close-custom"
                onClick={() => !actionLoading && setShow(false)}
                disabled={actionLoading}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body-custom">
              {/* Name */}
              <div className="form-group">
                <label className="form-label-custom">
                  <i className="bi bi-tag-fill me-1"></i>
                  Unit Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-control-custom"
                  placeholder="e.g., Kilogram, Gram, Litre"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={actionLoading}
                />
                <small className="form-help-text">
                  Enter the full name of the unit
                </small>
              </div>

              {/* Symbol */}
              <div className="form-group">
                <label className="form-label-custom">
                  <i className="bi bi-type me-1"></i>
                  Symbol <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-control-custom"
                  placeholder="e.g., kg, g, L"
                  value={form.symbol}
                  onChange={(e) =>
                    setForm({ ...form, symbol: e.target.value })
                  }
                  disabled={actionLoading}
                  maxLength={10}
                />
                <small className="form-help-text">
                  Short symbol used to represent this unit
                </small>
              </div>

              {/* Multiplier & Display Order Row */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label-custom">
                    <i className="bi bi-123 me-1"></i>
                    Multiplier <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control-custom"
                    placeholder="1"
                    min="0.01"
                    step="0.01"
                    value={form.multiplier}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        multiplier: Number(e.target.value) || 1,
                      })
                    }
                    disabled={actionLoading}
                  />
                  <small className="form-help-text">
                    Conversion factor relative to base unit
                  </small>
                </div>

                <div className="form-group">
                  <label className="form-label-custom">
                    <i className="bi bi-sort-numeric-down me-1"></i>
                    Display Order
                  </label>
                  <input
                    type="number"
                    className="form-control-custom"
                    placeholder="1"
                    min="1"
                    value={form.displayOrder}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        displayOrder: Number(e.target.value) || 1,
                      })
                    }
                    disabled={actionLoading}
                  />
                  <small className="form-help-text">
                    Order in which unit appears
                  </small>
                </div>
              </div>

              {/* Base Unit Toggle */}
              <div className="form-group-checkbox">
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    className="form-check-input-custom"
                    id="isBaseUnit"
                    checked={form.isBaseUnit}
                    onChange={(e) =>
                      setForm({ ...form, isBaseUnit: e.target.checked })
                    }
                    disabled={actionLoading}
                  />
                  <label
                    className="form-check-label-custom"
                    htmlFor="isBaseUnit">
                    <i className="bi bi-star-fill me-2"></i>
                    Set as Base Unit
                    <small className="d-block text-muted mt-1">
                      Base units are used as reference for conversions
                    </small>
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer-custom">
              <button
                className="btn btn-secondary btn-cancel"
                onClick={() => setShow(false)}
                disabled={actionLoading}>
                Cancel
              </button>
              <button
                className="btn btn-primary btn-save"
                onClick={save}
                disabled={actionLoading || !form.name.trim() || !form.symbol.trim()}>
                {actionLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"></span>
                    {editing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-1"></i>
                    {editing ? "Update Unit" : "Create Unit"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        )}
    </div>
  );
}
