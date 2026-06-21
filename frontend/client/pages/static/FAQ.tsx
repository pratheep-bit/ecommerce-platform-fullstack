import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FAQ() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-16 px-4 max-w-4xl mx-auto w-full">
                <h1 className="text-4xl font-serif text-[#765341] mb-8 text-center">Frequently Asked Questions</h1>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-[#F3E9DC] space-y-6">
                    <div>
                        <h3 className="font-bold text-lg text-[#765341]">How do I know the Karungali is authentic?</h3>
                        <p className="text-gray-600 mt-2">We source our Karungali wood directly from certified suppliers with deep roots in traditional harvesting. Each item comes with a certificate of authenticity.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-[#765341]">What is your return policy?</h3>
                        <p className="text-gray-600 mt-2">We accept returns within 7 days of delivery for defective or damaged items. Please refer to our Shipping & Returns policy for full details.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-[#765341]">How should I care for my Karungali products?</h3>
                        <p className="text-gray-600 mt-2">Avoid prolonged exposure to water and direct sunlight. Wipe with a dry, soft cloth to maintain its natural luster.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-[#765341]">How long does delivery take?</h3>
                        <p className="text-gray-600 mt-2">Standard delivery within India takes 3-7 business days depending on your location.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
