import { Mail, MapPin, Phone, Send } from "lucide-react";
import React from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useState } from "react";
import { useCreateContact } from "../contacts/useContacts";
import toast from "react-hot-toast";

const ContactPage: React.FC = () => {
    const createMutation = useCreateContact();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData, {
            onSuccess: () => {
                toast.success("Message sent successfully!");
                setFormData({ name: "", email: "", phone: "", message: "" });
            },
            onError: () => {
                toast.error("Failed to send message. Please try again.");
            },
        });
    };

    return (
        <div className="bg-white min-h-screen overflow-x-hidden">
            {/* ---------------- Creative Hero & Form Section ---------------- */}
            <div className="relative pt-32 pb-32 md:pb-14">
                {/* Background Text Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none opacity-[0.03] md:opacity-5">
                    <h1 className="text-[30vw] md:text-[20vw] font-black uppercase tracking-tighter leading-none -translate-x-10 translate-y-20 md:translate-y-20">
                        Strength
                    </h1>
                    <h1 className="text-[30vw] md:text-[20vw] font-black uppercase tracking-tighter leading-none translate-x-1/4 md:translate-x-1/2">
                        Limits
                    </h1>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        {/* Left: Bold Typography Hero */}
                        <div className="lg:w-1/2 pt-12">
                            <span className="text-blue-600 font-black uppercase tracking-widest text-sm mb-6 block">
                                Connect with us
                            </span>
                            <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.9] uppercase tracking-tighter mb-8 italic">
                                Break <br />
                                <span className="text-blue-600">Your</span>{" "}
                                <br />
                                Silence.
                            </h1>
                            <p className="text-gray-500 text-lg max-w-md font-medium leading-relaxed">
                                Don't let questions hold you back. Our elite
                                support team is ready to help you navigate your
                                journey to physical excellence.
                            </p>

                            {/* Refined Contact Info Strips */}
                            <div className="mt-12 flex flex-wrap gap-4">
                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 px-6 py-4 rounded-3xl hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all group cursor-default">
                                    <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white rotate-3 group-hover:rotate-0 transition-transform">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">
                                            Direct Line
                                        </p>
                                        <p className="text-gray-900 font-bold text-sm">
                                            hq@gymadmin.com
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 px-6 py-4 rounded-3xl hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all group cursor-default">
                                    <div className="w-10 h-10 rounded-2xl bg-gray-900 flex items-center justify-center text-white -rotate-3 group-hover:rotate-0 transition-transform">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">
                                            Support HQ
                                        </p>
                                        <p className="text-gray-900 font-bold text-sm">
                                            +1 (888) 000-GYM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Floating Glass Form */}
                        <div className="lg:w-1/2 w-full lg:-mt-20">
                            <div className="relative group">
                                {/* Decorative elements */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>

                                <Card className="p-8 md:p-12 bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[40px] relative z-10">
                                    <div className="mb-10">
                                        <h2 className="text-3xl font-black uppercase tracking-tight mb-2">
                                            Send a{" "}
                                            <span className="text-blue-600">
                                                Message
                                            </span>
                                        </h2>
                                        <div className="h-2 w-12 bg-blue-600 rounded-full"></div>
                                    </div>

                                    <form
                                        className="space-y-6"
                                        onSubmit={handleSubmit}
                                    >
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">
                                                    Identity
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Spartan"
                                                    required
                                                    className="w-full bg-gray-100/50 border-0 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-600/10 transition-all text-sm font-medium"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">
                                                    Gateway
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="warrior@gym.com"
                                                    required
                                                    className="w-full bg-gray-100/50 border-0 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-600/10 transition-all text-sm font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">
                                                Signal
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+1 (000) 000-0000"
                                                className="w-full bg-gray-100/50 border-0 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-600/10 transition-all text-sm font-medium"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">
                                                Objective
                                            </label>
                                            <textarea
                                                rows={5}
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="What are your fitness goals?"
                                                required
                                                className="w-full bg-gray-100/50 border-0 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-600/10 transition-all text-sm font-medium resize-none shadow-inner"
                                            ></textarea>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={createMutation.isPending}
                                            className="w-full py-5 rounded-2xl text-lg font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                        >
                                            {createMutation.isPending
                                                ? "Sending..."
                                                : "Execute"}{" "}
                                            <Send className="h-5 w-5" />
                                        </Button>
                                    </form>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------------- Layered Map Section ---------------- */}
            <div className="relative bg-gray-900 py-32 overflow-hidden">
                {/* Gym Background under map section */}
                <div className="absolute inset-0 opacity-20 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
                        alt="Background"
                        className="w-full h-full object-cover grayscale"
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col items-center">
                        <div className="max-w-4xl w-full">
                            <div className="mb-12 text-center lg:text-left">
                                <h1 className="text-white text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4">
                                    Find the{" "}
                                    <span className="text-blue-500">
                                        Arena.
                                    </span>
                                </h1>
                                <p className="text-gray-400 max-w-xl font-medium">
                                    Located in the heart of the city, our
                                    flagship facility is where champions are
                                    made. Come visit and feel the energy.
                                </p>
                            </div>

                            <div className="relative group">
                                {/* The Frame */}
                                <div className="absolute -inset-4 border-2 border-blue-600 opacity-20 group-hover:opacity-50 transition-all rounded-[3rem] -rotate-1 scale-[1.02]"></div>

                                <div className="h-[450px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        title="map"
                                        frameBorder="0"
                                        src="https://maps.google.com/maps?width=100%&height=600&hl=en&q=1 and Only Fitness Balongi (Panjab), PB 140307, IND+(Gym%20Admin%20HQ)&ie=UTF8&t=&z=14&iwloc=B&output=embed"
                                        style={{
                                            filter: "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%) opacity(0.8)",
                                        }}
                                    ></iframe>

                                    {/* Glass Overlay on Map */}
                                    <div className="absolute bottom-10 left-10 p-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl max-w-xs transition-all group-hover:-translate-y-2">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                                <MapPin className="h-4 w-4 text-white" />
                                            </div>
                                            <h3 className="text-white font-bold uppercase tracking-widest text-xs">
                                                Flagship HQ
                                            </h3>
                                        </div>
                                        <p className="text-gray-300 text-sm font-medium">
                                            1 and Only Fitness Balongi (Panjab),{" "}
                                            <br />
                                            PB 140307, IND
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Large Background Letter */}
                <span className="absolute -bottom-20 -right-20 text-[40vw] font-black text-white/5 uppercase select-none pointer-events-none italic">
                    G
                </span>
            </div>
        </div>
    );
};

export default ContactPage;
