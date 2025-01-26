// Example of Inactive Vendor Component
export default function Inactive() {
    return (
        <div>
            <h2>Inactive Vendors</h2>
            <table>
                {/* Render inactive vendor data here */}
                <thead>
                    <tr>
                        <th>Vendor Name</th>
                        <th>Phone Number</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {/* List of Inactive Vendors */}
                    <tr>
                        <td>Vendor 2</td>
                        <td>987-654-3210</td>
                        <td>Inactive</td>
                    </tr>
                    {/* More inactive vendors */}
                </tbody>
            </table>
        </div>
    );
}
