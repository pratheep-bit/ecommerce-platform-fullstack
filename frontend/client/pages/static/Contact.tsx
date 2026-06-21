import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Contact() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate form submission
        setTimeout(() => {
            console.log("Contact form submitted!");
            toast.success("Message sent successfully. We will get back to you soon!");
            setLoading(false);
            (e.target as HTMLFormElement).reset();
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-16 px-4 max-w-4xl mx-auto w-full">
                <h1 className="text-4xl font-serif text-[#765341] mb-8 text-center">Contact Us</h1>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-[#F3E9DC]">
                        <h2 className="text-2xl font-semibold text-[#765341] mb-4">Get in Touch</h2>
                        <p className="text-gray-600 mb-6">Have questions or need assistance? Fill out the form and we'll be in touch as soon as possible.</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Name</label>
                                <Input required placeholder="Your name" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Email</label>
                                <Input required type="email" placeholder="your@email.com" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Message</label>
                                <textarea required className="w-full min-h-[120px] p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9A6A51] resize-y" placeholder="How can we help?"></textarea>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full bg-[#765341] hover:bg-[#5C4033] text-white">
                                {loading ? "Sending..." : "Send Message"}
                            </Button>
                        </form>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-[#F3E9DC] h-fit">
                        <h2 className="text-2xl font-semibold text-[#765341] mb-4">Contact Information</h2>
                        <div className="space-y-4 text-gray-600">
                            <p><strong>Email:</strong> support@karungali.example.com</p>
                            <p><strong>Phone:</strong> +91 98765 43210</p>
                            <p><strong>Address:</strong><br/>123 Temple Road, Heritage District<br/>Chennai, Tamil Nadu 600001<br/>India</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
