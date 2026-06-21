import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApiService } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = () => {
        setLoading(true);
        adminApiService.getOrders()
            .then(res => setOrders(res.data.items || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <div>Loading orders...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-medium text-gray-600">Order #</th>
                            <th className="p-4 font-medium text-gray-600">Date</th>
                            <th className="p-4 font-medium text-gray-600">Customer</th>
                            <th className="p-4 font-medium text-gray-600">Total</th>
                            <th className="p-4 font-medium text-gray-600">Status</th>
                            <th className="p-4 font-medium text-gray-600 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {orders.map((order: any) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{order.order_number}</td>
                                <td className="p-4 text-gray-600">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4">{order.shipping_name}</td>
                                <td className="p-4 font-medium">₹{order.total}</td>
                                <td className="p-4">
                                    <Badge variant={
                                        order.status === "delivered" ? "default" :
                                        order.status === "cancelled" ? "destructive" : "secondary"
                                    }>
                                        {order.status}
                                    </Badge>
                                </td>
                                <td className="p-4 text-right">
                                    <Link to={`/admin/orders/${order.id}`}>
                                        <Button variant="outline" size="sm">View</Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
