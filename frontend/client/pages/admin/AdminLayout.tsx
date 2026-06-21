import { useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout() {
    const { isAdminLoggedIn, adminLogout } = useAdminAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAdminLoggedIn) {
            navigate("/admin/login");
        }
    }, [isAdminLoggedIn, navigate]);

    if (!isAdminLoggedIn) return null;

    const handleLogout = () => {
        adminLogout();
        navigate("/admin/login");
    };

    const navItems = [
        { name: "Analytics", path: "/admin", icon: LayoutDashboard },
        { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
        { name: "Products", path: "/admin/products", icon: Package },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-[#765341]">Admin Panel</h1>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                                    isActive
                                        ? "bg-[#F3E9DC] text-[#765341] font-medium"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t">
                    <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
