import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { fetchSuppliers } from './api';
import LoginModal from './components/LoginModal';
import SupplierTable from './components/SupplierTable';
import AddSupplierForm from './components/AddSupplierForm';
import UploadPage from './components/UploadPage';

function MainPage({ userName }) {
  const [suppliers, setSuppliers] = useState([]);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [totalChecks, setTotalChecks] = useState(0);

  const loadData = async () => {
    const res = await fetchSuppliers();
    setSuppliers(res.data.suppliers);
    setTotalSuppliers(res.data.totalSuppliers);
    setTotalChecks(res.data.totalChecks);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container mt-5">
      <h1>Cheque Status Tracking</h1>
      <div>Logged in as: {userName}</div>
      <div className="my-3">
        <strong>Total Suppliers: </strong>{totalSuppliers} | <strong>Total Checks: </strong>{totalChecks}
      </div>
      <AddSupplierForm onNewSupplier={loadData} userName={userName}/>
      <SupplierTable suppliers={suppliers} userName={userName} onSupplierUpdated={loadData}/>
      <div className="mt-3">
        <a href="/admin">Go to Admin Upload Page</a>
      </div>
    </div>
  );
}

function App() {
  const [userName, setUserName] = useState(null);

  if (!userName) {
    return <LoginModal onLogin={setUserName} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage userName={userName} />} />
        <Route path="/admin" element={<UploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
