import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Terms() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-16 px-4 max-w-4xl mx-auto w-full">
                <h1 className="text-4xl font-serif text-[#765341] mb-8 text-center">Terms of Service</h1>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-[#F3E9DC] space-y-6 text-gray-700 leading-relaxed">
                    <p>Welcome to Karungali Heritage. By accessing or using our website, you agree to be bound by these Terms of Service.</p>
                    <h2 className="text-2xl font-semibold text-[#765341]">Products and Pricing</h2>
                    <p>We strive to display our products as accurately as possible. However, due to the natural variations in Karungali wood, the actual item may differ slightly from the images shown. Prices are subject to change without notice.</p>
                    <h2 className="text-2xl font-semibold text-[#765341]">Orders and Payments</h2>
                    <p>All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason, including limitations on quantities available for purchase.</p>
                    <h2 className="text-2xl font-semibold text-[#765341]">Limitation of Liability</h2>
                    <p>Karungali Heritage shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our products or website.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
