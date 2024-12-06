import React, { useState } from 'react';
import { addSupplier } from '../api';

function AddSupplierForm({ onNewSupplier, userName }) {
  const [formData, setFormData] = useState({
    supplier_name: '',
    email_address: '',
    num_checks: 0,
    date_of_emailing: '',
    status: '',
    notes: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await addSupplier({ ...formData, userName });
      onNewSupplier();
      setFormData({
        supplier_name: '',
        email_address: '',
        num_checks: 0,
        date_of_emailing: '',
        status: '',
        notes: ''
      });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        setErrorMsg(err.response.data.error);
      } else {
        setErrorMsg('Error adding supplier.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-3">
      <h5>Add New Supplier</h5>
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
      <div className="row">
        <div className="col">
          <input className="form-control" placeholder="Supplier Name" name="supplier_name" value={formData.supplier_name} onChange={handleChange} />
        </div>
        <div className="col">
          <input className="form-control" placeholder="Email" name="email_address" value={formData.email_address} onChange={handleChange} />
        </div>
        <div className="col">
          <input className="form-control" placeholder="# Checks" type="number" name="num_checks" value={formData.num_checks} onChange={handleChange} />
        </div>
        <div className="col">
          <input className="form-control" placeholder="Date of Emailing" name="date_of_emailing" value={formData.date_of_emailing} onChange={handleChange} />
        </div>
        <div className="col">
          <input className="form-control" placeholder="Status" name="status" value={formData.status} onChange={handleChange} />
        </div>
        <div className="col">
          <input className="form-control" placeholder="Notes" name="notes" value={formData.notes} onChange={handleChange} />
        </div>
        <div className="col">
          <button className="btn btn-primary" type="submit">Add</button>
        </div>
      </div>
    </form>
  );
}

export default AddSupplierForm;
