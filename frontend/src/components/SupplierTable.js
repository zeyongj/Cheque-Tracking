import React, { useState } from 'react';
import { updateSupplier } from '../api';

function SupplierTable({ suppliers, userName, onSupplierUpdated }) {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const startEdit = (supplier) => {
    setEditingId(supplier.id);
    setFormData({ ...supplier });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const saveEdit = async () => {
    try {
      await updateSupplier(editingId, { ...formData, userName, currentLastModifiedAt: formData.last_modified_at });
      onSupplierUpdated();
      setEditingId(null);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert("This record has been modified by someone else. Please refresh and try again.");
      } else {
        alert("Error saving changes.");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <table className="table table-striped mt-3">
      <thead>
        <tr>
          <th>Supplier Name</th>
          <th>Email Address</th>
          <th># of Checks</th>
          <th>Date of Emailing</th>
          <th>Status</th>
          <th>Notes</th>
          <th>Last Modified By</th>
          <th>Last Modified At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map(sup => (
          editingId === sup.id ? (
            <tr key={sup.id}>
              <td><input name="supplier_name" value={formData.supplier_name} onChange={handleChange}/></td>
              <td><input name="email_address" value={formData.email_address} onChange={handleChange}/></td>
              <td><input name="num_checks" type="number" value={formData.num_checks} onChange={handleChange}/></td>
              <td><input name="date_of_emailing" value={formData.date_of_emailing} onChange={handleChange}/></td>
              <td><input name="status" value={formData.status} onChange={handleChange}/></td>
              <td><input name="notes" value={formData.notes} onChange={handleChange}/></td>
              <td>{formData.last_modified_by}</td>
              <td>{formData.last_modified_at}</td>
              <td>
                <button onClick={saveEdit}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </td>
            </tr>
          ) : (
            <tr key={sup.id}>
              <td>{sup.supplier_name}</td>
              <td>{sup.email_address}</td>
              <td>{sup.num_checks}</td>
              <td>{sup.date_of_emailing}</td>
              <td>{sup.status}</td>
              <td>{sup.notes}</td>
              <td>{sup.last_modified_by}</td>
              <td>{sup.last_modified_at}</td>
              <td>
                <button onClick={() => startEdit(sup)}>Edit</button>
              </td>
            </tr>
          )
        ))}
      </tbody>
    </table>
  );
}

export default SupplierTable;
