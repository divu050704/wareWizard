// Example of All Vendors Component
export default function AllVendors() {
    return (
        <div>
            <h2>All Vendors</h2>
            <table>
                {/* Render all vendor data here */}
                <thead>
                    <tr>
                        <th>Vendor Name</th>
                        <th>Phone Number</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {/* List of All Vendors */}
                    <tr>
                        <td>Vendor 1</td>
                        <td>123-456-7890</td>
                        <td>Active</td>
                    </tr>
                    <tr>
                        <td>Vendor 2</td>
                        <td>987-654-3210</td>
                        <td>Inactive</td>
                    </tr>
                    {/* More vendors */}
                </tbody>
            </table>
        </div>
    );
}
