import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/purchasePortal.scss'

const PurchasePortal = () => {
  const [purchases, setPurchases] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [newPurchase, setNewPurchase] = useState({
    invoice: '',
    date: '',
    vendorId: '',
    itemName: '',
    amount: '',
  });
  const [newVendor, setNewVendor] = useState({
    name: '',
    address: '',
    phone: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVendors();
    fetchPurchases();
    fetchItems();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get('http://localhost:8080/vendors');
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await axios.get('http://localhost:8080/purchases');
      setPurchases(response.data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products-data');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handlePurchaseChange = (e) => {
    const { name, value } = e.target;
    setNewPurchase((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVendorChange = (e) => {
    const { name, value } = e.target;
    setNewVendor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addPurchase = async (e) => {
    e.preventDefault();
    if (purchases.some((purchase) => purchase.invoice === newPurchase.invoice)) {
      alert('Invoice number already exists!');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/purchases', newPurchase);
      setPurchases((prev) => [...prev, response.data]);
      setNewPurchase({
        invoice: '',
        date: '',
        vendorId: '',
        itemName: '',
        amount: '',
      });
    } catch (error) {
      console.error('Error adding purchase:', error);
    }
  };

  const addVendor = async (e) => {
    e.preventDefault();
    if (vendors.some((vendor) => vendor.name === newVendor.name)) {
      alert('Vendor already exists!');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/vendors', newVendor);
      setVendors((prev) => [...prev, response.data]);
      setNewVendor({
        name: '',
        address: '',
        phone: '',
      });
    } catch (error) {
      console.error('Error adding vendor:', error);
    }
  };

  const sortPurchasesByInvoice = () => {
    const sortedPurchases = [...purchases].sort((a, b) => a.invoice.localeCompare(b.invoice));
    setPurchases(sortedPurchases);
  };

  const handleVendorSelect = (e) => {
    const vendorId = e.target.value;
    setNewPurchase((prev) => ({
      ...prev,
      vendorId,
    }));

    const selectedVendor = vendors.find((vendor) => vendor._id === vendorId);
    if (selectedVendor) {
      setNewVendor({
        name: selectedVendor.name,
        address: selectedVendor.address,
        phone: selectedVendor.phone,
      });
    }
  };

  const deletePurchase = async (purchaseId) => {
    try {
      await axios.delete(`http://localhost:8080/purchases/${purchaseId}`);
      setPurchases((prev) => prev.filter((purchase) => purchase._id !== purchaseId));
    } catch (error) {
      console.error('Error deleting purchase:', error);
    }
  };

  const filteredPurchases = purchases.filter((purchase) =>
    purchase.invoice.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='purchase-portal'>
      <h1>Purchase Portal</h1>

      <div>
        <h2>Add Vendor</h2>
        <form onSubmit={addVendor}>
          <input
            type="text"
            name="name"
            placeholder="Vendor Name"
            value={newVendor.name}
            onChange={handleVendorChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Vendor Address"
            value={newVendor.address}
            onChange={handleVendorChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Vendor Phone"
            value={newVendor.phone}
            onChange={handleVendorChange}
            required
          />
          <button type="submit">Add Vendor</button>
        </form>

        <h3>Vendor List</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor._id}>
                <td>{vendor.name}</td>
                <td>{vendor.address}</td>
                <td>{vendor.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Add Purchase</h2>
        <form onSubmit={addPurchase}>
          <input
            type="text"
            name="invoice"
            placeholder="Invoice"
            value={newPurchase.invoice}
            onChange={handlePurchaseChange}
            required
          />
          <input
            type="date"
            name="date"
            value={newPurchase.date}
            onChange={handlePurchaseChange}
            required
          />
          <select name="vendorId" onChange={handleVendorSelect} value={newPurchase.vendorId} required>
            <option value="">Select Vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor._id} value={vendor._id}>
                {vendor.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="itemName"
            placeholder="Enter Item Name"
            list="items"
            value={newPurchase.itemName}
            onChange={handlePurchaseChange}
            required
          />
          <datalist id="items">
            {items.map((item) => (
              <option key={item.id} value={item.name} />
            ))}
          </datalist>
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={newPurchase.amount}
            onChange={handlePurchaseChange}
            required
          />
          <button type="submit">Add Purchase</button>
        </form>
      </div>

      <div>
        <h2>All Purchases</h2>
        <input
          type="text"
          placeholder="Search by Invoice"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={sortPurchasesByInvoice}>Sort by Invoice</button>
        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Date</th>
              <th>Vendor</th>
              <th>Item</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.map((purchase) => (
              <tr key={purchase._id}>
                <td>{purchase.invoice}</td>
                <td>{new Date(purchase.date).toLocaleDateString()}</td>
                <td>{purchase.vendor?.name}</td>
                <td>{purchase.itemName}</td>
                <td>{purchase.amount}</td>
                <td>
                  <button onClick={() => deletePurchase(purchase._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchasePortal;
