import { Target, Zap, Waves, Camera } from "lucide-react";
import React from "react";
import Card from "../../components/ui/Card";

const AboutPage: React.FC = () => {
    return (
        <div className="bg-white min-h-screen overflow-x-hidden">
            {/* ---------------- High-Impact Hero ---------------- */}
            <div className="relative pt-32 pb-24 md:pt-48 md:pb-36 bg-gray-900 overflow-hidden">
                {/* Background Text Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none opacity-10">
                    <h1 className="text-[25vw] font-black uppercase tracking-tighter leading-none -translate-x-10 translate-y-10 text-white/5 italic">
                        Vision
                    </h1>
                    <h1 className="text-[25vw] font-black uppercase tracking-tighter leading-none translate-x-1/2 -translate-y-10 text-blue-600/10 italic">
                        Legacy
                    </h1>
                </div>

                <div className="absolute inset-0 z-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop"
                        alt="Gym Background"
                        className="w-full h-full object-cover grayscale opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-white"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center md:text-left">
                    <div className="max-w-3xl">
                        <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-sm mb-6 block">
                            Our Gym Heritage
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.85] uppercase tracking-tighter mb-8 italic">
                            Beyond The <br />
                            <span className="text-blue-600">Hustle</span>.
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-xl font-medium leading-relaxed">
                            Founded on the principle of raw potential, One & Only Fitness
                            is more than a platform. It's the digital backbone
                            for champions and the ultimate arsenal for those who
                            refuse to settle.
                        </p>
                    </div>
                </div>
            </div>

            {/* ---------------- Creative Story Section ---------------- */}
            <div className="container mx-auto px-4 py-32">
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                    <div className="lg:w-1/2 relative">
                        {/* Asymmetrical Image Frame */}
                        <div className="relative group">
                            <div className="absolute -inset-4 border-2 border-blue-600 opacity-20 group-hover:opacity-50 transition-all rounded-[3rem] -rotate-2 scale-[1.02]"></div>
                            <div className="relative aspect-[4/5] md:aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[0.98]">
                                <img
                                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
                                    alt="Our Story"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                />
                            </div>

                            {/* Floating Glass Stat */}
                            <div className="absolute -bottom-10 -right-10 hidden md:block">
                                <Card className="p-8 bg-white/70 backdrop-blur-xl border border-white shadow-2xl rounded-[2.5rem] rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <p className="text-5xl font-black text-blue-600 mb-1 leading-none">
                                        5k+
                                    </p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        Active Warriors
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 space-y-10">
                        <div>
                            <span className="text-blue-600 font-black uppercase tracking-widest text-sm mb-4 block">
                                Est. 2020
                            </span>
                            <h2 className="text-5xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter italic leading-none mb-6">
                                The Genesis of{" "}
                                <span className="text-blue-600">Power</span>.
                            </h2>
                            <p className="text-lg text-gray-500 font-medium leading-relaxed">
                                Founded in the heart of the fitness revolution,
                                One & Only Fitness was built to bridge the gap between
                                human spirit and digital efficiency. We believe
                                technology should be a force multiplier for your
                                health, not a hurdle.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-blue-100 transition-all">
                                <h3 className="text-xl font-black uppercase text-gray-900 mb-3">
                                    Elite Standards
                                </h3>
                                <p className="text-sm text-gray-500 font-medium">
                                    We vet every trainer and piece of equipment
                                    to ensure only the best reaches your hands.
                                </p>
                            </div>
                            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-blue-100 transition-all">
                                <h3 className="text-xl font-black uppercase text-gray-900 mb-3">
                                    Titan Network
                                </h3>
                                <p className="text-sm text-gray-500 font-medium">
                                    Connecting over 100+ certified masters to
                                    guide your transformation journey.
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 flex md:hidden gap-4">
                            <div className="flex-1 bg-gray-900 p-6 rounded-2xl text-center">
                                <p className="text-3xl font-black text-blue-500">
                                    5k+
                                </p>
                                <p className="text-[10px] font-black uppercase text-white/50 tracking-widest">
                                    Members
                                </p>
                            </div>
                            <div className="flex-1 bg-blue-600 p-6 rounded-2xl text-center">
                                <p className="text-3xl font-black text-white">
                                    100+
                                </p>
                                <p className="text-[10px] font-black uppercase text-white/70 tracking-widest">
                                    Masters
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* ---------------- Core Values Section ---------------- */}
            <div className="bg-gray-50 py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <span className="text-blue-600 font-black uppercase tracking-widest text-sm mb-4 block">
                            The Code
                        </span>
                        <h2 className="text-5xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
                            Our Core{" "}
                            <span className="text-blue-600">Values</span>.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Value 1 */}
                        <div className="group bg-white p-12 rounded-[3rem] border border-gray-100 hover:border-blue-200 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.1)] relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                            <div className="w-16 h-16 bg-gray-900 rounded-3xl flex items-center justify-center text-white mb-8 group-hover:bg-blue-600 transition-colors duration-500 relative z-10">
                                <Target className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 relative z-10">
                                Absolute Focus
                            </h3>
                            <p className="text-gray-500 font-medium leading-relaxed relative z-10">
                                We believe in zero distractions. Every session
                                is an opportunity to reach a new peak through
                                pure, laser-like concentration.
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div className="group bg-white p-12 rounded-[3rem] border border-gray-100 hover:border-blue-200 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.1)] relative overflow-hidden md:translate-y-12">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                            <div className="w-16 h-16 bg-gray-900 rounded-3xl flex items-center justify-center text-white mb-8 group-hover:bg-blue-600 transition-colors duration-500 relative z-10">
                                <Zap className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 relative z-10">
                                Relentless Energy
                            </h3>
                            <p className="text-gray-500 font-medium leading-relaxed relative z-10">
                                Energy is caught, not taught. We maintain a
                                high-octane environment that fuels your drive
                                from the moment you step in.
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div className="group bg-white p-12 rounded-[3rem] border border-gray-100 hover:border-blue-200 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.1)] relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                            <div className="w-16 h-16 bg-gray-900 rounded-3xl flex items-center justify-center text-white mb-8 group-hover:bg-blue-600 transition-colors duration-500 relative z-10">
                                <Waves className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 relative z-10">
                                Unified Grit
                            </h3>
                            <p className="text-gray-500 font-medium leading-relaxed relative z-10">
                                Strength is built together. Our community is a
                                collective force of grit, supporting every
                                member in their hardest sets.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------------- Elite Facility Section ---------------- */}
            <div className="relative py-48 overflow-hidden bg-gray-900">
                {/* Background Text overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none opacity-5">
                    <h1 className="text-[35vw] font-black uppercase tracking-tighter leading-none translate-x-1/4 translate-y-20 text-white italic">
                        Arena
                    </h1>
                </div>

                <div className="absolute inset-0 z-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop"
                        alt="Facility"
                        className="w-full h-full object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/40 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 p-12 rounded-[3rem]">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8">
                            <Camera className="h-8 w-8" />
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter italic leading-none mb-6">
                            The Elite{" "}
                            <span className="text-blue-500">Arena</span>.
                        </h2>
                        <p className="text-xl text-gray-300 font-medium leading-relaxed mb-8">
                            Our 15,000 sq.ft. facility is engineered for
                            performance. From Olympic-grade lifting platforms to
                            advanced biometric recovery zones, we provide the
                            tools for total domination.
                        </p>
                        <div className="flex gap-6">
                            <div>
                                <p className="text-3xl font-black text-white">
                                    15k
                                </p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    Sq. Ft.
                                </p>
                            </div>
                            <div className="w-px h-12 bg-white/20"></div>
                            <div>
                                <p className="text-3xl font-black text-white">
                                    24/7
                                </p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    Access
                                </p>
                            </div>
                            <div className="w-px h-12 bg-white/20"></div>
                            <div>
                                <p className="text-3xl font-black text-white">
                                    Elite
                                </p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    Gear
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
