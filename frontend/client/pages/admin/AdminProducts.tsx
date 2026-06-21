import { useEffect, useState } from "react";
import { adminApiService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash, X } from "lucide-react";

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        price: 0,
        mrp: 0,
        stock: 0,
        category: "malas",
        weight: 0.5,
        length: 10,
        breadth: 10,
        height: 10
    });

    const fetchProducts = () => {
        setLoading(true);
        adminApiService.getProducts()
            .then(res => setProducts(res.data.items || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await adminApiService.deleteProduct(id);
            toast.success("Product deleted successfully");
            fetchProducts();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to delete product");
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminApiService.createProduct(formData);
            toast.success("Product created successfully");
            setShowModal(false);
            fetchProducts();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to create product");
        }
    };

    if (loading) return <div>Loading products...</div>;

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                <Button onClick={() => setShowModal(true)} className="bg-[#765341] hover:bg-[#5C4033] text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                </Button>
            </div>
            
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-medium text-gray-600">Name</th>
                            <th className="p-4 font-medium text-gray-600">Category</th>
                            <th className="p-4 font-medium text-gray-600">Price</th>
                            <th className="p-4 font-medium text-gray-600">Stock</th>
                            <th className="p-4 font-medium text-gray-600">Status</th>
                            <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products.map((product: any) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        {product.images && product.images[0] && (
                                            <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded object-cover" />
                                        )}
                                        <span className="font-medium">{product.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-600 capitalize">{product.category?.replace('_', ' ')}</td>
                                <td className="p-4 font-medium">₹{product.price}</td>
                                <td className="p-4">{product.stock}</td>
                                <td className="p-4">
                                    <Badge variant={product.is_active ? "default" : "secondary"}>
                                        {product.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="icon">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleDelete(product.id)}>
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Add New Product</h3>
                            <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input required className="w-full border rounded p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Slug</label>
                                    <input required className="w-full border rounded p-2" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea required className="w-full border rounded p-2" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price</label>
                                    <input type="number" required className="w-full border rounded p-2" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">MRP</label>
                                    <input type="number" required className="w-full border rounded p-2" value={formData.mrp} onChange={e => setFormData({...formData, mrp: Number(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Stock</label>
                                    <input type="number" required className="w-full border rounded p-2" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <select className="w-full border rounded p-2" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                        <option value="malas">Malas</option>
                                        <option value="bracelets">Bracelets</option>
                                        <option value="idols">Idols</option>
                                        <option value="accessories">Accessories</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <h4 className="font-medium mb-2">Shipping Dimensions</h4>
                                <div className="grid grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                                        <input type="number" step="0.1" required className="w-full border rounded p-2" value={formData.weight} onChange={e => setFormData({...formData, weight: Number(e.target.value)})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Length (cm)</label>
                                        <input type="number" step="0.1" required className="w-full border rounded p-2" value={formData.length} onChange={e => setFormData({...formData, length: Number(e.target.value)})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Breadth (cm)</label>
                                        <input type="number" step="0.1" required className="w-full border rounded p-2" value={formData.breadth} onChange={e => setFormData({...formData, breadth: Number(e.target.value)})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Height (cm)</label>
                                        <input type="number" step="0.1" required className="w-full border rounded p-2" value={formData.height} onChange={e => setFormData({...formData, height: Number(e.target.value)})} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit" className="bg-[#765341] hover:bg-[#5C4033] text-white">Save Product</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
