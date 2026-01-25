import { Award, CheckCircle } from "lucide-react";
import React from "react";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useTrainers } from "../../services/trainersService";

const PublicTrainersPage: React.FC = () => {
    const { data: trainers, isLoading } = useTrainers({
        page: 1,
        limit: 12,
        status: "active",
    });
    const trainersList = trainers?.data || [];

    if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

    return (
        <div className="bg-white min-h-screen overflow-x-hidden">
            {/* ---------------- High-Impact Hero ---------------- */}
            <div className="relative pt-32 pb-24 md:pt-48 md:pb-36 bg-gray-900 overflow-hidden">
                {/* Background Text Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none opacity-10">
                    <h1 className="text-[25vw] font-black uppercase tracking-tighter leading-none -translate-x-10 translate-y-10 text-white/5 italic">
                        Elite
                    </h1>
                    <h1 className="text-[25vw] font-black uppercase tracking-tighter leading-none translate-x-1/2 -translate-y-10 text-blue-600/10 italic">
                        Masters
                    </h1>
                </div>

                <div className="absolute inset-0 z-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
                        alt="Gym Background"
                        className="w-full h-full object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-800"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center md:text-left">
                    <div className="max-w-3xl">
                        <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-sm mb-6 block">
                            World-Class Coaching
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.85] uppercase tracking-tighter mb-8 italic">
                            Meet Your <br />
                            <span className="text-blue-600">Masters</span>.
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-xl font-medium leading-relaxed">
                            Train with the best. Our elite squad of certified
                            professionals is here to push your limits, refine
                            your form, and forge your legacy.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                    {trainersList.map((trainer) => (
                        <div key={trainer.id} className="group relative">
                            {/* Card Body */}
                            <div className="relative flex flex-col bg-white rounded-[3rem] border border-gray-100 hover:border-blue-200 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.15)] overflow-hidden">
                                {/* Image Frame with Asymmetry */}
                                <div className="relative aspect-[4/5] p-5">
                                    <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden bg-gray-50 flex items-center justify-center transition-transform duration-700 group-hover:scale-[0.98]">
                                        <img
                                            src={`https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop`}
                                            alt={trainer.name}
                                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                        />

                                        {/* Glassmorphic Badge Overlay */}
                                        <div className="absolute top-5 left-5 flex flex-col gap-2">
                                            <div className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white drop-shadow-sm">
                                                    {trainer.specialization}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Floating Experience Badge */}
                                        <div className="absolute bottom-5 right-5 bg-blue-600 px-5 py-3 rounded-2xl shadow-xl transition-all duration-500 group-hover:-translate-y-2">
                                            <p className="text-[10px] font-black uppercase text-white/70 leading-none mb-1">
                                                Experience
                                            </p>
                                            <p className="text-white font-black text-lg leading-none">
                                                {trainer.experience}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col px-10 pb-10 pt-4 text-center lg:text-left">
                                    <h3 className="text-3xl font-black uppercase tracking-tight text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors italic">
                                        {trainer.name}
                                    </h3>

                                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                                        <div className="flex items-center gap-2 text-gray-400 group-hover:text-blue-500 transition-colors">
                                            <Award className="h-4 w-4" />
                                            <span className="text-xs font-bold uppercase tracking-widest">
                                                Certified Pro
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="text-xs font-bold uppercase tracking-widest">
                                                Active Squad
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest border-2 border-gray-100 group-hover:border-blue-600 group-hover:text-blue-600 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                                    >
                                        View Profile
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PublicTrainersPage;
