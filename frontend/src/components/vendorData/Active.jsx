// Example of Active Vendor Component
export default function Active() {
    return (
        <div>
            <h2>Active Vendors</h2>
            <table>
                {/* Render active vendor data here */}
                <thead>
                    <tr>
                        <th>Vendor Name</th>
                        <th>Phone Number</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {/* List of Active Vendors */}
                    <tr>
                        <td>Vendor 1</td>
                        <td>123-456-7890</td>
                        <td>Active</td>
                    </tr>
                    {/* More active vendors */}
                </tbody>
            </table>
        </div>
    );
}
