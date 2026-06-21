import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Shipping() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-16 px-4 max-w-4xl mx-auto w-full">
                <h1 className="text-4xl font-serif text-[#765341] mb-8 text-center">Shipping & Returns</h1>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-[#F3E9DC] space-y-6 text-gray-700 leading-relaxed">
                    <h2 className="text-2xl font-semibold text-[#765341]">Shipping Policy</h2>
                    <p>We process all orders within 1-2 business days. Delivery times vary based on location but generally range from 3 to 7 business days within India.</p>
                    <p>Shipping is free for orders over ₹500. A flat rate of ₹50 applies for orders below this amount.</p>
                    <h2 className="text-2xl font-semibold text-[#765341] mt-8">Returns & Exchanges</h2>
                    <p>We accept returns for defective or damaged items within 7 days of receipt. To initiate a return, please contact our support team with your order number and photos of the issue.</p>
                    <p>Please note that for hygiene and spiritual reasons, certain items may not be eligible for returns unless defective.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
