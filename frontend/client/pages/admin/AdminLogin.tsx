import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { adminApiService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
    const navigate = useNavigate();
    const { isAdminLoggedIn, adminLogin } = useAdminAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAdminLoggedIn) {
            navigate("/admin");
        }
    }, [isAdminLoggedIn, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            const res = await adminApiService.login(email, password);
            const { access_token, refresh_token } = res.data;
            adminLogin(access_token, refresh_token);
            toast.success("Login successful");
            navigate("/admin");
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-serif text-[#765341] font-bold">Admin Login</h1>
                    <p className="text-sm text-gray-500 mt-2">Sign in to manage the store</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="mt-1"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#765341] hover:bg-[#5C4033] text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
}
