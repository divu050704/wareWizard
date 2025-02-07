import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Multiselect from 'multiselect-react-dropdown';
import '../styles/purchasePortal.css';
import NewProduct from './NewProduct';
import ProductUpdate from './ProductUpdate';

const PurchasePortal = () => {
    const [purchases, setPurchases] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);
    const [selected, setSelected] = useState([]);
    const [showNewProductForm, setShowNewProductForm] = useState(false);
    const [showUpdateProductForm, setShowUpdateProductForm] = useState(false);

    const [newPurchase, setNewPurchase] = useState({
        invoice: '',
        date: '',
        vendorId: '',
        product: '', // for product selection
        quantity: '',
        mrp: '',
        discount: '',
        tax: '',
        costPrice: '',
        freight: '',
        otherCharges: '',
    });

    const [newVendor, setNewVendor] = useState({
        name: '',
        address: '',
        phone: '',
    });

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPurchases();
        fetchVendors();
        fetchProducts();
    }, []);

    const fetchPurchases = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/purchase');
            setPurchases(response.data);
        } catch (error) {
            console.error('Error fetching purchases:', error);
        }
    };

    const fetchVendors = async () => {
        try {
            const response = await axios.get('http://localhost:8080/vendors');
            setVendors(response.data);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/products-data", { credentials: "include" });
            const result = await response.json();
            if (Array.isArray(result.data)) {
                setProducts(result.data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
        }
    };

    const handlePurchaseChange = (e) => {
        const { name, value } = e.target;
        setNewPurchase((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const calculateCostPrice = () => {
        const { mrp, discount, tax } = newPurchase;
        let cost = parseFloat(mrp) || 0;
        if (discount) {
            cost -= (cost * (parseFloat(discount) / 100));
        }
        if (tax) {
            cost += (cost * (parseFloat(tax) / 100));
        }
        setNewPurchase((prev) => ({
            ...prev,
            costPrice: cost.toFixed(2),
        }));
    };

    useEffect(() => {
        calculateCostPrice();
    }, [newPurchase.mrp, newPurchase.discount, newPurchase.tax]);

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

        const totalAmount = selected.reduce((total, product) => {
            const costPrice = product.price * (product.quantity || 1);
            const taxAmount = (product.tax || 0) * costPrice / 100;
            return total + costPrice + taxAmount;
        }, 0);

        const totalCost = totalAmount + (parseFloat(newPurchase.freight) || 0) + (parseFloat(newPurchase.otherCharges) || 0);

        try {
            const response = await axios.post('http://localhost:8080/api/purchase', {
                invoice: newPurchase.invoice,
                date: newPurchase.date,
                vendorId: newPurchase.vendorId,
                amount: totalCost,
                freight: newPurchase.freight,
                otherCharges: newPurchase.otherCharges,
                products: selected,
            });

            setPurchases((prev) => [...prev, response.data.purchase]);
            setNewPurchase({ invoice: '', date: '', vendorId: '', amount: '', freight: '', otherCharges: '' });
            setSelected([]);
        } catch (error) {
            console.error('Error adding purchase:', error.response ? error.response.data : error.message);
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
            setNewVendor({ name: '', address: '', phone: '' });
        } catch (error) {
            console.error('Error adding vendor:', error);
        }
    };

    const deletePurchase = async (purchaseId) => {
        try {
            await axios.delete(`http://localhost:8080/api/purchase/${purchaseId}`);
            setPurchases((prev) => prev.filter((purchase) => purchase._id !== purchaseId));
        } catch (error) {
            console.error('Error deleting purchase:', error);
        }
    };

    const deleteVendor = async (vendorId) => {
        try {
            await axios.delete(`http://localhost:8080/vendors/${vendorId}`);
            setVendors((prev) => prev.filter((vendor) => vendor._id !== vendorId));
        } catch (error) {
            console.error('Error deleting vendor:', error);
        }
    };

    const printReceipt = (purchaseId) => {
        const purchase = purchases.find(p => p._id === purchaseId);
        if (!purchase) return;

        const receiptWindow = window.open('', '_blank');
        receiptWindow.document.write(`<h1>Purchase Receipt</h1>`);
        receiptWindow.document.write(`<p>Invoice: ${purchase.invoice}</p>`);
        receiptWindow.document.write(`<p>Date: ${new Date(purchase.date).toLocaleDateString()}</p>`);
        receiptWindow.document.write(`<p>Vendor: ${purchase.vendor?.name}</p>`);
        receiptWindow.document.write(`<p>Products: ${purchase.products?.map(p => p.productName).join(', ')}</p>`);
        receiptWindow.document.write(`<p>Amount: ${purchase.amount}</p>`);
        receiptWindow.document.write(`<p>Freight: ${purchase.freight}</p>`);
        receiptWindow.document.write(`<p>Other Charges: ${purchase.otherCharges}</p>`);
        receiptWindow.document.write(`<p>Total: ${purchase.amount + parseFloat(purchase.freight || 0) + parseFloat(purchase.otherCharges || 0)}</p>`);
        receiptWindow.document.write(`<button onclick="window.print()">Print</button>`);
        receiptWindow.document.close();
    };

    return (
        <div className='purchase-portal'>
            <button onClick={() => setShowNewProductForm(true)}>New Product</button>
            <button onClick={() => setShowUpdateProductForm(true)}>Update Product</button>

            {showNewProductForm && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowNewProductForm(false)}>&times;</span>
                        <NewProduct />
                    </div>
                </div>
            )}

            {showUpdateProductForm && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowUpdateProductForm(false)}>&times;</span>
                        <ProductUpdate />
                    </div>
                </div>
            )}

            <h1>Purchase Portal</h1>

            {/* Add Vendor Section */}
            <div>
                <h2>Add Vendor</h2>
                <form onSubmit={addVendor}>
                    <input type="text" name="name" placeholder="Vendor Name" value={newVendor.name} onChange={handleVendorChange} required />
                    <input type="text" name="address" placeholder="Vendor Address" value={newVendor.address} onChange={handleVendorChange} required />
                    <input type="text" name="phone" placeholder="Vendor Phone" value={newVendor.phone} onChange={handleVendorChange} required />
                    <button type="submit">Add Vendor</button>
                </form>
            </div>

            {/* Vendor Table Section */}
            <div>
                <h2>Vendors List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map((vendor) => (
                            <tr key={vendor._id}>
                                <td>{vendor.name}</td>
                                <td>{vendor.address}</td>
                                <td>{vendor.phone}</td>
                                <td><button onClick={() => deleteVendor(vendor._id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Purchase Section */}
            <div>
                <h2>Add Purchase</h2>
                <form onSubmit={addPurchase}>
                    <input type="text" name="invoice" placeholder="Invoice" value={newPurchase.invoice} onChange={handlePurchaseChange} required />
                    <input type="date" name="date" value={newPurchase.date} onChange={handlePurchaseChange} required />
                    <select name="vendorId" onChange={handlePurchaseChange} value={newPurchase.vendorId} required>
                        <option value="">Select Vendor</option>
                        {vendors.map((vendor) => (
                            <option key={vendor._id} value={vendor._id}>{vendor.name}</option>
                        ))}
                    </select>

                    <Multiselect
                        options={Array.isArray(products) ? products : []}
                        onSelect={(selectedList) => setSelected(selectedList)}
                        onRemove={(selectedList) => setSelected(selectedList)}
                        displayValue="productName"
                        groupBy="category"
                    />
                    
                    <input type="number" name="mrp" placeholder="MRP" value={newPurchase.mrp} onChange={handlePurchaseChange} />
                    <input type="number" name="discount" placeholder="Discount %" value={newPurchase.discount} onChange={handlePurchaseChange} />
                    <input type="number" name="tax" placeholder="Tax %" value={newPurchase.tax} onChange={handlePurchaseChange} />
                    <input type="text" name="costPrice" placeholder="Cost Price" value={newPurchase.costPrice} disabled />

                    <input type="text" name="freight" placeholder="Freight" value={newPurchase.freight} onChange={handlePurchaseChange} />
                    <input type="text" name="otherCharges" placeholder="Other Charges" value={newPurchase.otherCharges} onChange={handlePurchaseChange} />

                    <button type="submit">Add Purchase</button>
                </form>
            </div>

            {/* All Purchases Section */}
            <div>
                <h2>All Purchases</h2>
                <input type="text" placeholder="Search by Invoice" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <table>
                    <thead>
                        <tr>
                            <th>Invoice</th>
                            <th>Date</th>
                            <th>Vendor</th>
                            <th>Products</th>
                            <th>MRP</th>
                            <th>Discount</th>
                            <th>Amount</th>
                            <th>Freight</th>
                            <th>Other Charges</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {purchases.filter(p => p.invoice.includes(searchQuery)).map((purchase) => (
                        <tr key={purchase._id}>
                            <td>{purchase.invoice}</td>
                            <td>{new Date(purchase.date).toLocaleDateString()}</td>
                            <td>{purchase.vendor?.name}</td>
                            <td>{purchase.products?.map(p => p.productName).join(', ')}</td>
                            <td>{purchase.amount}</td>
                            <td>{purchase.freight}</td>
                            <td>{purchase.otherCharges}</td>
                            <td>
                                {purchase.amount + parseFloat(purchase.freight || 0) + parseFloat(purchase.otherCharges || 0)}
                            </td>
                            <td>
                                <button onClick={() => deletePurchase(purchase._id)}>Delete</button>
                                <button onClick={() => printReceipt(purchase._id)}>Print Receipt</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Total Purchases */}
                <div>
                    <h3>Total Purchases: {purchases.reduce((total, purchase) => total + purchase.amount, 0)}</h3>
                </div>
            </div>
        </div>
    );
};

export default PurchasePortal;
