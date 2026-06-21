import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Privacy() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-16 px-4 max-w-4xl mx-auto w-full">
                <h1 className="text-4xl font-serif text-[#765341] mb-8 text-center">Privacy Policy</h1>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-[#F3E9DC] space-y-6 text-gray-700 leading-relaxed">
                    <p>At Karungali Heritage, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information when you use our website.</p>
                    <h2 className="text-2xl font-semibold text-[#765341]">Information We Collect</h2>
                    <p>We may collect personal information such as your name, email address, phone number, and shipping address when you place an order or create an account.</p>
                    <h2 className="text-2xl font-semibold text-[#765341]">How We Use Your Information</h2>
                    <p>Your information is used strictly to process orders, provide customer support, and improve our services. We do not sell or share your personal information with third parties except as necessary to fulfill your order (e.g., shipping carriers, payment processors).</p>
                    <h2 className="text-2xl font-semibold text-[#765341]">Security</h2>
                    <p>We implement industry-standard security measures to protect your data. All sensitive/credit information is transmitted via secure technology and encrypted in our payment gateway providers' databases.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
