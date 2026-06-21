import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApiService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Truck, RefreshCcw } from "lucide-react";

export default function AdminOrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [shipModalOpen, setShipModalOpen] = useState(false);
    const [dimensions, setDimensions] = useState({ length: 10, breadth: 10, height: 10, weight: 0.5 });

    const fetchOrder = () => {
        setLoading(true);
        adminApiService.getOrder(id!)
            .then(res => {
                const data = res.data;
                setOrder(data);
                // Calculate defaults from order items if available
                if (data.items && data.items.length > 0) {
                    let totalWeight = 0;
                    let maxL = 0, maxB = 0, maxH = 0;
                    data.items.forEach((item: any) => {
                        const p = item.product;
                        if (p) {
                            totalWeight += (Number(p.weight) || 0) * item.quantity;
                            maxL = Math.max(maxL, Number(p.length) || 0);
                            maxB = Math.max(maxB, Number(p.breadth) || 0);
                            maxH = Math.max(maxH, Number(p.height) || 0);
                        }
                    });
                    setDimensions({
                        weight: totalWeight > 0 ? totalWeight : 0.5,
                        length: maxL > 0 ? maxL : 10,
                        breadth: maxB > 0 ? maxB : 10,
                        height: maxH > 0 ? maxH : 10
                    });
                }
            })
            .catch((err) => {
                toast.error("Failed to load order");
                navigate("/admin/orders");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const handleUpdateStatus = async (status: string) => {
        try {
            await adminApiService.updateOrderStatus(id!, status);
            toast.success("Order status updated");
            fetchOrder();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to update status");
        }
    };

    const handleShipOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminApiService.shipOrder(id!, dimensions);
            toast.success("Shipment created via Shiprocket!");
            setShipModalOpen(false);
            fetchOrder();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to create shipment");
        }
    };

    const handleRefund = async () => {
        const reason = prompt("Enter refund reason:");
        if (!reason) return;
        
        try {
            await adminApiService.refundOrder(id!, undefined, reason);
            toast.success("Refund processed successfully!");
            fetchOrder();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Refund failed");
        }
    };

    if (loading) return <div>Loading order details...</div>;
    if (!order) return null;

    return (
        <div className="space-y-6 max-w-4xl relative">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/orders")}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-2xl font-bold text-gray-800">Order #{order.order_number}</h2>
                <Badge>{order.status}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p><span className="font-medium">Name:</span> {order.shipping_name}</p>
                        <p><span className="font-medium">Email:</span> {order.shipping_email}</p>
                        <p><span className="font-medium">Phone:</span> {order.shipping_mobile}</p>
                        <p><span className="font-medium">Address:</span> {order.shipping_line1}, {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex gap-2">
                            <Button onClick={() => handleUpdateStatus('processing')} disabled={order.status !== 'confirmed'} variant="outline">
                                Mark Processing
                            </Button>
                            <Button onClick={() => setShipModalOpen(true)} disabled={!['confirmed', 'processing'].includes(order.status)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                <Truck className="w-4 h-4 mr-2" />
                                Ship via Shiprocket
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleRefund} disabled={order.status === 'refunded' || !order.payment || order.payment.status !== 'captured'} variant="destructive">
                                <RefreshCcw className="w-4 h-4 mr-2" />
                                Process Refund
                            </Button>
                            <Button onClick={() => handleUpdateStatus('cancelled')} disabled={['cancelled', 'refunded', 'delivered'].includes(order.status)} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                                Cancel Order
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="pb-3 font-medium text-gray-600">Product</th>
                                <th className="pb-3 font-medium text-gray-600">Price</th>
                                <th className="pb-3 font-medium text-gray-600">Qty</th>
                                <th className="pb-3 font-medium text-gray-600 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {order.items?.map((item: any) => (
                                <tr key={item.id}>
                                    <td className="py-3">{item.product_name}</td>
                                    <td className="py-3">₹{item.price}</td>
                                    <td className="py-3">{item.quantity}</td>
                                    <td className="py-3 text-right font-medium">₹{item.total}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t">
                            <tr>
                                <td colSpan={3} className="pt-3 text-right text-gray-600">Subtotal</td>
                                <td className="pt-3 text-right">₹{order.subtotal}</td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="pt-1 text-right text-gray-600">Shipping</td>
                                <td className="pt-1 text-right">₹{order.shipping_fee}</td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="pt-1 text-right text-gray-600">Tax</td>
                                <td className="pt-1 text-right">₹{order.tax}</td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="pt-3 font-bold text-right text-gray-800">Total</td>
                                <td className="pt-3 font-bold text-right text-gray-800">₹{order.total}</td>
                            </tr>
                        </tfoot>
                    </table>
                </CardContent>
            </Card>

            {shipModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <h3 className="text-xl font-bold mb-4">Confirm Shipping Dimensions</h3>
                        <form onSubmit={handleShipOrder} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                                    <input type="number" step="0.1" required className="w-full border rounded p-2" value={dimensions.weight} onChange={e => setDimensions({...dimensions, weight: Number(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Length (cm)</label>
                                    <input type="number" step="0.1" required className="w-full border rounded p-2" value={dimensions.length} onChange={e => setDimensions({...dimensions, length: Number(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Breadth (cm)</label>
                                    <input type="number" step="0.1" required className="w-full border rounded p-2" value={dimensions.breadth} onChange={e => setDimensions({...dimensions, breadth: Number(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Height (cm)</label>
                                    <input type="number" step="0.1" required className="w-full border rounded p-2" value={dimensions.height} onChange={e => setDimensions({...dimensions, height: Number(e.target.value)})} />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setShipModalOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Create Shipment</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
