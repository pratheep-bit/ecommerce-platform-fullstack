import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-16 px-4 max-w-4xl mx-auto w-full">
                <h1 className="text-4xl font-serif text-[#765341] mb-8 text-center">About Us</h1>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-[#F3E9DC] space-y-6 text-gray-700 leading-relaxed">
                    <p>Welcome to Karungali Heritage, your trusted source for authentic, handcrafted Karungali (Ebony) products. Rooted in deep cultural traditions, we bring you items that are not just beautiful, but hold significant spiritual value.</p>
                    <p>Our journey started with a simple mission: to preserve and share the ancient wisdom and craftsmanship of Karungali woodcarving. For generations, Karungali has been revered for its unique properties, believed to bring peace, prosperity, and positive energy.</p>
                    <p>Every piece in our collection is carefully sourced and crafted by skilled artisans who understand the material's sacred nature. We ensure that our products meet the highest standards of quality and authenticity.</p>
                    <p>Thank you for choosing us to be a part of your spiritual journey.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
